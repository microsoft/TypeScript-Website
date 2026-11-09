import { prerelease, valid } from "semver"
import { fetchCompilerResource, type CompilerAssetMetadata } from "./compiler-assets"
import { isPullRequestCompilerVersion } from "./compiler-versions"

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
  assets: ReadonlyMap<string, CompilerAssetMetadata>
}

export async function loadPublishedCompilerDistribution(version: string): Promise<CompilerDistribution> {
  const [mainName, artifactName] = isPullRequestCompilerVersion(version)
    ? ["@typescript-deploys/pr-build", "@typescript-deploys/pr-build-wasip1-wasm"]
    : ["typescript", "@typescript/typescript-wasip1-wasm"]
  const [main, artifact] = await Promise.all([loadPackage(mainName, version), loadPackage(artifactName, version)])
  if (main.revision !== artifact.revision) {
    throw new Error(`TypeScript API and WASI artifact revisions do not match for ${version}`)
  }
  const wasm = packageEntry(artifact, "./lib/tsc.wasm")
  const schema = packageEntry(main, "./schemas/tsconfig.schema.json")
  const libraryDirectory = new URL("./", wasm)
  const [mainFiles, artifactFiles] = await Promise.all([
    loadFileMetadata(main.base),
    loadFileMetadata(artifact.base, libraryDirectory),
  ])
  function size(files: ReadonlyMap<string, CompilerAssetMetadata>, url: URL) {
    const bytes = files.get(url.href)?.size
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
  const moduleBytes = [...mainFiles].reduce((sum, [url, file]) => sum + (url.endsWith(".js") ? file.size : 0), 0)
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
    assets: new Map([...mainFiles, ...artifactFiles]),
  }
}

async function loadPackage(name: string, version: string) {
  const base = new URL(`https://unpkg.com/${name}@${version}/`)
  const url = new URL("package.json", base)
  const metadata: unknown = await fetchCompilerResource(url, response => response.json())
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

async function loadFileMetadata(base: URL, directory = base): Promise<ReadonlyMap<string, CompilerAssetMetadata>> {
  const metadata: unknown = await fetchCompilerResource(new URL("?meta", directory), response => response.json())
  if (!isRecord(metadata) || !Array.isArray(metadata.files)) throw new Error("Invalid compiler file sizes")
  const files = new Map<string, CompilerAssetMetadata>()
  for (const file of metadata.files) {
    if (
      !isRecord(file) ||
      typeof file.path !== "string" ||
      typeof file.size !== "number" ||
      !Number.isSafeInteger(file.size) ||
      file.size < 0 ||
      typeof file.integrity !== "string" ||
      !/^sha256-[A-Za-z0-9+/]{43}=$/.test(file.integrity)
    ) {
      throw new Error("Invalid compiler file size")
    }
    files.set(new URL(file.path.replace(/^\//, ""), base).href, { size: file.size, integrity: file.integrity })
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
// These fixed CDN releases contain a different compiler than their URL claims.
const incorrectLegacyReleases = new Set([
  "4.0.2",
  "4.1.5",
  "4.2.2",
  "4.2.3",
  "4.3.2",
  "4.3.3",
  "4.3.4",
  "4.3.5",
  "4.4.2",
  "4.4.3",
  "4.4.4",
])

export function legacyCompilerBaseUrl(version: string, mirroredVersions: readonly string[] = []) {
  const channel = valid(version) ? prerelease(version)?.[0] : undefined
  const published =
    valid(version) !== null && (channel === undefined || ["dev", "beta", "rc"].includes(String(channel)))
  return new URL(
    published && (!mirroredVersions.includes(version) || incorrectLegacyReleases.has(version))
      ? `https://unpkg.com/typescript@${version}/lib/`
      : `https://playgroundcdn.typescriptlang.org/cdn/${encodeURIComponent(version)}/typescript/lib/`
  )
}
