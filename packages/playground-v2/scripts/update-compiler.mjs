import { createHash } from "node:crypto"
import { readFile, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const mainURL = new URL(import.meta.resolve("@typescript/typescript/package.json"))
const artifactURL = new URL(import.meta.resolve("@typescript/typescript-wasip1-wasm/package.json"))
const main = JSON.parse(await readFile(mainURL, "utf8"))
const artifact = JSON.parse(await readFile(artifactURL, "utf8"))
const dependencies = JSON.parse(await readFile(resolve(packageDirectory, "package.json"), "utf8")).dependencies
const version = main.version
const revision = main.gitHead
if (
  dependencies["@typescript/typescript"] !== `npm:typescript@${version}` ||
  dependencies["@typescript/typescript-wasip1-wasm"] !== version
) {
  throw new Error("Install the pinned compiler dependencies before updating the distribution")
}
if (version !== artifact.version || !revision || revision !== artifact.gitHead) {
  throw new Error("TypeScript API and WASI artifact versions and revisions must match")
}
if (main.imports) throw new Error("The compiler distribution must not require package-private imports")

function entry(manifest, subpath) {
  const value = manifest.exports[subpath]
  const path = typeof value === "string" ? value : value?.default
  if (typeof path !== "string" || !path.startsWith("./")) throw new Error(`Missing package export: ${subpath}`)
  return path
}

function cdnEntry(manifest, subpath) {
  return new URL(entry(manifest, subpath), `https://unpkg.com/${manifest.name}@${version}/`).href
}

const libraryIndexURL = new URL(entry(artifact, "./lib/libFiles.json"), artifactURL)
const libraries = JSON.parse(await readFile(libraryIndexURL, "utf8"))
if (
  !Array.isArray(libraries) ||
  libraries.length === 0 ||
  libraries.some(name => typeof name !== "string" || !/^lib(?:\.[\w.]+)?\.d\.ts$/.test(name))
) {
  throw new Error("Invalid WASI library index")
}
const paths = {
  sync: cdnEntry(main, "./sync"),
  async: cdnEntry(main, "./async"),
  ast: cdnEntry(main, "./ast"),
  host: cdnEntry(main, "./wasm"),
  wasm: cdnEntry(artifact, "./lib/tsc.wasm"),
  libraryIndex: cdnEntry(artifact, "./lib/libFiles.json"),
  schema: cdnEntry(main, "./schemas/tsconfig.schema.json"),
}
const files = [
  new URL(entry(artifact, "./lib/tsc.wasm"), artifactURL),
  libraryIndexURL,
  new URL(entry(main, "./schemas/tsconfig.schema.json"), mainURL),
  ...libraries.map(name => new URL(name, libraryIndexURL)),
]
const bytes = await Promise.all(files.map(url => readFile(url)))
const cacheKey = createHash("sha256").update(`${version}\0${revision}`).digest("hex").slice(0, 16)
await writeFile(
  resolve(packageDirectory, "vendor/distribution.json"),
  `${JSON.stringify(
    {
      version,
      revision,
      cacheKey,
      ...paths,
      downloadBytes: bytes.reduce((sum, value) => sum + value.byteLength, 0),
    },
    undefined,
    2
  )}\n`
)
console.log(`Pinned the CDN distribution to TypeScript ${version} at ${revision}`)
