import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const websiteDirectory = resolve(packageDirectory, "../..")
const typescriptDirectory = resolve(process.env.TYPESCRIPT_REPO || resolve(websiteDirectory, "../TypeScript"))
const vendorDirectory = resolve(packageDirectory, "vendor")
const typescriptPackage = resolve(typescriptDirectory, "packages/typescript")
const wasmPackage = resolve(typescriptDirectory, "packages/typescript-wasip1-wasm")
const libDirectory = resolve(wasmPackage, "lib")
const packageNames = ["typescript", "typescript-wasip1-wasm"]
const legalFiles = ["LICENSE.txt", "NOTICE.txt"]

const libFileNames = JSON.parse(await readFile(resolve(libDirectory, "libFiles.json"), "utf8"))
const expectedLibFileNames = (await readdir(libDirectory)).filter(fileName => /^lib(?:\..+)?\.d\.ts$/.test(fileName)).sort()
if (
  !Array.isArray(libFileNames) ||
  libFileNames.length === 0 ||
  JSON.stringify(libFileNames) !== JSON.stringify(expectedLibFileNames)
) {
  throw new Error("The WASI package library index does not match its declaration files")
}
await Promise.all([
  readFile(resolve(typescriptPackage, "dist/wasm/index.js")),
  readFile(resolve(typescriptPackage, "schemas/tsconfig.schema.json")),
  readFile(resolve(typescriptPackage, "schemas/jsconfig.schema.json")),
  readFile(resolve(wasmPackage, "lib/tsc.wasm")),
])

await Promise.all([
  rm(resolve(vendorDirectory, "lib"), { force: true, recursive: true }),
  rm(resolve(vendorDirectory, "typescript"), { force: true, recursive: true }),
  rm(resolve(vendorDirectory, "typescript-wasip1-wasm"), { force: true, recursive: true }),
  rm(resolve(vendorDirectory, "source-revision.txt"), { force: true }),
  rm(resolve(vendorDirectory, "version.txt"), { force: true }),
])
await Promise.all(packageNames.map(packageName => mkdir(resolve(vendorDirectory, packageName), { recursive: true })))
await Promise.all([
  cp(resolve(typescriptPackage, "dist"), resolve(vendorDirectory, "typescript/dist"), {
    recursive: true,
  }),
  cp(resolve(wasmPackage, "dist"), resolve(vendorDirectory, "typescript-wasip1-wasm/dist"), {
    recursive: true,
  }),
  cp(resolve(wasmPackage, "lib"), resolve(vendorDirectory, "typescript-wasip1-wasm/lib"), { recursive: true }),
  cp(resolve(typescriptPackage, "schemas"), resolve(vendorDirectory, "typescript/schemas"), { recursive: true }),
  writeVendorManifest(typescriptPackage, "typescript"),
  writeVendorManifest(wasmPackage, "typescript-wasip1-wasm"),
  ...packageNames.flatMap(packageName =>
    legalFiles.map(fileName =>
      cp(resolve(typescriptDirectory, fileName), resolve(vendorDirectory, packageName, fileName))
    )
  ),
])

const versionResult = spawnSync(resolve(typescriptDirectory, "built/local/tsc"), ["--version"], { encoding: "utf8" })
if (versionResult.status !== 0) {
  throw new Error(versionResult.stderr || "Unable to read the TypeScript version")
}
const version = versionResult.stdout.trim().replace(/^Version\s+/, "")
const revisionResult = spawnSync("git", ["-C", typescriptDirectory, "rev-parse", "HEAD"], {
  encoding: "utf8",
})
if (revisionResult.status !== 0) {
  throw new Error(revisionResult.stderr || "Unable to read the TypeScript source revision")
}
await Promise.all([
  writeFile(resolve(vendorDirectory, "source-revision.txt"), revisionResult.stdout.trim() + "\n"),
  writeFile(resolve(vendorDirectory, "version.txt"), `${version}\n`),
])

console.log(`Vendored TypeScript ${version} from ${typescriptDirectory}`)

async function writeVendorManifest(sourceDirectory, vendorName) {
  const manifest = JSON.parse(await readFile(resolve(sourceDirectory, "package.json"), "utf8"))
  const exports = { ...manifest.exports }
  const imports = { ...manifest.imports }
  if (vendorName === "typescript") {
    delete exports["."]
    delete imports["#getExePath"]
    delete imports["#vscode-jsonrpc/node"]
    imports["#asyncClient"] = "./dist/api/async/browserClient.js"
    imports["#syncClient"] = "./dist/api/sync/browserClient.js"
    imports["#enums/*"] = {
      types: "./dist/enums/*.enum.d.ts",
      default: "./dist/enums/*.js",
    }
  }
  const vendoredManifest = {
    name: manifest.name,
    version: manifest.version,
    license: manifest.license,
    type: manifest.type,
    files: vendorName === "typescript-wasip1-wasm" ? ["dist", "lib", ...legalFiles] : ["dist", "schemas", ...legalFiles],
    exports,
    imports,
  }
  await writeFile(
    resolve(vendorDirectory, vendorName, "package.json"),
    `${JSON.stringify(vendoredManifest, undefined, 2)}\n`
  )
}
