import path from "node:path"
import { fileURLToPath } from "node:url"

import { updateDocumentationCache, writeDocumentationCache } from "../src/lib/documentation-cache.mjs"
import { renderMarkdown } from "../src/lib/markdown.mjs"
import { createRoutes, minimumDocumentationCount } from "../src/lib/routes.mjs"

const pages = createRoutes()
const linkedAssetRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../.generated-public")
const documentationPages = pages.filter(page => page.family === "documentation")
if (documentationPages.length < minimumDocumentationCount) {
  throw new Error(
    `Expected at least ${minimumDocumentationCount} documentation pages, found ${documentationPages.length}`
  )
}

const requestedSources = new Set(
  process.argv.slice(2).map(source => path.normalize(path.resolve(source)).toLowerCase())
)
const pagesToCompile = requestedSources.size
  ? documentationPages.filter(page => requestedSources.has(path.normalize(path.resolve(page.source)).toLowerCase()))
  : documentationPages
if (pagesToCompile.length !== requestedSources.size && requestedSources.size) {
  throw new Error(
    `Could not find documentation routes for ${requestedSources.size - pagesToCompile.length} changed source file(s)`
  )
}

const sourceRouteMap = new Map(
  pages.flatMap(page =>
    page.source ? [[path.normalize(path.resolve(page.source)).toLowerCase(), `/${page.pathname}`]] : []
  )
)
const entries = []

for (const [index, page] of pagesToCompile.entries()) {
  const pathname = `/${page.pathname}`
  const html = await renderMarkdown(page.markdown || "", {
    twoslash: true,
    routePath: pathname,
    sourcePath: page.source,
    sourceRouteMap,
    linkedAssetRoot,
  })

  const missingTypeScriptLanguage = html.match(
    /Note from shiki-twoslash: the language (?:ts|tsx|js|jsx) was not set up/g
  )
  if (missingTypeScriptLanguage) {
    throw new Error(`${pathname} lost ${missingTypeScriptLanguage.length} TypeScript/JavaScript language registrations`)
  }

  entries.push([pathname, html])
  if ((index + 1) % 25 === 0 || index + 1 === pagesToCompile.length) {
    console.log(`Compiled documentation ${index + 1}/${pagesToCompile.length}`)
  }
}

if (requestedSources.size) updateDocumentationCache(entries)
else writeDocumentationCache(entries)
console.log(`${requestedSources.size ? "Updated" : "Wrote"} ${entries.length} deterministic documentation HTML entries`)
