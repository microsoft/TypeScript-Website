import { PackageTypeCache } from "./cache"
import { definitelyTypedName, isDeclaration, packageName, runtimePackageName, safePackagePath } from "./packages"
import type {
  AcquisitionOptions,
  AcquisitionProgress,
  AcquisitionResult,
  AcquiredPackage,
  Dependency,
  DiscoverDependencies,
  SourceFile,
} from "./types"

export type {
  AcquisitionOptions,
  AcquisitionProgress,
  AcquisitionResult,
  Dependency,
  DiscoverDependencies,
  SourceFile,
} from "./types"
export { corsaDiscovery, stradaDiscovery } from "./discovery"

type PackageRequest = { name: string; version: string; requestedBy: string }
type PackageData = {
  name: string
  version: string
  files: ReadonlyMap<string, string>
  dependencies: ReadonlyMap<string, string>
}

export type AcquisitionLimits = {
  concurrency: number
  packages: number
  files: number
  bytes: number
  responseBytes: number
}

const defaultLimits: AcquisitionLimits = {
  concurrency: 6,
  packages: 100,
  files: 4000,
  bytes: 32 * 1024 * 1024,
  responseBytes: 8 * 1024 * 1024,
}

function record(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value)
}

class HttpError extends Error {
  constructor(readonly status: number, url: string) {
    super(`HTTP ${status} fetching ${url}`)
  }
}

class DownloadPool {
  private active = 0
  private readonly waiting: Array<() => void> = []

  constructor(private readonly concurrency: number) {}

  async run<T>(signal: AbortSignal, operation: () => Promise<T>): Promise<T> {
    signal.throwIfAborted()
    if (this.active >= this.concurrency) {
      await new Promise<void>((resolve, reject) => {
        const abort = () => {
          const index = this.waiting.indexOf(resume)
          if (index !== -1) this.waiting.splice(index, 1)
          reject(signal.reason)
        }
        const resume = () => {
          signal.removeEventListener("abort", abort)
          resolve()
        }
        this.waiting.push(resume)
        signal.addEventListener("abort", abort, { once: true })
      })
    } else {
      this.active++
    }
    try {
      signal.throwIfAborted()
      return await operation()
    } finally {
      const next = this.waiting.shift()
      if (next) next()
      else this.active--
    }
  }
}

export class PackageTypeAcquirer {
  private readonly fetcher: typeof fetch
  private readonly limits: AcquisitionLimits
  private readonly pool: DownloadPool
  private readonly packages = new Map<string, { data: PackageData; bytes: number }>()
  private cachedBytes = 0
  private readonly cache = new PackageTypeCache()
  private readonly discoveries = new WeakMap<DiscoverDependencies, WeakMap<PackageData, Map<string, readonly Dependency[]>>>()

  constructor(options: { fetcher?: typeof fetch; limits?: Partial<AcquisitionLimits> } = {}) {
    this.fetcher = options.fetcher ?? ((input, init) => fetch(input, init))
    this.limits = { ...defaultLimits, ...options.limits }
    if (Object.values(this.limits).some(value => !Number.isSafeInteger(value) || value < 1)) {
      throw new Error("ATA limits must be positive integers")
    }
    this.pool = new DownloadPool(this.limits.concurrency)
  }

  async acquire(input: {
    files: readonly SourceFile[]
    discover: DiscoverDependencies
    options?: AcquisitionOptions
    signal?: AbortSignal
    onProgress?(progress: AcquisitionProgress): void
  }): Promise<AcquisitionResult> {
    const signal = input.signal ?? new AbortController().signal
    signal.throwIfAborted()
    const files = new Map<string, string>()
    const ambientTypes = new Set<string>()
    const packages: AcquiredPackage[] = []
    const errors: Array<{ packageName: string; requestedBy: string; message: string }> = []
    if (input.options?.enable === false) return { files, ambientTypes: [], packages, errors }

    const excluded = new Set<string>()
    for (const specifier of input.options?.exclude ?? []) {
      const name = packageName(specifier)
      if (name) {
        excluded.add(name)
        excluded.add(definitelyTypedName(name))
        if (name.startsWith("@types/")) excluded.add(name.slice("@types/".length))
      }
    }
    const queued = new Set<string>()
    const queue: PackageRequest[] = []
    const pendingPackages = new Set<string>()
    let completedPackages = 0
    let totalPackages = 0
    let downloaded = 0
    let total = 0
    const progress = () => {
      if (!signal.aborted) {
        input.onProgress?.({
          downloaded,
          total,
          completedPackages,
          totalPackages,
          pendingPackages: [...pendingPackages],
        })
      }
    }
    const enqueue = (dependency: Dependency, requestedBy: string, versions?: ReadonlyMap<string, string>) => {
      const name = packageName(dependency.specifier)
      if (!name || excluded.has(name) || excluded.has(definitelyTypedName(name)) || queued.has(name)) return
      if (queued.size >= this.limits.packages) throw new Error(`ATA exceeded its ${this.limits.packages}-package limit`)
      queued.add(name)
      queue.push({ name, requestedBy, version: dependency.version ?? versions?.get(name) ?? "latest" })
      totalPackages++
      progress()
    }
    for (const file of [...input.files].sort((a, b) => a.path.localeCompare(b.path))) {
      const dependencies = await input.discover(file)
      signal.throwIfAborted()
      for (const dependency of dependencies) enqueue(dependency, file.path)
    }
    for (const specifier of input.options?.include ?? [])
      enqueue({ kind: "import", specifier }, "typeAcquisition.include")

    let bytes = 0
    if (queue.length) progress()
    while (queue.length) {
      signal.throwIfAborted()
      // Resolve a deterministic wave before adding its transitive dependencies.
      const wave = queue.splice(0, this.limits.concurrency)
      const results = await Promise.all(
        wave.map(
          async (
            request
          ): Promise<{ request: PackageRequest; data: PackageData } | { request: PackageRequest; error: string }> => {
            pendingPackages.add(request.name)
            progress()
            try {
              const data = await this.loadPackage(
                request,
                signal,
                count => {
                  total += count
                  progress()
                },
                () => {
                  downloaded++
                  progress()
                }
              )
              return { request, data }
            } catch (error) {
              signal.throwIfAborted()
              return { request, error: error instanceof Error ? error.message : String(error) }
            } finally {
              pendingPackages.delete(request.name)
              completedPackages++
              progress()
            }
          }
        )
      )
      for (const result of results) {
        if ("error" in result) {
          errors.push({
            packageName: result.request.name,
            requestedBy: result.request.requestedBy,
            message: result.error,
          })
          continue
        }
        const { data, request } = result
        queued.add(data.name)
        packages.push({ name: data.name, version: data.version, requestedBy: request.requestedBy })
        if (data.name.startsWith("@types/")) {
          ambientTypes.add(data.name.slice("@types/".length))
          queued.add(runtimePackageName(data.name))
        }
        for (const [path, text] of data.files) {
          const fileName = `/workspace/node_modules/${data.name}${path}`
          if (files.has(fileName)) continue
          bytes += new TextEncoder().encode(text).byteLength
          if (files.size >= this.limits.files || bytes > this.limits.bytes) {
            throw new Error("ATA exceeded the project declaration file or byte limit")
          }
          files.set(fileName, text)
          if (isDeclaration(path)) {
            let cachedPackages = this.discoveries.get(input.discover)
            if (!cachedPackages) {
              cachedPackages = new WeakMap()
              this.discoveries.set(input.discover, cachedPackages)
            }
            let declarations = cachedPackages.get(data)
            if (!declarations) {
              declarations = new Map()
              cachedPackages.set(data, declarations)
            }
            let dependencies = declarations.get(path)
            if (!dependencies) {
              dependencies = await input.discover({ path: fileName, text })
              signal.throwIfAborted()
              declarations.set(path, dependencies)
            }
            signal.throwIfAborted()
            for (const dependency of dependencies) {
              enqueue(dependency, `${data.name}@${data.version}${path}`, data.dependencies)
            }
          }
        }
      }
    }
    signal.throwIfAborted()
    return {
      files,
      ambientTypes: [...ambientTypes].sort(),
      packages,
      errors,
    }
  }

  private async request(url: string, signal: AbortSignal, cacheResult = true) {
    return this.pool.run(signal, async () => {
      const cached = await this.cache.read(url, signal)
      signal.throwIfAborted()
      if (cached !== undefined) {
        if (new TextEncoder().encode(cached).byteLength > this.limits.responseBytes) {
          throw new Error(`ATA response is too large: ${url}`)
        }
        return cached
      }
      const response = await this.fetcher(url, { signal })
      if (!response.ok) {
        await response.body?.cancel()
        throw new HttpError(response.status, url)
      }
      if (Number(response.headers.get("content-length")) > this.limits.responseBytes) {
        await response.body?.cancel()
        throw new Error(`ATA response is too large: ${url}`)
      }
      if (!response.body) {
        const text = await response.text()
        if (new TextEncoder().encode(text).byteLength > this.limits.responseBytes) {
          throw new Error(`ATA response is too large: ${url}`)
        }
        if (cacheResult) await this.cache.write(url, text, signal)
        return text
      }
      const reader = response.body.getReader()
      const chunks: Uint8Array[] = []
      let length = 0
      try {
        for (;;) {
          signal.throwIfAborted()
          const { done, value } = await reader.read()
          if (done) break
          length += value.byteLength
          if (length > this.limits.responseBytes) throw new Error(`ATA response is too large: ${url}`)
          chunks.push(value)
        }
      } catch (error) {
        await reader.cancel()
        throw error
      } finally {
        reader.releaseLock()
      }
      const bytes = new Uint8Array(length)
      let offset = 0
      for (const chunk of chunks) {
        bytes.set(chunk, offset)
        offset += chunk.length
      }
      const text = new TextDecoder().decode(bytes)
      if (cacheResult) await this.cache.write(url, text, signal)
      return text
    })
  }

  private async json(url: string, signal: AbortSignal): Promise<unknown> {
    const text = await this.request(url, signal, false)
    let value: unknown
    try {
      value = JSON.parse(text)
    } catch (error) {
      throw new Error(`Invalid JSON from ${url}`, { cause: error })
    }
    await this.cache.write(url, text, signal)
    return value
  }

  private async loadPackage(
    request: PackageRequest,
    signal: AbortSignal,
    onFiles: (count: number) => void,
    onFile: () => void
  ): Promise<PackageData> {
    const key = `${request.name}@${request.version}`
    const cached = this.packages.get(key)
    if (cached) return cached.data
    const data = await this.downloadPackage(request.name, request.version, signal, onFiles, onFile)
    if (data) {
      this.remember(key, data)
      return data
    }
    if (request.name.startsWith("@types/")) throw new Error(`${request.name} does not contain declarations`)
    const fallback = await this.downloadPackage(definitelyTypedName(request.name), "latest", signal, onFiles, onFile)
    if (!fallback) throw new Error(`No declarations found for ${request.name}`)
    this.remember(key, fallback)
    return fallback
  }

  private remember(key: string, data: PackageData) {
    const bytes = [...data.files.values()].reduce((sum, text) => sum + new TextEncoder().encode(text).byteLength, 0)
    while (this.cachedBytes + bytes > this.limits.bytes || this.packages.size >= this.limits.packages) {
      const oldest = this.packages.entries().next().value
      if (!oldest) return
      this.packages.delete(oldest[0])
      this.cachedBytes -= oldest[1].bytes
    }
    this.packages.set(key, { data, bytes })
    this.cachedBytes += bytes
  }

  private async downloadPackage(
    name: string,
    selector: string,
    signal: AbortSignal,
    onFiles: (count: number) => void,
    onFile: () => void
  ): Promise<PackageData | undefined> {
    let resolved: unknown
    try {
      resolved = await this.json(
        `https://data.jsdelivr.com/v1/package/resolve/npm/${name}@${encodeURIComponent(selector)}`,
        signal
      )
    } catch (error) {
      signal.throwIfAborted()
      if (error instanceof HttpError && error.status === 404 && !name.startsWith("@types/")) return undefined
      throw error
    }
    if (
      !record(resolved) ||
      typeof resolved.version !== "string" ||
      !/^\d+\.\d+\.\d+[-+\w.]*$/.test(resolved.version)
    ) {
      throw new Error(`Could not resolve ${name}@${selector} to an exact version`)
    }
    const version = resolved.version
    const base = `https://cdn.jsdelivr.net/npm/${name}@${version}`
    const tree = await this.json(`https://data.jsdelivr.com/v1/package/npm/${name}@${version}/flat`, signal)
    if (!record(tree) || !Array.isArray(tree.files)) throw new Error(`Invalid file index for ${name}@${version}`)
    const paths = tree.files
      .map(entry => {
        if (!record(entry) || typeof entry.name !== "string" || !safePackagePath(entry.name)) {
          throw new Error(`Invalid file path in ${name}@${version}`)
        }
        return entry.name
      })
      .filter(path => !path.includes("/node_modules/"))
    if (!paths.some(isDeclaration)) return undefined
    const metadata = await this.json(`${base}/package.json`, signal)
    if (!record(metadata)) throw new Error(`Invalid package.json for ${name}@${version}`)
    const dependencies = new Map<string, string>()
    for (const field of ["peerDependencies", "dependencies"]) {
      const entries = metadata[field]
      if (entries !== undefined && entries !== null) {
        if (!record(entries)) throw new Error(`Invalid ${field} in ${name}@${version}`)
        for (const [dependency, value] of Object.entries(entries)) {
          if (typeof value !== "string") throw new Error(`Invalid dependency ${dependency} in ${name}@${version}`)
          dependencies.set(dependency, value)
        }
      }
    }
    const declarationPaths = [...new Set(paths.filter(path => isDeclaration(path) || path.endsWith("/package.json")))]
      .filter(path => path !== "/package.json")
      .sort()
    if (declarationPaths.length > this.limits.files) throw new Error(`Too many declaration files in ${name}@${version}`)
    onFiles(declarationPaths.length)
    const files = new Map<string, string>([["/package.json", JSON.stringify(metadata)]])
    let bytes = new TextEncoder().encode(JSON.stringify(metadata)).byteLength
    // Keep fan-out bounded even before requests enter the shared network pool.
    for (let start = 0; start < declarationPaths.length; start += this.limits.concurrency) {
      const results = await Promise.allSettled(
        declarationPaths.slice(start, start + this.limits.concurrency).map(async path => {
          const text = await this.request(`${base}${path}`, signal)
          onFile()
          return [path, text] as const
        })
      )
      const entries = results.map(result => {
        if (result.status === "rejected") throw result.reason
        return result.value
      })
      for (const [path, text] of entries) {
        bytes += new TextEncoder().encode(text).byteLength
        if (bytes > this.limits.bytes) throw new Error(`Declarations in ${name}@${version} exceed the ATA byte limit`)
        files.set(path, text)
      }
    }
    return { name, version, files, dependencies }
  }
}
