import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRoutes } from "../src/lib/routes.mjs"
import { developerSemanticCopiedAssets, developerSemanticRouteCount, developerSemanticSourcePages } from "../src/lib/developer-semantics.mjs"

const here = path.dirname(fileURLToPath(import.meta.url))
const targetRoot = path.resolve(here, "..")
const evidenceRoot = path.resolve(targetRoot, "../typescriptlang-org/.tsupgrader/framework-migration/evidence")
const parity = JSON.parse(fs.readFileSync(path.join(evidenceRoot, "content-parity.json"), "utf8"))
const routes = createRoutes().filter(route => route.family === "developer")
const family = parity.distribution.byFamily.developer
const fields = parity.distribution.byFamilyAndField.developer
const payload = {
  captured: new Date().toISOString(),
  status: family.mismatched === 0 ? "passed" : "failed",
  inventory: {
    routeCount: routes.length,
    routes: routes.map(route => `/${route.pathname}`).sort(),
    sourcePages: developerSemanticSourcePages,
  },
  implementation: {
    structuredData: "packages/typescriptlang-org-astro/src/data/developer-semantics.json",
    extractedRouteCount: developerSemanticRouteCount,
    copiedAssets: developerSemanticCopiedAssets,
    interactiveIsland: "DeveloperWorkbenchIsland.tsx",
    targetBuildRuntimeGatsbyImports: 0,
    generatedHtmlSnapshots: false,
  },
  before: {
    matched: 1,
    mismatched: 5,
    fields: { headingTexts: 5, localLinks: 5, textHash: 5, codeBlockCount: 4, imageSources: 1 },
  },
  after: {
    matched: family.matched,
    mismatched: family.mismatched,
    fields,
  },
}
fs.writeFileSync(path.join(evidenceRoot, "developer-pages.json"), `${JSON.stringify(payload, null, 2)}\n`)
console.log(`Developer semantic parity: ${payload.before.matched}/6 -> ${payload.after.matched}/6; remaining fields ${JSON.stringify(fields)}`)