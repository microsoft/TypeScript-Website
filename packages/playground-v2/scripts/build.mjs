import { context } from "esbuild"
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises"
import { dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { compatibilityHtml, compatibilityPaths, playgroundPath } from "./routes.mjs"

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const websiteDirectory = resolve(packageDirectory, "../..")
const vendorDirectory = resolve(packageDirectory, "vendor")
const outputDirectory = resolve(packageDirectory, "dist")
const websiteStaticDirectory = resolve(websiteDirectory, "packages/typescriptlang-org/static/play")
const compatibilityDirectories = compatibilityPaths.map(path =>
  resolve(websiteDirectory, "packages/typescriptlang-org/static", path)
)
const serve = process.argv.includes("--serve")
const playgroundBase = serve ? "/" : process.env.PLAYGROUND_BASE ?? playgroundPath

const releaseIndex = resolve(packageDirectory, "vendor/versions.json")
const examplesIndex = resolve(packageDirectory, "vendor/examples.json")
const helpIndex = resolve(packageDirectory, "vendor/help.json")
const editorWorker = fileURLToPath(import.meta.resolve("monaco-editor/editor/editor.worker"))
const coiServiceWorker = fileURLToPath(import.meta.resolve("coi-serviceworker/coi-serviceworker.min.js"))

const version = (await readFile(resolve(vendorDirectory, "version.txt"), "utf8")).trim()
const distribution = JSON.parse(await readFile(resolve(vendorDirectory, "distribution.json"), "utf8"))
const distributionPath = `compiler/${distribution.cacheKey}`
const indexHtml = (await readFile(resolve(packageDirectory, "src/index.html"), "utf8"))
  .replaceAll("__PLAYGROUND_BASE__", playgroundBase)
  .replaceAll("__COMPILER_VERSION__", version)
  .replace("<title>", `<title data-typescript-version="${version}">`)

await rm(outputDirectory, { force: true, recursive: true })
await mkdir(outputDirectory, { recursive: true })
await Promise.all([
  writeFile(resolve(outputDirectory, "index.html"), indexHtml),
  cp(coiServiceWorker, resolve(outputDirectory, "coi-serviceworker.min.js")),
  cp(releaseIndex, resolve(outputDirectory, "versions.json")),
  cp(examplesIndex, resolve(outputDirectory, "examples.json")),
  cp(helpIndex, resolve(outputDirectory, "help.json")),
  ...(process.env.COMPILER_DISTRIBUTION_URL ? [] : ["typescript", "typescript-wasip1-wasm", "distribution.json"]).map(
    name => cp(resolve(vendorDirectory, name), resolve(outputDirectory, distributionPath, name), { recursive: true })
  ),
])

const buildContext = await context({
  absWorkingDir: packageDirectory,
  bundle: true,
  conditions: ["browser", "default"],
  define: {
    __COMPILER_DISTRIBUTION_URL__: JSON.stringify(
      process.env.COMPILER_DISTRIBUTION_URL || `./${distributionPath}/distribution.json`
    ),
    __TS_VERSION__: JSON.stringify(version),
  },
  entryNames: "[name]",
  entryPoints: {
    main: resolve(packageDirectory, "src/main.ts"),
    "editor.worker": editorWorker,
    "strada.worker": resolve(packageDirectory, "src/strada.worker.ts"),
    "native.worker": resolve(packageDirectory, "src/native.worker.ts"),
    "tsgo-lsp.worker": resolve(packageDirectory, "src/tsgo-lsp.worker.ts"),
  },
  format: "esm",
  loader: {
    ".ttf": "file",
    ".woff": "file",
    ".woff2": "file",
  },
  outdir: outputDirectory,
  metafile: true,
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
  console.log(`TypeScript Playground v2: http://${server.host}:${server.port}`)
} else {
  const result = await buildContext.rebuild()
  const compilerInputs = Object.keys(result.metafile.inputs).filter(path =>
    /(?:vendor|node_modules)\/(?:@typescript\/)?typescript(?:-wasip1-wasm)?\//.test(path)
  )
  if (compilerInputs.length) throw new Error(`Compiler implementation was bundled: ${compilerInputs.join(", ")}`)
  await buildContext.dispose()
  await rm(websiteStaticDirectory, { force: true, recursive: true })
  await cp(outputDirectory, websiteStaticDirectory, { recursive: true })
  await Promise.all(
    compatibilityDirectories.map(async directory => {
      await mkdir(directory, { recursive: true })
      await writeFile(resolve(directory, "index.html"), compatibilityHtml)
    })
  )
  console.log(`Built TypeScript ${version} playground in ${outputDirectory}`)
}
