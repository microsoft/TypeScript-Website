import assert from "node:assert/strict"
import { readFile } from "node:fs/promises"
import { createRequire } from "node:module"
import { test } from "node:test"
import { API } from "@typescript/typescript/unstable/sync"
import { instantiateWasm, WasmTransport } from "@typescript/typescript/unstable/wasm"
import { acquisitionOptions } from "./config"
import { corsaDiscovery, stradaDiscovery, PackageTypeAcquirer, type AcquisitionProgress, type Dependency } from "./index"
import { packageName, safePackagePath } from "./packages"

const require = createRequire(import.meta.url)
const ts: typeof import("typescript") = require("typescript")
const discover = stradaDiscovery(ts)

type Fixture = { files: Record<string, string>; dependencies?: Record<string, string> }
function registry(fixtures: Record<string, Fixture>) {
  const calls: string[] = []
  const failures = new Set<string>()
  let active = 0
  let maximum = 0
  const fetcher: typeof fetch = async (input, init) => {
    const url = String(input)
    calls.push(url)
    active++
    maximum = Math.max(active, maximum)
    try {
      init?.signal?.throwIfAborted()
      await new Promise(resolve => setTimeout(resolve, 1))
      init?.signal?.throwIfAborted()
      if (failures.delete(url)) return new Response("", { status: 503 })
      const resolve = /^https:\/\/data\.jsdelivr\.com\/v1\/package\/resolve\/npm\/(.+)@([^/]+)$/.exec(url)
      const tree = /^https:\/\/data\.jsdelivr\.com\/v1\/package\/npm\/(.+)@1\.0\.0\/flat$/.exec(url)
      const file = /^https:\/\/cdn\.jsdelivr\.net\/npm\/(.+)@1\.0\.0(\/.+)$/.exec(url)
      const name = resolve?.[1] ?? tree?.[1] ?? file?.[1]
      const fixture = name ? fixtures[name] : undefined
      if (!fixture) return new Response("", { status: 404 })
      if (resolve) return Response.json({ version: "1.0.0" })
      if (tree) {
        return Response.json({ files: ["/package.json", ...Object.keys(fixture.files)].map(name => ({ name })) })
      }
      if (file?.[2] === "/package.json") {
        return Response.json({ name, version: "1.0.0", types: "./index.d.ts", dependencies: fixture.dependencies })
      }
      const text = file && fixture.files[file[2]]
      return text === undefined ? new Response("", { status: 404 }) : new Response(text)
    } finally {
      active--
    }
  }
  return { fetcher, calls, failures, maximum: () => maximum }
}

function source(text: string) {
  return [{ path: "/workspace/src/index.ts", text }]
}

test("compiler parsers agree on dependencies, references, and version comments", async () => {
  const module = await WebAssembly.compile(
    await readFile(`${process.env.PLAYGROUND_DIR}/vendor/typescript-wasip1-wasm/lib/tsc.wasm`)
  )
  const api = new API({ transport: new WasmTransport({ instance: await instantiateWasm(module), cwd: "/workspace" }) })
  try {
    const file = {
      path: "/workspace/input.ts",
      text: `/// <reference types="node" />
/// <reference lib="dom" />
/// <reference path="./local.d.ts" />
import { x } from "pkg"; // types: 1.2.3
import "hereby";
import "node:url";
export { y } from "exports";
import z = require("import-equals");
const a = import("dynamic");
type T = import("type-import").T;
const b = require("required");
const c = require(variable);
// import "comment";
const text = 'import "text"';
declare module "ambient" {}
`,
    }
    const sort = (items: readonly Dependency[]) => [...items].sort((a, b) => a.specifier.localeCompare(b.specifier))
    const expected: Dependency[] = [
      { kind: "types", specifier: "node" },
      { kind: "import", specifier: "pkg", version: "1.2.3" },
      ...["hereby", "node:url", "exports", "import-equals", "dynamic", "type-import", "required"].map(
        (specifier): Dependency => ({
          kind: "import",
          specifier,
        })
      ),
    ]
    assert.deepEqual(sort(await discover(file)), sort(expected))
    assert.deepEqual(sort(await corsaDiscovery(api)(file)), sort(expected))
  } finally {
    api.close()
  }
})

test("normalizes Node builtins, DT scopes, and ignores local/URL imports", () => {
  for (const name of ["node:url", "readline/promises", "stream/iter"]) assert.equal(packageName(name), "@types/node")
  for (const name of ["./local", "/local", "#alias", "https://example.test/code", "data:text/plain,x"]) {
    assert.equal(packageName(name), undefined)
  }
  assert.equal(packageName("@scope/pkg/subpath"), "@scope/pkg")
  assert.equal(packageName("test"), "test")
  for (const path of ["/../outside", "/folder/../outside", "/%2e%2e/outside", "/file?x", "/\\file"]) {
    assert.equal(safePackagePath(path), false)
  }
})

test("accepts asynchronous compiler discovery adapters", async () => {
  const mock = registry({ pkg: { files: { "/index.d.ts": "export {}" } } })
  const result = await new PackageTypeAcquirer({ fetcher: mock.fetcher }).acquire({
    files: source('import "pkg"'),
    discover: async file => discover(file),
  })
  assert.equal(result.packages.length, 1)
  assert.equal(result.errors.length, 0)
})

test("reports pending metadata, declaration downloads, and cached package completion", async () => {
  const mock = registry({ pkg: { files: { "/index.d.ts": "export {}", "/extra.d.ts": "export {}" } } })
  let release!: () => void
  let started!: () => void
  const gate = new Promise<void>(resolve => {
    release = resolve
  })
  const metadataStarted = new Promise<void>(resolve => {
    started = resolve
  })
  const engine = new PackageTypeAcquirer({
    fetcher: async (input, init) => {
      if (String(input).includes("/resolve/npm/")) {
        started()
        await gate
      }
      return mock.fetcher(input, init)
    },
  })
  const progress: AcquisitionProgress[] = []
  const input = {
    files: source('import "pkg"'),
    discover,
    onProgress: (value: AcquisitionProgress) => progress.push(value),
  }
  const acquisition = engine.acquire(input)
  try {
    await metadataStarted
    assert.deepEqual(progress.at(-1), {
      downloaded: 0,
      total: 0,
      completedPackages: 0,
      totalPackages: 1,
      pendingPackages: ["pkg"],
    })
  } finally {
    release()
  }
  await acquisition
  assert.deepEqual(progress.at(-1), {
    downloaded: 2,
    total: 2,
    completedPackages: 1,
    totalPackages: 1,
    pendingPackages: [],
  })
  const calls = mock.calls.length
  await engine.acquire(input)
  assert.equal(mock.calls.length, calls)
  assert.deepEqual(progress.at(-1), {
    downloaded: 0,
    total: 0,
    completedPackages: 1,
    totalPackages: 1,
    pendingPackages: [],
  })
})

test("reuses declaration discovery for unchanged packages but not different compilers", async () => {
  const mock = registry({
    pkg: { files: { "/index.d.ts": 'export * from "dep"' } },
    dep: { files: { "/index.d.ts": "export const value: string" } },
  })
  const engine = new PackageTypeAcquirer({ fetcher: mock.fetcher })
  const parsed: string[] = []
  const parser = async (file: { path: string; text: string }) => {
    parsed.push(file.path)
    return discover(file)
  }
  const input = { files: source('import "pkg"'), discover: parser }
  await engine.acquire(input)
  const declarations = parsed.filter(path => path.includes("/node_modules/")).length
  assert.equal(declarations, 2)
  await engine.acquire({ ...input, files: source('import "pkg"; const edited = true;') })
  assert.equal(parsed.filter(path => path.includes("/node_modules/")).length, declarations)
  await engine.acquire({ ...input, discover: file => parser(file) })
  assert.equal(parsed.filter(path => path.includes("/node_modules/")).length, declarations * 2)
})

test("downloads declarations and package metadata, never JavaScript", async () => {
  const mock = registry({
    pkg: {
      files: {
        "/index.d.ts": "export const value: string",
        "/esm/index.d.mts": "export const value: string",
        "/cjs/index.d.cts": "export const value: string",
        "/esm/package.json": '{"type":"module"}',
        "/index.js": "doNotRun()",
      },
    },
  })
  const result = await new PackageTypeAcquirer({ fetcher: mock.fetcher }).acquire({
    files: source('import "pkg/subpath"'),
    discover,
  })
  assert.equal(result.errors.length, 0)
  assert.equal(result.files.size, 5)
  assert(result.files.has("/workspace/node_modules/pkg/esm/package.json"))
  assert(!mock.calls.some(url => url.endsWith(".js")))
})

test("type-reference subpaths can refer to packages shipping their own declarations", async () => {
  const mock = registry({ vite: { files: { "/client.d.ts": "declare const environment: string;" } } })
  const result = await new PackageTypeAcquirer({ fetcher: mock.fetcher }).acquire({
    files: source('/// <reference types="vite/client" />'),
    discover,
  })
  assert.equal(result.errors.length, 0)
  assert(result.files.has("/workspace/node_modules/vite/client.d.ts"))
  assert(!mock.calls.some(url => url.includes("@types/vite")))
})

test("falls back to DT with the actual declaration package metadata", async () => {
  const mock = registry({
    plain: { files: { "/index.js": "runtime" } },
    "@types/plain": { files: { "/index.d.ts": 'declare module "plain" {}' } },
    "@types/scope__pkg": { files: { "/index.d.ts": "export const value: string" } },
  })
  const progress: AcquisitionProgress[] = []
  const result = await new PackageTypeAcquirer({ fetcher: mock.fetcher }).acquire({
    files: source('import "plain"; import "@scope/pkg"'),
    discover,
    onProgress: value => progress.push(value),
  })
  assert.deepEqual(result.ambientTypes, ["plain", "scope__pkg"])
  assert(result.files.has("/workspace/node_modules/@types/plain/package.json"))
  assert(!result.files.has("/workspace/node_modules/plain/package.json"))
  assert.equal(progress.at(-1)?.totalPackages, 2)
  assert.equal(progress.at(-1)?.completedPackages, 2)
})

test("Node requests go directly to @types/node and do not recurse into builtins", async () => {
  const mock = registry({
    "@types/node": { files: { "/index.d.ts": 'import "readline/promises"; import "stream/iter"' } },
  })
  const result = await new PackageTypeAcquirer({ fetcher: mock.fetcher }).acquire({
    files: source('import "node:url"'),
    discover,
  })
  assert.deepEqual(result.ambientTypes, ["node"])
  assert.equal(result.packages.length, 1)
  assert(!mock.calls.some(url => /\/npm\/(?:node|readline|stream)@/.test(url)))
})

test("honors include, exclude, and enable with complete snapshots", async () => {
  const mock = registry({
    included: { files: { "/index.d.ts": "export {}" } },
    blocked: { files: { "/index.d.ts": "export {}" } },
  })
  const engine = new PackageTypeAcquirer({ fetcher: mock.fetcher })
  const result = await engine.acquire({
    files: source('import "blocked"'),
    discover,
    options: { include: ["included"], exclude: ["blocked"] },
  })
  assert.deepEqual(
    result.packages.map(pkg => pkg.name),
    ["included"]
  )
  const disabled = await engine.acquire({ files: [], discover, options: { enable: false, include: ["included"] } })
  assert.equal(disabled.files.size, 0)
  const empty = await engine.acquire({ files: [], discover })
  assert.equal(empty.files.size, 0)
})

test("preserves package dependency ranges, deduplicates cycles, and bounds concurrency", async () => {
  const mock = registry({
    pkg: { files: { "/index.d.ts": 'export * from "dep"' }, dependencies: { dep: "^2.0.0" } },
    dep: { files: { "/index.d.ts": 'export * from "pkg"' } },
  })
  const progress: AcquisitionProgress[] = []
  const result = await new PackageTypeAcquirer({ fetcher: mock.fetcher, limits: { concurrency: 2 } }).acquire({
    files: source('import "pkg"'),
    discover,
    onProgress: value => progress.push(value),
  })
  assert.equal(result.packages.length, 2)
  assert(mock.calls.some(url => url.includes("dep@%5E2.0.0")))
  assert(mock.maximum() <= 2)
  assert.equal(progress.at(-1)?.completedPackages, 2)
  assert.equal(progress.at(-1)?.totalPackages, 2)
  assert.deepEqual(progress.at(-1)?.pendingPackages, [])
})

test("source version annotations take precedence over an unversioned include", async () => {
  const mock = registry({ pkg: { files: { "/index.d.ts": "export {}" } } })
  const result = await new PackageTypeAcquirer({ fetcher: mock.fetcher }).acquire({
    files: source('import "pkg"; // types: 1.2.3'),
    discover,
    options: { include: ["pkg"] },
  })
  assert.equal(result.packages.length, 1)
  assert(mock.calls.some(url => url.includes("pkg@1.2.3")))
  assert(!mock.calls.some(url => url.includes("pkg@latest")))
})

test("isolates package errors, caches successes, and retries failures", async () => {
  const mock = registry({
    good: { files: { "/index.d.ts": "export {}" } },
    retry: { files: { "/index.d.ts": "export {}" } },
  })
  mock.failures.add("https://cdn.jsdelivr.net/npm/retry@1.0.0/index.d.ts")
  const engine = new PackageTypeAcquirer({ fetcher: mock.fetcher })
  const progress: AcquisitionProgress[] = []
  const input = {
    files: source('import "good"; import "retry"'),
    discover,
    onProgress: (value: AcquisitionProgress) => progress.push(value),
  }
  const first = await engine.acquire(input)
  assert.equal(first.errors[0].packageName, "retry")
  assert(first.files.has("/workspace/node_modules/good/index.d.ts"))
  assert(!first.files.has("/workspace/node_modules/retry/index.d.ts"))
  assert(!mock.calls.some(url => url.includes("@types/retry")))
  assert.equal(progress.at(-1)?.completedPackages, 2)
  assert.deepEqual(progress.at(-1)?.pendingPackages, [])
  const calls = mock.calls.filter(url => url.includes("good@")).length
  const second = await engine.acquire(input)
  assert.equal(second.errors.length, 0)
  assert.equal(mock.calls.filter(url => url.includes("good@")).length, calls)
})

test("aborted acquisition cannot return a stale success or poison retries", async () => {
  const mock = registry({ pkg: { files: { "/index.d.ts": "export {}" } } })
  const engine = new PackageTypeAcquirer({ fetcher: mock.fetcher })
  const controller = new AbortController()
  const promise = engine.acquire({ files: source('import "pkg"'), discover, signal: controller.signal })
  controller.abort()
  await assert.rejects(promise, { name: "AbortError" })
  const result = await engine.acquire({ files: source('import "pkg"'), discover })
  assert.equal(result.errors.length, 0)
})

test("queued downloads release their permits when an acquisition is cancelled", async () => {
  const fixtures: Record<string, Fixture> = {}
  for (const name of ["one", "two", "three", "four"]) {
    fixtures[name] = { files: { "/index.d.ts": "export {}", "/extra.d.ts": "export {}" } }
  }
  const mock = registry(fixtures)
  const engine = new PackageTypeAcquirer({ fetcher: mock.fetcher, limits: { concurrency: 2 } })
  const controller = new AbortController()
  const input = { files: source('import "one"; import "two"; import "three"; import "four";'), discover }
  let progressCount = 0
  let countAtAbort = 0
  const cancelled = engine.acquire({
    ...input,
    signal: controller.signal,
    onProgress: () => { progressCount++ },
  })
  setTimeout(() => {
    controller.abort()
    countAtAbort = progressCount
  }, 5)
  await assert.rejects(cancelled, { name: "AbortError" })
  assert(progressCount > 0)
  assert.equal(progressCount, countAtAbort)
  const retried = await engine.acquire(input)
  assert.equal(retried.errors.length, 0)
  assert.equal(retried.packages.length, 4)
  assert(mock.maximum() <= 2)
})

test("a DT exclusion also suppresses scoped runtime package requests", async () => {
  const mock = registry({})
  const result = await new PackageTypeAcquirer({ fetcher: mock.fetcher }).acquire({
    files: source('import "@scope/pkg"'),
    discover,
    options: { exclude: ["@types/scope__pkg"] },
  })
  assert.equal(result.files.size, 0)
  assert.equal(mock.calls.length, 0)
})

test("enforces graph-wide package and declaration byte budgets", async () => {
  const mock = registry({
    one: { files: { "/index.d.ts": "x".repeat(500) } },
    two: { files: { "/index.d.ts": "x".repeat(500) } },
  })
  const input = { files: source('import "one"; import "two"'), discover }
  await assert.rejects(
    new PackageTypeAcquirer({ fetcher: mock.fetcher, limits: { packages: 1 } }).acquire(input),
    /package limit/
  )
  await assert.rejects(
    new PackageTypeAcquirer({ fetcher: mock.fetcher, limits: { bytes: 900 } }).acquire(input),
    /byte limit/
  )
})

test("rejects oversized responses and unsafe package paths", async () => {
  const mock = registry({ huge: { files: { "/index.d.ts": "x".repeat(4000) } } })
  const result = await new PackageTypeAcquirer({ fetcher: mock.fetcher, limits: { responseBytes: 1024 } }).acquire({
    files: source('import "huge"'),
    discover,
  })
  assert.match(result.errors[0].message, /too large/)
  const unsafe = registry({ bad: { files: { "/../bad.d.ts": "export {}" } } })
  const invalid = await new PackageTypeAcquirer({ fetcher: unsafe.fetcher }).acquire({
    files: source('import "bad"'),
    discover,
  })
  assert.match(invalid.errors[0].message, /Invalid file path/)
})

test("project options accept JSONC, preserve explicit choices, and report invalid values", () => {
  assert.deepEqual(acquisitionOptions('{// hi\n"typeAcquisition":{"enable":false,"include":["node"],},}', true), {
    enable: false,
    include: ["node"],
    exclude: undefined,
  })
  assert.deepEqual(acquisitionOptions("invalid", false), { enable: false })
  assert.throws(() => acquisitionOptions('{"typeAcquisition":{"exclude":[1]}}', true), /array of package names/)
  assert.throws(() => acquisitionOptions("invalid", true), /syntax/)
})
