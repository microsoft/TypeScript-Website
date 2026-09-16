import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const websiteDirectory = resolve(packageDirectory, "../..")
const typescriptDirectory = resolve(
  process.env.TYPESCRIPT_REPO || resolve(websiteDirectory, "../TypeScript"),
)
const vendorDirectory = resolve(packageDirectory, "vendor")
const typescriptPackage = resolve(typescriptDirectory, "packages/typescript")
const wasmPackage = resolve(typescriptDirectory, "packages/typescript-wasip1-wasm")
const libDirectory = resolve(typescriptDirectory, "built/local")
const packageNames = ["typescript", "typescript-wasip1-wasm"]
const legalFiles = ["LICENSE.txt", "NOTICE.txt"]

await rm(vendorDirectory, { force: true, recursive: true })
await Promise.all(
  packageNames.map(packageName => mkdir(resolve(vendorDirectory, packageName), { recursive: true })),
)
await Promise.all([
  cp(resolve(typescriptPackage, "dist"), resolve(vendorDirectory, "typescript/dist"), {
    recursive: true,
  }),
  cp(resolve(wasmPackage, "dist"), resolve(vendorDirectory, "typescript-wasip1-wasm/dist"), {
    recursive: true,
  }),
  writeVendorManifest(typescriptPackage, "typescript"),
  writeVendorManifest(wasmPackage, "typescript-wasip1-wasm"),
  ...packageNames.flatMap(packageName =>
    legalFiles.map(fileName =>
      cp(
        resolve(typescriptDirectory, fileName),
        resolve(vendorDirectory, packageName, fileName),
      )
    )
  ),
])

const vendorLibDirectory = resolve(vendorDirectory, "lib")
await mkdir(vendorLibDirectory, { recursive: true })
const libFileNames = (await readdir(libDirectory))
  .filter(fileName => /^lib(?:\..+)?\.d\.ts$/.test(fileName))
await Promise.all(
  libFileNames.map(fileName =>
    cp(resolve(libDirectory, fileName), resolve(vendorLibDirectory, fileName))
  ),
)

const versionResult = spawnSync(
  resolve(typescriptDirectory, "built/local/tsc"),
  ["--version"],
  { encoding: "utf8" },
)
if (versionResult.status !== 0) {
  throw new Error(versionResult.stderr || "Unable to read the TypeScript version")
}
const version = versionResult.stdout.trim().replace(/^Version\s+/, "")
await writeFile(resolve(vendorDirectory, "version.txt"), `${version}\n`)

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
    files: ["dist", ...legalFiles],
    exports,
    imports,
  }
  await writeFile(
    resolve(vendorDirectory, vendorName, "package.json"),
    `${JSON.stringify(vendoredManifest, undefined, 2)}\n`,
  )
}
