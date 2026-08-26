import assert from "node:assert/strict"
import fs from "node:fs"
import os from "node:os"
import path from "node:path"
import test from "node:test"

import { renderMarkdown, resolveDocumentationUrl } from "../src/lib/markdown.mjs"
import { documentationNavigation, getDocumentationPrevNext } from "../src/lib/routes.mjs"

test("rewrites relative markdown links to documentation routes", () => {
  const sourceRouteMap = new Map([
    ["c:\\repo\\packages\\documentation\\copy\\en\\declaration-files\\templates\\global-modifying-module.d.ts.md".toLowerCase(), "/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html"],
  ])

  assert.equal(
    resolveDocumentationUrl("./templates/global-modifying-module.d.ts.md", {
      routePath: "/docs/handbook/declaration-files/templates.html",
      sourcePath: "c:\\repo\\packages\\documentation\\copy\\en\\declaration-files\\Templates.md",
      sourceRouteMap,
    }),
    "/docs/handbook/declaration-files/templates/global-modifying-module-d-ts.html"
  )
})

test("preserves spaces when slugging headings with inline code", async () => {
  const rendered = await renderMarkdown("## `@param` and `@returns`")
  assert.match(rendered, /id="param-and-returns"/)
})

test("normalizes punctuation-heavy headings to Gatsby-compatible anchors", async () => {
  const rendered = await renderMarkdown("### `@typedef`, `@callback`, and `@param`")
  assert.match(rendered, /id="typedef-callback-and-param"/)
})

test("renders Gatsby-compatible smart punctuation outside code", async () => {
  const rendered = await renderMarkdown('"quoted" -- dash ... `"code" -- ...`')
  assert.match(rendered, /“quoted” — dash …/)
  assert.match(rendered, /<code>"code" -- \.\.\.<\/code>/)
})

test("renders GFM tables as semantic tables", async () => {
  const rendered = await renderMarkdown("| Name | Value |\n| --- | ---: |\n| alpha | 1 |")
  assert.match(rendered, /<table>/)
  assert.match(rendered, /<th>Name<\/th>/)
  assert.match(rendered, /<td align="right">1<\/td>/)
})

test("renders concurrent Twoslash documents without losing the language registry", async () => {
  const documents = await Promise.all(Array.from({ length: 8 }, (_, index) => renderMarkdown([
    "```ts twoslash",
    `const value${index} = ${index}`,
    `//    ^?`,
    "```",
  ].join("\n"), { twoslash: true })))

  for (const rendered of documents) {
    assert.match(rendered, /<pre[^>]*\btwoslash\b/)
    assert.match(rendered, /<div class="code-container" tabindex="0">/)
    assert.doesNotMatch(rendered, /Note from shiki-twoslash/)
  }
})

const koreanModuleResolution = path.resolve("..", "documentation", "copy", "ko", "reference", "Module Resolution.md")
test("resolves translated relative Markdown links from source paths", { skip: !fs.existsSync(koreanModuleResolution) }, () => {
  const sourceRouteMap = new Map([
    [koreanModuleResolution.toLowerCase(), "/ko/docs/handbook/module-resolution.html"],
  ])

  assert.equal(
    resolveDocumentationUrl("./module-resolution.md#base-url", {
      routePath: "/ko/docs/handbook/compiler-options.html",
      sourcePath: path.resolve("..", "documentation", "copy", "ko", "project-config", "Compiler Options.md"),
      sourceRouteMap,
    }),
    "/ko/docs/handbook/module-resolution.html#기본-url-base-url"
  )
})

test("falls back to an existing English route when a localized route is unavailable", () => {
  const sourceRouteMap = new Map([
    [path.resolve("..", "documentation", "copy", "en", "reference", "Enums.md").toLowerCase(), "/docs/handbook/enums.html"],
  ])

  assert.equal(
    resolveDocumentationUrl("/fr/docs/handbook/enums.html", { sourceRouteMap }),
    "/docs/handbook/enums.html"
  )
})

test("normalizes legacy locale placement and historical release-note paths", () => {
  const sourceRouteMap = new Map([
    [path.resolve("..", "documentation", "copy", "fr", "handbook-v2", "Basic Types.md").toLowerCase(), "/fr/docs/handbook/2/basic-types.html"],
    [path.resolve("..", "documentation", "copy", "en", "release-notes", "TypeScript 1.6.md").toLowerCase(), "/docs/handbook/release-notes/typescript-1-6.html"],
  ])

  assert.equal(resolveDocumentationUrl("/docs/fr/handbook/2/basic-types.html", { sourceRouteMap }), "/fr/docs/handbook/2/basic-types.html")
  assert.equal(
    resolveDocumentationUrl("/docs/handbook/release-notes/typescript-1.6.html#user-defined-type-guard-functions", { sourceRouteMap }),
    "/docs/handbook/release-notes/typescript-1-6.html#user-defined-type-guard-functions"
  )
})

test("normalizes the redundant English Playground locale", () => {
  assert.equal(resolveDocumentationUrl("/en/play#example/unknown-and-never"), "/play#example/unknown-and-never")
})

test("resolves percent-encoded release-note Markdown paths through an English source fallback", () => {
  const sourceRouteMap = new Map([
    [path.resolve("..", "documentation", "copy", "en", "release-notes", "TypeScript 1.8.md").toLowerCase(), "/docs/handbook/release-notes/typescript-1-8.html"],
  ])
  assert.equal(
    resolveDocumentationUrl("./release%20notes/TypeScript%201.8.md#concatenate-amd-and-system-modules-with---outfile", {
      routePath: "/ko/docs/handbook/namespaces-and-modules.html",
      sourcePath: path.resolve("..", "documentation", "copy", "ko", "reference", "Namespaces and Modules.md"),
      sourceRouteMap,
    }),
    "/docs/handbook/release-notes/typescript-1-8.html#concatenate-amd-and-system-modules-with---outfile"
  )
})

test("renders current localized online-handbook links without obsolete downloads", async () => {
  const rendered = await renderMarkdown("[manuel en ligne](/fr/docs/handbook/intro.html)", {
    routePath: "/fr/docs/handbook/intro.html",
  })
  assert.match(rendered, /href="\/fr\/docs\/handbook\/intro\.html"/)
  assert.doesNotMatch(rendered, /typescript-handbook\.(?:pdf|epub)/)
})

test("normalizes legacy same-page fragment aliases", () => {
  assert.equal(
    resolveDocumentationUrl("#type-on-import-names", {
      sourcePath: path.resolve("..", "documentation", "copy", "en", "release-notes", "TypeScript 4.5.md"),
    }),
    "#type-modifiers-on-import-names"
  )
})

test("uses generated documentation navigation order for previous and next pages", () => {
  const { previous, next } = getDocumentationPrevNext("en", "docs/handbook/2/basic-types.html")
  assert.equal(previous?.pathname, "docs/handbook/intro.html")
  assert.equal(next?.pathname, "docs/handbook/2/everyday-types.html")
})

test("returns nested documentation navigation groups in source order", () => {
  const groups = documentationNavigation([], "en", "docs/handbook/2/basic-types.html")
  assert.equal(groups[0].title, "Get Started")
  assert.equal(groups[1].title, "Handbook")
  assert.equal(groups[1].items[0].pathname, "/docs/handbook/intro.html")
  assert.equal(groups[1].items[6].title, "Type Manipulation")
})

test("renders Gatsby-compatible footnotes", async () => {
  const rendered = await renderMarkdown("A note.[^1]\n\n[^1]: Footnote text.")
  assert.match(rendered, /<sup id="fnref-1"><a href="#fn-1" class="footnote-ref">1<\/a><\/sup>/)
  assert.match(rendered, /Footnote text\./)
  assert.doesNotMatch(rendered, /\[\^1\]/)
})

test("preserves URLs in raw HTML examples", async () => {
  const rendered = await renderMarkdown('<script src="scripts/app.js"></script>', {
    routePath: "/docs/handbook/asp-net-core.html",
  })
  assert.match(rendered, /src="scripts\/app\.js"/)
})

test("copies linked Markdown images to Gatsby-compatible MD5 paths", async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "documentation-assets-"))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const sourcePath = path.join(root, "page.md")
  const assetPath = path.join(root, "diagram.svg")
  const outputPath = path.join(root, "public")
  fs.writeFileSync(sourcePath, "")
  fs.writeFileSync(assetPath, "<svg></svg>")

  const rendered = await renderMarkdown("![Diagram](./diagram.svg)", { sourcePath, linkedAssetRoot: outputPath })
  assert.match(rendered, /src="\/7b56e1eab00ec8000da9331a4888cb35\/diagram\.svg"/)
  assert.equal(fs.readFileSync(path.join(outputPath, "7b56e1eab00ec8000da9331a4888cb35", "diagram.svg"), "utf8"), "<svg></svg>")
})

test("copies linked images embedded in raw HTML", async t => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "documentation-html-assets-"))
  t.after(() => fs.rmSync(root, { recursive: true, force: true }))
  const sourcePath = path.join(root, "page.md")
  const outputPath = path.join(root, "public")
  fs.writeFileSync(sourcePath, "")
  fs.writeFileSync(path.join(root, "diagram.svg"), "<svg></svg>")

  const rendered = await renderMarkdown('<img src="./diagram.svg" width="400" />', { sourcePath, linkedAssetRoot: outputPath })
  assert.match(rendered, /src="\/7b56e1eab00ec8000da9331a4888cb35\/diagram\.svg"/)
})

test("repairs malformed Markdown destination parentheses without changing external URLs", () => {
  assert.equal(
    resolveDocumentationUrl("(/docs/handbook/release-notes/typescript-3-2.html#bigint)"),
    "/docs/handbook/release-notes/typescript-3-2.html#bigint"
  )
  assert.equal(
    resolveDocumentationUrl("(https://github.com/microsoft/TypeScript-Sublime-Plugin#note)"),
    "https://github.com/microsoft/TypeScript-Sublime-Plugin#note"
  )
})