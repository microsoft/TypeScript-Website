import assert from "node:assert/strict"
import test from "node:test"
import { createRoutes } from "../src/lib/routes.mjs"
import { getHomePageContent, getRootPageData } from "../src/lib/root-pages.mjs"
import { getRootSemanticPage, renderRootSemanticHtml, rootSemanticRouteCount } from "../src/lib/root-semantics.mjs"

test("provides source-backed content for every declared root route", () => {
  const routes = createRoutes()
  const rootRoutes = routes.filter(route => route.family === "root")
  assert.equal(rootRoutes.length, 100)

  for (const route of rootRoutes) {
    const page = getRootPageData({ pathname: route.pathname, locale: route.locale, title: route.title, routes })
    assert.notEqual(page.kind, "generic", `unexpected generic root content for ${route.pathname}`)
    assert.ok(page.heading || page.headingHtml || page.title || page.headline, `missing heading for ${route.pathname}`)
  }
})

test("falls back to English where Gatsby root pages did not ship locale-specific copy", () => {
  const routes = createRoutes()
  const voCommunity = getRootPageData({ pathname: "vo/community", locale: "vo", title: "community", routes })
  assert.equal(voCommunity.title, "TypeScript Community Resources")

  const zhTypedSearch = getRootPageData({ pathname: "zh/dt/search", locale: "zh", title: "dt/search", routes })
  assert.equal(zhTypedSearch.title, "Search for typed packages")
})

test("keeps translated homepage content where the Gatsby source had it", () => {
  const french = getHomePageContent("fr")
  assert.match(french.headingHtml, /JavaScript avec une syntaxe pour les types/i)

  const japanese = getHomePageContent("ja")
  assert.match(japanese.byline, /JavaScript/)
})

test("provides extracted semantic content for all ten templates in all ten site locales", () => {
  const rootRoutes = createRoutes().filter(route => route.family === "root")
  assert.equal(rootSemanticRouteCount, 100)
  assert.equal(rootRoutes.length, 100)
  for (const route of rootRoutes) {
    const page = getRootSemanticPage(route.pathname)
    assert.ok(page, `missing root semantic page for ${route.pathname}`)
    assert.equal(page.locale, route.locale)
    assert.ok(page.tokens.length > 0, `empty root semantic page for ${route.pathname}`)
  }
})

test("renders structural headings, links, images, code, and Twoslash from family data", () => {
  const home = renderRootSemanticHtml("/")
  assert.match(home, /<h1>TypeScript is JavaScript with syntax for types\.<\/h1>/)
  assert.match(home, /<pre class="twoslash">/)
  const cheatsheets = renderRootSemanticHtml("/fr/cheatsheets")
  assert.match(cheatsheets, /<img src="\/static\//)
  assert.match(cheatsheets, /typescript-cheat-sheets\.zip/)
  const download = renderRootSemanticHtml("/download")
  assert.match(download, /<h2>Working with TypeScript-compatible transpilers<\/h2>/)
})