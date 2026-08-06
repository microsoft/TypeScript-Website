import { createHash } from "node:crypto"
import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import ts from "typescript"

const scriptRoot = path.dirname(fileURLToPath(import.meta.url))
const migrationRoot = path.resolve(scriptRoot, "..")
const sourceRoot = path.resolve(migrationRoot, "../..")
const packagesRoot = path.resolve(sourceRoot, "..")
const publicRoot = path.join(sourceRoot, "public")
const evidenceRoot = path.join(migrationRoot, "evidence")
const canonicalOrigin = "https://www.typescriptlang.org"

const slash = value => value.split(path.sep).join("/")
const uniqueSorted = values => [...new Set(values)].sort((left, right) => left.localeCompare(right))
const sha256 = value => createHash("sha256").update(value).digest("hex")
const read = file => fs.readFileSync(file, "utf8")
const exists = file => fs.existsSync(file)
const relativeToSource = file => slash(path.relative(sourceRoot, file))
const relativeToPackages = file => slash(path.relative(packagesRoot, file))

const walkFiles = root => !exists(root) ? [] : fs.readdirSync(root, { withFileTypes: true }).flatMap(entry => {
  const child = path.join(root, entry.name)
  return entry.isDirectory() ? walkFiles(child) : [child]
})

const normalizeRoute = value => {
  const route = `/${String(value).replaceAll("\\", "/")}`.replace(/\/+/g, "/")
  if (route === "/") return route
  return route.endsWith(".html") ? route : route.replace(/\/$/, "")
}

const routeFromHtml = relative => {
  const normalized = slash(relative)
  if (normalized === "index.html") return "/"
  if (normalized.endsWith("/index.html")) return normalizeRoute(normalized.slice(0, -"/index.html".length))
  return normalizeRoute(normalized)
}

const routeToHtml = route => route === "/"
  ? "index.html"
  : route.endsWith(".html") ? route.slice(1) : `${route.slice(1)}/index.html`

const countBy = (values, key) => Object.fromEntries([...new Set(values.map(key))]
  .sort((left, right) => left.localeCompare(right))
  .map(name => [name, values.filter(value => key(value) === name).length]))

const extensionSummary = files => Object.fromEntries(Object.entries(countBy(files, file => path.extname(file).toLowerCase() || "[none]"))
  .sort(([left], [right]) => left.localeCompare(right)))

const parseFrontmatter = file => {
  const text = read(file).replace(/^\uFEFF/, "")
  const match = text.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/)
  if (!match) return {}
  const result = {}
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][\w-]*):\s*(.*?)\s*$/)
    if (!field) continue
    result[field[1]] = field[2].replace(/^(?:"([\s\S]*)"|'([\s\S]*)')$/, (_, double, single) => double ?? single)
  }
  return result
}

const localeFromRoute = route => route.match(/^\/([a-z]{2})(?:\/|$)/)?.[1] || "en"
const records = []
const addRoute = (family, pathname, source, details = {}) => records.push({
  route: normalizeRoute(pathname),
  family,
  locale: details.locale || localeFromRoute(normalizeRoute(pathname)),
  declaration: relativeToPackages(source),
  ...details,
})

// Gatsby filesystem pages.
const pagesRoot = path.join(sourceRoot, "src", "pages")
for (const file of walkFiles(pagesRoot).filter(file => /\.[jt]sx?$/.test(file)).sort()) {
  let route = slash(path.relative(pagesRoot, file)).replace(/\.[^.]+$/, "").replace(/\/(?:index)$/, "")
  addRoute("filesystem", route, file)
}

// Ten template declarations expanded over the ten site-copy locales.
const templatesRoot = path.join(sourceRoot, "src", "templates", "pages")
const siteCopyRoot = path.join(sourceRoot, "src", "copy")
const siteCopyLocales = fs.readdirSync(siteCopyRoot, { withFileTypes: true }).filter(entry => entry.isDirectory()).map(entry => entry.name).sort()
for (const file of walkFiles(templatesRoot).filter(file => file.endsWith(".tsx") && !file.includes(`${path.sep}dev${path.sep}`)).sort()) {
  let templateRoute = slash(path.relative(templatesRoot, file)).replace(/\.tsx$/, "").replace(/(?:^|\/)index$/, "")
  for (const locale of siteCopyLocales) addRoute("localized-root", locale === "en" ? templateRoute : `${locale}/${templateRoute}`, file, { locale, template: normalizeRoute(templateRoute) })
}

// Documentation routes are declared by Markdown frontmatter, exactly as Gatsby's GraphQL generator consumes them.
const documentationRoot = path.join(packagesRoot, "documentation", "copy")
for (const file of walkFiles(documentationRoot).filter(file => file.endsWith(".md")).sort()) {
  const { permalink } = parseFrontmatter(file)
  if (permalink) addRoute("documentation", permalink, file)
}

// Generated TSConfig root inputs.
const tsconfigOutputRoot = path.join(packagesRoot, "tsconfig-reference", "output")
for (const file of walkFiles(tsconfigOutputRoot).filter(file => file.endsWith(".md")).sort()) {
  const locale = path.basename(file, ".md")
  if (locale.length === 2 && !locale.includes("-")) addRoute("tsconfig-root", locale === "en" ? "/tsconfig" : `/${locale}/tsconfig`, file, { locale })
}

// The current Gatsby generator emits only the generated English glossary input.
const glossaryOutputRoot = path.join(packagesRoot, "glossary", "output")
for (const file of walkFiles(glossaryOutputRoot).filter(file => file.endsWith(".md")).sort()) {
  const locale = path.basename(file, ".md")
  addRoute("glossary", locale === "en" ? "/glossary" : `/${locale}/glossary`, file, { locale })
}

// Playground roots are declared by generated locale TOCs.
const playgroundGeneratedRoot = path.join(packagesRoot, "playground-examples", "generated")
for (const file of walkFiles(playgroundGeneratedRoot).filter(file => file.endsWith(".json")).sort()) {
  const locale = path.basename(file, ".json")
  addRoute("playground-root", locale === "en" ? "/play" : `/${locale}/play`, file, { locale })
}

const idize = value => value.toLowerCase().replace(/[^\x00-\x7F]/g, "-").replace(/ |\/|\+/g, "-")
const playgroundCopyRoot = path.join(packagesRoot, "playground-examples", "copy")
for (const file of walkFiles(playgroundCopyRoot).filter(file => /\.(?:js|ts)$/.test(file)).sort()) {
  const relative = slash(path.relative(playgroundCopyRoot, file))
  const [locale, ...parts] = relative.split("/")
  const seoPath = parts.map(idize).join("/")
  addRoute("playground-example", `${locale === "en" ? "" : `/${locale}`}/play/${seoPath}.html`, file, { locale })
}

const optionsRoot = path.join(packagesRoot, "tsconfig-reference", "copy", "en", "options")
const tsconfigOptionInputs = new Map()
for (const file of walkFiles(optionsRoot).filter(file => file.endsWith(".md")).sort()) {
  const route = `/tsconfig/${path.basename(file, ".md")}.html`
  const inputs = tsconfigOptionInputs.get(route) || []
  inputs.push(file)
  tsconfigOptionInputs.set(route, inputs)
}
for (const [route, inputs] of tsconfigOptionInputs) {
  addRoute("tsconfig-option", route, inputs[0], {
    locale: "en",
    declarationInputs: inputs.map(relativeToPackages),
    createPageInputCount: inputs.length,
  })
}
const tsconfigOptionInputCollisions = [...tsconfigOptionInputs]
  .filter(([, inputs]) => inputs.length > 1)
  .map(([route, inputs]) => ({ route, declarations: inputs.map(relativeToPackages) }))

const playgroundHandbookRoot = path.join(packagesRoot, "playground-handbook", "copy")
for (const file of walkFiles(playgroundHandbookRoot).filter(file => file.endsWith(".md")).sort()) {
  addRoute("playground-handbook", `/_playground-handbook/${idize(path.basename(file, ".md"))}.html`, file, { locale: "en" })
}

records.sort((left, right) => left.route.localeCompare(right.route) || left.family.localeCompare(right.family))
const duplicateRoutes = Object.entries(countBy(records, record => record.route)).filter(([, count]) => count > 1).map(([route, count]) => ({ route, count }))
const expectedFamilyCounts = {
  "filesystem": 6,
  "localized-root": 100,
  "documentation": 283,
  "tsconfig-root": 10,
  "glossary": 1,
  "playground-root": 10,
  "playground-example": 361,
  "tsconfig-option": 135,
  "playground-handbook": 14,
}
const actualFamilyCounts = countBy(records, record => record.family)

// Parse the exact object literals passed to setupRedirects without importing Gatsby or executing source code.
const redirectsFile = path.join(sourceRoot, "src", "redirects", "setupRedirects.ts")
const redirectSource = read(redirectsFile)
const redirectAst = ts.createSourceFile(redirectsFile, redirectSource, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS)
const redirectObjects = new Map()
for (const statement of redirectAst.statements) {
  if (!ts.isVariableStatement(statement)) continue
  for (const declaration of statement.declarationList.declarations) {
    if (ts.isIdentifier(declaration.name) && declaration.initializer && ts.isObjectLiteralExpression(declaration.initializer)) redirectObjects.set(declaration.name.text, declaration.initializer)
  }
}
const redirects = []
const readRedirectObject = (object, group) => {
  for (const property of object.properties) {
    if (!ts.isPropertyAssignment(property)) continue
    const from = ts.isStringLiteral(property.name) ? property.name.text : property.name.getText(redirectAst)
    if (!ts.isStringLiteralLike(property.initializer)) throw new Error(`Non-literal redirect destination for ${from}`)
    const to = property.initializer.text
    redirects.push({
      from: normalizeRoute(from),
      declaredFrom: from,
      to,
      destinationType: /^https?:\/\//i.test(to) ? "external" : to.includes("#") ? "internal-fragment" : "internal",
      group,
      isPermanent: true,
      redirectInBrowser: true,
      declaration: relativeToPackages(redirectsFile),
    })
  }
}
const visitRedirectCalls = node => {
  if (ts.isCallExpression(node) && ts.isIdentifier(node.expression) && node.expression.text === "addRedirects") {
    const argument = node.arguments[0]
    if (ts.isIdentifier(argument) && redirectObjects.has(argument.text)) readRedirectObject(redirectObjects.get(argument.text), argument.text)
    else if (argument && ts.isObjectLiteralExpression(argument)) readRedirectObject(argument, "currentHandbookAliases")
  }
  ts.forEachChild(node, visitRedirectCalls)
}
visitRedirectCalls(redirectAst)
redirects.sort((left, right) => left.from.localeCompare(right.from) || left.declaredFrom.localeCompare(right.declaredFrom))
const redirectsByCaseInsensitivePath = Object.values(Object.groupBy(redirects, redirect => redirect.from.toLowerCase())).map(group => ({
  outputPathKey: group[0].from.toLowerCase(),
  declarations: group.map(redirect => redirect.declaredFrom).sort(),
  destinations: uniqueSorted(group.map(redirect => redirect.to)),
}))
redirectsByCaseInsensitivePath.sort((left, right) => left.outputPathKey.localeCompare(right.outputPathKey))
const redirectCollisions = redirectsByCaseInsensitivePath.filter(group => group.declarations.length > 1)

if (!exists(publicRoot)) throw new Error(`Gatsby public output is unavailable at ${publicRoot}`)
const publicFiles = walkFiles(publicRoot).sort()
const htmlFiles = publicFiles.filter(file => file.endsWith(".html"))
const outputHtml = htmlFiles.map(file => ({ relativePath: slash(path.relative(publicRoot, file)), route: routeFromHtml(path.relative(publicRoot, file)) }))
const applicationRoutes = new Set(records.map(record => record.route))
const redirectPathKeys = new Set(redirectsByCaseInsensitivePath.map(group => group.outputPathKey))
const outputApplication = outputHtml.filter(item => applicationRoutes.has(item.route))
const outputRedirects = outputHtml.filter(item => redirectPathKeys.has(item.route.toLowerCase()) && !applicationRoutes.has(item.route))
const outputStaticHtml = outputHtml.filter(item => item.route === "/License.html")
const outputInternals = outputHtml.filter(item => item.route.startsWith("/_gatsby/slices/"))
const classifiedHtmlPaths = new Set([...outputApplication, ...outputRedirects, ...outputStaticHtml, ...outputInternals].map(item => item.relativePath))
const unclassifiedHtml = outputHtml.filter(item => !classifiedHtmlPaths.has(item.relativePath))
const outputApplicationSet = new Set(outputApplication.map(item => item.route))
const missingApplicationRoutes = records.filter(record => !outputApplicationSet.has(record.route)).map(record => record.route)
const extraApplicationLikeRoutes = unclassifiedHtml.map(item => item.route)

const pageDataFiles = publicFiles.filter(file => path.basename(file) === "page-data.json" && slash(path.relative(publicRoot, file)).startsWith("page-data/"))
const pageDataRoutes = pageDataFiles.map(file => {
  const relative = slash(path.relative(path.join(publicRoot, "page-data"), path.dirname(file)))
  return relative === "" || relative === "." || relative === "index" ? "/" : routeFromHtml(`${relative}/index.html`)
})
const pageDataSet = new Set(pageDataRoutes)
const pageDataMissingApplicationRoutes = records.filter(record => !pageDataSet.has(record.route)).map(record => record.route)
const pageDataExtraRoutes = uniqueSorted(pageDataRoutes.filter(route => !applicationRoutes.has(route)))

const parseAttributes = tag => {
  const attributes = {}
  for (const match of tag.matchAll(/([A-Za-z_:][-A-Za-z0-9_:.]*)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)) attributes[match[1].toLowerCase()] = match[2] ?? match[3] ?? match[4] ?? ""
  return attributes
}
const findTags = (html, tagName) => [...html.matchAll(new RegExp(`<${tagName}\\b[^>]*>`, "gi"))].map(match => parseAttributes(match[0]))
const findAttribute = (html, tagName, predicate, name) => findTags(html, tagName).find(predicate)?.[name] || null
const decodeEntities = value => value?.replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code))).replace(/&#x([\da-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16))).replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&") ?? null
const metadata = []
const unavailableMetadata = []
for (const record of records) {
  const htmlRelativePath = routeToHtml(record.route)
  const htmlPath = path.join(publicRoot, htmlRelativePath)
  if (!exists(htmlPath)) {
    unavailableMetadata.push({ route: record.route, reason: "application HTML absent from current Gatsby public output" })
    continue
  }
  const html = read(htmlPath)
  const htmlAttributes = parseAttributes(html.match(/<html\b[^>]*>/i)?.[0] || "<html>")
  const title = decodeEntities(html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1]?.replace(/\s+/g, " ").trim() || null)
  metadata.push({
    route: record.route,
    family: record.family,
    locale: record.locale,
    output: htmlRelativePath,
    outputSha256: sha256(html),
    lang: htmlAttributes.lang || null,
    title,
    description: decodeEntities(findAttribute(html, "meta", attrs => attrs.name === "description", "content")),
    canonical: findAttribute(html, "link", attrs => attrs.rel === "canonical", "href"),
    manifest: findAttribute(html, "link", attrs => attrs.rel === "manifest", "href"),
    themeColor: findAttribute(html, "meta", attrs => attrs.name === "theme-color", "content"),
    openGraph: {
      title: decodeEntities(findAttribute(html, "meta", attrs => attrs.property === "og:title", "content")),
      description: decodeEntities(findAttribute(html, "meta", attrs => attrs.property === "og:description", "content")),
      type: findAttribute(html, "meta", attrs => attrs.property === "og:type", "content"),
      url: findAttribute(html, "meta", attrs => attrs.property === "og:url", "content"),
      siteName: findAttribute(html, "meta", attrs => attrs.property === "og:site_name", "content"),
    },
    twitter: {
      card: findAttribute(html, "meta", attrs => attrs.name === "twitter:card" || attrs.property === "twitter:card", "content"),
      site: findAttribute(html, "meta", attrs => attrs.name === "twitter:site" || attrs.property === "twitter:site", "content"),
    },
  })
}

const staticRoot = path.join(sourceRoot, "static")
const staticFiles = walkFiles(staticRoot).sort()
const staticRelative = staticFiles.map(file => slash(path.relative(staticRoot, file)))
const missingStaticFiles = staticRelative.filter(relative => !exists(path.join(publicRoot, relative)))
const nonHtmlOutputFiles = publicFiles.filter(file => !file.endsWith(".html"))
const outputAssetBytes = nonHtmlOutputFiles.reduce((total, file) => total + fs.statSync(file).size, 0)
const staticAssetBytes = staticFiles.reduce((total, file) => total + fs.statSync(file).size, 0)

const previouslyMissingLocalizedRoots = [
  ...["es", "fa", "fr", "id", "ja", "ko", "pt", "vo", "zh"].map(locale => `/${locale}/play`),
  ...["es", "fr", "id", "it", "ja", "ko", "pt", "vo", "zh"].map(locale => `/${locale}/tsconfig`),
].sort()
const inventoryDiscrepancyNow = previouslyMissingLocalizedRoots.map(route => ({ route, presentInCurrentPublic: outputApplicationSet.has(route), presentInCurrentPageData: pageDataSet.has(route) }))

const sourceRouteManifest = {
  schemaVersion: 1,
  provenance: {
    sourceFramework: "Gatsby",
    sourcePackage: "packages/typescriptlang-org",
    targetOutputUsed: false,
    declarations: [
      "packages/typescriptlang-org/src/pages",
      "packages/typescriptlang-org/src/templates/pages",
      "packages/typescriptlang-org/src/copy",
      "packages/documentation/copy",
      "packages/tsconfig-reference/output",
      "packages/glossary/output",
      "packages/playground-examples/generated",
      "packages/playground-examples/copy",
      "packages/tsconfig-reference/copy/en/options",
      "packages/playground-handbook/copy",
      "packages/typescriptlang-org/src/redirects/setupRedirects.ts",
    ],
  },
  normalization: {
    rootIndex: "index.html => /",
    nestedIndex: "<path>/index.html => /<path> with trailing slash removed for comparison",
    intentionalHtml: "non-index .html suffixes are preserved",
    duplicateSeparators: "collapsed",
    routeCase: "case-sensitive; redirect output collisions are also compared case-insensitively",
  },
  declaredApplicationRouteCount: records.length,
  expectedFamilyCounts,
  familyCounts: actualFamilyCounts,
  localeCountsByFamily: Object.fromEntries(Object.keys(expectedFamilyCounts).map(family => [family, countBy(records.filter(record => record.family === family), record => record.locale)])),
  duplicateRoutes,
  effectiveRouteInputCollisions: {
    tsconfigOption: tsconfigOptionInputCollisions,
    explanation: "Gatsby queries 137 option Markdown nodes, but createPage keys them by basename. Nested typeAcquisition/include.md and exclude.md overwrite the same two output paths, producing 135 effective unique routes.",
  },
  routes: records,
  redirects: {
    declarationCount: redirects.length,
    uniqueCaseInsensitiveOutputPathCount: redirectsByCaseInsensitivePath.length,
    destinationTypeCounts: countBy(redirects, redirect => redirect.destinationType),
    groupCounts: countBy(redirects, redirect => redirect.group),
    collisions: redirectCollisions,
    uniqueOutputPaths: redirectsByCaseInsensitivePath,
    declarations: redirects,
  },
}

const sourceOutputManifest = {
  schemaVersion: 1,
  provenance: {
    sourceFramework: "Gatsby",
    outputRoot: "packages/typescriptlang-org/public",
    targetOutputUsed: false,
  },
  summary: {
    outputFileCount: publicFiles.length,
    outputBytes: publicFiles.reduce((total, file) => total + fs.statSync(file).size, 0),
    htmlFileCount: htmlFiles.length,
    applicationHtmlCount: outputApplication.length,
    redirectHtmlCount: outputRedirects.length,
    staticHtmlCount: outputStaticHtml.length,
    internalSliceHtmlCount: outputInternals.length,
    unclassifiedHtmlCount: unclassifiedHtml.length,
    pageDataCount: pageDataFiles.length,
  },
  applicationOutput: {
    declaredCount: records.length,
    generatedCount: outputApplication.length,
    missingDeclaredRoutes: missingApplicationRoutes,
    extraApplicationLikeRoutes,
    pageDataMissingDeclaredRoutes: pageDataMissingApplicationRoutes,
    pageDataExtraRoutes,
  },
  discrepancies: {
    current: {
      missingDeclaredApplicationRoutes: missingApplicationRoutes,
      extraApplicationLikeRoutes,
      unclassifiedHtml: unclassifiedHtml,
      missingPageDataRoutes: pageDataMissingApplicationRoutes,
      extraPageDataRoutes: pageDataExtraRoutes,
    },
    inventoryRecordedBeforeLatestSourceBuild: {
      description: "Inventory recorded 902 application page-data entries and 926 HTML files, missing these 18 localized roots. The current retained Gatsby public output is re-evaluated here rather than preserving that stale count as current fact.",
      routeChecks: inventoryDiscrepancyNow,
      resolvedInCurrentPublic: inventoryDiscrepancyNow.every(check => check.presentInCurrentPublic && check.presentInCurrentPageData),
    },
  },
  htmlClassification: {
    application: outputApplication,
    redirects: outputRedirects,
    static: outputStaticHtml,
    gatsbyInternals: outputInternals,
    unclassified: unclassifiedHtml,
  },
  redirects: {
    declaredCount: redirects.length,
    uniqueCaseInsensitiveOutputPathCount: redirectsByCaseInsensitivePath.length,
    emittedUniqueRedirectHtmlCount: outputRedirects.length,
    collisionCount: redirectCollisions.length,
    collisions: redirectCollisions,
  },
  assets: {
    outputNonHtmlFileCount: nonHtmlOutputFiles.length,
    outputNonHtmlBytes: outputAssetBytes,
    outputNonHtmlExtensions: extensionSummary(nonHtmlOutputFiles),
    sourceStaticFileCount: staticFiles.length,
    sourceStaticBytes: staticAssetBytes,
    sourceStaticExtensions: extensionSummary(staticFiles),
    staticFilesPresentInOutputCount: staticRelative.length - missingStaticFiles.length,
    missingStaticFiles,
  },
}

const sourceMetadata = {
  schemaVersion: 1,
  provenance: {
    sourceFramework: "Gatsby",
    outputRoot: "packages/typescriptlang-org/public",
    targetOutputUsed: false,
    extraction: "Metadata is parsed only from currently available Gatsby application HTML selected by source-declared routes.",
    canonicalOrigin,
  },
  declaredApplicationRouteCount: records.length,
  availablePageMetadataCount: metadata.length,
  unavailablePageMetadataCount: unavailableMetadata.length,
  fieldAvailability: {
    lang: metadata.filter(item => item.lang).length,
    title: metadata.filter(item => item.title).length,
    description: metadata.filter(item => item.description).length,
    canonical: metadata.filter(item => item.canonical).length,
    manifest: metadata.filter(item => item.manifest).length,
    themeColor: metadata.filter(item => item.themeColor).length,
    openGraphTitle: metadata.filter(item => item.openGraph.title).length,
    openGraphDescription: metadata.filter(item => item.openGraph.description).length,
    openGraphType: metadata.filter(item => item.openGraph.type).length,
    openGraphUrl: metadata.filter(item => item.openGraph.url).length,
    twitterCard: metadata.filter(item => item.twitter.card).length,
    twitterSite: metadata.filter(item => item.twitter.site).length,
  },
  unavailable: unavailableMetadata,
  pages: metadata,
}

const failures = []
if (records.length !== 920) failures.push(`declared route count ${records.length} != 920`)
if (Object.entries(expectedFamilyCounts).some(([family, count]) => actualFamilyCounts[family] !== count) || Object.keys(actualFamilyCounts).length !== Object.keys(expectedFamilyCounts).length) failures.push(`family counts ${JSON.stringify(actualFamilyCounts)} != ${JSON.stringify(expectedFamilyCounts)}`)
if (duplicateRoutes.length) failures.push(`${duplicateRoutes.length} duplicate application routes`)
if (redirects.length !== 23) failures.push(`redirect declaration count ${redirects.length} != 23`)
if (redirectsByCaseInsensitivePath.length !== 22) failures.push(`unique redirect output path count ${redirectsByCaseInsensitivePath.length} != 22`)
if (outputApplication.length + missingApplicationRoutes.length !== records.length) failures.push("application output reconciliation failed")
if (htmlFiles.length !== outputApplication.length + outputRedirects.length + outputStaticHtml.length + outputInternals.length + unclassifiedHtml.length) failures.push("HTML classification reconciliation failed")
if (metadata.length + unavailableMetadata.length !== records.length) failures.push("metadata reconciliation failed")
if (missingStaticFiles.length) failures.push(`${missingStaticFiles.length} source static files absent from Gatsby public`)
if (failures.length) throw new Error(`B04 manifest validation failed:\n- ${failures.join("\n- ")}`)

fs.mkdirSync(evidenceRoot, { recursive: true })
for (const [name, value] of [["source-route-manifest.json", sourceRouteManifest], ["source-output-manifest.json", sourceOutputManifest], ["source-metadata.json", sourceMetadata]]) {
  fs.writeFileSync(path.join(evidenceRoot, name), `${JSON.stringify(value, null, 2)}\n`)
}

console.log(JSON.stringify({
  status: "passed",
  declaredApplicationRoutes: records.length,
  familyCounts: actualFamilyCounts,
  redirectDeclarations: redirects.length,
  uniqueRedirectOutputPaths: redirectsByCaseInsensitivePath.length,
  GatsbyPublic: sourceOutputManifest.summary,
  currentDiscrepancies: sourceOutputManifest.discrepancies.current,
  prior18RouteDiscrepancyResolved: sourceOutputManifest.discrepancies.inventoryRecordedBeforeLatestSourceBuild.resolvedInCurrentPublic,
  staticAssets: sourceOutputManifest.assets,
  metadataAvailable: metadata.length,
  evidence: ["source-route-manifest.json", "source-output-manifest.json", "source-metadata.json"],
}, null, 2))
