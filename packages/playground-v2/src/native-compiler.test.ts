import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { test } from "node:test"
import { API } from "@typescript/typescript/sync"
import * as ast from "@typescript/typescript/ast"
import { instantiateWasm, WasmTransport } from "@typescript/typescript/wasm"
import { NativeCompiler, type NativeCompileInput } from "./native-compiler"
import { loadCompilerDistribution, loadPublishedCompilerDistribution } from "./compiler-distribution"
import { compilerVersionChoices, isWasmCompilerVersion, loadPublishedCompilerVersions } from "./compiler-versions"
import { loadStradaLibraries, type StradaLibraryProgress } from "./strada-libraries"
import { computeCompilerOverrides } from "./compiler-overrides"

test("native TypeScript comment directives are not project-wide compiler overrides", () => {
  const config = '{"compilerOptions":{"strict":false}}'
  const state = computeCompilerOverrides(
    new Map([
      [
        "/workspace/src/index.ts",
        [
          "// @ts-expect-error: intentional type error",
          "// @ts-ignore: compatibility",
          "// @ts-nocheck: generated",
          "// @ts-check:",
          "// @strict: true",
          'const value: number = "wrong";',
        ].join("\n"),
      ],
    ]),
    config
  )
  assert.deepEqual(state.diagnostics, [])
  assert.deepEqual(
    state.overrides.map(override => override.option),
    ["strict"]
  )
  assert.deepEqual(JSON.parse(state.effectiveConfigText).compilerOptions, { strict: true })
})

test("legacy library discovery downloads bounded parallel batches, deduplicates references, and reports progress", async t => {
  const source = new Map<string, string>([
    ["lib.root.d.ts", Array.from({ length: 12 }, (_, index) => `/// <reference lib="part${index}" />`).join("\n")],
    ...Array.from({ length: 12 }, (_, index): [string, string] => [
      `lib.part${index}.d.ts`,
      '/// <reference lib="shared" />\n/// <reference path="lib.root.d.ts" />',
    ]),
    ["lib.shared.d.ts", "interface Shared {}"],
  ])
  let active = 0
  let maximum = 0
  const requests: string[] = []
  t.mock.method(globalThis, "fetch", async (input: URL | RequestInfo) => {
    const name = new URL(String(input)).pathname.split("/").at(-1)!
    requests.push(name)
    active++
    maximum = Math.max(maximum, active)
    await new Promise(resolve => setTimeout(resolve, 5))
    active--
    return new Response(source.get(name), { status: source.has(name) ? 200 : 404 })
  })
  const libraries = new Map<string, string>()
  const progress: StradaLibraryProgress[] = []
  await loadStradaLibraries(["root", "lib.root.d.ts"], "https://compiler.example.test/", libraries, value =>
    progress.push(value)
  )
  assert.equal(maximum, 8)
  assert.equal(requests.length, source.size)
  assert.equal(new Set(requests).size, requests.length)
  assert.equal(libraries.size, source.size)
  assert.equal(progress[0].completed, 0)
  assert.equal(progress[0].total, 1)
  assert.equal(progress.at(-1)?.completed, source.size)
  assert.equal(progress.at(-1)?.total, source.size)
  await loadStradaLibraries(["root"], "https://compiler.example.test/", libraries, () => {})
  assert.equal(requests.length, source.size)
})

test("legacy library download failures are reported", async t => {
  t.mock.method(globalThis, "fetch", async () => new Response("", { status: 503 }))
  await assert.rejects(
    loadStradaLibraries(["root"], "https://compiler.example.test/", new Map(), () => {}),
    /Could not load lib\.root\.d\.ts: 503/
  )
})

test("native versions start at the WASM nightly and exclude the published beta", () => {
  for (const version of ["7.1.0-dev.20261030.1", "7.1.0-dev.20261031.1", "7.1.0-rc", "7.1.0", "7.2.0-beta", "8.0.0"]) {
    assert.equal(isWasmCompilerVersion(version), true, version)
  }
  for (const version of ["7.1.0-beta", "7.1.0-dev.20261029.1", "7.0.2", "6.0.3", "next", "pr-build"]) {
    assert.equal(isWasmCompilerVersion(version), false, version)
  }
})

test("version choices merge published native channels with the separate legacy CDN list", () => {
  const choices = compilerVersionChoices("7.1.0-dev.20261030.1", ["5.9.2", "6.0.2", "3.1.6", "5.9.3", "6.0.3"], {
    versions: ["7.0.2", "7.1.0-beta", "7.1.0-dev.20261030.1", "7.1.1", "7.1.2", "7.2.0-dev.20261101.1"],
    tags: { next: "7.2.0-dev.20261101.1", beta: "7.1.0-beta", rc: "7.0.1-rc" },
  })
  assert.deepEqual(choices, [
    { version: "7.1.0-dev.20261030.1", label: "7.1.0-dev.20261030.1" },
    { version: "7.1.2", label: "7.1.2" },
    { version: "7.2.0-dev.20261101.1", label: "Nightly (7.2.0-dev.20261101.1)" },
    { version: "6.0.3", label: "6.0.3" },
    { version: "5.9.3", label: "5.9.3" },
  ])
  const sameNightly = compilerVersionChoices("7.1.0-dev.20261030.1", [], {
    versions: ["7.1.0-dev.20261030.1"],
    tags: { next: "7.1.0-dev.20261030.1" },
  })
  assert.deepEqual(sameNightly, [{ version: "7.1.0-dev.20261030.1", label: "Nightly (7.1.0-dev.20261030.1)" }])
})

test("published version discovery reports failed and malformed indexes", async t => {
  const fetch = t.mock.method(globalThis, "fetch", async () =>
    Response.json({ versions: ["7.1.0-dev.20261030.1"], tags: { next: "7.1.0-dev.20261030.1" } })
  )
  assert.equal((await loadPublishedCompilerVersions()).tags.next, "7.1.0-dev.20261030.1")
  fetch.mock.mockImplementation(async () => new Response("", { status: 503 }))
  await assert.rejects(loadPublishedCompilerVersions(), /Could not load published TypeScript versions: 503/)
  fetch.mock.mockImplementation(async () => Response.json({ versions: [123], tags: {} }))
  await assert.rejects(loadPublishedCompilerVersions(), /Invalid published TypeScript versions/)
  fetch.mock.mockImplementation(async () => Response.json({ versions: ["7.1.0"], tags: { next: "not-a-version" } }))
  await assert.rejects(loadPublishedCompilerVersions(), /Invalid published TypeScript tag: next/)
})

test("published distributions pair exact package versions, exports, libraries, and cache identity", async t => {
  const version = "7.2.0-dev.20261101.1"
  const main = {
    name: "typescript",
    version,
    gitHead: "matching-revision",
    dist: { unpackedSize: 100 },
    exports: {
      "./sync": "./dist/api/sync/api.js",
      "./async": "./dist/api/async/api.js",
      "./ast": "./dist/ast/index.js",
      "./wasm": { default: "./dist/wasm/index.js" },
      "./schemas/tsconfig.schema.json": "./schemas/tsconfig.schema.json",
    },
  }
  const artifact = {
    name: "@typescript/typescript-wasip1-wasm",
    version,
    gitHead: "matching-revision",
    dist: { unpackedSize: 200 },
    exports: { "./lib/tsc.wasm": "./lib/tsc.wasm", "./lib/libFiles.json": "./lib/libFiles.json" },
  }
  const requests: string[] = []
  let missingArtifact = false
  t.mock.method(globalThis, "fetch", async (input: URL | RequestInfo) => {
    const url = String(input)
    requests.push(url)
    if (url.endsWith("libFiles.json")) return Response.json(["lib.d.ts", "lib.es5.d.ts"])
    if (decodeURIComponent(url).includes("@typescript/typescript-wasip1-wasm")) {
      return missingArtifact ? new Response("", { status: 404 }) : Response.json(artifact)
    }
    return Response.json(main)
  })
  const distribution = await loadPublishedCompilerDistribution(version)
  assert.equal(distribution.version, version)
  assert.equal(distribution.revision, main.gitHead)
  assert.equal(distribution.cacheKey, `npm-${version}`)
  assert.equal(distribution.host, `https://unpkg.com/typescript@${version}/dist/wasm/index.js`)
  assert.equal(distribution.sync, `https://unpkg.com/typescript@${version}/dist/api/sync/api.js`)
  assert.equal(distribution.wasm.href, `https://unpkg.com/@typescript/typescript-wasip1-wasm@${version}/lib/tsc.wasm`)
  assert.equal(distribution.schema.href, `https://unpkg.com/typescript@${version}/schemas/tsconfig.schema.json`)
  assert.equal(distribution.downloadBytes, 300)
  assert.deepEqual(
    distribution.libraries.map(url => url.href),
    [
      `https://unpkg.com/@typescript/typescript-wasip1-wasm@${version}/lib/lib.d.ts`,
      `https://unpkg.com/@typescript/typescript-wasip1-wasm@${version}/lib/lib.es5.d.ts`,
    ]
  )
  assert(requests.slice(0, 2).every(url => url.endsWith(`/${version}`)))
  artifact.gitHead = "wrong-revision"
  await assert.rejects(loadPublishedCompilerDistribution(version), /revisions do not match/)
  artifact.gitHead = main.gitHead
  main.version = "7.1.0"
  await assert.rejects(loadPublishedCompilerDistribution(version), /Invalid package metadata/)
  main.version = version
  const host = main.exports["./wasm"]
  Reflect.deleteProperty(main.exports, "./wasm")
  await assert.rejects(loadPublishedCompilerDistribution(version), /Missing package export: \.\/wasm/)
  main.exports["./wasm"] = host
  missingArtifact = true
  await assert.rejects(
    loadPublishedCompilerDistribution(version),
    /Could not load @typescript\/typescript-wasip1-wasm@.+: 404/
  )
})

test("runtime compiler URLs resolve relative and absolute module and library locations", async t => {
  const metadata = {
    version: "7.1.0-test",
    revision: "test-revision",
    cacheKey: "test-content-key",
    sync: "typescript/dist/api/sync/api.js",
    async: "typescript/dist/api/async/api.js",
    ast: "typescript/dist/ast/index.js",
    host: "typescript/dist/wasm/index.js",
    wasm: "typescript-wasip1-wasm/lib/tsc.wasm",
    libraryIndex: "typescript-wasip1-wasm/lib/libFiles.json",
    schema: "typescript/schemas/tsconfig.schema.json",
    downloadBytes: 100,
  }
  const requests: string[] = []
  let invalidLibrary = false
  t.mock.method(globalThis, "fetch", async (input: URL | RequestInfo) => {
    const url = String(input)
    requests.push(url)
    return Response.json(
      url.endsWith("distribution.json") ? metadata : invalidLibrary ? ["../outside.d.ts"] : ["lib.d.ts", "lib.es5.d.ts"]
    )
  })
  const url = new URL("https://cdn.example.test/immutable/compiler/distribution.json")
  const distribution = await loadCompilerDistribution(url)
  assert.equal(distribution.sync, "https://cdn.example.test/immutable/compiler/typescript/dist/api/sync/api.js")
  assert.equal(distribution.host, "https://cdn.example.test/immutable/compiler/typescript/dist/wasm/index.js")
  assert.deepEqual(
    distribution.libraries.map(url => url.href),
    [
      "https://cdn.example.test/immutable/compiler/typescript-wasip1-wasm/lib/lib.d.ts",
      "https://cdn.example.test/immutable/compiler/typescript-wasip1-wasm/lib/lib.es5.d.ts",
    ]
  )
  assert.equal(requests.length, 2)

  metadata.sync = "https://cdn.example.test/npm/typescript@7.1.0-test/dist/api/sync/api.js"
  metadata.host = "https://cdn.example.test/npm/typescript@7.1.0-test/dist/wasm/index.js"
  metadata.wasm = "https://cdn.example.test/npm/@typescript/typescript-wasip1-wasm@7.1.0-test/lib/tsc.wasm"
  metadata.libraryIndex = "https://cdn.example.test/npm/@typescript/typescript-wasip1-wasm@7.1.0-test/lib/libFiles.json"
  metadata.schema = "https://cdn.example.test/npm/typescript@7.1.0-test/schemas/tsconfig.schema.json"
  const cdn = await loadCompilerDistribution(new URL("https://playground.example.test/play/distribution.json"))
  assert.equal(cdn.sync, metadata.sync)
  assert.equal(cdn.host, metadata.host)
  assert.equal(cdn.wasm.href, metadata.wasm)
  assert.equal(cdn.schema.href, metadata.schema)
  assert.deepEqual(
    cdn.libraries.map(url => url.href),
    [
      "https://cdn.example.test/npm/@typescript/typescript-wasip1-wasm@7.1.0-test/lib/lib.d.ts",
      "https://cdn.example.test/npm/@typescript/typescript-wasip1-wasm@7.1.0-test/lib/lib.es5.d.ts",
    ]
  )
  assert.equal(requests.at(-1), metadata.libraryIndex)

  invalidLibrary = true
  await assert.rejects(loadCompilerDistribution(url), /Invalid compiler library index/)
})

test("runtime compiler loading reports missing and malformed distribution metadata", async t => {
  const url = new URL("https://cdn.example.test/compiler/distribution.json")
  const fetch = t.mock.method(globalThis, "fetch", async () => new Response("", { status: 404 }))
  await assert.rejects(loadCompilerDistribution(url), /Could not load compiler distribution: 404/)
  fetch.mock.mockImplementation(async () => Response.json({ version: "7.1" }))
  await assert.rejects(loadCompilerDistribution(url), /Invalid compiler distribution field: revision/)
})

test("native compiler reuses snapshots across edits, types, and configuration changes", async () => {
  const module = await WebAssembly.compile(
    await readFile(new URL(import.meta.resolve("@typescript/typescript-wasip1-wasm/lib/tsc.wasm")))
  )
  const transport = new WasmTransport({ instance: await instantiateWasm(module), cwd: "/workspace" })
  const libDirectory = new URL("./", import.meta.resolve("@typescript/typescript-wasip1-wasm/lib/libFiles.json"))
  for (const name of await readdir(libDirectory)) {
    if (/^lib(?:\..+)?\.d\.ts$/.test(name))
      transport.setFile(`/${name}`, await readFile(new URL(name, libDirectory), "utf8"))
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
  const compiler = new NativeCompiler(api, transport, ast)
  const configFileName = "/workspace/tsconfig.json"
  const source = "/workspace/src/index.ts"
  const config = {
    compilerOptions: { strict: true, target: "es2022", module: "commonjs", declaration: true },
    include: ["src/**/*"],
  }
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
    input.files[configFileName] = JSON.stringify({
      ...config,
      compilerOptions: { ...config.compilerOptions, noEmit: true },
    })
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
    input.files[configFileName] = '{"compilerOptions": { "strict": true '
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
