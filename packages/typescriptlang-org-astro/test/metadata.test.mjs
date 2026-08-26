import assert from "node:assert/strict"
import test from "node:test"
import { getRouteMetadata } from "../src/lib/metadata.mjs"
import { createRoutes } from "../src/lib/routes.mjs"

const routes = createRoutes()
const metadataFor = pathname => {
  const page = routes.find(route => route.pathname === pathname)
  assert.ok(page, `missing route ${pathname}`)
  return getRouteMetadata(page, routes)
}

test("derives documentation metadata from independent frontmatter", () => {
  assert.deepEqual(metadataFor("docs/handbook/2/everyday-types.html"), {
    description: "The language primitives.",
    ogTitle: "Documentation - Everyday Types",
  })
  assert.equal(metadataFor("docs/handbook/intro.html").ogTitle, "Handbook - The TypeScript Handbook")
})

test("derives localized Playground metadata", () => {
  assert.match(metadataFor("play").description, /Playground/)
  if (routes.some(route => route.pathname === "zh/play")) {
    assert.equal(metadataFor("zh/play").ogTitle, "演练场 - 一个用于 TypeScript 和 JavaScript 的在线编辑器")
    assert.match(metadataFor("fr/play").description, /Le playground/)
    assert.equal(
      metadataFor("id/play/3-7/fixits/big-number-literals.ts.html").ogTitle,
      "Contoh Area Bermain - Big number literals"
    )
  }
})

test("derives TSConfig and developer metadata", () => {
  assert.deepEqual(metadataFor("tsconfig/allowJs.html"), {
    description: "How this setting affects your build.",
    ogTitle: "TSConfig Option: allowJs",
  })
  assert.equal(metadataFor("dev/twoslash").ogTitle, "Developers - Twoslash Code Samples")
})
