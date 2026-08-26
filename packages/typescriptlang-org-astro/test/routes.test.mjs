import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"
import {
  createRoutes,
  expectedCounts,
  minimumDocumentationCount,
  minimumPlaygroundCount,
  minimumPlaygroundExampleCount,
  minimumTSConfigCount,
} from "../src/lib/routes.mjs"

test("generates every declared Gatsby application route family", () => {
  const routes = createRoutes()
  const counts = Object.fromEntries(
    Object.keys(expectedCounts).map(family => [family, routes.filter(route => route.family === family).length])
  )
  assert.deepEqual(counts, expectedCounts)
  assert.ok(routes.filter(route => route.family === "documentation").length >= minimumDocumentationCount)
  assert.ok(routes.filter(route => route.family === "tsconfig").length >= minimumTSConfigCount)
  assert.ok(routes.filter(route => route.family === "playground").length >= minimumPlaygroundCount)
  assert.ok(routes.filter(route => route.family === "playground-example").length >= minimumPlaygroundExampleCount)
  assert.equal(new Set(routes.map(route => route.pathname)).size, routes.length)
})

test("preserves intentional html routes", () => {
  const routes = createRoutes()
  assert.ok(
    routes.filter(route => route.family === "playground-example" && route.pathname.endsWith(".html")).length >=
      minimumPlaygroundExampleCount
  )
  assert.equal(
    routes.filter(route => route.family === "tsconfig-option" && route.pathname.endsWith(".html")).length,
    135
  )
  assert.equal(
    routes.filter(route => route.family === "playground-handbook" && route.pathname.endsWith(".html")).length,
    14
  )
})

test("all TSConfig option SEO routes retain exact redirect and indexable source semantics", () => {
  const routes = createRoutes()
  const options = routes.filter(route => route.family === "tsconfig-option")
  const sourceOptions = fs
    .readdirSync(path.resolve("../tsconfig-reference/copy/en/options"))
    .filter(name => name.endsWith(".md"))
    .map(name => path.basename(name, ".md"))
    .sort()
  assert.deepEqual(options.map(option => option.title).sort(), sourceOptions)
  for (const option of options) {
    assert.equal(option.pathname, `tsconfig/${option.title}.html`)
    assert.equal(option.redirect, `/tsconfig#${option.title}`)
    assert.ok(option.markdown.trim().length > 0, option.pathname)
  }

  const roots = routes.filter(route => route.family === "tsconfig")
  assert.ok(roots.some(route => route.pathname === "tsconfig"))
})
