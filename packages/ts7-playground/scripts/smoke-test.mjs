import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { resolve } from "node:path"
import { API } from "@typescript/typescript/unstable/sync"
import { instantiateWasm, WasmTransport, wasmURL } from "@typescript/typescript-wasip1-wasm"

const packageDirectory = resolve(import.meta.dirname, "..")
const wasm = await readFile(wasmURL)
const module = await WebAssembly.compile(wasm)
const instance = await instantiateWasm(module)
const transport = new WasmTransport({ instance, cwd: "/workspace" })
const api = new API({ transport })

try {
  const libDirectory = resolve(packageDirectory, "vendor/lib")
  const libFileNames = (await readdir(libDirectory)).filter(fileName => /^lib(?:\..+)?\.d\.ts$/.test(fileName))
  for (const fileName of libFileNames) {
    transport.setFile(`/${fileName}`, await readFile(resolve(libDirectory, fileName), "utf8"))
  }

  const files = {
    "/workspace/tsconfig.json": JSON.stringify({
      compilerOptions: {
        declaration: true,
        module: "CommonJS",
        strict: true,
        target: "ES2022",
      },
      include: ["./src/**/*"],
    }),
    "/workspace/src/greet.ts": "export const greet = (name: string) => `Hello, ${name}!`;",
    "/workspace/src/index.ts": 'import { greet } from "./greet"; console.log(greet("TS7"));',
  }
  for (const [fileName, source] of Object.entries(files)) {
    transport.setFile(fileName, source)
  }

  const config = api.readConfigFile("/workspace/tsconfig.json")
  assert.equal(config.error, undefined)
  const parsed = api.parseJsonConfigFileContent(config.config, {
    configFileName: "/workspace/tsconfig.json",
  })
  assert.deepEqual(parsed.fileNames, ["/workspace/src/greet.ts", "/workspace/src/index.ts"])
  const program = api.createProgram(parsed.fileNames, {
    compilerOptions: parsed.options,
    projectReferences: parsed.projectReferences,
    configFileParsingDiagnostics: parsed.errors,
  })
  try {
    assert.equal(program.getSyntacticDiagnostics().length, 0)
    assert.equal(program.getSemanticDiagnostics().length, 0)
    const emit = program.emitToString()
    assert.equal(emit.emitSkipped, false)
    assert.deepEqual(
      [...emit.outputFiles.keys()],
      ["/workspace/src/greet.d.ts", "/workspace/src/greet.js", "/workspace/src/index.d.ts", "/workspace/src/index.js"]
    )
    assert.match(emit.outputFiles.get("/workspace/src/index.js").text, /require\("\.\/greet"\)/)
  } finally {
    program.dispose()
  }
} finally {
  api.close()
}

console.log("TypeScript WASM API smoke test passed")
