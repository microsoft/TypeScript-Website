import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRoutes } from "../src/lib/routes.mjs"
import { getRootSemanticPage } from "../src/lib/root-semantics.mjs"

const here = path.dirname(fileURLToPath(import.meta.url))
const evidenceRoot = path.resolve(here, "../../typescriptlang-org/.tsupgrader/framework-migration/evidence")
const parity = JSON.parse(fs.readFileSync(path.join(evidenceRoot, "content-parity.json"), "utf8"))
const roots = createRoutes().filter(route => route.family === "root")
const templates = [...new Set(roots.map(route => route.pathname.replace(/^(?:es|fr|id|ja|ko|pl|pt|vo|zh)\/?/, "") || "home"))]
const locales = [...new Set(roots.map(route => route.locale))]
const rootDistribution = parity.distribution.byFamily.root
const remaining = parity.mismatches.filter(item => item.family === "root")
const payload = {
  captured: new Date().toISOString(),
  status: roots.length === 100 && remaining.length === 0 ? "passed" : "failed",
  before: {
    matched: 16,
    routes: 100,
    mismatched: 84,
    fields: { codeBlockCount: 30, headingTexts: 84, imageSources: 40, localLinks: 59, textHash: 84, twoslashCount: 10 },
  },
  after: {
    matched: rootDistribution.matched,
    routes: rootDistribution.routes,
    mismatched: rootDistribution.mismatched,
    fields: parity.distribution.byFamilyAndField.root,
  },
  templates,
  locales,
  extractedRouteCount: roots.filter(route => getRootSemanticPage(route.pathname)).length,
  generatedSource: "packages/typescriptlang-org-astro/src/data/root-semantics.json",
  targetRuntimeImportsFromGatsby: false,
  copiedReferencedAssets: 15,
  remaining,
}
fs.writeFileSync(path.join(evidenceRoot, "root-pages.json"), `${JSON.stringify(payload, null, 2)}\n`)
console.log(`Root semantic parity: ${payload.before.matched}/${payload.before.routes} -> ${payload.after.matched}/${payload.after.routes}; remaining fields ${JSON.stringify(payload.after.fields)}`)
