import path from "node:path"
import { fileURLToPath } from "node:url"

import { writeDocumentationCache } from "../src/lib/documentation-cache.mjs"
import { renderMarkdown } from "../src/lib/markdown.mjs"
import { createRoutes, expectedCounts } from "../src/lib/routes.mjs"

const pages = createRoutes()
const linkedAssetRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.generated-public")
const documentationPages = pages.filter(page => page.family === "documentation")
if (documentationPages.length !== expectedCounts.documentation) {
  throw new Error(`Expected ${expectedCounts.documentation} documentation pages, found ${documentationPages.length}`)
}

const sourceRouteMap = new Map(pages.flatMap(page => page.source
  ? [[path.normalize(path.resolve(page.source)).toLowerCase(), `/${page.pathname}`]]
  : []))
const entries = []

for (const [index, page] of documentationPages.entries()) {
  const pathname = `/${page.pathname}`
  const html = await renderMarkdown(page.markdown || "", {
    twoslash: true,
    routePath: pathname,
    sourcePath: page.source,
    sourceRouteMap,
    linkedAssetRoot,
  })

  const missingTypeScriptLanguage = html.match(/Note from shiki-twoslash: the language (?:ts|tsx|js|jsx) was not set up/g)
  if (missingTypeScriptLanguage) {
    throw new Error(`${pathname} lost ${missingTypeScriptLanguage.length} TypeScript/JavaScript language registrations`)
  }

  entries.push([pathname, html])
  if ((index + 1) % 25 === 0 || index + 1 === documentationPages.length) {
    console.log(`Compiled documentation ${index + 1}/${documentationPages.length}`)
  }
}

writeDocumentationCache(entries)
console.log(`Wrote ${entries.length} deterministic documentation HTML entries`)
