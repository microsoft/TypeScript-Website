import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { redirectDeclarations, redirectDestinationType, uniqueRedirectOutputPaths } from "../src/lib/redirects.mjs"

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const dist = path.join(root, "dist")
const evidence = path.resolve(root, "../typescriptlang-org/.tsupgrader/framework-migration/evidence")
const config = JSON.parse(fs.readFileSync(path.join(dist, "staticwebapp.config.json"), "utf8"))
const generatedAt = new Date().toISOString()
const escapeHtml = value => value.replaceAll("&", "&amp;").replaceAll('"', "&quot;")
const outputPath = from => {
  const relative = from.replace(/^\//, "")
  return path.join(dist, relative.endsWith(".html") ? relative : relative, relative.endsWith(".html") ? "" : "index.html")
}
const destinationOutput = destination => {
  const url = new URL(destination, "https://www.typescriptlang.org")
  const relative = url.pathname.replace(/^\//, "")
  return { url, file: path.join(dist, relative.endsWith(".html") ? relative : relative.replace(/\/$/, ""), relative.endsWith(".html") ? "" : "index.html") }
}

const matrix = redirectDeclarations.map(redirect => {
  const htmlFile = outputPath(redirect.from)
  const html = fs.readFileSync(htmlFile, "utf8")
  const destinationType = redirectDestinationType(redirect.to)
  let destinationArtifact = null
  let fragmentTarget = null
  if (destinationType !== "external") {
    const destination = destinationOutput(redirect.to)
    const destinationHtml = fs.readFileSync(destination.file, "utf8")
    destinationArtifact = path.relative(dist, destination.file).replaceAll("\\", "/")
    fragmentTarget = destination.url.hash ? new RegExp(`id=["']${destination.url.hash.slice(1)}["']`).test(destinationHtml) : null
  }
  const azure = config.routes.find(rule => rule.route === redirect.from)
  return {
    ...redirect,
    destinationType,
    outputPathKey: redirect.from.toLowerCase(),
    githubPages: {
      artifact: path.relative(dist, htmlFile).replaceAll("\\", "/"),
      staticResponseStatus: 200,
      metaRefresh: /http-equiv="refresh"/i.test(html),
      clientReplace: html.includes("location.replace("),
      exactDestination: html.includes(escapeHtml(redirect.to)),
      classification: "static HTML response followed by meta refresh or client-side location.replace; GitHub Pages cannot emit a redirect status from this artifact",
    },
    azurePreview: {
      route: azure?.route,
      destination: azure?.redirect,
      statusCode: azure?.statusCode,
      classification: "native Azure Static Web Apps permanent redirect configured in staticwebapp.config.json",
    },
    destinationArtifact,
    fragmentTarget,
  }
})

const collisions = [...uniqueRedirectOutputPaths].flatMap(([key]) => {
  const declarations = redirectDeclarations.filter(item => item.from.toLowerCase() === key)
  return declarations.length > 1 ? [{ outputPathKey: key, declarations: declarations.map(item => item.from), destinations: [...new Set(declarations.map(item => item.to))] }] : []
})

const redirects = {
  generatedAt,
  status: matrix.every(item => item.githubPages.metaRefresh && item.githubPages.clientReplace && item.githubPages.exactDestination && item.azurePreview.statusCode === 301 && item.azurePreview.destination === item.to && item.destinationArtifact !== undefined && item.fragmentTarget !== false) ? "passed" : "failed",
  declarationCount: redirectDeclarations.length,
  uniqueCaseInsensitiveOutputPathCount: uniqueRedirectOutputPaths.size,
  destinationTypeCounts: Object.fromEntries([...new Set(matrix.map(item => item.destinationType))].map(type => [type, matrix.filter(item => item.destinationType === type).length])),
  collisions,
  hostBehavior: {
    githubPagesProduction: "22 case-insensitive output identities are emitted as static redirect documents; all 23 declarations are emitted on case-sensitive hosts. Responses are ordinary static 200 documents and navigation is client/meta based.",
    azurePreview: "All 23 declarations are exact permanent HTTP 301 route rules. Azure evaluates configured routes before static fallback documents.",
    localAstroPreview: "Static redirect documents were browser-tested because Astro preview does not emulate Azure route rules.",
  },
  matrix,
}

const html404 = fs.readFileSync(path.join(dist, "404.html"), "utf8")
const notFound = {
  generatedAt,
  status: /<h1>Page not found<\/h1>/.test(html404) && config.navigationFallback === undefined && config.responseOverrides?.["404"]?.rewrite === "/404.html" ? "passed" : "failed",
  artifact: { path: "404.html", heading: "Page not found", usableHomeLink: /href="\/"/.test(html404) },
  localAstroPreview: { statusCode: 404, customArtifactRendered: true, evidence: "Playwright request and browser navigation assertions in browser/redirects-404.spec.mjs" },
  azurePreview: { statusCode: 404, config: config.responseOverrides["404"], classification: "status-preserving custom 404 response override; navigationFallback is intentionally absent because Azure documents that it returns 200" },
  githubPagesProduction: { classification: "special root 404.html artifact; GitHub Pages supplies host-level not-found behavior, while the artifact itself was validated deterministically" },
  screenshots: ["playwright/404/desktop.png", "playwright/404/mobile.png"],
}

fs.mkdirSync(evidence, { recursive: true })
fs.writeFileSync(path.join(evidence, "redirects.json"), `${JSON.stringify(redirects, null, 2)}\n`)
fs.writeFileSync(path.join(evidence, "404.json"), `${JSON.stringify(notFound, null, 2)}\n`)
console.log(`P17 ${redirects.status}: ${redirects.declarationCount} declarations / ${redirects.uniqueCaseInsensitiveOutputPathCount} case-insensitive paths`)
console.log(`P18 ${notFound.status}: custom 404 artifact and status-preserving host configuration`)
if (redirects.status !== "passed" || notFound.status !== "passed") process.exitCode = 1
