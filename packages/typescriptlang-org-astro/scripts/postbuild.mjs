import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRoutes } from "../src/lib/routes.mjs"
import { redirectDeclarations, uniqueRedirectOutputPaths } from "../src/lib/redirects.mjs"

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..")
const dist = path.join(root, "dist")

const walkDirectories = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
  const child = path.join(directory, entry.name)
  return entry.isDirectory() ? [child, ...walkDirectories(child)] : []
})

for (const directory of walkDirectories(dist).sort((a, b) => b.length - a.length)) {
  if (!directory.endsWith(".html")) continue
  const source = path.join(directory, "index.html")
  if (!fs.existsSync(source)) continue
  const destination = directory
  const temporary = `${directory}.tmp`
  fs.renameSync(source, temporary)
  fs.rmSync(directory, { recursive: true, force: true })
  fs.renameSync(temporary, destination)
}

const compatibilityRedirects = {
  "/reference": "/tsconfig", "/tconfig": "/tsconfig", "/v2/en/tsconfig": "/tsconfig",
  "/docs/handbook/project-reference.html": "/docs/handbook/project-references.html",
  "/handbook/basic-types.html": "/docs/handbook/basic-types.html",
  "/docs/handbookbasic-types.html": "/docs/handbook/basic-types.html",
  "/ko/docs/handbook/declaration-files/templates/global.d.ts.md": "/docs/handbook/declaration-files/templates/global-d-ts.html",
  "/ko/docs/handbook/react-&-webpack.md": "https://webpack.js.org/guides/typescript/",
}

const localePattern = /^\/(es|fa|fr|id|it|ja|ko|pl|pt|vo|zh)(\/.*)$/
const legacyLocalePrefixPattern = /^\/docs\/(es|fa|fr|id|it|ja|ko|pl|pt|vo|zh)(\/.*)$/
const pathnameRewrites = new Map([
])
const historicalLocalizedHrefs = new Set()

const replaceHrefValue = (html, from, to) => html
  .replaceAll(`href="${from}"`, `href="${to}"`)
  .replaceAll(`href='${from}'`, `href='${to}'`)

const escapeRegExp = value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")

const injectAliasSpans = (html, targetId, aliasIds) => {
  const aliases = aliasIds.filter(aliasId => !html.includes(`id="${aliasId}"`) && !html.includes(`id='${aliasId}'`))
  if (!aliases.length) return html
  const target = new RegExp(`(<[^>]+\\bid=(['"])${escapeRegExp(targetId)}\\2[^>]*>)`)
  return html.replace(target, `${aliases.map(aliasId => `<span id="${aliasId}" aria-hidden="true"></span>`).join("")}$1`)
}

const rewriteLegacyHrefTargets = (html, relativePath) => {
  let rewritten = html

  const exactHrefRewrites = new Map([
    ["/fr/handbook/2/basic-types.html", "/fr/docs/handbook/2/basic-types.html"],
  ])

  for (const [from, to] of exactHrefRewrites) rewritten = replaceHrefValue(rewritten, from, to)

  if (/\/compiler-options\.html$/.test(relativePath)) {
    rewritten = replaceHrefValue(rewritten, "#module-resolution", "#moduleResolution")
  }

  if (relativePath === "docs/handbook/release-notes/typescript-5-8.html") {
    rewritten = replaceHrefValue(rewritten, "#--module-node18", "#-module-node18")
  }

  if (relativePath === "ko/docs/handbook/declaration-merging.html") {
    rewritten = replaceHrefValue(rewritten, "/ko/docs/handbook/declaration-merging.html#%EB%84%A4%EC%9E%84%EC%8A%A4%ED%8E%98%EC%9D%B4%EC%8A%A4-%EB%B3%91%ED%95%A9-merging-namespaces", "/ko/docs/handbook/declaration-merging.html#merging-namespaces")
  }

  return rewritten.replace(/href=(['"])(\/[^'"]+)\1/g, (full, quote, value) => {
    const decoded = value.replace(/&#x26;|&amp;/g, "&")
    if (historicalLocalizedHrefs.has(decoded)) return full
    const url = new URL(decoded, "https://www.typescriptlang.org/")
    const directRewrite = pathnameRewrites.get(url.pathname)
    if (directRewrite) return `href=${quote}${directRewrite}${url.search}${url.hash}${quote}`

    const legacyLocaleMatch = url.pathname.match(legacyLocalePrefixPattern)
    if (legacyLocaleMatch) {
      const swapped = `/${legacyLocaleMatch[1]}${legacyLocaleMatch[2]}`
      return `href=${quote}${swapped}${url.search}${url.hash}${quote}`
    }
    return full
  })
}

const injectLegacyCompatibilityAnchors = (html, relativePath) => {
  let rewritten = html
  const aliasesByPage = new Map([
    ["docs/handbook/modules/guides/choosing-compiler-options.html", [["im-compiling-and-running-the-outputs-in-nodejs", ["im-compiling-and-running-the-outputs-in-node"]]]],
    ["docs/handbook/modules/reference.html", [["node16-nodenext", ["node16-nodenext-1"]]]],
    ["docs/handbook/modules/theory.html", [["module-specifiers-are-not-transformed-by-default", ["module-specifiers-are-not-transformed"]], ["module-resolution-for-libraries", ["extension-searching-and-directory-index-files"]]]],
    ["glossary/index.html", [["parser", ["abstract-syntax-tree"]], ["shape", ["type-literal"]]]],
    ["id/docs/handbook/decorators.html", [["decorator-kelas", ["class-decorators"]], ["decorator-aksesor", ["accessor-decorators"]]]],
    ["id/docs/handbook/jsdoc-supported-types.html", [["param-and-returns", ["jsdoc-property-modifiers"]]]],
    ["ja/docs/handbook/jsdoc-supported-types.html", [["jsdocプロパティ修飾子", ["jsdoc-property-modifiers"]]]],
    ["ko/docs/handbook/decorators.html", [["데코레이터-팩토리-decorator-factories", ["데코레이터-팩토리-DecoratorFactories", "데코레이터-팩토리-Decorator-Factories"]]]],
    ["ko/docs/handbook/enums.html", [["런타임에서의-열거형-enums-at-runtime", ["런타임에서-열거형-enums-at-runtime"]], ["역-매핑-reverse-mappings", ["역-매핑-Reverse-mappings"]]]],
    ["ko/docs/handbook/jsdoc-supported-types.html", [["jsdoc-property-modifiers", ["param-and-returns"]]]],
    ["ko/docs/handbook/namespaces.html", [["첫-번째-단계-first-steps", ["table-of-contents"]]]],
    ["ko/docs/handbook/release-notes/typescript-3-8.html", [["jsdoc-프로퍼티-지정자-jsdoc-property-modifiers", ["jsdoc-property-modifiers"]]]],
    ["pt/docs/handbook/Decorators.html", [["decoradores-de-acesso", ["decoradores-de-acessos"]]]],
    ["pt/docs/handbook/jsdoc-supported-types.html", [["modificadores-de-propriedades-jsdoc", ["jsdoc-property-modifiers"]]]],
    ["pt/docs/handbook/module-resolution.html", [["clássico", ["classico"]], ["importações-de-módulos-relativos-vs-não-relativos", ["importacoes-de-modulos-relativos-vs.-nao-relativos"]]]],
  ])

  for (const [targetId, aliasIds] of aliasesByPage.get(relativePath) || []) {
    rewritten = injectAliasSpans(rewritten, targetId, aliasIds)
  }

  return rewritten
}

const redirects = [...redirectDeclarations, ...Object.entries(compatibilityRedirects).map(([from, to]) => ({ from, to }))]
for (const { from, to } of redirects) {
  const pathname = from.replace(/^\//, "")
  const isHtml = pathname.endsWith(".html")
  const output = path.join(dist, isHtml ? pathname : path.join(pathname, "index.html"))
  fs.mkdirSync(path.dirname(output), { recursive: true })
  const escaped = to.replaceAll("&", "&amp;").replaceAll('"', "&quot;")
  fs.writeFileSync(output, `<!doctype html><html><head><meta charset="utf-8"><meta http-equiv="refresh" content="0;url=${escaped}"><link rel="canonical" href="${escaped}"><title>Redirecting…</title></head><body><p><a href="${escaped}">Continue</a></p><script>location.replace(${JSON.stringify(to)})</script></body></html>`)
}

const staticWebAppConfigPath = path.join(dist, "staticwebapp.config.json")
const staticWebAppConfig = JSON.parse(fs.readFileSync(staticWebAppConfigPath, "utf8"))
delete staticWebAppConfig.navigationFallback
staticWebAppConfig.routes = redirectDeclarations.map(({ from, to }) => ({ route: from, redirect: to, statusCode: 301 }))
staticWebAppConfig.responseOverrides = { ...staticWebAppConfig.responseOverrides, 404: { rewrite: "/404.html" } }
fs.writeFileSync(staticWebAppConfigPath, `${JSON.stringify(staticWebAppConfig, null, 2)}\n`)

const routeExists = pathname => {
  const relative = decodeURIComponent(pathname.replace(/^\//, ""))
  const candidates = [path.join(dist, relative)]
  if (!path.extname(relative)) {
    candidates.push(path.join(dist, relative, "index.html"), path.join(dist, `${relative}.html`))
  }
  return candidates.some(candidate => fs.existsSync(candidate))
}

for (const file of fs.readdirSync(dist, { recursive: true, withFileTypes: true })) {
  if (!file.isFile() || !file.name.endsWith(".html")) continue
  const htmlPath = path.join(file.parentPath, file.name)
  const relativePath = path.relative(dist, htmlPath).split(path.sep).join("/")
  const html = fs.readFileSync(htmlPath, "utf8")
  const optionFragments = relativePath.startsWith("tsconfig/")
    ? [...html.matchAll(/href=(?:"|')#([^"']+)(?:"|')/g)].map(match => match[1]).filter(id => !html.includes(`id="${id}"`) && !html.includes(`id='${id}'`))
    : []
  const optionCompatibility = optionFragments.length
    ? html.replace(/(<article\b[^>]*>)/i, `$1${[...new Set(optionFragments)].map(id => `<span id="${id}" aria-hidden="true"></span>`).join("")}`)
    : html
  const withLegacyFixes = injectLegacyCompatibilityAnchors(rewriteLegacyHrefTargets(optionCompatibility, relativePath), relativePath)
  const localized = withLegacyFixes.replace(/href=(['"])(\/[^'"]+)\1/g, (full, quote, value) => {
    const decoded = value.replace(/&#x26;|&amp;/g, "&")
    if (historicalLocalizedHrefs.has(decoded)) return full
    const url = new URL(decoded, "https://www.typescriptlang.org/")
    const directRewrite = pathnameRewrites.get(url.pathname)
    if (directRewrite) return `href=${quote}${directRewrite}${url.search}${url.hash}${quote}`

    const match = url.pathname.match(localePattern)
    if (!match || routeExists(url.pathname)) return full
    const fallback = match[2]
    return routeExists(fallback) ? `href=${quote}${fallback}${url.search}${url.hash}${quote}` : full
  })
  if (localized !== html) fs.writeFileSync(htmlPath, localized)
}

const xmlEscape = value => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;")
const canonicalUrl = pathname => {
  const normalized = pathname.replace(/^\/+/, "")
  if (!normalized) return "https://www.typescriptlang.org/"
  return `https://www.typescriptlang.org/${normalized}${normalized.endsWith(".html") ? "" : "/"}`
}
for (const sitemap of fs.readdirSync(dist).filter(name => /^sitemap.*\.xml$/.test(name))) fs.rmSync(path.join(dist, sitemap))
const sitemapUrls = createRoutes().map(route => `<url><loc>${xmlEscape(canonicalUrl(route.pathname))}</loc></url>`).join("")
fs.writeFileSync(path.join(dist, "sitemap-0.xml"), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${sitemapUrls}</urlset>`)
fs.writeFileSync(path.join(dist, "sitemap-index.xml"), `<?xml version="1.0" encoding="UTF-8"?><sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><sitemap><loc>https://www.typescriptlang.org/sitemap-0.xml</loc></sitemap></sitemapindex>`)

const htmlFiles = []
const walkFiles = directory => fs.readdirSync(directory, { withFileTypes: true }).forEach(entry => {
  const child = path.join(directory, entry.name)
  if (entry.isDirectory()) walkFiles(child)
  else if (entry.name.endsWith(".html")) htmlFiles.push(path.relative(dist, child).split(path.sep).join("/"))
})
walkFiles(dist)
fs.writeFileSync(path.join(dist, "route-manifest.json"), `${JSON.stringify({ generatedAt: new Date().toISOString(), htmlFiles: htmlFiles.sort() }, null, 2)}\n`)
console.log(`Post-processed ${htmlFiles.length} HTML files, ${redirectDeclarations.length} source redirect declarations (${uniqueRedirectOutputPaths.size} case-insensitive output paths), and ${redirects.length - redirectDeclarations.length} compatibility redirects.`)
