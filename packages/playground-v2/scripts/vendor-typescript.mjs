import { createHash } from "node:crypto"
import { mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const typescriptDirectory = resolve(process.env.TYPESCRIPT_REPO || resolve(packageDirectory, "../../../TypeScript"))
const vendorDirectory = resolve(packageDirectory, "vendor")
const packageNames = ["typescript", "typescript-wasip1-wasm"]

function run(command, args) {
  const result = spawnSync(command, args, { cwd: typescriptDirectory, encoding: "utf8" })
  if (result.error) throw result.error
  if (result.status !== 0) throw new Error(result.stderr || result.stdout || `${command} failed`)
  return result.stdout.trim()
}

const revision = run("git", ["rev-parse", "HEAD"])
if (run("git", ["status", "--porcelain"])) throw new Error("Commit the TypeScript changes before vendoring")
const manifests = await Promise.all(
  packageNames.map(async name => {
    const source = resolve(typescriptDirectory, "built/npm", `${name}.tgz`)
    const entries = run("tar", ["-tzf", source]).split("\n")
    for (const path of entries) {
      if (!path.startsWith("package/") || path.split("/").some(part => part === "..")) {
        throw new Error(`Invalid path in ${name} tarball: ${path}`)
      }
    }
    const manifest = JSON.parse(run("tar", ["-xOf", source, "package/package.json"]))
    if (manifest.gitHead !== revision) throw new Error(`Rebuild ${name}: its gitHead does not match ${revision}`)
    return {
      name,
      source,
      manifest,
      files: entries
        .filter(path => !path.endsWith("/"))
        .map(path => path.slice(8))
        .sort(),
    }
  })
)
const version = manifests[0].manifest.version
if (version !== manifests[1].manifest.version) throw new Error("TypeScript API and WASI artifact versions do not match")

const hash = createHash("sha256")
for (const { name, source, files } of manifests) {
  const target = resolve(vendorDirectory, name)
  await rm(target, { recursive: true, force: true })
  await mkdir(target, { recursive: true })
  run("tar", ["-xzf", source, "--strip-components=1", "--no-same-owner", "-C", target])
  for (const path of files) {
    hash.update(`${name}/${path}\0`).update(await readFile(resolve(target, path)))
  }
}

const mainDirectory = resolve(vendorDirectory, "typescript")
const artifactDirectory = resolve(vendorDirectory, "typescript-wasip1-wasm")
const main = JSON.parse(await readFile(resolve(mainDirectory, "package.json"), "utf8"))
const artifact = JSON.parse(await readFile(resolve(artifactDirectory, "package.json"), "utf8"))
if (main.version !== artifact.version) throw new Error("TypeScript API and WASI artifact versions do not match")
if (main.imports) throw new Error("The compiler distribution must not require package-private imports")
const libraries = JSON.parse(await readFile(resolve(artifactDirectory, "lib/libFiles.json"), "utf8"))
if (
  !Array.isArray(libraries) ||
  libraries.length === 0 ||
  libraries.some(name => typeof name !== "string" || !/^lib(?:\.[\w.]+)?\.d\.ts$/.test(name))
) {
  throw new Error("Invalid WASI library index")
}

function entry(manifest, subpath, directory) {
  const value = manifest.exports[subpath]
  const path = typeof value === "string" ? value : value?.default
  if (typeof path !== "string" || !path.startsWith("./")) throw new Error(`Missing package export: ${subpath}`)
  return `${directory}/${path.slice(2)}`
}

const paths = {
  sync: entry(main, "./sync", "typescript"),
  async: entry(main, "./async", "typescript"),
  ast: entry(main, "./ast", "typescript"),
  host: entry(main, "./wasm", "typescript"),
  wasm: entry(artifact, "./lib/tsc.wasm", "typescript-wasip1-wasm"),
  libraryIndex: entry(artifact, "./lib/libFiles.json", "typescript-wasip1-wasm"),
  schema: entry(main, "./schemas/tsconfig.schema.json", "typescript"),
}
const bytes = await Promise.all(
  [paths.wasm, paths.libraryIndex, paths.schema].map(path => readFile(resolve(vendorDirectory, path)))
)
const libraryBytes = await Promise.all(libraries.map(name => readFile(resolve(artifactDirectory, "lib", name))))
const cacheKey = hash.digest("hex").slice(0, 16)
await Promise.all([
  writeFile(resolve(vendorDirectory, "source-revision.txt"), `${revision}\n`),
  writeFile(resolve(vendorDirectory, "version.txt"), `${version}\n`),
  writeFile(
    resolve(vendorDirectory, "distribution.json"),
    `${JSON.stringify(
      {
        version,
        revision,
        cacheKey,
        ...paths,
        downloadBytes:
          bytes.reduce((sum, value) => sum + value.byteLength, 0) +
          libraryBytes.reduce((sum, value) => sum + value.byteLength, 0),
      },
      undefined,
      2
    )}\n`
  ),
])
console.log(`Vendored unchanged npm package contents for TypeScript ${version} at ${revision}`)
