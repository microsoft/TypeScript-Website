import { context } from "esbuild"
import { cp, mkdir, readFile, readdir, rm, writeFile } from "node:fs/promises"
import { basename, dirname, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { spawnSync } from "node:child_process"

const packageDirectory = resolve(dirname(fileURLToPath(import.meta.url)), "..")
const websiteDirectory = resolve(packageDirectory, "../..")
const typescriptDirectory = resolve(
  process.env.TYPESCRIPT_REPO || resolve(websiteDirectory, "../TypeScript"),
)
const outputDirectory = resolve(packageDirectory, "dist")
const websiteStaticDirectory = resolve(
  websiteDirectory,
  "packages/typescriptlang-org/static/ts7-playground",
)
const serve = process.argv.includes("--serve")

const typescriptAPI = resolve(typescriptDirectory, "packages/typescript/dist/api/sync/api.js")
const wasmPackage = resolve(typescriptDirectory, "packages/typescript-wasip1-wasm/dist/index.js")
const wasmFile = resolve(typescriptDirectory, "packages/typescript-wasip1-wasm/dist/tsc.wasm")
const libDirectory = resolve(typescriptDirectory, "built/local")
const editorWorker = fileURLToPath(
  import.meta.resolve("monaco-editor/editor/editor.worker"),
)

const versionResult = spawnSync(
  resolve(typescriptDirectory, "built/local/tsc"),
  ["--version"],
  { encoding: "utf8" },
)
const version = versionResult.status === 0
  ? versionResult.stdout.trim().replace(/^Version\s+/, "")
  : "7.1.0-dev"

await rm(outputDirectory, { force: true, recursive: true })
await mkdir(outputDirectory, { recursive: true })
const libFileNames = (await readdir(libDirectory))
  .filter(fileName => /^lib(?:\..+)?\.d\.ts$/.test(fileName))
  .sort()
const libFiles = Object.fromEntries(
  await Promise.all(
    libFileNames.map(async fileName => [
      `/${basename(fileName)}`,
      await readFile(resolve(libDirectory, fileName), "utf8"),
    ]),
  ),
)
await Promise.all([
  cp(resolve(packageDirectory, "src/index.html"), resolve(outputDirectory, "index.html")),
  cp(wasmFile, resolve(outputDirectory, "tsc.wasm")),
  writeFile(resolve(outputDirectory, "lib-files.json"), JSON.stringify(libFiles)),
])

const buildContext = await context({
  absWorkingDir: packageDirectory,
  bundle: true,
  conditions: ["browser", "default"],
  define: {
    __TS_VERSION__: JSON.stringify(version),
  },
  entryNames: "[name]",
  entryPoints: {
    main: resolve(packageDirectory, "src/main.ts"),
    "editor.worker": editorWorker,
  },
  format: "esm",
  loader: {
    ".ttf": "file",
    ".woff": "file",
    ".woff2": "file",
  },
  outdir: outputDirectory,
  platform: "browser",
  plugins: [
    {
      name: "local-typescript-wasip1",
      setup(build) {
        build.onResolve(
          { filter: /^@typescript\/typescript\/unstable\/sync$/ },
          () => ({ path: typescriptAPI }),
        )
        build.onResolve(
          { filter: /^@typescript\/typescript-wasip1-wasm$/ },
          () => ({ path: wasmPackage }),
        )
      },
    },
  ],
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
  console.log(`TypeScript 7.1 playground: http://${server.host}:${server.port}`)
}
else {
  await buildContext.rebuild()
  await buildContext.dispose()
  const htmlPath = resolve(outputDirectory, "index.html")
  const html = await readFile(htmlPath, "utf8")
  await writeFile(htmlPath, html.replace("<title>", `<title data-typescript-version="${version}">`))
  await rm(websiteStaticDirectory, { force: true, recursive: true })
  await cp(outputDirectory, websiteStaticDirectory, { recursive: true })
  console.log(`Built TypeScript ${version} playground in ${outputDirectory}`)
}
