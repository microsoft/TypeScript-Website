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
  downloadBytes: number
}

export async function loadPublishedCompilerDistribution(version: string): Promise<CompilerDistribution> {
  const [main, artifact] = await Promise.all([
    loadPackage("typescript", version),
    loadPackage("@typescript/typescript-wasip1-wasm", version),
  ])
  if (main.revision !== artifact.revision) {
    throw new Error(`TypeScript API and WASI artifact revisions do not match for ${version}`)
  }
  const libraryIndex = packageEntry(artifact, "./lib/libFiles.json")
  const indexResponse = await fetch(libraryIndex, { signal: AbortSignal.timeout(30_000) })
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
    sync: packageEntry(main, "./sync").href,
    async: packageEntry(main, "./async").href,
    ast: packageEntry(main, "./ast").href,
    host: packageEntry(main, "./wasm").href,
    wasm: packageEntry(artifact, "./lib/tsc.wasm"),
    schema: packageEntry(main, "./schemas/tsconfig.schema.json"),
    libraries: names.map(name => new URL(name, libraryIndex)),
    downloadBytes: main.unpackedSize + artifact.unpackedSize,
  }
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
  return new URL(path, packageInfo.base)
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value)
}
