import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { resolve } from "node:path"
import { pathToFileURL } from "node:url"

const packageDirectory = resolve(import.meta.dirname, "..")
const typescriptDirectory = resolve(
  process.env.TYPESCRIPT_REPO || resolve(packageDirectory, "../../..", "TypeScript"),
)
const apiModule = await import(
  pathToFileURL(resolve(typescriptDirectory, "packages/typescript/dist/api/sync/api.js"))
)
const wasmModule = await import(
  pathToFileURL(resolve(typescriptDirectory, "packages/typescript-wasip1-wasm/dist/index.js"))
)
const wasm = await readFile(resolve(packageDirectory, "dist/tsc.wasm"))
const module = await WebAssembly.compile(wasm)
const instance = await wasmModule.instantiateWasm(module)
const transport = new wasmModule.WasmTransport({ instance, cwd: "/" })
const api = new apiModule.API({ transport })

try {
  const libDirectory = resolve(typescriptDirectory, "built/local")
  const libFileNames = (await readdir(libDirectory))
    .filter(fileName => /^lib(?:\..+)?\.d\.ts$/.test(fileName))
  for (const fileName of libFileNames) {
    transport.setFile(`/${fileName}`, await readFile(resolve(libDirectory, fileName), "utf8"))
  }

  const source = "const answers = [40, 41, 42].map(value => value + 1);"
  const emitted = api.transpileModule(source, {
    compilerOptions: { module: 99, target: 99 },
    fileName: "/index.ts",
    reportDiagnostics: true,
  })
  assert.match(emitted.outputText, /const answers = \[40, 41, 42\]\.map/)

  transport.setFile("/index.ts", source)
  const program = api.createProgram(
    ["/index.ts"],
    { compilerOptions: { strict: true, target: 99 } },
  )
  try {
    assert.equal(program.getSyntacticDiagnostics("/index.ts").length, 0)
    assert.equal(program.getSemanticDiagnostics("/index.ts").length, 0)
    assert.ok(program.getSourceFile("/index.ts"))
  }
  finally {
    program.dispose()
  }
}
finally {
  api.close()
}

console.log("TypeScript WASM API smoke test passed")
