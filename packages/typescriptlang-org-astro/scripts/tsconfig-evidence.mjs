import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRoutes } from "../src/lib/routes.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dist = path.join(root, "dist")
const output = path.resolve(root, "../typescriptlang-org/.tsupgrader/framework-migration/evidence/playwright/tsconfig/static-assertions.json")
const routes = createRoutes()
const roots = routes.filter(route => route.family === "tsconfig")
const options = routes.filter(route => route.family === "tsconfig-option")
const failures = []

for (const option of options) {
  const file = path.join(dist, option.pathname)
  if (!fs.existsSync(file)) {
    failures.push({ option: option.title, check: "intentional-html-output" })
    continue
  }
  const html = fs.readFileSync(file, "utf8")
  const checks = {
    indexableContent: html.includes('data-route-family="tsconfig-option"') && html.includes(`<h2>${option.title}</h2>`),
    humanRedirect: html.includes(`redirect = "/tsconfig#${option.title}"`),
    seoMetadata: html.includes('<html lang="en">') && html.includes('<meta name="description" content="How this setting affects your build.">'),
    noMetaRefresh: !/http-equiv=["']refresh/i.test(html),
  }
  for (const [check, passed] of Object.entries(checks)) if (!passed) failures.push({ option: option.title, check })
}

const report = {
  captured: new Date().toISOString(),
  status: failures.length === 0 ? "passed" : "failed",
  productionOutput: "packages/typescriptlang-org-astro/dist",
  roots: {
    count: roots.length,
    locales: roots.map(route => route.locale).sort(),
    localizedRoot: roots.some(route => route.pathname === "ja/tsconfig"),
  },
  options: {
    count: options.length,
    intentionalHtmlUrls: options.filter(route => route.pathname.endsWith(".html")).length,
    indexableBotContentAssertions: options.length,
    exactHumanRedirectAssertions: options.length,
    seoMetadataAssertions: options.length,
    noMetaRefreshAssertions: options.length,
  },
  failures,
}

fs.mkdirSync(path.dirname(output), { recursive: true })
fs.writeFileSync(output, `${JSON.stringify(report, null, 2)}\n`)
console.log(JSON.stringify(report, null, 2))
if (failures.length) process.exitCode = 1