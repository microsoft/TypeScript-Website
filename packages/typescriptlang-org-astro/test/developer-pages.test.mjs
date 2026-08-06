import assert from "node:assert/strict"
import fs from "node:fs"
import path from "node:path"
import test from "node:test"
import { fileURLToPath } from "node:url"
import { createRoutes } from "../src/lib/routes.mjs"
import { developerSemanticCopiedAssets, developerSemanticRouteCount, developerSemanticSourcePages, renderDeveloperSemanticHtml } from "../src/lib/developer-semantics.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const read = relative => fs.readFileSync(path.join(root, relative), "utf8")
const expectedRoutes = ["branding", "dev/bug-workbench", "dev/playground-plugins", "dev/sandbox", "dev/twoslash", "dev/typescript-vfs"]
const brandingOutput = path.join(root, "dist", "branding", "index.html")
const builtAfterSources = fs.existsSync(brandingOutput) && fs.statSync(brandingOutput).mtimeMs >= fs.statSync(path.join(root, "src", "components", "BrandingPage.astro")).mtimeMs

test("declares the exact six filesystem and developer routes", () => {
  const actual = createRoutes().filter(route => route.family === "developer").map(route => route.pathname).sort()
  assert.deepEqual(actual, expectedRoutes)
})

test("developer routes retain useful content and interactive workbenches", () => {
  const page = read("src/components/DeveloperPage.astro")
  const workbench = read("src/components/DeveloperWorkbenchIsland.tsx")
  assert.match(page, /renderDeveloperSemanticHtml/)
  assert.match(page, /mode=\{slug\}/)
  for (const action of ["Compile", "Get .d.ts", "Emit virtual files", "Plugin manifest builder"]) assert.match(workbench, new RegExp(action.replace(".", "\\.")))
  assert.match(workbench, /typescript-sandbox\/index/)
  assert.doesNotMatch(page + workbench, /from ["'][^"']*typescriptlang-org\//)
  assert.doesNotMatch(page + workbench, /gatsby/i)
})

test("developer semantic data inventories all six source pages and renders their baseline regions", () => {
  assert.equal(developerSemanticRouteCount, 6)
  assert.deepEqual(developerSemanticSourcePages.map(page => page.route).sort(), expectedRoutes.map(route => `/${route}`).sort())
  const landmarks = new Map([
    ["/branding", ["Branding", "Recommendations", "Please Don't"]],
    ["/dev/bug-workbench", ["Bug Workbench", "Downloading TypeScript"]],
    ["/dev/playground-plugins", ["Developer Tools", "Your toys, our sandbox", "Alternatives"]],
    ["/dev/sandbox", ["TypeScript Sandbox", "Get Started", "Some examples of the API"]],
    ["/dev/twoslash", ["TypeScript Twoslash", "Markup", "Results", "Usage"]],
    ["/dev/typescript-vfs", ["Easy access to the compiler API", "Setup with TypeScript from node_modules"]],
  ])
  for (const [route, expected] of landmarks) {
    const html = renderDeveloperSemanticHtml(route)
    for (const landmark of expected) assert.match(html, new RegExp(landmark))
  }
})

test("branding and plugin artwork are target-owned", () => {
  const required = [
    "branding/typescript-design-assets.zip",
    "images/branding/logo-grouping.svg",
    "images/branding/two-colors.svg",
    "images/branding/two-longform.svg",
    "images/branding/palette.svg",
    "images/branding/palette-bg.svg",
    "images/playground-plugin-preview.svg",
  ]
  for (const asset of required) assert.ok(fs.existsSync(path.join(root, "public", asset)), `Missing target-owned asset: ${asset}`)
  for (const asset of developerSemanticCopiedAssets) assert.ok(fs.existsSync(path.join(root, "public", asset)), `Missing extracted developer asset: ${asset}`)
})

test("built developer pages contain route-specific landmarks", { skip: !builtAfterSources }, () => {
  const landmarks = new Map([
    ["branding", ["Recommendations", "Please Don't"]],
    ["dev/bug-workbench", ["Bug Workbench", "Compile"]],
    ["dev/playground-plugins", ["Plugin manifest builder", "playground-plugin-preview-3fa319f7efff676f839a57ad3d8be916.png"]],
    ["dev/sandbox", ["TypeScript Sandbox", "Get .d.ts"]],
    ["dev/twoslash", ["TypeScript Twoslash", "Show JavaScript"]],
    ["dev/typescript-vfs", ["Easy access to the compiler API", "Emit virtual files"]],
  ])
  for (const [route, expected] of landmarks) {
    const html = read(`dist/${route}/index.html`)
    for (const landmark of expected) assert.match(html, new RegExp(landmark.replace(".", "\\.")), `${route} is missing ${landmark}`)
  }
})
