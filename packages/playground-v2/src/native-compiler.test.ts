import assert from "node:assert/strict"
import { readFile, readdir } from "node:fs/promises"
import { createRequire } from "node:module"
import { test } from "node:test"
import { API } from "@typescript/typescript/sync"
import * as ast from "@typescript/typescript/ast"
import { instantiateWasm, WasmTransport } from "@typescript/typescript/wasm"
import { NativeCompiler, type NativeCompileInput } from "./native-compiler"
import { legacyCompilerBaseUrl, loadPublishedCompilerDistribution } from "./compiler-distribution"
import {
  compilerVersionChoices,
  isUnsupportedNativeCompilerVersion,
  isWasmCompilerVersion,
  loadLegacyCompilerVersions,
  loadPublishedCompilerVersions,
  publishedNativeCompilerSelection,
} from "./compiler-versions"
import { loadStradaLibraries, type StradaLibraryProgress } from "./strada-libraries"
import { computeCompilerOverrides } from "./compiler-overrides"
import { createStradaFileSystem } from "./strada-project"
import { createPlaygroundV2Query } from "../../typescriptlang-org/src/lib/createPlaygroundV2Query"

test("the legacy handoff serializes effective options with its own compiler and retains the requested channel", () => {
  const ts: typeof import("typescript") = createRequire(import.meta.url)("typescript")
  let overrides: Record<string, unknown> | undefined
  const sandbox = {
    ts,
    getCompilerOptions: () => ({
      strict: false,
      strictNullChecks: true,
      exactOptionalPropertyTypes: true,
      module: 99,
      target: 4,
      jsx: 4,
      lib: ["lib.es2017.d.ts", "lib.dom.d.ts"],
      paths: { alias: ["./types/alias"] },
    }),
    createURLQueryWithCompilerOptions(_sandbox: unknown, params: Record<string, unknown>) {
      overrides = params
      return "fixture-query"
    },
  }
  for (const version of ["4.4.2", "6.0.2", "custom-build"]) {
    assert.equal(createPlaygroundV2Query(sandbox, version ? `?ts=${version}` : ""), "fixture-query")
    assert.equal(overrides?.ts, version)
    const config = JSON.parse(String(overrides?.tsconfig))
    const expected = {
      strict: false,
      strictNullChecks: true,
      exactOptionalPropertyTypes: true,
      module: "esnext",
      target: "es2017",
      jsx: "react-jsx",
      lib: ["es2017", "dom"],
      paths: { alias: ["./types/alias"] },
    }
    for (const [option, value] of Object.entries(expected)) {
      assert.deepEqual(config.compilerOptions[option], value)
    }
  }
  for (const version of ["next", "Nightly", "native", "7", "7.1", "7.1.0", undefined]) {
    assert.equal(createPlaygroundV2Query(sandbox, version ? `?ts=${version}` : ""), "fixture-query")
    assert.deepEqual(overrides, { ts: version ?? null })
  }
})

test("legacy virtual directory discovery supports compiler config inheritance and file selection", () => {
  const ts: typeof import("typescript") = createRequire(import.meta.url)("typescript")
  const files = new Map([
    ["/workspace/tsconfig.json", "{}"],
    [
      "/workspace/config/base.json",
      JSON.stringify({
        compilerOptions: { strict: true, target: "es2020" },
        include: ["../src"],
        exclude: ["../src/skip.ts"],
      }),
    ],
    ["/workspace/explicit.ts", "export const explicit = 1;"],
    ["/workspace/src/Keep.ts", "export const kept = 1;"],
    ["/workspace/src/skip.ts", "export const skipped = 1;"],
    ["/workspace/node_modules/package/ignore.ts", "export const ignored = 1;"],
  ])
  const host = createStradaFileSystem(
    ts,
    () => files.keys(),
    path => files.get(path)
  )
  for (const include of [["src"], undefined]) {
    const parsed = ts.parseJsonConfigFileContent(
      { extends: "./config/base.json", files: ["./explicit.ts"], ...(include ? { include } : {}) },
      host,
      "/workspace",
      undefined,
      "/workspace/tsconfig.json"
    )
    assert.deepEqual(parsed.errors, [])
    assert.deepEqual(parsed.fileNames.sort(), ["/workspace/explicit.ts", "/workspace/src/Keep.ts"])
    assert.equal(parsed.options.strict, true)
    assert.equal(parsed.options.target, ts.ScriptTarget.ES2020)
  }
  assert.deepEqual(host.getDirectories("/workspace").sort(), ["config", "node_modules", "src"])
  assert.equal(host.fileExists("/workspace/src/../explicit.ts"), true)
  assert.equal(host.fileExists("/workspace/src/keep.ts"), false)
})

test("historical compilers and libraries use exact npm URLs while custom builds keep their CDN", () => {
  for (const version of ["3.3.3", "4.4.2", "5.9.3", "6.0.2", "6.1.0-beta", "6.1.1-rc", "6.1.0-dev.20261030"]) {
    const base = legacyCompilerBaseUrl(version)
    assert.equal(new URL("typescript.js", base).href, `https://unpkg.com/typescript@${version}/lib/typescript.js`)
    assert.equal(new URL("lib.es5.d.ts", base).href, `https://unpkg.com/typescript@${version}/lib/lib.es5.d.ts`)
  }
  for (const version of ["custom-build", "4.4.0-pr-12345-1"]) {
    assert.equal(
      legacyCompilerBaseUrl(version).href,
      `https://playgroundcdn.typescriptlang.org/cdn/${version}/typescript/lib/`
    )
  }
})

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

test("compiler list directives accept comma-separated values and JSON arrays without splitting scalar options", () => {
  const state = computeCompilerOverrides(
    new Map([
      [
        "/workspace/src/index.ts",
        [
          "// @types: node, jquery",
          "// @lib: es2020, dom",
          '// @rootDirs: ["src", "generated"]',
          "// @moduleSuffixes: .native, ",
          "// @customConditions: browser, development",
          "// @typeRoots: ./types, ./vendor/types",
          "// @outDir: build,output",
        ].join("\n"),
      ],
    ]),
    "{}"
  )
  assert.deepEqual(state.diagnostics, [])
  assert.deepEqual(JSON.parse(state.effectiveConfigText).compilerOptions, {
    types: ["node", "jquery"],
    lib: ["es2020", "dom"],
    rootDirs: ["src", "generated"],
    moduleSuffixes: [".native", ""],
    customConditions: ["browser", "development"],
    typeRoots: ["./types", "./vendor/types"],
    outDir: "build,output",
  })
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

test("legacy library loading retries missing dependencies beneath cached roots", async t => {
  const requests: string[] = []
  t.mock.method(globalThis, "fetch", async (input: URL | RequestInfo) => {
    const name = new URL(String(input)).pathname.split("/").at(-1)!
    requests.push(name)
    if (name === "lib.root.d.ts") return new Response('/// <reference lib="dependency" />')
    return requests.length === 2 ? new Response("", { status: 503 }) : new Response("interface Dependency {}")
  })
  const libraries = new Map<string, string>()
  const load = () => loadStradaLibraries(["root"], "https://compiler.example.test/", libraries, () => {})
  await assert.rejects(load(), /Could not load lib\.dependency\.d\.ts: 503/)
  assert(libraries.has("/typescript/lib/lib.root.d.ts"))
  assert(!libraries.has("/typescript/lib/lib.dependency.d.ts"))
  await load()
  assert(libraries.has("/typescript/lib/lib.dependency.d.ts"))
  assert.deepEqual(requests, ["lib.root.d.ts", "lib.dependency.d.ts", "lib.dependency.d.ts"])
})

test("overlapping legacy library loads wait for dependencies beneath cached roots", async t => {
  let release!: () => void
  let started!: () => void
  const gate = new Promise<void>(resolve => {
    release = resolve
  })
  const downloading = new Promise<void>(resolve => {
    started = resolve
  })
  t.mock.method(globalThis, "fetch", async (input: URL | RequestInfo) => {
    if (String(input).endsWith("lib.root.d.ts")) return new Response('/// <reference lib="dependency" />')
    started()
    await gate
    return new Response("interface Dependency {}")
  })
  const libraries = new Map<string, string>()
  const load = () => loadStradaLibraries(["root"], "https://compiler.example.test/", libraries, () => {})
  const first = load()
  await downloading
  let secondFinished = false
  const second = load().then(() => {
    secondFinished = true
  })
  try {
    await new Promise(resolve => setImmediate(resolve))
    assert.equal(secondFinished, false)
  } finally {
    release()
    await Promise.all([first, second])
  }
  assert(libraries.has("/typescript/lib/lib.dependency.d.ts"))
})

test("native versions start at the WASM nightly and exclude the published beta", () => {
  for (const version of ["7.1.0-dev.20261030.1", "7.1.0-dev.20261031.1", "7.1.0-rc", "7.1.0", "7.2.0-beta", "8.0.0"]) {
    assert.equal(isWasmCompilerVersion(version), true, version)
  }
  for (const version of ["7.1.0-beta", "7.1.0-dev.20261029.1", "7.0.2", "6.0.3", "next", "pr-build"]) {
    assert.equal(isWasmCompilerVersion(version), false, version)
  }
})

test("the native default follows Nightly until a supported stable release is published", () => {
  const published = {
    versions: ["7.0.2", "7.1.0-dev.20261030.1", "7.1.0-dev.20261031.1", "7.1.0", "7.2.0-dev.20261101.1"],
    tags: { latest: "7.0.2", next: "7.1.0-dev.20261031.1" },
  }
  assert.deepEqual(publishedNativeCompilerSelection(published, "default"), {
    version: "7.1.0-dev.20261031.1",
    channel: "nightly",
  })
  published.tags.next = "7.2.0-dev.20261101.1"
  assert.equal(publishedNativeCompilerSelection(published, "default").version, "7.2.0-dev.20261101.1")
  published.tags.latest = "7.1.0"
  assert.deepEqual(publishedNativeCompilerSelection(published, "default"), { version: "7.1.0", channel: "stable" })
  assert.deepEqual(publishedNativeCompilerSelection(published, "nightly"), {
    version: "7.2.0-dev.20261101.1",
    channel: "nightly",
  })
})

test("native channel resolution rejects missing, incompatible and unlisted versions", () => {
  for (const tags of [{}, { next: "7.1.0-beta" }, { next: "7.1.0-dev.20261031.1" }]) {
    assert.throws(
      () => publishedNativeCompilerSelection({ versions: ["7.0.2"], tags }, "default"),
      /No published TypeScript version supports/
    )
  }
  assert.throws(
    () => publishedNativeCompilerSelection({ versions: ["7.1.0"], tags: { latest: "7.1.0" } }, "nightly"),
    /No published TypeScript version supports/
  )
})

test("version choices sort supported releases and the resolved Nightly by descending semver", () => {
  const choices = compilerVersionChoices(["7.0.2", "5.9.2", "6.0.2", "3.1.6", "5.9.3", "6.0.3"], {
    versions: ["7.0.2", "7.1.0-beta", "7.1.0-dev.20261030.1", "7.1.1", "7.1.2", "7.2.0-dev.20261101.1"],
    tags: { next: "7.2.0-dev.20261101.1", beta: "7.1.0-beta", rc: "7.0.1-rc" },
  })
  assert.deepEqual(choices, [
    { version: "next", label: "Nightly (7.2.0-dev.20261101.1)" },
    { version: "7.1.2", label: "7.1.2" },
    { version: "6.0.3", label: "6.0.3" },
    { version: "5.9.3", label: "5.9.3" },
  ])
  const sameNightly = compilerVersionChoices([], {
    versions: ["7.1.0-dev.20261030.1"],
    tags: { next: "7.1.0-dev.20261030.1" },
  })
  assert.deepEqual(sameNightly, [{ version: "next", label: "Nightly (7.1.0-dev.20261030.1)" }])
})

test("version choices offer the applicable beta or RC without unsupported or superseded candidates", () => {
  const published = {
    versions: ["7.0.2", "7.1.0-beta", "7.1.0", "7.2.0-beta", "7.2.0-rc", "7.3.0-dev.20261101.1"],
    tags: { latest: "7.1.0", beta: "7.2.0-beta", rc: "7.2.0-rc", next: "7.3.0-dev.20261101.1" },
  }
  assert.deepEqual(compilerVersionChoices(["7.0.2", "6.0.3"], published), [
    { version: "next", label: "Nightly (7.3.0-dev.20261101.1)" },
    { version: "7.2.0-rc", label: "RC (7.2.0-rc)" },
    { version: "7.1.0", label: "7.1.0" },
    { version: "6.0.3", label: "6.0.3" },
  ])
  assert.deepEqual(
    compilerVersionChoices(["6.0.3", "5.9.3"], published, "5.9.2").map(choice => choice.version),
    ["next", "7.2.0-rc", "7.1.0", "6.0.3", "5.9.3", "5.9.2"]
  )
  published.versions.push("7.2.0")
  published.tags.latest = "7.2.0"
  assert(!compilerVersionChoices([], published).some(choice => /Beta|RC/.test(choice.label)))
  for (const version of ["7.0.2", "7.0.1-rc", "7.1.0-beta", "7.1.0-dev.20261029.1"]) {
    assert.equal(isUnsupportedNativeCompilerVersion(version), true)
  }
  for (const version of ["6.0.3", "7.1.0-dev.20261031.1", "7.1.0", "7.2.0-beta"]) {
    assert.equal(isUnsupportedNativeCompilerVersion(version), false)
  }
})

test("version ordering follows semver even when a release is newer than the Nightly tag", () => {
  const choices = compilerVersionChoices(
    ["6.0.3", "5.10.1", "5.9.3"],
    {
      versions: ["7.1.0", "7.1.0-dev.20261030.1"],
      tags: { latest: "7.1.0", next: "7.1.0-dev.20261030.1" },
    },
    "custom-build"
  )
  assert.deepEqual(
    choices.map(choice => choice.version),
    ["7.1.0", "next", "6.0.3", "5.10.1", "5.9.3", "custom-build"]
  )
})

test("historical version discovery reads the CDN index and reports unavailable or invalid data", async t => {
  const fetch = t.mock.method(globalThis, "fetch", async () => Response.json({ versions: ["6.0.3", "5.9.3"] }))
  assert.deepEqual(await loadLegacyCompilerVersions(), ["6.0.3", "5.9.3"])
  assert.equal(fetch.mock.calls[0].arguments[0], "https://playgroundcdn.typescriptlang.org/indexes/releases.json")
  fetch.mock.mockImplementation(async () => new Response("", { status: 503 }))
  await assert.rejects(loadLegacyCompilerVersions(), /Could not load historical TypeScript versions: 503/)
  for (const metadata of [null, {}, { versions: [] }, { versions: ["invalid"] }, { versions: [1] }]) {
    fetch.mock.mockImplementation(async () => Response.json(metadata))
    await assert.rejects(loadLegacyCompilerVersions(), /Invalid historical TypeScript versions/)
  }
  assert.deepEqual(compilerVersionChoices(["6.0.3"], undefined, "7.1.0-dev.20261030.1"), [
    { version: "6.0.3", label: "6.0.3" },
    { version: "7.1.0-dev.20261030.1", label: "7.1.0-dev.20261030.1" },
  ])
})

test("published version discovery reports failed and malformed indexes", async t => {
  const fetch = t.mock.method(globalThis, "fetch", async () =>
    Response.json({ versions: ["7.1.0-dev.20261030.1"], tags: { latest: "7.0.2", next: "7.1.0-dev.20261030.1" } })
  )
  assert.equal((await loadPublishedCompilerVersions()).tags.latest, "7.0.2")
  assert.equal((await loadPublishedCompilerVersions()).tags.next, "7.1.0-dev.20261030.1")
  fetch.mock.mockImplementation(async () => new Response("", { status: 503 }))
  await assert.rejects(loadPublishedCompilerVersions(), /Could not load published TypeScript versions: 503/)
  fetch.mock.mockImplementation(async () => Response.json({ versions: [123], tags: {} }))
  await assert.rejects(loadPublishedCompilerVersions(), /Invalid published TypeScript versions/)
  fetch.mock.mockImplementation(async () => Response.json({ versions: ["7.1.0"], tags: { next: "not-a-version" } }))
  await assert.rejects(loadPublishedCompilerVersions(), /Invalid published TypeScript tag: next/)
})

test("published distributions pair exact package versions, exports, and libraries", async t => {
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
  let invalidLibrary = false
  let missingLibraryIndex = false
  t.mock.method(globalThis, "fetch", async (input: URL | RequestInfo) => {
    const url = String(input)
    requests.push(url)
    if (url.endsWith("libFiles.json")) {
      return missingLibraryIndex
        ? new Response("", { status: 503 })
        : Response.json(invalidLibrary ? ["../outside.d.ts"] : ["lib.d.ts", "lib.es5.d.ts"])
    }
    if (decodeURIComponent(url).includes("@typescript/typescript-wasip1-wasm")) {
      return missingArtifact ? new Response("", { status: 404 }) : Response.json(artifact)
    }
    return Response.json(main)
  })
  const distribution = await loadPublishedCompilerDistribution(version)
  assert.equal(distribution.version, version)
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
  invalidLibrary = true
  await assert.rejects(loadPublishedCompilerDistribution(version), /Invalid compiler library index/)
  invalidLibrary = false
  missingLibraryIndex = true
  await assert.rejects(loadPublishedCompilerDistribution(version), /Could not load compiler library index: 503/)
  missingLibraryIndex = false
  missingArtifact = true
  await assert.rejects(
    loadPublishedCompilerDistribution(version),
    /Could not load @typescript\/typescript-wasip1-wasm@.+: 404/
  )
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

    input.files[configFileName] = JSON.stringify({
      ...config,
      compilerOptions: { ...config.compilerOptions, noLib: true },
    })
    assert(
      compiler
        .compile(input)
        .diagnostics.some(diagnostic => diagnostic.code === 2318 && diagnostic.text.includes("Array"))
    )
    input.files[configFileName] = JSON.stringify({
      ...config,
      compilerOptions: { ...config.compilerOptions, declaration: false, declarationMap: true },
    })
    assert(compiler.compile(input).diagnostics.some(diagnostic => diagnostic.code === 5069))
    input.files[configFileName] = JSON.stringify(config)

    const imported = "/workspace/src/imported.ts"
    input.files[configFileName] = JSON.stringify({
      compilerOptions: config.compilerOptions,
      files: ["./src/index.ts"],
    })
    input.files[source] = 'import "./imported";\ndeclare global { const configuredGlobal: "configured"; }\n'
    input.files[imported] = "const answer = configuredGlobal;\n//    ^?\nexport {};\n"
    input.sourceFiles = [source, imported]
    const configuredImport = compiler.compile(input)
    assert.equal(configuredImport.diagnostics.length, 0)
    assert(configuredImport.typeQueries[imported].some(query => query.label === '"configured"'))
    assert.equal(syntheticPrograms, 0)
    delete input.files[imported]
    input.sourceFiles = [source]
    input.files[source] = "const answer = 1;"
    input.files[configFileName] = JSON.stringify(config)

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
