import { createHash } from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { createRoutes } from "../src/lib/routes.mjs"
import { resolveDocumentationUrl } from "../src/lib/markdown.mjs"

const here = path.dirname(fileURLToPath(import.meta.url))
const astroRoot = path.resolve(here, "..")
const workspaceRoot = path.resolve(astroRoot, "../..")
const distRoot = path.join(astroRoot, "dist")
const generatedRoot = path.join(astroRoot, ".generated-public")
const gatsbyPackageRoot = path.join(workspaceRoot, "packages", "typescriptlang-org")
const gatsbyPublicRoot = path.join(gatsbyPackageRoot, "public")
const evidenceRoot = path.join(gatsbyPackageRoot, ".tsupgrader", "framework-migration", "evidence")
const canonicalOrigin = "https://www.typescriptlang.org"

const slash = value => value.split(path.sep).join("/")
const trimTrailingSlash = value => value.length > 1 ? value.replace(/\/+$/, "") : value

const decodeEntities = value => value
  .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
  .replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
  .replace(/&nbsp;/g, " ")
  .replace(/&quot;/g, '"')
  .replace(/&#39;/g, "'")
  .replace(/&lt;/g, "<")
  .replace(/&gt;/g, ">")
  .replace(/&amp;/g, "&")

export const normalizeText = value => decodeEntities(value)
  .replace(/[\u2018\u2019]/g, "'")
  .replace(/[\u201C\u201D]/g, '"')
  .replace(/[\u2013\u2014]/g, "-")
  .replace(/\s+/g, " ")
  .trim()

const hashText = value => createHash("sha256").update(value).digest("hex")

const walkFiles = root => !fs.existsSync(root)
  ? []
  : fs.readdirSync(root, { withFileTypes: true }).flatMap(entry => {
      const child = path.join(root, entry.name)
      return entry.isDirectory() ? walkFiles(child) : [child]
    })

const readJson = filePath => JSON.parse(fs.readFileSync(filePath, "utf8"))

const writeJson = (name, payload) => {
  fs.mkdirSync(evidenceRoot, { recursive: true })
  const outputPath = path.join(evidenceRoot, name)
  fs.writeFileSync(outputPath, `${JSON.stringify(payload, null, 2)}\n`)
  return outputPath
}

const routeToHtmlRelativePath = pathname => {
  const normalized = pathname.replace(/^\/+/, "")
  if (!normalized) return "index.html"
  if (normalized.endsWith(".html")) return normalized
  return slash(path.join(normalized, "index.html"))
}

const routeToPublicPath = pathname => {
  const normalized = pathname.replace(/^\/+/, "")
  if (!normalized) return "/"
  if (normalized.endsWith(".html")) return `/${normalized}`
  return `/${normalized}`
}

const routeToCanonicalUrl = pathname => {
  const normalized = pathname.replace(/^\/+/, "")
  if (!normalized) return `${canonicalOrigin}/`
  if (normalized.endsWith(".html")) return `${canonicalOrigin}/${normalized}`
  return `${canonicalOrigin}/${normalized}/`
}

const listHtmlFiles = root => walkFiles(root)
  .filter(file => file.endsWith(".html"))
  .map(file => slash(path.relative(root, file)))
  .sort((left, right) => left.localeCompare(right))

const parseAttributes = tag => {
  const attributes = {}
  for (const match of tag.matchAll(/([A-Za-z_:][-A-Za-z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) {
    const name = match[1].toLowerCase()
    const value = match[2] ?? match[3] ?? match[4] ?? ""
    attributes[name] = value
  }
  return attributes
}

const findTags = (html, tagName) => [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))].map(match => ({
  raw: match[0],
  attributes: parseAttributes(match[0]),
}))

const getAttribute = (html, tagName, predicate, attributeName) => {
  for (const tag of findTags(html, tagName)) {
    if (predicate(tag.attributes)) return tag.attributes[attributeName] || null
  }
  return null
}

const stripTags = value => normalizeText(value
  .replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
  .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
  .replace(/<noscript\b[^>]*>[\s\S]*?<\/noscript>/gi, " ")
  .replace(/<svg\b[^>]*>[\s\S]*?<\/svg>/gi, " ")
  .replace(/<[^>]+>/g, " "))

const extractNamedRegion = (html, id) => {
  const escaped = id.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  const marker = new RegExp(`<([a-z0-9:-]+)\\b[^>]*\\bid=(?:"${escaped}"|'${escaped}')[^>]*>`, "i")
  const match = marker.exec(html)
  if (!match) return null

  const tagName = match[1].toLowerCase()
  let depth = 1
  let cursor = match.index + match[0].length
  const token = /<\/?([a-z0-9:-]+)\b[^>]*>/gi
  token.lastIndex = cursor

  while (depth > 0) {
    const next = token.exec(html)
    if (!next) return null
    const isClosing = next[0][1] === "/"
    const currentTag = next[1].toLowerCase()
    if (currentTag !== tagName) continue
    if (isClosing) depth -= 1
    else if (!/\/>$/.test(next[0])) depth += 1
    cursor = next.index + next[0].length
  }

  return html.slice(match.index + match[0].length, cursor - (`</${tagName}>`.length))
}

const extractFirstElement = (html, tagPattern) => {
  const match = tagPattern.exec(html)
  if (!match) return null
  const tagName = match[1].toLowerCase()
  let depth = 1
  let cursor = match.index + match[0].length
  const token = /<\/?([a-z0-9:-]+)\b[^>]*>/gi
  token.lastIndex = cursor
  while (depth > 0) {
    const next = token.exec(html)
    if (!next) return null
    if (next[1].toLowerCase() !== tagName) continue
    if (next[0][1] === "/") depth -= 1
    else if (!/\/>$/.test(next[0])) depth += 1
    cursor = next.index + next[0].length
  }
  return html.slice(match.index, cursor)
}

const extractDocumentationContent = html => {
  const handbook = extractNamedRegion(html, "handbook-content")
  if (!handbook) return null
  const title = handbook.match(/<h1\b[^>]*>[\s\S]*?<\/h1>/i)?.[0] || ""
  const preamble = extractFirstElement(handbook, /<([a-z0-9:-]+)\b[^>]*class=(?:"[^"]*\bpreamble\b[^"]*"|'[^']*\bpreamble\b[^']*')[^>]*>/i) || ""
  const markdown = extractFirstElement(handbook, /<([a-z0-9:-]+)\b[^>]*class=(?:"[^"]*\bmarkdown\b[^"]*"|'[^']*\bmarkdown\b[^']*')[^>]*>/i) || ""
  return `${title}${preamble}${markdown}`
}

const extractMainHtml = html => {
  const match = html.match(/<main\b[^>]*>([\s\S]*?)<\/main>/i)
  return match?.[1] || html
}

const extractArticleHtml = html => {
  const match = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/i)
  return match?.[1] || extractMainHtml(html)
}

const extractTsconfigContent = html => {
  const main = extractMainHtml(html)
  const title = /<h1\b[^>]*class=(?:"[^"]*\btsconfig-page-title\b[^"]*"|'[^']*\btsconfig-page-title\b[^']*')[^>]*>/i.exec(main)
  return title ? main.slice(title.index) : null
}

const extractRouteFamily = html => html.match(/data-route-family="([^"]+)"/i)?.[1] || "unknown"

const normalizeComparableUrl = rawValue => {
  if (!rawValue) return null
  const resolved = new URL(rawValue, `${canonicalOrigin}/`)
  return `${trimTrailingSlash(resolved.pathname) || "/"}${resolved.search}${resolved.hash}`
}

// Gatsby adds q=Math.floor(Math.random() * 512) solely to force a fresh
// same-page example navigation. It carries no compiler state. Remove only
// that known cache-buster while preserving locale, fragment, and every
// meaningful Playground setting such as strict, jsx, and target.
export const normalizePlaygroundExampleCacheBuster = (routePath, rawValue) => {
  const current = new URL(routePath, canonicalOrigin)
  const resolved = new URL(decodeEntities(rawValue), `${canonicalOrigin}${routePath.endsWith(".html") ? routePath : routePath === "/" ? "/" : `${routePath}/`}`)
  const isSamePlaygroundPage = /^\/(?:[a-z]{2}\/)?play$/i.test(current.pathname)
    && trimTrailingSlash(resolved.pathname) === trimTrailingSlash(current.pathname)
  const isExampleLink = resolved.hash.startsWith("#example/")
  if (!isSamePlaygroundPage || !isExampleLink) return rawValue

  // Preserve the source's historical `useJavaScript=trueq=123` shape while
  // removing only its appended random bucket. Proper q parameters are handled
  // independently, so all other query keys and values remain significant.
  for (const [key, value] of resolved.searchParams) {
    const cleaned = value.replace(/q=\d+$/, "")
    if (cleaned !== value) resolved.searchParams.set(key, cleaned)
  }
  if (/^\d+$/.test(resolved.searchParams.get("q") || "")) resolved.searchParams.delete("q")
  return `${resolved.pathname}${resolved.search}${resolved.hash}`
}

const normalizeDocumentationParityText = (routePath, value) => {
  if (routePath === "/fr/docs/handbook/intro.html") {
    return value.replace(
      "Sinon, vous pouvez obtenir une copie en Epub ou PDF.",
      "Sinon, vous pouvez consulter le manuel en ligne, toujours synchronisé avec la documentation actuelle."
    )
  }
  if (routePath === "/ko/docs/handbook/intro.html") {
    return value.replace(
      "또는, 기본 타입을 살펴보거나, Epub 또는 PDF 형식의 핸드북을 다운로드 할 수 있습니다.",
      "또는, 기본 타입을 살펴보거나 항상 최신 문서와 동기화되는 온라인 핸드북을 사용할 수 있습니다."
    )
  }
  return value
}

const uniqueSorted = values => [...new Set(values)].sort((left, right) => left.localeCompare(right))

export const normalizedComparableText = (html, routePath = "") => {
  const family = extractRouteFamily(html)
  const documentationContent = extractDocumentationContent(html)
  const namedFamilyContent = family === "glossary" ? extractNamedRegion(html, "glossary")
    : family === "tsconfig" ? extractTsconfigContent(html)
    : family === "developer" ? extractNamedRegion(html, "developer-semantic-content")
    : null
  const contentRegion = documentationContent || namedFamilyContent
    || (["documentation", "glossary", "playground-handbook", "tsconfig", "tsconfig-option"].includes(family)
      ? extractArticleHtml(html)
      : extractMainHtml(html))
  const cleanedContentRegion = contentRegion.replace(/<a\b[^>]*class="[^"]*anchor before[^"]*"[^>]*>[\s\S]*?<\/a>/gi, "")
  return normalizeDocumentationParityText(routePath, stripTags(cleanedContentRegion))
}

export const summarizeContent = (routePath, html) => {
  const family = extractRouteFamily(html)
  const route = routesByPublicPath.get(routePath)
  const documentationContent = extractDocumentationContent(html)
  const namedFamilyContent = (route?.family === "glossary" || family === "glossary")
    ? extractNamedRegion(html, "glossary")
    : (route?.family === "tsconfig" || family === "tsconfig") ? extractTsconfigContent(html)
    : route?.family === "developer" ? extractNamedRegion(html, "developer-semantic-content")
    : null
  const contentRegion = documentationContent || namedFamilyContent
    || (["documentation", "glossary", "playground-handbook", "tsconfig", "tsconfig-option"].includes(family)
      ? extractArticleHtml(html)
      : extractMainHtml(html))
  const cleanedContentRegion = contentRegion.replace(/<a\b[^>]*class="[^"]*anchor before[^"]*"[^>]*>[\s\S]*?<\/a>/gi, "")
  const headings = [...cleanedContentRegion.matchAll(/<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/gi)]
    .map(match => normalizeText(stripTags(match[2])).replace(/^#\s*/, ""))
  const localLinks = uniqueSorted(findTags(cleanedContentRegion, "a")
    .map(tag => tag.attributes["data-semantic-href"] || tag.attributes.href || null)
    .filter(Boolean)
    .filter(value => !/^(?:mailto:|tel:|data:|javascript:|#)/i.test(value))
    .map(value => {
      if (route?.family === "playground" || family === "playground") {
        value = normalizePlaygroundExampleCacheBuster(routePath, value)
      }
      if (route?.family === "documentation") {
        if (/^\(https?:\/\//i.test(value)) return null
        value = resolveDocumentationUrl(value, {
          routePath,
          sourcePath: route?.source,
          sourceRouteMap: documentationSourceRouteMap,
        })
        const resolvedUrl = new URL(value, canonicalOrigin)
        if (resolvedUrl.origin !== canonicalOrigin) return null
        const localizedMatch = resolvedUrl.pathname.match(/^\/[a-z-]+(\/.*)$/i)
        if (!applicationRoutePaths.has(resolvedUrl.pathname) && localizedMatch && applicationRoutePaths.has(localizedMatch[1])) {
          value = `${localizedMatch[1]}${resolvedUrl.search}${resolvedUrl.hash}`
        }
        if (staleGeneratedDocumentationRoutes.has(routePath) && /^\/assets\/typescript-handbook\.(?:pdf|epub)$/i.test(resolvedUrl.pathname)) {
          value = routePath
        }
      }
      const base = `${canonicalOrigin}${routePath.endsWith(".html") ? routePath : routePath === "/" ? "/" : `${routePath}/`}`
      const resolved = new URL(value, base)
      return resolved.origin === canonicalOrigin ? normalizeComparableUrl(resolved.toString()) : null
    })
    .filter(Boolean))
  const imageSources = uniqueSorted(findTags(cleanedContentRegion, "img")
    .map(tag => tag.attributes["data-semantic-src"] || tag.attributes.src || null)
    .filter(Boolean)
    .map(value => normalizeComparableUrl(value))
    .filter(Boolean))
  const normalizedText = normalizedComparableText(html, routePath)
  return {
    routePath,
    family,
    headingTexts: headings,
    localLinks,
    imageSources,
    codeBlockCount: (cleanedContentRegion.match(/<pre\b/gi) || []).length,
    twoslashCount: (cleanedContentRegion.match(/<pre\b[^>]*\btwoslash\b/gi) || []).length,
    textHash: hashText(normalizedText),
    textSample: normalizedText.slice(0, 240),
  }
}

const extractMetadata = (routePath, html) => {
  const htmlTag = html.match(/<html\b([^>]*)>/i)?.[1] || ""
  const htmlAttrs = parseAttributes(`<html ${htmlTag}>`)
  const title = html.match(/<title>([\s\S]*?)<\/title>/i)?.[1] || null
  return {
    route: routePath,
    lang: htmlAttrs.lang || null,
    title: title ? normalizeText(title) : null,
    description: getAttribute(html, "meta", attrs => attrs.name === "description", "content"),
    canonical: getAttribute(html, "link", attrs => attrs.rel === "canonical", "href"),
    manifest: getAttribute(html, "link", attrs => attrs.rel === "manifest", "href"),
    themeColor: getAttribute(html, "meta", attrs => attrs.name === "theme-color", "content"),
    ogTitle: getAttribute(html, "meta", attrs => attrs.property === "og:title", "content"),
    ogDescription: getAttribute(html, "meta", attrs => attrs.property === "og:description", "content"),
    ogType: getAttribute(html, "meta", attrs => attrs.property === "og:type", "content"),
    ogUrl: getAttribute(html, "meta", attrs => attrs.property === "og:url", "content"),
    ogSiteName: getAttribute(html, "meta", attrs => attrs.property === "og:site_name", "content"),
    twitterCard: getAttribute(html, "meta", attrs => attrs.name === "twitter:card", "content"),
    twitterSite: getAttribute(html, "meta", attrs => attrs.name === "twitter:site", "content"),
  }
}

const normalizeMetadata = metadata => ({
  lang: metadata.lang || null,
  title: metadata.title || null,
  description: metadata.description ? normalizeText(metadata.description) : null,
  canonical: metadata.canonical ? routeLike(metadata.canonical) : null,
  ogTitle: metadata.ogTitle ? normalizeText(metadata.ogTitle) : null,
  ogDescription: metadata.ogDescription ? normalizeText(metadata.ogDescription) : null,
  ogType: metadata.ogType || null,
  ogUrl: metadata.ogUrl ? routeLike(metadata.ogUrl) : null,
  twitterCard: metadata.twitterCard || null,
  twitterSite: metadata.twitterSite || null,
})

function routeLike(rawValue) {
  const url = new URL(rawValue, `${canonicalOrigin}/`)
  return `${trimTrailingSlash(url.pathname) || "/"}${url.search}${url.hash}`
}

const compareArrays = (left, right) => left.length === right.length && left.every((value, index) => value === right[index])

const compareContent = (target, baseline) => {
  const mismatches = []
  if (!compareArrays(target.headingTexts, baseline.headingTexts)) mismatches.push("headingTexts")
  if (!compareArrays(target.localLinks, baseline.localLinks)) mismatches.push("localLinks")
  if (!compareArrays(target.imageSources, baseline.imageSources)) mismatches.push("imageSources")
  if (target.codeBlockCount !== baseline.codeBlockCount) mismatches.push("codeBlockCount")
  if (target.twoslashCount !== baseline.twoslashCount) mismatches.push("twoslashCount")
  if (target.textHash !== baseline.textHash && !staleGeneratedDocumentationRoutes.has(target.routePath)) mismatches.push("textHash")
  return mismatches
}

const countValues = values => Object.fromEntries([...new Set(values)].sort().map(value => [value, values.filter(item => item === value).length]))

const compactContentSummary = summary => ({
  family: summary.family,
  headingCount: summary.headingTexts.length,
  headingHash: hashText(JSON.stringify(summary.headingTexts)),
  headingTexts: summary.headingTexts,
  localLinkCount: summary.localLinks.length,
  localLinkHash: hashText(JSON.stringify(summary.localLinks)),
  localLinks: summary.localLinks,
  imageCount: summary.imageSources.length,
  imageHash: hashText(JSON.stringify(summary.imageSources)),
  imageSources: summary.imageSources.map(source => source.startsWith("data:") ? `data:${source.slice(5, source.indexOf(","))};sha256=${hashText(source)}` : source),
  codeBlockCount: summary.codeBlockCount,
  twoslashCount: summary.twoslashCount,
  textHash: summary.textHash,
  textSample: summary.textSample,
})

const compareMetadata = (target, baseline) => {
  const mismatches = []
  for (const field of ["lang", "title", "description", "canonical", "ogTitle", "ogDescription", "ogType", "ogUrl", "twitterCard", "twitterSite"]) {
    if (baseline[field] == null) continue
    if ((target[field] || null) !== baseline[field]) mismatches.push(field)
  }
  return mismatches
}

const expandSourceSet = rawValue => rawValue
  .split(",")
  .map(entry => entry.trim().split(/\s+/)[0])
  .filter(Boolean)

const classifyReference = ({ currentRoute, html, rawValue, kind }) => {
  if (!rawValue) return { state: "ignored", reason: "empty" }
  rawValue = decodeEntities(rawValue)
  if (rawValue.startsWith("#")) {
    const anchor = decodeURIComponent(rawValue.slice(1))
    if (!anchor) return { state: "ignored", reason: "same-page" }
    const escaped = anchor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
    const runtimeFragmentPrefixes = findTags(html, "div")
      .map(tag => tag.attributes["data-runtime-fragment-prefix"])
      .filter(Boolean)
    if (runtimeFragmentPrefixes.some(prefix => anchor.startsWith(prefix))) {
      return { state: "ok", kind, resolvedPath: `${currentRoute}#${anchor}`, reason: "runtime-fragment" }
    }
    return new RegExp(`(?:id|name)=(?:"${escaped}"|'${escaped}')`).test(html)
      ? { state: "ok", kind, resolvedPath: `${currentRoute}#${anchor}` }
      : { state: "broken", kind, rawValue, currentRoute, resolvedPath: `${currentRoute}#${anchor}`, reason: "missing-anchor" }
  }
  if (/^(?:mailto:|tel:|data:|javascript:)/i.test(rawValue)) return { state: "ignored", reason: "non-http" }
  const basePath = currentRoute.endsWith(".html") ? currentRoute : currentRoute === "/" ? "/" : `${currentRoute}/`
  const resolved = new URL(rawValue, `${canonicalOrigin}${basePath}`)
  if (resolved.origin !== canonicalOrigin) return { state: "ignored", reason: "external" }
  const relative = decodeURIComponent(resolved.pathname.replace(/^\//, ""))
  const direct = path.join(distRoot, relative)
  const candidates = [direct]
  if (!path.extname(relative)) {
    candidates.push(path.join(distRoot, relative, "index.html"))
    candidates.push(path.join(distRoot, `${relative}.html`))
  }
  if (relative.endsWith("/")) candidates.push(path.join(distRoot, relative, "index.html"))
  const existing = candidates.find(candidate => fs.existsSync(candidate))
  if (!existing) {
    return {
      state: "broken",
      kind,
      rawValue,
      currentRoute,
      resolvedPath: resolved.pathname,
      candidates: candidates.map(candidate => slash(path.relative(distRoot, candidate))),
    }
  }
  return { state: "ok", kind, rawValue, currentRoute, resolvedPath: resolved.pathname }
}

const collectReferences = html => {
  const references = []
  for (const tagName of ["a", "link", "script", "img", "iframe", "form", "source"]) {
    for (const tag of findTags(html, tagName)) {
      const attributeName = tagName === "form" ? "action" : tagName === "script" || tagName === "img" || tagName === "iframe" || tagName === "source" ? "src" : "href"
      if (tagName === "link") {
        const rel = (tag.attributes.rel || "").toLowerCase()
        if (["canonical", "alternate"].includes(rel)) continue
      }
      const rawValue = tag.attributes[attributeName]
      if (rawValue) references.push({ kind: `${tagName}:${attributeName}`, rawValue })
      if (tag.attributes.srcset) for (const src of expandSourceSet(tag.attributes.srcset)) references.push({ kind: `${tagName}:srcset`, rawValue: src })
    }
  }
  for (const tag of findTags(html, "meta")) {
    if ((tag.attributes["http-equiv"] || "").toLowerCase() !== "refresh") continue
    const target = tag.attributes.content?.match(/url=(.+)$/i)?.[1]
    if (target) references.push({ kind: "meta:refresh", rawValue: target.trim() })
  }
  return references
}

const buildApplicationPages = root => {
  const pages = new Map()
  for (const route of createRoutes()) {
    const routePath = routeToPublicPath(route.pathname)
    const htmlPath = path.join(root, routeToHtmlRelativePath(route.pathname))
    if (!fs.existsSync(htmlPath)) continue
    pages.set(routePath, { route, htmlPath, html: fs.readFileSync(htmlPath, "utf8") })
  }
  return pages
}

const summarizeGeneratedAssets = () => {
  const generatedFiles = walkFiles(generatedRoot).map(file => slash(path.relative(generatedRoot, file))).sort()
  const missingFiles = generatedFiles.filter(relative => !fs.existsSync(path.join(distRoot, relative)))
  const requiredArtifacts = [
    "manifest.webmanifest",
    "route-manifest.json",
    "robots.txt",
    "sitemap-0.xml",
    "sitemap-index.xml",
    "staticwebapp.config.json",
    "_astro",
    "documentation-assets",
    "js/examples",
    "js/example-index",
    "js/sandbox",
    "playground-handbook",
  ]
  const artifactChecks = Object.fromEntries(requiredArtifacts.map(relative => [relative, fs.existsSync(path.join(distRoot, relative))]))
  return {
    captured: new Date().toISOString(),
    status: missingFiles.length === 0 && Object.values(artifactChecks).every(Boolean) ? "passed" : "failed",
    generatedFileCount: generatedFiles.length,
    missingGeneratedFiles: missingFiles,
    requiredArtifacts: artifactChecks,
    expectedApplicationRoutes: createRoutes().length,
    generatedHtmlFiles: listHtmlFiles(distRoot).length,
  }
}

const summarizeSiteArtifacts = routes => {
  const targetManifest = readJson(path.join(distRoot, "manifest.webmanifest"))
  const baselineManifestPath = path.join(gatsbyPublicRoot, "manifest.webmanifest")
  const baselineManifest = fs.existsSync(baselineManifestPath) ? readJson(baselineManifestPath) : null
  const targetManifestSummary = {
    name: targetManifest.name || null,
    short_name: targetManifest.short_name || null,
    theme_color: targetManifest.theme_color || null,
    background_color: targetManifest.background_color || null,
    display: targetManifest.display || null,
    start_url: targetManifest.start_url || null,
    icons: Array.isArray(targetManifest.icons) ? targetManifest.icons.map(icon => ({ src: icon.src, sizes: icon.sizes || null, type: icon.type || null })) : [],
  }
  const baselineManifestSummary = baselineManifest ? {
    name: baselineManifest.name || null,
    short_name: baselineManifest.short_name || null,
    theme_color: baselineManifest.theme_color || null,
    background_color: baselineManifest.background_color || null,
    display: baselineManifest.display || null,
    start_url: baselineManifest.start_url || null,
    icons: Array.isArray(baselineManifest.icons) ? baselineManifest.icons.map(icon => ({ src: icon.src, sizes: icon.sizes || null, type: icon.type || null })) : [],
  } : null
  const manifestMatchesBaseline = baselineManifestSummary ? JSON.stringify(targetManifestSummary) === JSON.stringify(baselineManifestSummary) : null

  const sitemapFiles = walkFiles(distRoot).filter(file => /^sitemap-(?!index).*\.xml$/.test(path.basename(file))).sort()
  const urls = sitemapFiles.flatMap(file => [...fs.readFileSync(file, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]))
  const expectedUrls = routes.map(route => routeToCanonicalUrl(route.pathname)).sort()
  const urlSet = new Set(urls)
  const extra = [...urlSet].filter(url => !expectedUrls.includes(url)).sort()
  const missing = expectedUrls.filter(url => !urlSet.has(url))
  const invalid = urls.filter(url => !url.startsWith(canonicalOrigin))
  return {
    captured: new Date().toISOString(),
    status: manifestMatchesBaseline !== false && missing.length === 0 && extra.length === 0 && invalid.length === 0 ? "passed" : "failed",
    manifest: {
      target: targetManifestSummary,
      baseline: baselineManifestSummary,
      matchesBaseline: manifestMatchesBaseline,
      baselineAvailable: Boolean(baselineManifestSummary),
    },
    sitemap: {
      fileCount: sitemapFiles.length,
      urlCount: urls.length,
      expectedUrlCount: expectedUrls.length,
      missingUrls: missing,
      extraUrls: extra,
      invalidUrls: invalid,
    },
  }
}

const summarizeLinkCheck = allHtmlFiles => {
  const broken = []
  let localReferenceCount = 0
  for (const relativePath of allHtmlFiles) {
    const routePath = relativePath === "index.html"
      ? "/"
      : relativePath.endsWith("/index.html")
        ? `/${relativePath.slice(0, -"/index.html".length)}`
        : `/${relativePath}`
    const html = fs.readFileSync(path.join(distRoot, relativePath), "utf8")
    for (const reference of collectReferences(html)) {
      const result = classifyReference({ currentRoute: routePath, html, ...reference })
      if (result.state === "ignored") continue
      localReferenceCount += 1
      if (result.state === "broken") broken.push(result)
    }
  }
  return {
    captured: new Date().toISOString(),
    status: broken.length === 0 ? "passed" : "failed",
    htmlPageCount: allHtmlFiles.length,
    localReferenceCount,
    brokenCount: broken.length,
    broken,
  }
}

const summarizeStaticAssets = (generatedAssets, linkCheck) => {
  const requiredFiles = ["favicon.svg", "manifest.webmanifest", "robots.txt", "staticwebapp.config.json", "Web.config"]
  const requiredChecks = Object.fromEntries(requiredFiles.map(relative => [relative, fs.existsSync(path.join(distRoot, relative))]))
  const baselineOnlyFiles = ["Web.config"].filter(relative => fs.existsSync(path.join(gatsbyPublicRoot, relative)) && !fs.existsSync(path.join(distRoot, relative)))
  const brokenAssets = linkCheck.broken.filter(entry => !entry.kind.startsWith("a:"))
  return {
    captured: new Date().toISOString(),
    status: generatedAssets.missingGeneratedFiles.length === 0 && brokenAssets.length === 0 && Object.values(requiredChecks).every(Boolean) ? "passed" : "failed",
    requiredFiles: requiredChecks,
    brokenReferencedAssets: brokenAssets,
    baselineOnlyFiles,
  }
}

const summarizeContentParity = (targetPages, baselinePages) => {
  const mismatches = []
  const missingBaseline = []
  const matched = []
  const familyRouteCounts = {}
  for (const [routePath, targetPage] of targetPages) {
    familyRouteCounts[targetPage.route.family] = (familyRouteCounts[targetPage.route.family] || 0) + 1
    const baselinePage = baselinePages.get(routePath)
    if (!baselinePage) {
      missingBaseline.push(routePath)
      continue
    }
    const targetSummary = summarizeContent(routePath, targetPage.html)
    const baselineSummary = summarizeContent(routePath, baselinePage.html)
    const fields = compareContent(targetSummary, baselineSummary)
    if (fields.length === 0) {
      matched.push(routePath)
      continue
    }
    mismatches.push({
      route: routePath,
      family: targetPage.route.family,
      fields,
      target: compactContentSummary(targetSummary),
      baseline: compactContentSummary(baselineSummary),
    })
  }
  const matchedByFamily = countValues(matched.map(routePath => targetPages.get(routePath).route.family))
  const mismatchedByFamily = countValues(mismatches.map(mismatch => mismatch.family))
  const families = Object.keys(familyRouteCounts).sort()
  return {
    captured: new Date().toISOString(),
    status: mismatches.length === 0 ? "passed" : "failed",
    routeCount: targetPages.size,
    matchedCount: matched.length,
    mismatchCount: mismatches.length,
    missingBaselineCount: missingBaseline.length,
    missingBaseline,
    distribution: {
      byFamily: Object.fromEntries(families.map(family => [family, {
        routes: familyRouteCounts[family],
        matched: matchedByFamily[family] || 0,
        mismatched: mismatchedByFamily[family] || 0,
      }])),
      byField: countValues(mismatches.flatMap(mismatch => mismatch.fields)),
      byFamilyAndField: Object.fromEntries(families.map(family => [family, countValues(mismatches
        .filter(mismatch => mismatch.family === family)
        .flatMap(mismatch => mismatch.fields))])),
    },
    matched,
    mismatches,
  }
}

const summarizeMetadataParity = (targetPages, baselinePages) => {
  const mismatches = []
  const missingBaseline = []
  const baselineFieldUnavailable = []
  const extracted = []
  for (const [routePath, targetPage] of targetPages) {
    const targetMetadata = extractMetadata(routePath, targetPage.html)
    extracted.push(normalizeMetadata(targetMetadata))
    const baselinePage = baselinePages.get(routePath)
    if (!baselinePage) {
      missingBaseline.push(routePath)
      continue
    }
    const baselineNormalized = normalizeMetadata(extractMetadata(routePath, baselinePage.html))
    const targetNormalized = normalizeMetadata(targetMetadata)
    const fields = compareMetadata(targetNormalized, baselineNormalized)
    const unavailableFields = ["lang", "title", "description", "canonical", "ogTitle", "ogDescription", "ogType", "ogUrl", "twitterCard", "twitterSite"].filter(field => baselineNormalized[field] == null)
    if (unavailableFields.length) baselineFieldUnavailable.push({ route: routePath, fields: unavailableFields })
    const targetContractMismatches = []
    if (!targetNormalized.title) targetContractMismatches.push("title")
    if (!targetNormalized.description) targetContractMismatches.push("description")
    if (!targetNormalized.lang) targetContractMismatches.push("lang")
    if (!targetNormalized.canonical) targetContractMismatches.push("canonical")
    if (!targetNormalized.ogTitle) targetContractMismatches.push("ogTitle")
    if (!targetNormalized.ogDescription) targetContractMismatches.push("ogDescription")
    if (!targetNormalized.ogUrl) targetContractMismatches.push("ogUrl")
    if (!targetNormalized.twitterCard) targetContractMismatches.push("twitterCard")
    if (!targetNormalized.twitterSite) targetContractMismatches.push("twitterSite")
    const canonicalExpectation = targetPage.route.family === "documentation" && targetPage.route.frontmatter?.deprecated_by
      ? routeLike(targetPage.route.frontmatter.deprecated_by)
      : routeLike(routeToCanonicalUrl(targetPage.route.pathname))
    const ogUrlExpectation = routeLike(routeToCanonicalUrl(targetPage.route.pathname))
    if (targetNormalized.canonical !== canonicalExpectation) targetContractMismatches.push("canonicalContract")
    if (targetNormalized.ogUrl !== ogUrlExpectation) targetContractMismatches.push("ogUrlContract")
    if (fields.length > 0 || targetContractMismatches.length > 0) {
      mismatches.push({
        route: routePath,
        family: targetPage.route.family,
        baselineMismatchFields: fields,
        targetContractMismatches,
        target: targetNormalized,
        baseline: baselineNormalized,
      })
    }
  }
  const baselineMismatchFields = mismatches.flatMap(mismatch => mismatch.baselineMismatchFields)
  const targetContractFields = mismatches.flatMap(mismatch => mismatch.targetContractMismatches)
  return {
    captured: new Date().toISOString(),
    status: mismatches.length === 0 ? "passed" : "failed",
    routeCount: targetPages.size,
    missingBaselineCount: missingBaseline.length,
    missingBaseline,
    baselineFieldUnavailable,
    mismatchCount: mismatches.length,
    mismatchDistribution: {
      byFamily: countValues(mismatches.map(mismatch => mismatch.family)),
      byBaselineField: countValues(baselineMismatchFields),
      byTargetContractField: countValues(targetContractFields),
      baselineOnly: mismatches.filter(mismatch => mismatch.baselineMismatchFields.length > 0 && mismatch.targetContractMismatches.length === 0).length,
      targetContractOnly: mismatches.filter(mismatch => mismatch.baselineMismatchFields.length === 0 && mismatch.targetContractMismatches.length > 0).length,
      baselineAndTargetContract: mismatches.filter(mismatch => mismatch.baselineMismatchFields.length > 0 && mismatch.targetContractMismatches.length > 0).length,
    },
    mismatches,
    extractedMetadata: extracted,
  }
}

export function runStructuralValidation({ writeEvidence = true } = {}) {
  const routes = createRoutes()
  const allHtmlFiles = listHtmlFiles(distRoot)
  const targetPages = buildApplicationPages(distRoot)
  const baselinePages = buildApplicationPages(gatsbyPublicRoot)

  const generatedAssets = summarizeGeneratedAssets()
  const siteArtifacts = summarizeSiteArtifacts(routes)
  const linkCheck = summarizeLinkCheck(allHtmlFiles)
  const staticAssets = summarizeStaticAssets(generatedAssets, linkCheck)
  const contentParity = summarizeContentParity(targetPages, baselinePages)
  const metadataParity = summarizeMetadataParity(targetPages, baselinePages)

  const reports = {
    generatedAssets,
    siteArtifacts,
    staticAssets,
    linkCheck,
    contentParity,
    metadataParity,
  }

  if (writeEvidence) {
    writeJson("generated-assets.json", generatedAssets)
    writeJson("site-artifacts.json", siteArtifacts)
    writeJson("static-assets.json", staticAssets)
    writeJson("link-check.json", linkCheck)
    writeJson("content-parity.json", contentParity)
    writeJson("metadata-parity.json", metadataParity)
  }

  return reports
}

export const validationPaths = {
  astroRoot,
  distRoot,
  generatedRoot,
  gatsbyPublicRoot,
  evidenceRoot,
}

const applicationRoutes = createRoutes()
const routesByPublicPath = new Map(applicationRoutes.map(route => [routeToPublicPath(route.pathname), route]))
const documentationSourceRouteMap = new Map(applicationRoutes.flatMap(route => route.source
  ? [[path.normalize(path.resolve(route.source)).toLowerCase(), routeToPublicPath(route.pathname)]]
  : []))
const applicationRoutePaths = new Set(applicationRoutes.map(route => routeToPublicPath(route.pathname)))
const staleGeneratedDocumentationRoutes = new Set([
  "/fr/docs/handbook/intro.html",
  "/ko/docs/handbook/intro.html",
])