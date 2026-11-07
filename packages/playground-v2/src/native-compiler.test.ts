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
  publishedNativeCompilerSelection,
} from "./compiler-versions"
import { loadStradaLibraries, type StradaLibraryProgress } from "./strada-libraries"
import {
  applyLegacyCompilerOptions,
  canSetCompilerOptions,
  compilerOverrideForDiagnostic,
  computeCompilerOverrides,
} from "./compiler-overrides"
import { createStradaFileSystem, parseStradaConfig } from "./strada-project"
import { createPlaygroundV2Query } from "../../typescriptlang-org/src/lib/createPlaygroundV2Query"
import { decodeCompressedHash, projectMarkdown, type ExportProject } from "./exporter"
import { downloadCompilerAsset } from "./compiler-assets"

test("compiler downloads discard corrupt cached bytes and retry interrupted or incomplete responses", async () => {
  const url = new URL("https://example.test/tsc.wasm")
  const bytes = new Uint8Array([0, 97, 115, 109, 1, 0, 0, 0])
  const digest = new Uint8Array(await crypto.subtle.digest("SHA-256", bytes))
  const metadata = { size: bytes.length, integrity: `sha256-${Buffer.from(digest).toString("base64")}` }
  const originalFetch = globalThis.fetch
  const requests: RequestCache[] = []
  const writes: Response[] = []
  let deleted = 0
  let retries = 0
  const corrupt = new Response(new Uint8Array(bytes.length))
  const cache = {
    match: async () => corrupt,
    delete: async () => {
      deleted++
      return true
    },
    put: async (_url: unknown, response: Response) => {
      writes.push(response)
    },
  }
  globalThis.fetch = async (_url, init) => {
    requests.push(init?.cache ?? "default")
    if (requests.length === 1) throw new TypeError("Connection interrupted")
    return new Response(requests.length === 2 ? bytes.slice(0, -1) : bytes, {
      headers: { "content-encoding": "gzip" },
    })
  }
  try {
    const result = await downloadCompilerAsset(url, metadata, {
      cache,
      onProgress() {},
      onSource() {},
      onRetry() {
        retries++
      },
    })
    assert.deepEqual(result, bytes)
    assert.equal(deleted, 1)
    assert.equal(retries, 2)
    assert.deepEqual(requests, ["no-store", "no-store", "no-store"])
    assert.equal(writes.length, 1)
    assert.deepEqual(new Uint8Array(await writes[0].arrayBuffer()), bytes)
    assert.equal(writes[0].headers.get("content-encoding"), null)
  } finally {
    globalThis.fetch = originalFetch
  }
})

test("compiler download retries are bounded and never cache a bad transfer", async () => {
  const originalFetch = globalThis.fetch
  let requests = 0
  let writes = 0
  globalThis.fetch = async () => {
    requests++
    return new Response(new Uint8Array(1))
  }
  try {
    await assert.rejects(
      () =>
        downloadCompilerAsset(
          new URL("https://example.test/tsc.wasm"),
          {
            size: 2,
            integrity: `sha256-${"A".repeat(43)}=`,
          },
          {
            cache: {
              match: async () => undefined,
              delete: async () => false,
              put: async () => {
                writes++
              },
            },
            onProgress() {},
            onSource() {},
            onRetry() {},
          }
        ),
      /Incomplete compiler download/
    )
    assert.equal(requests, 3)
    assert.equal(writes, 0)
  } finally {
    globalThis.fetch = originalFetch
  }
})

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

test("historical compilers use the Playground CDN except for incorrect or unmirrored builds", () => {
  for (const version of ["3.3.3", "4.4.2", "5.9.3", "6.0.2", "6.1.0-beta", "6.1.1-rc", "6.1.0-dev.20261030"]) {
    const base = legacyCompilerBaseUrl(version)
    assert.equal(new URL("typescript.js", base).href, `https://unpkg.com/typescript@${version}/lib/typescript.js`)
    assert.equal(new URL("lib.es5.d.ts", base).href, `https://unpkg.com/typescript@${version}/lib/lib.es5.d.ts`)
  }
  for (const version of ["3.3.3", "5.9.3", "6.0.2"]) {
    assert.equal(
      legacyCompilerBaseUrl(version, [version]).href,
      `https://playgroundcdn.typescriptlang.org/cdn/${version}/typescript/lib/`
    )
  }
  for (const version of [
    "4.0.2",
    "4.1.5",
    "4.2.2",
    "4.2.3",
    "4.3.2",
    "4.3.3",
    "4.3.4",
    "4.3.5",
    "4.4.2",
    "4.4.3",
    "4.4.4",
  ]) {
    assert.equal(legacyCompilerBaseUrl(version, [version]).href, `https://unpkg.com/typescript@${version}/lib/`)
  }
  for (const version of ["custom-build", "4.4.0-pr-12345-1"]) {
    assert.equal(
      legacyCompilerBaseUrl(version).href,
      `https://playgroundcdn.typescriptlang.org/cdn/${version}/typescript/lib/`
    )
  }
})

test("legacy URL ingestion preserves JSONC and accepts only known options with compiler enum values", () => {
  const ts: typeof import("typescript") = createRequire(import.meta.url)("typescript")
  const names = ["strict", "jsx", "module", "lib", "paths", "noImplicitAny"]
  const config = '{\n  // keep this comment\n  "compilerOptions": { "strict": true, },\n}'
  const converted = applyLegacyCompilerOptions(
    config,
    "?strict=false&q=42&install-plugin=x&lib=es2017,dom&noImplicitAny",
    names
  )
  assert(converted.includes("// keep this comment"))
  assert(converted.includes('"strict": false'))
  assert(!converted.includes('"q"'))
  assert(!converted.includes("install-plugin"))
  const parsed = ts.parseConfigFileTextToJson("tsconfig.json", converted).config
  assert.deepEqual(parsed.compilerOptions.lib, ["es2017", "dom"])
  assert.equal(parsed.compilerOptions.noImplicitAny, true)
  for (const [value, expected] of [
    [1, "preserve"],
    [2, "react"],
    [3, "react-native"],
    [4, "react-jsx"],
    [5, "react-jsxdev"],
  ] as const) {
    assert.equal(JSON.parse(applyLegacyCompilerOptions("{}", `?jsx=${value}`, names)).compilerOptions.jsx, expected)
  }
  for (const module of [ts.ModuleKind.Node18, ts.ModuleKind.Node20]) {
    const config = JSON.parse(applyLegacyCompilerOptions("{}", `?module=${module}`, names))
    const converted = ts.convertCompilerOptionsFromJson(config.compilerOptions, "/workspace")
    assert.deepEqual(converted.errors, [])
    assert.equal(converted.options.module, module)
  }
  assert.equal(
    JSON.parse(applyLegacyCompilerOptions('{"compilerOptions":{"jsx":"react"}}', "?jsx=0", names)).compilerOptions.jsx,
    undefined
  )
  assert.equal(
    ts.parseConfigFileTextToJson(
      "tsconfig.json",
      applyLegacyCompilerOptions(config, "?tsconfig=snapshot&strict=false", names)
    ).config.compilerOptions.strict,
    true
  )
  for (const invalid of ["[]", '{"compilerOptions":null}', '{"compilerOptions":[]}', '{"compilerOptions":']) {
    assert.equal(canSetCompilerOptions(invalid), false)
    assert.equal(applyLegacyCompilerOptions(invalid, "?strict=true", names), invalid)
  }
})

test("historical root config selection ignores insertion order and follows config symlinks", () => {
  const ts: typeof import("typescript") = createRequire(import.meta.url)("typescript")
  const files = new Map([
    ["/workspace/nested/tsconfig.json", '{"compilerOptions":{"strict":false},"files":["nested.ts"]}'],
    ["/workspace/config/base.json", '{"compilerOptions":{"strict":true},"files":["src/index.ts"]}'],
    ["/workspace/nested/nested.ts", "export const nested = 1;"],
    ["/workspace/src/index.ts", "export const root = 1;"],
  ])
  const links = { "/workspace/tsconfig.json": "config/base.json" }
  const filesystem = createStradaFileSystem(
    ts,
    () => files.keys(),
    path => files.get(path),
    links
  )
  const parsed = parseStradaConfig(ts, filesystem)
  assert.deepEqual(parsed.errors, [])
  assert.equal(parsed.options.strict, true)
  assert.deepEqual(parsed.rootNames, ["/workspace/src/index.ts"])
})

test("compiler overrides remap option errors but not source errors that mention an option", () => {
  const state = computeCompilerOverrides(
    new Map([["/workspace/src/index.ts", "// @module: nodenext\nmodule.exports = 1;"]]),
    "{}"
  )
  assert.equal(
    compilerOverrideForDiagnostic(
      state,
      {
        fileName: "/workspace/src/index.ts",
        pos: 21,
        end: 27,
        text: "Cannot find name 'module'.",
      },
      "/workspace/tsconfig.json"
    ),
    undefined
  )
  assert.equal(
    compilerOverrideForDiagnostic(
      state,
      {
        pos: 0,
        end: 0,
        text: "Option 'module' must be set to 'NodeNext'.",
      },
      "/workspace/tsconfig.json"
    ),
    state.overrides[0]
  )
})

test("legacy compilers resolve linked files and package identity using preserveSymlinks", () => {
  const ts: typeof import("typescript") = createRequire(import.meta.url)("typescript")
  const files = new Map([
    [
      "/workspace/src/index.ts",
      'import { value } from "./value"; import { Token as Direct } from "../packages/pkg"; import { Token as Linked } from "pkg"; const token: Direct = new Linked(); const result: number = value;',
    ],
    ["/workspace/shared/value.ts", "export const value = 42;"],
    ["/workspace/packages/pkg/index.ts", "export class Token { private brand = 1; }"],
    ["/workspace/packages/pkg/package.json", '{"name":"pkg","types":"index.ts"}'],
  ])
  const links = { "/workspace/src/value.ts": "../shared/value.ts", "/workspace/node_modules/pkg": "../packages/pkg" }
  const filesystem = createStradaFileSystem(
    ts,
    () => files.keys(),
    path => files.get(path),
    links
  )
  for (const preserveSymlinks of [false, true]) {
    const options = { module: ts.ModuleKind.NodeNext, target: ts.ScriptTarget.ESNext, noLib: true, preserveSymlinks }
    const program = ts.createProgram(["/workspace/src/index.ts"], options, {
      ...ts.createCompilerHost(options),
      ...filesystem,
      getCurrentDirectory: () => "/workspace",
      useCaseSensitiveFileNames: () => true,
      getSourceFile: (path, target) => {
        const text = filesystem.readFile(path)
        return text === undefined ? undefined : ts.createSourceFile(path, text, target, true)
      },
    })
    const diagnostics = program.getSemanticDiagnostics()
    if (preserveSymlinks) assert(diagnostics.some(diagnostic => diagnostic.code === 2322))
    else assert.deepEqual(diagnostics, [])
  }
})

test("compressed share links decode percent escapes and preserve empty legacy sources", () => {
  const raw =
    "N4IgbgpgTgzglgewHYgFwCYA0IBmcA2EMaoA9AO4JQDWMADgIYDGEpMUTpcSAJhAB4A6AC7FUIJshjCABPwDMMgLwz5AbhmlSMgCQyA1DOkBXHDhkatug0eGnzl7XsMmzFzU5uvzIAL6+gA"
  const expected =
    '{"version":2,"files":{"/workspace/src/index.ts":"const x3 = 3; // $ + stuff ; // $ + stuff ; // $ + stuff ; // $ + stuff "}}'
  assert.equal(decodeCompressedHash(raw), expected)
  assert.equal(decodeCompressedHash(encodeURIComponent(raw)), expected)
  assert.equal(decodeCompressedHash("Q"), "")
  assert.equal(decodeCompressedHash("%51"), "")
  assert.equal(decodeCompressedHash("%invalid"), null)
})

test("Markdown exports retain project files, configuration, symbolic links and output", () => {
  const project: ExportProject = {
    activeFile: "src/index.ts",
    files: {
      "src/index.ts": "import './other';",
      "src/other.ts": "export const value = `backticks ``` stay in the code`;",
      "tsconfig.json": '{"compilerOptions":{"strict":true},"files":["src/index.ts"]}',
      "package.json":
        '{"name":"existing","dependencies":{"pkg":"^2"},"devDependencies":{"typescript":"6.0.2"},"scripts":{"start":"node src/index.js"}}',
    },
    outputFiles: { "src/index.js": "require('./other');" },
    symlinks: { "node_modules/pkg": "../packages/pkg" },
    url: "https://example.test/play/v2/#project",
  }
  const markdown = projectMarkdown(project)
  for (const [path, text] of Object.entries(project.files)) {
    assert(markdown.includes(JSON.stringify(path)))
    assert(markdown.includes(text))
  }
  assert(markdown.includes("````ts\n"))
  assert(markdown.includes('"node_modules/pkg": "../packages/pkg"'))
  assert(markdown.includes(project.url))
  assert(markdown.includes("require('./other');"))
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
  for (const version of [
    "7.1.0-dev.20261030.1",
    "7.1.0-dev.20261031.1",
    "7.1.0-rc",
    "7.1.0",
    "7.2.0-beta",
    "8.0.0",
    "7.1.0-pr.65000.3",
  ]) {
    assert.equal(isWasmCompilerVersion(version), true, version)
  }
  for (const version of [
    "7.1.0-beta",
    "7.1.0-dev.20261029.1",
    "7.0.2",
    "6.0.3",
    "next",
    "pr-build",
    "4.4.0-pr-12345-1",
  ]) {
    assert.equal(isWasmCompilerVersion(version), false, version)
  }
})

test("pull request builds load from the @typescript-deploys/pr-build packages", async () => {
  const version = "7.1.0-pr.65000.3"
  const main = `https://unpkg.com/@typescript-deploys/pr-build@${version}/`
  const wasm = `https://unpkg.com/@typescript-deploys/pr-build-wasip1-wasm@${version}/`
  const file = (path: string) => ({ path, size: 1, integrity: `sha256-${"A".repeat(43)}=` })
  const responses: Record<string, unknown> = {
    [`${main}package.json`]: {
      name: "@typescript-deploys/pr-build",
      version,
      gitHead: "abc",
      exports: {
        "./sync": "./dist/api/sync/api.js",
        "./async": "./dist/api/async/api.js",
        "./ast": "./dist/ast/index.js",
        "./wasm": "./dist/wasm/index.js",
        "./schemas/tsconfig.schema.json": "./schemas/tsconfig.schema.json",
      },
    },
    [`${main}?meta`]: { files: [file("/schemas/tsconfig.schema.json")] },
    [`${wasm}package.json`]: {
      name: "@typescript-deploys/pr-build-wasip1-wasm",
      version,
      gitHead: "abc",
      exports: { "./lib/tsc.wasm": "./lib/tsc.wasm" },
    },
    [`${wasm}lib/?meta`]: { files: [file("/lib/tsc.wasm"), file("/lib/lib.d.ts")] },
  }
  const originalFetch = globalThis.fetch
  globalThis.fetch = async url => {
    const body = responses[String(url)]
    return body ? Response.json(body) : new Response(null, { status: 404 })
  }
  try {
    const distribution = await loadPublishedCompilerDistribution(version)
    assert.equal(distribution.wasm.href, `${wasm}lib/tsc.wasm`)
    assert.equal(distribution.sync, `${main}dist/api/sync/api.js`)
    assert.deepEqual(
      distribution.libraries.map(url => url.href),
      [`${wasm}lib/lib.d.ts`]
    )
  } finally {
    globalThis.fetch = originalFetch
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
  assert.deepEqual(compilerVersionChoices(["6.0.3"], undefined, "7.1.0-dev.20261030.1"), [
    { version: "7.1.0-dev.20261030.1", label: "7.1.0-dev.20261030.1" },
    { version: "6.0.3", label: "6.0.3" },
  ])
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
    assert.equal(syntheticPrograms, 0)

    const linked: NativeCompileInput = {
      configFileName,
      sourceFiles: [source],
      files: {
        [configFileName]: JSON.stringify({
          compilerOptions: { ...config.compilerOptions, module: "nodenext" },
          files: ["src/index.ts"],
        }),
        [source]:
          'import { value } from "./value"; import { Token as Direct } from "../packages/pkg"; import { Token as Linked } from "pkg"; const token: Direct = new Linked(); const result: number = value;',
        "/workspace/shared/value.ts": "export const value = 42;",
        "/workspace/packages/pkg/index.ts": "export class Token { private brand = 1; }",
        "/workspace/packages/pkg/package.json": '{"name":"pkg","types":"index.ts"}',
      },
      symlinks: { "/workspace/src/value.ts": "../shared/value.ts", "/workspace/node_modules/pkg": "../packages/pkg" },
    }
    assert.deepEqual(compiler.compile(linked).diagnostics, [])
    linked.files["/workspace/shared/value.ts"] = 'export const value = "changed";'
    assert(
      compiler.compile(linked).diagnostics.some(diagnostic => diagnostic.code === 2322),
      "Edits to linked targets must update their importers"
    )
    linked.files["/workspace/shared/value.ts"] = "export const value = 42;"
    linked.files[configFileName] = JSON.stringify({
      compilerOptions: { ...config.compilerOptions, module: "nodenext", preserveSymlinks: true },
      files: ["src/index.ts"],
    })
    assert(
      compiler.compile(linked).diagnostics.some(diagnostic => diagnostic.code === 2322),
      "Changing preserveSymlinks must update linked package identity"
    )
    linked.sourceFiles = [source, orphan]
    linked.files[orphan] = 'import { Token } from "pkg";\nconst linkedToken = new Token();\n//    ^?\n'
    assert(compiler.compile(linked).typeQueries[orphan].some(query => query.label === "Token"))
    linked.symlinks = { "/workspace/src/value.ts": "../shared/value.ts" }
    assert(compiler.compile(linked).diagnostics.some(diagnostic => diagnostic.code === 2307))
  } finally {
    compiler.close()
  }
})
