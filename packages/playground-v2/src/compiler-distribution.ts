export type CompilerModules = {
  sync: string
  async: string
  ast: string
  host: string
}

export type CompilerDistribution = CompilerModules & {
  version: string
  revision: string
  cacheKey: string
  wasm: URL
  libraryIndex: URL
  schema: URL
  libraries: URL[]
  downloadBytes: number
}

export async function loadCompilerDistribution(url: URL): Promise<CompilerDistribution> {
  const response = await fetch(url)
  if (!response.ok) throw new Error(`Could not load compiler distribution: ${response.status} ${url}`)
  const metadata: unknown = await response.json()
  return resolveCompilerDistribution(metadata, new URL(response.url || url.href))
}

export async function loadPublishedCompilerDistribution(version: string): Promise<CompilerDistribution> {
  const [main, artifact] = await Promise.all([
    loadPackage("typescript", version),
    loadPackage("@typescript/typescript-wasip1-wasm", version),
  ])
  if (main.revision !== artifact.revision) {
    throw new Error(`TypeScript API and WASI artifact revisions do not match for ${version}`)
  }
  return resolveCompilerDistribution(
    {
      version,
      revision: main.revision,
      cacheKey: `npm-${version}`,
      sync: packageEntry(main, "./sync"),
      async: packageEntry(main, "./async"),
      ast: packageEntry(main, "./ast"),
      host: packageEntry(main, "./wasm"),
      wasm: packageEntry(artifact, "./lib/tsc.wasm"),
      libraryIndex: packageEntry(artifact, "./lib/libFiles.json"),
      schema: packageEntry(main, "./schemas/tsconfig.schema.json"),
      downloadBytes: main.unpackedSize + artifact.unpackedSize,
    },
    main.base
  )
}

async function loadPackage(name: string, version: string) {
  const url = `https://registry.npmjs.org/${encodeURIComponent(name)}/${encodeURIComponent(version)}`
  const response = await fetch(url, { signal: AbortSignal.timeout(30_000) })
  if (!response.ok) throw new Error(`Could not load ${name}@${version}: ${response.status}`)
  const metadata: unknown = await response.json()
  if (
    !isRecord(metadata) ||
    metadata.name !== name ||
    metadata.version !== version ||
    typeof metadata.gitHead !== "string" ||
    !metadata.gitHead ||
    !isRecord(metadata.exports) ||
    !isRecord(metadata.dist) ||
    typeof metadata.dist.unpackedSize !== "number" ||
    !Number.isSafeInteger(metadata.dist.unpackedSize) ||
    metadata.dist.unpackedSize < 1
  ) {
    throw new Error(`Invalid package metadata for ${name}@${version}`)
  }
  return {
    base: new URL(`https://unpkg.com/${name}@${version}/`),
    revision: metadata.gitHead,
    exports: metadata.exports,
    unpackedSize: metadata.dist.unpackedSize,
  }
}

function packageEntry(packageInfo: Awaited<ReturnType<typeof loadPackage>>, subpath: string) {
  const value = packageInfo.exports[subpath]
  const path = isRecord(value) ? value.default : value
  if (typeof path !== "string" || !path.startsWith("./")) throw new Error(`Missing package export: ${subpath}`)
  return new URL(path, packageInfo.base).href
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value)
}

async function resolveCompilerDistribution(metadata: unknown, base: URL): Promise<CompilerDistribution> {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) {
    throw new Error("Invalid compiler distribution metadata")
  }
  const fields = metadata
  function field(key: string) {
    const value: unknown = Reflect.get(fields, key)
    if (typeof value !== "string" || !value) throw new Error(`Invalid compiler distribution field: ${key}`)
    return value
  }
  const version = field("version")
  const revision = field("revision")
  const cacheKey = field("cacheKey")
  const downloadBytes: unknown = Reflect.get(metadata, "downloadBytes")
  if (typeof downloadBytes !== "number" || !Number.isSafeInteger(downloadBytes) || downloadBytes < 1) {
    throw new Error("Invalid compiler distribution download size")
  }
  const libraryIndex = new URL(field("libraryIndex"), base)
  const indexResponse = await fetch(libraryIndex)
  if (!indexResponse.ok) throw new Error(`Could not load compiler library index: ${indexResponse.status}`)
  const names: unknown = await indexResponse.json()
  if (
    !Array.isArray(names) ||
    names.length === 0 ||
    !names.every((name: unknown): name is string => typeof name === "string" && /^lib(?:\.[\w.]+)?\.d\.ts$/.test(name))
  ) {
    throw new Error("Invalid compiler library index")
  }
  return {
    version,
    revision,
    cacheKey,
    sync: new URL(field("sync"), base).href,
    async: new URL(field("async"), base).href,
    ast: new URL(field("ast"), base).href,
    host: new URL(field("host"), base).href,
    wasm: new URL(field("wasm"), base),
    libraryIndex,
    schema: new URL(field("schema"), base),
    libraries: names.map(name => new URL(name, indexResponse.url || libraryIndex)),
    downloadBytes,
  }
}
