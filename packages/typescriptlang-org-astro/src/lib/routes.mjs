import fs from "node:fs"
import path from "node:path"
import matter from "gray-matter"

const here = path.dirname(new URL(import.meta.url).pathname.replace(/^\/(.:)/, "$1"))
const workspace = path.resolve(here, "../../../..")
const packages = path.join(workspace, "packages")
const documentationNavigationPath = path.join(packages, "documentation", "output", "navigation.json")
const documentationAttributionPath = path.join(packages, "documentation", "output", "attribution.json")
const documentationNavigationArtifact = fs.existsSync(documentationNavigationPath)
  ? JSON.parse(fs.readFileSync(documentationNavigationPath, "utf8"))
  : {}
const documentationAttribution = fs.existsSync(documentationAttributionPath)
  ? JSON.parse(fs.readFileSync(documentationAttributionPath, "utf8"))
  : {}

const walk = directory =>
  fs.existsSync(directory)
    ? fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const file = path.join(directory, entry.name)
        return entry.isDirectory() ? walk(file) : [file]
      })
    : []

const slash = value => value.split(path.sep).join("/")
const slug = value =>
  value
    .toLowerCase()
    .replace(/[^\x00-\x7F]/g, "-")
    .replace(/[ /+]/g, "-")
const route = (pathname, family, options = {}) => ({ pathname: pathname.replace(/^\/+/, ""), family, ...options })
let routeCache

const playgroundDetails = (code, filename) => {
  let compiler = {}
  let inlineTitle
  if (code.startsWith("//// {")) {
    try {
      const prelude = `{${code.replace(/\r\n/g, "\n").split("//// {")[1].split("}\n")[0]}}`
      const parsed = JSON.parse(prelude)
      inlineTitle = parsed.title
      compiler = parsed.compiler || {}
    } catch {}
  }
  const query = new URLSearchParams({ ...(filename.endsWith(".js") ? { filetype: "js" } : {}), ...compiler }).toString()
  const lines = code.replace(/\r\n/g, "\n").split("\n")
  if (lines[0]?.startsWith("//// {")) lines.shift()
  while (lines[0]?.trim() === "") lines.shift()
  const prose = []
  while (lines.length && (lines[0].trim() === "" || /^\s*\/\//.test(lines[0]))) {
    prose.push(lines.shift().replace(/^\s*\/\/\s?/, ""))
  }
  while (lines[0]?.trim() === "") lines.shift()
  let state = "comment"
  const seoLines = []
  code
    .replace(/\r\n/g, "\n")
    .split("\n")
    .forEach((line, index, all) => {
      if (line.startsWith("////")) return
      const comment = line.startsWith("//")
      const empty = line.trim() === ""
      const nextComment = all[index + 1]?.startsWith("//")
      if (comment && state === "comment") return void seoLines.push(line.slice(2))
      if (empty && state === "comment") return void seoLines.push("")
      if (!comment && state === "comment") {
        state = "code"
        seoLines.push("<code><pre>", line)
        return
      }
      if (comment && state === "code") {
        if (nextComment) {
          seoLines.push("</pre></code>")
          state = "comment"
        }
        seoLines.push(line)
        return
      }
      seoLines.push(line)
    })
  return {
    inlineTitle,
    query,
    prose: prose.join("\n").trim(),
    exampleCode: lines.join("\n").trim(),
    seoHtml: seoLines.join("\n"),
  }
}

export function createRoutes() {
  if (routeCache) return routeCache
  const routes = []
  const rootPages = [
    "",
    "cheatsheets",
    "community",
    "download",
    "empty",
    "tools",
    "why-create-typescript",
    "docs",
    "docs/handbook",
    "dt/search",
  ]
  const siteLocales = ["en", "es", "fr", "id", "ja", "ko", "pl", "pt", "vo", "zh"]
  for (const locale of siteLocales)
    for (const page of rootPages) {
      routes.push(
        route([locale === "en" ? "" : locale, page].filter(Boolean).join("/"), "root", {
          locale,
          title: page || "TypeScript",
        })
      )
    }

  for (const file of walk(path.join(packages, "documentation", "copy")).filter(file => file.endsWith(".md"))) {
    const source = fs.readFileSync(file, "utf8")
    const parsed = matter(source)
    if (!parsed.data.permalink) continue
    routes.push(
      route(String(parsed.data.permalink).replace(/\/+/g, "/"), "documentation", {
        locale: slash(path.relative(path.join(packages, "documentation", "copy"), file)).split("/")[0],
        title: parsed.data.title || path.basename(file, ".md"),
        source: file,
        markdown: parsed.content,
        description: parsed.data.oneline || parsed.data.short || parsed.data.description,
        frontmatter: parsed.data,
        repoPath: slash(path.relative(packages, file)),
        modifiedTime: fs.statSync(file).mtime.toISOString(),
        attribution: documentationAttribution[slash(path.relative(path.join(packages, "documentation"), file))] || null,
      })
    )
  }

  const tsconfigOutputs = walk(path.join(packages, "tsconfig-reference", "output")).filter(file =>
    /^[a-z]{2}\.md$/.test(path.basename(file))
  )
  for (const file of tsconfigOutputs) {
    const locale = path.basename(file, ".md")
    routes.push(
      route(locale === "en" ? "tsconfig" : `${locale}/tsconfig`, "tsconfig", {
        locale,
        title: "TSConfig Reference",
        source: file,
        markdown: fs.readFileSync(file, "utf8"),
      })
    )
  }

  const glossary = path.join(packages, "glossary", "output", "en.md")
  routes.push(
    route("glossary", "glossary", {
      locale: "en",
      title: "TypeScript Glossary",
      source: glossary,
      markdown: fs.existsSync(glossary) ? fs.readFileSync(glossary, "utf8") : "",
    })
  )

  const playgroundLocales = walk(path.join(packages, "playground-examples", "generated"))
    .filter(file => file.endsWith(".json"))
    .map(file => path.basename(file, ".json"))
    .sort()
  for (const locale of playgroundLocales)
    routes.push(
      route(locale === "en" ? "play" : `${locale}/play`, "playground", { locale, title: "TypeScript Playground" })
    )

  const examplesRoot = path.join(packages, "playground-examples", "copy")
  for (const file of walk(examplesRoot).filter(file => /\.(js|ts)$/.test(file))) {
    const relative = slash(path.relative(examplesRoot, file))
    const [locale, ...parts] = relative.split("/")
    const postLocale = parts.map(slug).join("/")
    const code = fs.readFileSync(file, "utf8")
    const details = playgroundDetails(code, file)
    const id = path
      .basename(file)
      .replace(/\.(js|ts)x?$/, "")
      .toLowerCase()
      .replace(/[^\x00-\x7F]/g, "-")
      .replace(/[ /+]/g, "-")
    routes.push(
      route(`${locale === "en" ? "" : `${locale}/`}play/${postLocale}.html`, "playground-example", {
        locale,
        title: details.inlineTitle || path.basename(file).replace(/\.(js|ts)x?$/, ""),
        source: file,
        code,
        prose: details.prose,
        exampleCode: details.exampleCode,
        seoHtml: details.seoHtml,
        redirect: `/${locale === "en" ? "" : `${locale}/`}play/?${details.query}#example/${id}`,
      })
    )
  }

  const optionsRoot = path.join(packages, "tsconfig-reference", "copy", "en", "options")
  for (const file of walk(optionsRoot).filter(file => file.endsWith(".md"))) {
    const name = path.basename(file, ".md")
    const parsed = matter(fs.readFileSync(file, "utf8"))
    routes.push(
      route(`tsconfig/${name}.html`, "tsconfig-option", {
        locale: "en",
        title: name,
        source: file,
        markdown: parsed.content,
        frontmatter: parsed.data,
        redirect: `/tsconfig#${name}`,
      })
    )
  }

  const handbookRoot = path.join(packages, "playground-handbook", "copy")
  for (const file of walk(handbookRoot).filter(file => file.endsWith(".md"))) {
    routes.push(
      route(`_playground-handbook/${slug(path.basename(file, ".md"))}.html`, "playground-handbook", {
        locale: "en",
        title: path.basename(file, ".md"),
        source: file,
        markdown: fs.readFileSync(file, "utf8"),
      })
    )
  }

  for (const pathname of [
    "branding",
    "dev/bug-workbench",
    "dev/playground-plugins",
    "dev/sandbox",
    "dev/twoslash",
    "dev/typescript-vfs",
  ])
    routes.push(route(pathname, "developer", { locale: "en", title: pathname.split("/").at(-1) }))

  const unique = new Map(routes.map(item => [item.pathname, item]))
  routeCache = [...unique.values()].sort((a, b) => a.pathname.localeCompare(b.pathname))
  return routeCache
}

const getDocumentationNavForLanguage = locale =>
  documentationNavigationArtifact[locale] || documentationNavigationArtifact.en || []

const findInNav = (item, predicate) => {
  if (Array.isArray(item)) {
    for (const entry of item) {
      const found = findInNav(entry, predicate)
      if (found) return found
    }
    return undefined
  }

  if (predicate(item)) return item
  if (!item.items) return undefined
  for (const entry of item.items) {
    const found = findInNav(entry, predicate)
    if (found) return found
  }
  return undefined
}

const normalizePathname = pathname => (pathname.startsWith("/") ? pathname : `/${pathname}`)

const toDocumentationNavItems = (items, pathname) =>
  items
    .map(item => ({
      title: item.title,
      pathname: item.permalink,
      current: item.permalink === normalizePathname(pathname),
      items: item.items ? toDocumentationNavItems(item.items, pathname) : undefined,
    }))
    .filter(item => item.pathname || item.items?.length)

export function findDocumentationPageId(locale, pathname) {
  const current = findInNav(
    getDocumentationNavForLanguage(locale),
    item => item.permalink === normalizePathname(pathname)
  )
  return current?.id
}

export function documentationNavigation(_routes, locale, pathname) {
  return getDocumentationNavForLanguage(locale).map(group => ({
    title: group.title,
    items: toDocumentationNavItems(group.items || [], pathname),
  }))
}

export function getDocumentationPrevNext(locale, pathname) {
  const navs = getDocumentationNavForLanguage(locale)
  const currentId = findDocumentationPageId(locale, pathname)
  if (!currentId) return { previous: undefined, next: undefined }

  const section = findInNav(
    navs,
    item => item && !!item.items && !!item.items.find(subItem => subItem.id === currentId)
  )
  if (!section || !section.chronological || !section.items) return { previous: undefined, next: undefined }

  const currentIndex = section.items.findIndex(item => item.id === currentId)
  const previousItem = section.items[currentIndex - 1]
  const nextItem = section.items[currentIndex + 1]

  return {
    previous: previousItem?.permalink
      ? {
          pathname: previousItem.permalink.replace(/^\//, ""),
          title: previousItem.title,
          description: previousItem.oneline,
        }
      : undefined,
    next:
      nextItem?.items?.[0]?.permalink || nextItem?.permalink
        ? {
            pathname: (nextItem.items?.[0]?.permalink || nextItem.permalink).replace(/^\//, ""),
            title: nextItem.title,
            description: nextItem.oneline,
          }
        : undefined,
  }
}

export const expectedCounts = {
  root: 100,
  glossary: 1,
  "tsconfig-option": 135,
  "playground-handbook": 14,
  developer: 6,
}

export const minimumDocumentationCount = 131
export const minimumTSConfigCount = 1
export const minimumPlaygroundCount = 1
export const minimumPlaygroundExampleCount = 85
