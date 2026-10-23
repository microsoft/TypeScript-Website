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
  const base = new URL(response.url || url.href)
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
