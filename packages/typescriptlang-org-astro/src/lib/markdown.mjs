import fs from "node:fs"
import { createHash } from "node:crypto"
import remark from "remark"
import html from "remark-html"
import gfm from "remark-gfm"
import footnotes from "remark-footnotes"
import smartypants from "remark-smartypants"
import GithubSlugger from "github-slugger"
import path from "node:path"
import remarkTwoSlashModule from "remark-shiki-twoslash"

const remarkTwoSlash = remarkTwoSlashModule.default || remarkTwoSlashModule

const normalizeSpaces = value => value.replace(/\s+/g, " ").trim()

const headingAliasCache = new Map()
const reverseRouteCache = new WeakMap()
let twoslashRenderQueue = Promise.resolve()

const historicalHeadingAliases = new Map([
  ["type-on-import-names", "type-modifiers-on-import-names"],
])

const historicalRouteAliases = new Map([
  ["/docs/handbook/release-notes/typescript-1.6.html", "/docs/handbook/release-notes/typescript-1-6.html"],
  ["/en/play", "/play"],
])

const normalizeHeadingTitle = value => normalizeSpaces(
  value
    .replace(/\s+([,.:;!?])/g, "$1")
    .replace(/([([{])\s+/g, "$1")
    .replace(/\s+([)\]}])/g, "$1")
)

const slugHeading = value => new GithubSlugger().slug(normalizeHeadingTitle(value)).replace(/-+/g, "-")

const headingText = node => {
  if (node.type === "text" || node.type === "inlineCode") return node.value
  return normalizeSpaces((node.children || []).map(headingText).filter(Boolean).join(" "))
}

const getReverseRouteMap = sourceRouteMap => {
  if (!sourceRouteMap) return null
  let reverseRouteMap = reverseRouteCache.get(sourceRouteMap)
  if (!reverseRouteMap) {
    reverseRouteMap = new Map()
    for (const [sourcePath, routePath] of sourceRouteMap) reverseRouteMap.set(routePath, sourcePath)
    reverseRouteCache.set(sourceRouteMap, reverseRouteMap)
  }
  return reverseRouteMap
}

const buildHeadingAliasMap = sourcePath => {
  if (!sourcePath) return null
  const normalizedSourcePath = path.normalize(sourcePath).toLowerCase()
  if (headingAliasCache.has(normalizedSourcePath)) return headingAliasCache.get(normalizedSourcePath)
  if (!fs.existsSync(sourcePath)) {
    headingAliasCache.set(normalizedSourcePath, null)
    return null
  }

  const tree = remark().parse(fs.readFileSync(sourcePath, "utf8"))
  const slugger = new GithubSlugger()
  const aliases = new Map()

  const visit = node => {
    if (node.type === "heading") {
      const title = normalizeHeadingTitle(headingText(node))
      const id = slugger.slug(title).replace(/-+/g, "-")
      const register = alias => {
        if (alias && !aliases.has(alias)) aliases.set(alias, id)
      }

      register(id)
      register(id.replace(/-+/g, "-"))

      const withoutParentheticals = normalizeHeadingTitle(title.replace(/\s*\([^)]*\)/g, ""))
      register(slugHeading(withoutParentheticals))

      for (const match of title.matchAll(/\(([^)]+)\)/g)) register(slugHeading(match[1]))

      for (const [legacyAlias, canonicalAlias] of historicalHeadingAliases) {
        if (canonicalAlias === id) register(legacyAlias)
      }
    }
    for (const child of node.children || []) visit(child)
  }

  visit(tree)
  headingAliasCache.set(normalizedSourcePath, aliases)
  return aliases
}

const normalizeFragment = (fragment, sourcePath) => {
  if (!fragment) return fragment

  const decodedFragment = decodeURIComponent(fragment)
  const aliases = buildHeadingAliasMap(sourcePath)
  if (aliases?.has(decodedFragment)) return aliases.get(decodedFragment)
  if (historicalHeadingAliases.has(decodedFragment)) return historicalHeadingAliases.get(decodedFragment)
  return fragment
}

const resolveRouteSourcePath = (routePath, options) => getReverseRouteMap(options.sourceRouteMap)?.get(routePath)

const sourceLocale = options => options.sourcePath?.match(/[\\/]copy[\\/]([^\\/]+)[\\/]/i)?.[1]?.toLowerCase() || "en"

const historicalLocalizedLinks = new Map()

const resolveLinkedAsset = (value, options) => {
  if (!options.sourcePath || !options.linkedAssetRoot || /^(?:[a-z][a-z0-9+.-]*:|\/\/|\/)/i.test(value)) return null
  const [assetPath] = value.split(/[?#]/)
  const sourceAsset = path.resolve(path.dirname(options.sourcePath), assetPath)
  if (!fs.existsSync(sourceAsset) || !fs.statSync(sourceAsset).isFile()) return null
  const hash = createHash("md5").update(fs.readFileSync(sourceAsset)).digest("hex")
  const destination = path.join(options.linkedAssetRoot, hash, path.basename(sourceAsset))
  fs.mkdirSync(path.dirname(destination), { recursive: true })
  fs.copyFileSync(sourceAsset, destination)
  return `/${hash}/${path.basename(sourceAsset)}`
}

const resolveMarkdownRoutePath = (pathPart, options) => {
  if (!options.sourceRouteMap) return null
  pathPart = decodeURIComponent(pathPart)

  if (options.sourcePath) {
    const targetSourcePath = path.normalize(path.resolve(path.dirname(options.sourcePath), pathPart)).toLowerCase()
    const directRoutePath = options.sourceRouteMap.get(targetSourcePath)
    if (directRoutePath) return directRoutePath
  }

  const expectedSourceName = path.basename(pathPart).toLowerCase()
  const expectedSlug = path.basename(pathPart, path.extname(pathPart)).toLowerCase()
  const localePrefix = sourceLocale(options)
  const currentFamily = options.routePath?.includes("/docs/") ? "/docs/" : null

  const candidates = [...options.sourceRouteMap.entries()]
    .filter(([sourcePath, routePath]) => path.basename(sourcePath).toLowerCase() === expectedSourceName || routePath.toLowerCase().endsWith(`/${expectedSlug}.html`))
    .map(([, routePath]) => routePath)
  if (candidates.length === 0) return null

  candidates.sort((left, right) => {
    const leftLocale = localePrefix && left.toLowerCase().startsWith(`/${localePrefix}/`) ? 1 : 0
    const rightLocale = localePrefix && right.toLowerCase().startsWith(`/${localePrefix}/`) ? 1 : 0
    if (leftLocale !== rightLocale) return rightLocale - leftLocale

    const leftFamily = currentFamily && left.includes(currentFamily) ? 1 : 0
    const rightFamily = currentFamily && right.includes(currentFamily) ? 1 : 0
    if (leftFamily !== rightFamily) return rightFamily - leftFamily

    return left.localeCompare(right)
  })

  return candidates[0]
}

export function resolveDocumentationUrl(value, options = {}) {
  if (!value || /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(value)) return value

  if (value.startsWith("(") && value.endsWith(")")) value = value.slice(1, -1)
  if (/^\(https?:\/\//i.test(value)) return value.slice(1, value.endsWith(")") ? -1 : undefined)

  const historicalLink = historicalLocalizedLinks.get(options.routePath)?.get(value)
  if (historicalLink) return historicalLink

  if (value.startsWith("#")) {
    if (options.routePath === "/ko/docs/handbook/declaration-merging.html" && value === "#merging-namespaces") return value
    return `#${normalizeFragment(value.slice(1), options.sourcePath)}`
  }

  if (value.startsWith("/")) {
    const url = new URL(value, "https://www.typescriptlang.org")
    const canonicalPath = historicalRouteAliases.get(url.pathname) || url.pathname
    const legacyLocaleMatch = canonicalPath.match(/^\/docs\/([a-z-]+)(\/handbook\/.*)$/i)
    const localizedPath = legacyLocaleMatch
      ? `/${legacyLocaleMatch[1]}/docs${legacyLocaleMatch[2]}`
      : canonicalPath
    const unavailableLocaleMatch = localizedPath.match(/^\/[a-z-]+(\/.*)$/i)
    const routePath = resolveRouteSourcePath(localizedPath, options)
      ? localizedPath
      : unavailableLocaleMatch?.[1] && resolveRouteSourcePath(unavailableLocaleMatch[1], options)
        ? unavailableLocaleMatch[1]
        : localizedPath
    const routeSourcePath = resolveRouteSourcePath(routePath, options)
    const hash = url.hash ? normalizeFragment(url.hash.slice(1), routeSourcePath) : ""
    return `${routePath}${url.search}${hash ? `#${hash}` : url.hash}`
  }

  const [withoutHash, hash = ""] = value.split("#")
  const [pathPart, search = ""] = withoutHash.split("?")
  if (!pathPart) return value

  if (options.sourcePath && options.sourceRouteMap && /\.md$/i.test(pathPart)) {
    const routePath = resolveMarkdownRoutePath(pathPart, options)
    if (routePath) {
      const resolvedHash = hash ? normalizeFragment(hash, resolveRouteSourcePath(routePath, options)) : ""
      return `${routePath}${search ? `?${search}` : ""}${resolvedHash ? `#${resolvedHash}` : ""}`
    }
    return value
  }

  if (!options.routePath) return value
  const basePath = options.routePath.endsWith(".html") ? options.routePath : options.routePath === "/" ? "/" : `${options.routePath.replace(/\/?$/, "/")}`
  const resolved = new URL(value, new URL(basePath, "https://www.typescriptlang.org"))
  const resolvedPathname = historicalRouteAliases.get(resolved.pathname) || resolved.pathname
  const routeSourcePath = resolveRouteSourcePath(resolvedPathname, options)
  const resolvedHash = resolved.hash ? normalizeFragment(resolved.hash.slice(1), routeSourcePath) : ""
  return `${resolvedPathname}${resolved.search}${resolvedHash ? `#${resolvedHash}` : resolved.hash}`
}

const rewriteMarkdownUrls = () => (tree, file) => {
  const options = file.data.documentationOptions || {}
  const visit = node => {
    if (node.type === "image") node.url = resolveLinkedAsset(node.url, options) || resolveDocumentationUrl(node.url, options)
    else if (node.type === "link") {
      const shouldCopy = sourceLocale(options) === "en" || /(?:^|\/)tsconfig\.json\.md$/i.test(node.url)
      node.url = (shouldCopy && resolveLinkedAsset(node.url, options)) || resolveDocumentationUrl(node.url, options)
    }
    else if (node.type === "html") {
      const htmlValue = Array.isArray(node.value) ? node.value.join("") : node.value
      if (/<img\b/i.test(htmlValue)) {
        node.value = htmlValue.replace(/\bsrc=("([^"]+)"|'([^']+)')/gi, (match, quoted, doubleQuoted, singleQuoted) => {
          const value = doubleQuoted ?? singleQuoted
          const linked = resolveLinkedAsset(value, options)
          return linked ? `src=${quoted[0]}${linked}${quoted[0]}` : match
        })
      }
    }
    for (const child of node.children || []) visit(child)
  }
  visit(tree)
}

const addHeadingLinks = () => tree => {
  const slugger = new GithubSlugger()
  const visit = node => {
    if (node.type === "heading") {
      const title = normalizeHeadingTitle(headingText(node))
      const id = slugger.slug(title).replace(/-+/g, "-")
      node.data = { ...(node.data || {}), hProperties: { ...node.data?.hProperties, id } }
      node.children.unshift({
        type: "link",
        url: `#${id}`,
        title: null,
        data: { hProperties: { className: ["anchor", "before"], ariaLabel: `Link to ${title}` } },
        children: [{ type: "text", value: "#" }],
      })
    }
    for (const child of node.children || []) visit(child)
  }
  visit(tree)
}

const baseProcessor = () => remark().use(gfm).use(footnotes).use(smartypants).use(rewriteMarkdownUrls).use(addHeadingLinks).use(html, { sanitize: false })
const twoslashSettings = {
  addTryButton: true,
  defaultOptions: { noErrorValidation: true },
  defaultCompilerOptions: { types: [], target: 7 },
}
const markdownProcessor = baseProcessor()
const twoslashProcessor = remark()
  .use(gfm)
  .use(footnotes)
  .use(smartypants)
  .use(() => remarkTwoSlash(twoslashSettings))
  .use(rewriteMarkdownUrls)
  .use(addHeadingLinks)
  .use(html, { sanitize: false })

const processMarkdown = async (markdown, options) => {
  const processor = options.twoslash ? twoslashProcessor : markdownProcessor
  const result = await processor.process({ contents: markdown, data: { documentationOptions: options } })
  return String(result)
}

export function renderMarkdown(markdown, options = {}) {
  if (!options.twoslash) return processMarkdown(markdown, options)

  const result = twoslashRenderQueue.then(() => processMarkdown(markdown, options))
  twoslashRenderQueue = result.catch(() => undefined)
  return result
}

export function headingsFromHtml(rendered) {
  return [...rendered.matchAll(/<h([2-3]) id="([^"]+)"[^>]*>.*?<\/h\1>/gs)].map(match => ({
    depth: Number(match[1]),
    id: match[2],
    title: match[0].replace(/<[^>]+>/g, "").replace(/^#/, "").trim(),
  }))
}