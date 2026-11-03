import { prerelease, valid } from "semver"

export type CompilerModules = {
  sync: string
  async: string
  ast: string
  host: string
}

export type CompilerDistribution = CompilerModules & {
  version: string
  wasm: URL
  schema: URL
  libraries: URL[]
  assetBytes: number
  estimatedDownloadBytes: number
}

export async function loadPublishedCompilerDistribution(version: string): Promise<CompilerDistribution> {
  const [main, artifact] = await Promise.all([
    loadPackage("typescript", version),
    loadPackage("@typescript/typescript-wasip1-wasm", version),
  ])
  if (main.revision !== artifact.revision) {
    throw new Error(`TypeScript API and WASI artifact revisions do not match for ${version}`)
  }
  const wasm = packageEntry(artifact, "./lib/tsc.wasm")
  const schema = packageEntry(main, "./schemas/tsconfig.schema.json")
  const libraryDirectory = new URL("./", wasm)
  const [mainFiles, artifactFiles] = await Promise.all([
    loadFileSizes(main.base),
    loadFileSizes(artifact.base, libraryDirectory),
  ])
  function size(files: ReadonlyMap<string, number>, url: URL) {
    const bytes = files.get(url.href)
    if (bytes === undefined) throw new Error(`Missing compiler file size: ${url.pathname}`)
    return bytes
  }
  const libraries = [...artifactFiles.keys()]
    .map(url => new URL(url))
    .filter(
      url =>
        url.href.startsWith(libraryDirectory.href) &&
        /^lib(?:\.[\w.]+)?\.d\.ts$/.test(url.pathname.slice(url.pathname.lastIndexOf("/") + 1))
    )
  if (libraries.length === 0) throw new Error("Compiler libraries are missing")
  const wasmBytes = size(artifactFiles, wasm)
  const libraryBytes = libraries.reduce((sum, url) => sum + size(artifactFiles, url), 0)
  const schemaBytes = size(mainFiles, schema)
  const moduleBytes = [...mainFiles].reduce((sum, [url, bytes]) => sum + (url.endsWith(".js") ? bytes : 0), 0)
  // CDN samples: WASM ~25%, JavaScript ~12%, JSON ~10%; declarations are uncompressed.
  const estimatedDownloadBytes = Math.ceil(wasmBytes * 0.25 + moduleBytes * 0.12 + schemaBytes * 0.1 + libraryBytes)
  return {
    version,
    sync: packageEntry(main, "./sync").href,
    async: packageEntry(main, "./async").href,
    ast: packageEntry(main, "./ast").href,
    host: packageEntry(main, "./wasm").href,
    wasm,
    schema,
    libraries,
    assetBytes: wasmBytes + schemaBytes + libraryBytes,
    estimatedDownloadBytes,
  }
}

async function loadPackage(name: string, version: string) {
  const base = new URL(`https://unpkg.com/${name}@${version}/`)
  const url = new URL("package.json", base)
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) })
  if (!response.ok) throw new Error(`Could not load ${name}@${version}: ${response.status}`)
  const metadata: unknown = await response.json()
  if (
    !isRecord(metadata) ||
    metadata.name !== name ||
    metadata.version !== version ||
    typeof metadata.gitHead !== "string" ||
    !metadata.gitHead ||
    !isRecord(metadata.exports)
  ) {
    throw new Error(`Invalid package metadata for ${name}@${version}`)
  }
  return {
    base,
    revision: metadata.gitHead,
    exports: metadata.exports,
  }
}

async function loadFileSizes(base: URL, directory = base): Promise<ReadonlyMap<string, number>> {
  const response = await fetch(new URL("?meta", directory), { signal: AbortSignal.timeout(30_000) })
  if (!response.ok) throw new Error(`Could not load compiler file sizes: ${response.status}`)
  const metadata: unknown = await response.json()
  if (!isRecord(metadata) || !Array.isArray(metadata.files)) throw new Error("Invalid compiler file sizes")
  const files = new Map<string, number>()
  for (const file of metadata.files) {
    if (
      !isRecord(file) ||
      typeof file.path !== "string" ||
      typeof file.size !== "number" ||
      !Number.isSafeInteger(file.size) ||
      file.size < 0
    ) {
      throw new Error("Invalid compiler file size")
    }
    files.set(new URL(file.path.replace(/^\//, ""), base).href, file.size)
  }
  return files
}

function packageEntry(packageInfo: Awaited<ReturnType<typeof loadPackage>>, subpath: string) {
  const value = packageInfo.exports[subpath]
  const path = isRecord(value) ? value.default : value
  if (typeof path !== "string" || !path.startsWith("./")) throw new Error(`Missing package export: ${subpath}`)
  return new URL(path, packageInfo.base)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value)
}
export function legacyCompilerBaseUrl(version: string) {
  const channel = valid(version) ? prerelease(version)?.[0] : undefined
  const published =
    valid(version) !== null && (channel === undefined || ["dev", "beta", "rc"].includes(String(channel)))
  return new URL(
    published
      ? `https://unpkg.com/typescript@${version}/lib/`
      : `https://playgroundcdn.typescriptlang.org/cdn/${encodeURIComponent(version)}/typescript/lib/`
  )
}
