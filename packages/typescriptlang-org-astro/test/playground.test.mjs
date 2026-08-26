import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"
import { createRoutes } from "../src/lib/routes.mjs"
import { normalizePlaygroundExampleCacheBuster } from "../src/lib/playground-url.mjs"

const root = path.resolve(import.meta.dirname, "..")

test("all Playground roots use the framework-independent Sandbox and Playground runtime", () => {
  const source = fs.readFileSync(path.join(root, "src/components/PlaygroundIsland.tsx"), "utf8")
  assert.match(source, /typescript-sandbox\/index/)
  assert.match(source, /typescript-playground\/index/)
  assert.match(source, /createTypeScriptSandbox/)
  assert.match(source, /setupPlayground/)
  assert.match(source, /indexes\/next\.json/)
  assert.match(source, /playground-worker\/index\.js/)
  assert.match(source, /run-button/)
  assert.match(source, /share-button/)
})

test("all ten Playground roots receive target-owned locale semantics", () => {
  const routes = createRoutes().filter(route => route.family === "playground")
  const copy = JSON.parse(fs.readFileSync(path.join(root, "src/data/playground-copy.json"), "utf8"))
  assert.equal(routes.length, 10)
  for (const route of routes) {
    const expected = copy.locales[route.locale] || copy.locales.en
    assert.ok(expected.config)
    assert.ok(expected.close)
    assert.ok(expected.languageBlurb)
    assert.ok(expected.examples)
  }
  assert.equal(copy.locales.es.config, "Playground")
  assert.equal(copy.locales.id.config, "Konfig TS")
  assert.equal(copy.locales.ja.config, "プレイグラウンド")
  assert.equal(copy.locales.zh.config, "配置")
})

test("normalizes only the random q bucket on same-page Playground example links", () => {
  assert.equal(
    normalizePlaygroundExampleCacheBuster("/fr/play", "/fr/play?strict=true&jsx=2&target=7&q=431#example/react"),
    "/fr/play?strict=true&jsx=2&target=7#example/react"
  )
  assert.equal(
    normalizePlaygroundExampleCacheBuster("/play", "/play?useJavaScript=trueq=33#example/jsdoc-support"),
    "/play?useJavaScript=true#example/jsdoc-support"
  )
  assert.equal(
    normalizePlaygroundExampleCacheBuster("/fr/play", "/fr/play?strict=true&q=12#not-an-example"),
    "/fr/play?strict=true&q=12#not-an-example"
  )
  assert.equal(
    normalizePlaygroundExampleCacheBuster("/fr/play", "/play?strict=true&q=12#example/other-locale"),
    "/play?strict=true&q=12#example/other-locale"
  )
  assert.equal(
    normalizePlaygroundExampleCacheBuster("/fr/play", "/fr/play?strict=true&q=meaningful#example/value"),
    "/fr/play?strict=true&q=meaningful#example/value"
  )
})

test("361 SEO examples retain searchable content and exact human redirects", () => {
  const examples = createRoutes().filter(route => route.family === "playground-example")
  assert.equal(examples.length, 361)
  for (const example of examples) {
    assert.ok(example.seoHtml.length > 0, example.pathname)
    assert.match(example.redirect, /^\/(?:[a-z]{2}\/)?play\/\?.*#example\//)
  }
  const page = fs.readFileSync(path.join(root, "src/pages/[...path].astro"), "utf8")
  assert.match(page, /baidu\|bing\|msn\|duckduckbot\|teoma\|slurp\|yandex/)
  assert.match(page, /set:html=\{page\.seoHtml/)
})

test("asset synchronization compiles only framework-independent Playground packages", () => {
  const sync = fs.readFileSync(path.join(root, "scripts/sync-assets.mjs"), "utf8")
  for (const packageName of ["sandbox", "playground", "playground-worker"]) assert.match(sync, new RegExp(`compile\\("${packageName}"`))
  assert.doesNotMatch(sync, /typescriptlang-org[\\/](?:src|static)/)
})