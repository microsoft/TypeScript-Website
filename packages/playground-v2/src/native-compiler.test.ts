import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { test } from "node:test"
import { API } from "@typescript/typescript/unstable/sync"
import { instantiateWasm, WasmTransport } from "@typescript/typescript/unstable/wasm"
import { NativeCompiler, type NativeCompileInput } from "./native-compiler"

test("native compiler reuses snapshots across edits, types, and configuration changes", async () => {
  const directory = process.env.PLAYGROUND_DIR!
  const module = await WebAssembly.compile(await readFile(`${directory}/vendor/typescript-wasip1-wasm/lib/tsc.wasm`))
  const transport = new WasmTransport({ instance: await instantiateWasm(module), cwd: "/workspace" })
  const libDirectory = `${directory}/vendor/typescript-wasip1-wasm/lib`
  for (const name of await readdir(libDirectory)) {
    if (/^lib(?:\..+)?\.d\.ts$/.test(name)) transport.setFile(`/${name}`, await readFile(`${libDirectory}/${name}`, "utf8"))
  }
  const api = new API({ transport })
  const createProgram = api.createProgram
  const readConfigFile = api.readConfigFile
  const parseConfig = api.parseJsonConfigFileContent
  let syntheticPrograms = 0
  let configReads = 0
  let configParses = 0
  Object.defineProperties(api, {
    createProgram: {
      value: (...args: Parameters<typeof createProgram>) => {
        syntheticPrograms++
        return createProgram(...args)
      },
    },
    readConfigFile: {
      value: (...args: Parameters<typeof readConfigFile>) => {
        configReads++
        return readConfigFile(...args)
      },
    },
    parseJsonConfigFileContent: {
      value: (...args: Parameters<typeof parseConfig>) => {
        configParses++
        return parseConfig(...args)
      },
    },
  })
  const compiler = new NativeCompiler(api, transport)
  const configFileName = "/workspace/tsconfig.json"
  const source = "/workspace/src/index.ts"
  const config = { compilerOptions: { strict: true, target: "es2022", module: "commonjs", declaration: true }, include: ["src/**/*"] }
  const input: NativeCompileInput = {
    configFileName,
    sourceFiles: [source],
    files: {
      [configFileName]: JSON.stringify(config),
      [source]: "const answer = 42;\n//    ^?\n",
    },
  }
  try {
    const first = compiler.compile(input)
    assert.equal(first.diagnostics.length, 0)
    assert.match(first.outputFiles["/workspace/src/index.js"], /42/)
    assert(first.typeQueries[source].some(query => query.label === "42"))

    input.files[source] = 'const answer: number = "wrong";\n//    ^?\n'
    const changed = compiler.compile(input)
    assert(changed.diagnostics.some(diagnostic => diagnostic.code === 2322))
    assert.match(changed.outputFiles["/workspace/src/index.js"], /wrong/)
    assert(changed.typeQueries[source].some(query => query.label === "number"))

    input.files[source] = 'import { value } from "pkg";\nconst answer: string = value;'
    assert(compiler.compile(input).diagnostics.some(diagnostic => diagnostic.code === 2307))
    input.files["/workspace/node_modules/pkg/package.json"] = '{"name":"pkg","types":"index.d.ts"}'
    input.files["/workspace/node_modules/pkg/index.d.ts"] = "export const value: string;"
    assert.equal(compiler.compile(input).diagnostics.length, 0)
    delete input.files["/workspace/node_modules/pkg/package.json"]
    delete input.files["/workspace/node_modules/pkg/index.d.ts"]
    assert(compiler.compile(input).diagnostics.some(diagnostic => diagnostic.code === 2307))

    input.files[source] = "const answer = 1;"
    input.files[configFileName] = JSON.stringify({ ...config, compilerOptions: { ...config.compilerOptions, noEmit: true } })
    assert.deepEqual(compiler.compile(input).outputFiles, {})
    input.files[configFileName] = JSON.stringify(config)
    assert.match(compiler.compile(input).outputFiles["/workspace/src/index.js"], /1/)

    const unopened = "/workspace/src/unopened.ts"
    input.files[unopened] = 'export const unopenedValue: number = "wrong";'
    const wholeProject = compiler.compile(input)
    assert(wholeProject.diagnostics.some(diagnostic => diagnostic.code === 2322 && diagnostic.fileName === unopened))
    delete input.files[unopened]
    assert.equal(compiler.compile(input).diagnostics.length, 0)

    input.files[configFileName] = JSON.stringify({
      ...config,
      compilerOptions: { ...config.compilerOptions, unknownCompilerOption: true },
    })
    assert(compiler.compile(input).diagnostics.some(diagnostic => diagnostic.code === 5023))
    input.files[configFileName] = '{"compilerOptions": { "strict": true ';
    assert(compiler.compile(input).diagnostics.some(diagnostic => diagnostic.fileName === configFileName))
    input.files[configFileName] = JSON.stringify(config)
    assert.equal(compiler.compile(input).diagnostics.length, 0)

    assert.equal(configReads, 0)
    assert.equal(configParses, 0)
    const orphan = "/workspace/orphan.ts"
    input.sourceFiles = [source, orphan]
    input.files[orphan] = "const orphanValue = true;"
    assert.equal(compiler.compile(input).typeQueries[orphan], undefined)
    assert.equal(syntheticPrograms, 0)

    const orphanHelper = "/workspace/orphan-helper.ts"
    input.files[orphanHelper] = "declare const orphanSource: true;"
    input.sourceFiles = [source, orphan, orphanHelper]
    input.files[orphan] = "const orphanValue = orphanSource;\n//    ^?\n"
    assert(compiler.compile(input).typeQueries[orphan].some(query => query.label.includes("true")))
    assert.equal(syntheticPrograms, 1)
  } finally {
    compiler.close()
  }
})
