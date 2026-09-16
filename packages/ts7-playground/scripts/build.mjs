import { context } from "esbuild"
import { cp, mkdir, readFile, readdir, rm, stat, writeFile } from "node:fs/promises"
import { basename, dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const websiteDirectory = resolve(packageDirectory, "../..")
const vendorDirectory = resolve(packageDirectory, "vendor")
const outputDirectory = resolve(packageDirectory, "dist")
const websiteStaticDirectory = resolve(websiteDirectory, "packages/typescriptlang-org/static/play/7")
const serve = process.argv.includes("--serve")
const playgroundBase = serve ? "/" : process.env.PLAYGROUND_BASE ?? "/play/7/"

const wasmFile = resolve(vendorDirectory, "typescript-wasip1-wasm/dist/tsc.wasm")
const libDirectory = resolve(vendorDirectory, "lib")
const configSchema = resolve(websiteDirectory, "packages/tsconfig-reference/scripts/schema/result/schema.json")
const editorWorker = fileURLToPath(import.meta.resolve("monaco-editor/editor/editor.worker"))
const coiServiceWorker = fileURLToPath(import.meta.resolve("coi-serviceworker/coi-serviceworker.min.js"))

const version = (await readFile(resolve(vendorDirectory, "version.txt"), "utf8")).trim()
const indexHtml = (await readFile(resolve(packageDirectory, "src/index.html"), "utf8"))
  .replaceAll("__PLAYGROUND_BASE__", playgroundBase)
  .replace("<title>", `<title data-typescript-version="${version}">`)

await rm(outputDirectory, { force: true, recursive: true })
await mkdir(outputDirectory, { recursive: true })
const libFileNames = (await readdir(libDirectory)).filter(fileName => /^lib(?:\..+)?\.d\.ts$/.test(fileName)).sort()
const libFiles = Object.fromEntries(
  await Promise.all(
    libFileNames.map(async fileName => [
      `/${basename(fileName)}`,
      await readFile(resolve(libDirectory, fileName), "utf8"),
    ])
  )
)
const libFilesJSON = JSON.stringify(libFiles)
const [wasmStats, schemaStats] = await Promise.all([stat(wasmFile), stat(configSchema)])
await Promise.all([
  writeFile(resolve(outputDirectory, "index.html"), indexHtml),
  cp(coiServiceWorker, resolve(outputDirectory, "coi-serviceworker.min.js")),
  cp(configSchema, resolve(outputDirectory, "tsconfig.schema.json")),
  cp(wasmFile, resolve(outputDirectory, "tsc.wasm")),
  writeFile(resolve(outputDirectory, "lib-files.json"), libFilesJSON),
])

const buildContext = await context({
  absWorkingDir: packageDirectory,
  bundle: true,
  conditions: ["browser", "default"],
  define: {
    __LOAD_ASSET_SIZES__: JSON.stringify({
      libraries: Buffer.byteLength(libFilesJSON),
      schema: schemaStats.size,
      wasm: wasmStats.size,
    }),
    __TS_VERSION__: JSON.stringify(version),
  },
  entryNames: "[name]",
  entryPoints: {
    main: resolve(packageDirectory, "src/main.ts"),
    "editor.worker": editorWorker,
    "tsgo-lsp.worker": resolve(packageDirectory, "src/tsgo-lsp.worker.ts"),
  },
  format: "esm",
  loader: {
    ".ttf": "file",
    ".woff": "file",
    ".woff2": "file",
  },
  outdir: outputDirectory,
  platform: "browser",
  sourcemap: true,
  target: ["es2022"],
})

if (serve) {
  await buildContext.watch()
  const server = await buildContext.serve({
    host: "127.0.0.1",
    port: 4173,
    servedir: outputDirectory,
  })
  console.log(`TypeScript 7 playground: http://${server.host}:${server.port}`)
} else {
  await buildContext.rebuild()
  await buildContext.dispose()
  await rm(websiteStaticDirectory, { force: true, recursive: true })
  await cp(outputDirectory, websiteStaticDirectory, { recursive: true })
  console.log(`Built TypeScript ${version} playground in ${outputDirectory}`)
}
