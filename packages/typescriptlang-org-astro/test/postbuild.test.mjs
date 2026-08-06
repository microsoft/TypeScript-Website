import assert from "node:assert/strict"
import fs from "node:fs"
import test from "node:test"
import { redirectDeclarations, redirectDestinationType, uniqueRedirectOutputPaths } from "../src/lib/redirects.mjs"

const dist = new URL("../dist/", import.meta.url)

test("preserves intentional html output paths", { skip: !fs.existsSync(dist) }, () => {
  assert.ok(fs.existsSync(new URL("tsconfig/allowJs.html", dist)))
  assert.equal(fs.existsSync(new URL("tsconfig/allowJs.html/index.html", dist)), false)
})

test("emits a usable 404 and no Gatsby build internals", { skip: !fs.existsSync(dist) }, () => {
  const html = fs.readFileSync(new URL("404.html", dist), "utf8")
  assert.match(html, /<h1>Page not found<\/h1>/)
  assert.match(html, /href="\/"/)
  assert.equal(fs.existsSync(new URL("_gatsby/", dist)), false)
})

test("emits every source redirect as a static fallback and an Azure permanent redirect", { skip: !fs.existsSync(dist) }, () => {
  assert.equal(redirectDeclarations.length, 23)
  assert.equal(uniqueRedirectOutputPaths.size, 22)
  assert.deepEqual(Object.fromEntries([...redirectDeclarations.reduce((counts, redirect) => counts.set(redirectDestinationType(redirect.to), (counts.get(redirectDestinationType(redirect.to)) || 0) + 1), new Map())]), {
    internal: 18, external: 1, "internal-fragment": 4,
  })

  const config = JSON.parse(fs.readFileSync(new URL("staticwebapp.config.json", dist), "utf8"))
  assert.equal(config.navigationFallback, undefined)
  assert.deepEqual(config.responseOverrides?.["404"], { rewrite: "/404.html" })
  assert.equal(config.routes.length, 23)

  for (const redirect of redirectDeclarations) {
    const pathname = redirect.from.replace(/^\//, "")
    const output = new URL(pathname.endsWith(".html") ? pathname : `${pathname}/index.html`, dist)
    const html = fs.readFileSync(output, "utf8")
    assert.match(html, /http-equiv="refresh"/i, redirect.from)
    assert.match(html, /location\.replace\(/, redirect.from)
    assert.ok(html.includes(redirect.to.replaceAll("&", "&amp;").replaceAll('"', "&quot;")), redirect.from)
    assert.deepEqual(config.routes.find(rule => rule.route === redirect.from), { route: redirect.from, redirect: redirect.to, statusCode: 301 })

    if (redirectDestinationType(redirect.to) !== "external") {
      const destination = new URL(redirect.to, "https://www.typescriptlang.org")
      const destinationPath = destination.pathname.replace(/^\//, "")
      const destinationOutput = new URL(destinationPath.endsWith(".html") ? destinationPath : `${destinationPath.replace(/\/$/, "")}/index.html`, dist)
      const destinationHtml = fs.readFileSync(destinationOutput, "utf8")
      if (destination.hash) assert.match(destinationHtml, new RegExp(`id=["']${destination.hash.slice(1)}["']`), redirect.to)
    }
  }
})

test("emits the complete application, redirect, error, and license HTML contract", { skip: !fs.existsSync(dist) }, () => {
  const walk = directory => fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const child = new URL(entry.name + (entry.isDirectory() ? "/" : ""), directory)
    return entry.isDirectory() ? walk(child) : entry.name.endsWith(".html") ? [child] : []
  })
  assert.equal(walk(dist).length, 952)
  assert.ok(fs.existsSync(new URL("License.html", dist)))
})

test("renders representative feature-family parity markup", { skip: !fs.existsSync(dist) }, () => {
  const home = fs.readFileSync(new URL("index.html", dist), "utf8")
  const docs = fs.readFileSync(new URL("docs/handbook/intro.html", dist), "utf8")
  const twoslashDocs = fs.readFileSync(new URL("docs/handbook/basic-types.html", dist), "utf8")
  const tsconfig = fs.readFileSync(new URL("tsconfig/index.html", dist), "utf8")
  const playground = fs.readFileSync(new URL("play/index.html", dist), "utf8")
  assert.match(home, /TypeScript is (?:<[^>]+>)*JavaScript with syntax for types/)
  assert.match(home, /id="top-menu"/)
  assert.match(home, /id="site-footer"/)
  assert.match(docs, /id="sidebar"/)
  assert.match(docs, /class="handbook-toc"/)
  assert.match(docs, /class="anchor before"/)
  assert.match(twoslashDocs, /class="[^"]*twoslash/)
  assert.match(tsconfig, /Compiler Options/)
  assert.match(tsconfig, /allowJs/)
  assert.match(playground, /monaco-editor-embed/)
})

test("keeps TSConfig legacy anchor compatibility while linking quick-nav to canonical targets", { skip: !fs.existsSync(dist) }, () => {
  const tsconfig = fs.readFileSync(new URL("tsconfig/index.html", dist), "utf8")
  assert.match(tsconfig, /href="#watch-watchFile">watchFile</)
  assert.match(tsconfig, /<span id="watchFile" aria-hidden="true"><\/span><span id="watchfile" aria-hidden="true"><\/span><span id="watch-file" aria-hidden="true"><\/span><h3 id='watch-watchFile-config'>/)
  assert.match(tsconfig, /<span id="disableFilenameBasedTypeAcquisition" aria-hidden="true"><\/span><span id="disablefilenamebasedtypeacquisition" aria-hidden="true"><\/span><span id="disable-filename-based-type-acquisition" aria-hidden="true"><\/span><h3 id='type-disableFilenameBasedTypeAcquisition-config'>/)
  assert.match(tsconfig, /<span id="Project_Files_0" aria-hidden="true"><\/span><h2 id='Projects_6255'/)

  const rootDir = fs.readFileSync(new URL("tsconfig/rootDir.html", dist), "utf8")
  assert.match(rootDir, /href="#outDir"><code>outDir<\/code><\/a>/)
  assert.match(rootDir, /href="#include"><code>include<\/code><\/a>/)
})

test("all TSConfig option HTML pages are indexable and carry exact human redirects", { skip: !fs.existsSync(dist) }, () => {
  const optionFiles = fs.readdirSync(new URL("tsconfig/", dist), { withFileTypes: true })
    .filter(entry => entry.isFile() && entry.name.endsWith(".html") && entry.name !== "index.html")
    .map(entry => entry.name)
    .sort()
  assert.equal(optionFiles.length, 135)
  for (const file of optionFiles) {
    const option = file.slice(0, -".html".length)
    const html = fs.readFileSync(new URL(`tsconfig/${file}`, dist), "utf8")
    assert.match(html, new RegExp(`<h2>${option.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}<\\/h2>`), file)
    assert.match(html, /data-route-family="tsconfig-option"/, file)
    assert.match(html, new RegExp(`redirect = "/tsconfig#${option.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}"`), file)
    assert.doesNotMatch(html, /http-equiv=["']refresh/i, file)
    assert.match(html, /<html lang="en">/, file)
    assert.match(html, /<meta name="description" content="How this setting affects your build\.">/, file)
  }
})

test("rewrites stale local handbook links to equivalent live routes", { skip: !fs.existsSync(dist) }, () => {
  const koBabel = fs.readFileSync(new URL("ko/docs/handbook/babel-with-typescript.html", dist), "utf8")
  assert.match(koBabel, /href="\/tsconfig">/)

  const referenceRedirect = fs.readFileSync(new URL("reference/index.html", dist), "utf8")
  assert.match(referenceRedirect, /url=\/tsconfig/)

  const handbookBasicTypesRedirect = fs.readFileSync(new URL("handbook/basic-types.html", dist), "utf8")
  assert.match(handbookBasicTypesRedirect, /url=\/docs\/handbook\/basic-types.html/)

  const frHandbookIntro = fs.readFileSync(new URL("fr/docs/handbook/intro.html", dist), "utf8")
  assert.match(frHandbookIntro, /href="\/fr\/docs\/handbook\/2\/basic-types.html">Bases<\/a>/)
  assert.doesNotMatch(frHandbookIntro, /typescript-handbook\.(?:pdf|epub)/)
})

test("preserves legacy fragment compatibility on docs, glossary, and localized pages", { skip: !fs.existsSync(dist) }, () => {
  const modulesGuide = fs.readFileSync(new URL("docs/handbook/modules/guides/choosing-compiler-options.html", dist), "utf8")
  assert.match(modulesGuide, /<span id="im-compiling-and-running-the-outputs-in-node" aria-hidden="true"><\/span><h3 id="im-compiling-and-running-the-outputs-in-nodejs"/)

  const modulesReference = fs.readFileSync(new URL("docs/handbook/modules/reference.html", dist), "utf8")
  assert.match(modulesReference, /<span id="node16-nodenext-1" aria-hidden="true"><\/span><h3 id="node16-nodenext"/)

  const modulesTheory = fs.readFileSync(new URL("docs/handbook/modules/theory.html", dist), "utf8")
  assert.match(modulesTheory, /<span id="module-specifiers-are-not-transformed" aria-hidden="true"><\/span><h3 id="module-specifiers-are-not-transformed-by-default"/)
  assert.match(modulesTheory, /<span id="extension-searching-and-directory-index-files" aria-hidden="true"><\/span><h3 id="module-resolution-for-libraries"/)
  assert.match(modulesTheory, /href="#extension-searching-and-directory-index-files">disables extension searching<\/a>/)

  const glossary = fs.readFileSync(new URL("glossary/index.html", dist), "utf8")
  assert.match(glossary, /<span id="abstract-syntax-tree" aria-hidden="true"><\/span><h3 id='parser'/)
  assert.match(glossary, /<span id="type-literal" aria-hidden="true"><\/span><h3 id='shape'/)

  const idDecorators = fs.readFileSync(new URL("id/docs/handbook/decorators.html", dist), "utf8")
  assert.match(idDecorators, /<span id="class-decorators" aria-hidden="true"><\/span><h2 id="decorator-kelas"/)
  assert.match(idDecorators, /<span id="accessor-decorators" aria-hidden="true"><\/span><h2 id="decorator-aksesor"/)

  const ptModuleResolution = fs.readFileSync(new URL("pt/docs/handbook/module-resolution.html", dist), "utf8")
  assert.match(ptModuleResolution, /<span id="classico" aria-hidden="true"><\/span><h3 id="clássico"/)
  assert.match(ptModuleResolution, /<span id="importacoes-de-modulos-relativos-vs.-nao-relativos" aria-hidden="true"><\/span><h2 id="importações-de-módulos-relativos-vs-não-relativos"/)

  const koDecorators = fs.readFileSync(new URL("ko/docs/handbook/decorators.html", dist), "utf8")
  assert.match(koDecorators, /<span id="데코레이터-팩토리-DecoratorFactories" aria-hidden="true"><\/span><span id="데코레이터-팩토리-Decorator-Factories" aria-hidden="true"><\/span><h2 id="데코레이터-팩토리-decorator-factories"/)

  const koEnums = fs.readFileSync(new URL("ko/docs/handbook/enums.html", dist), "utf8")
  assert.match(koEnums, /<span id="런타임에서-열거형-enums-at-runtime" aria-hidden="true"><\/span><h2 id="런타임에서의-열거형-enums-at-runtime"/)
  assert.match(koEnums, /<span id="역-매핑-Reverse-mappings" aria-hidden="true"><\/span><h3 id="역-매핑-reverse-mappings"/)

  const koNamespaces = fs.readFileSync(new URL("ko/docs/handbook/namespaces.html", dist), "utf8")
  assert.match(koNamespaces, /<span id="table-of-contents" aria-hidden="true"><\/span><h1 id="첫-번째-단계-first-steps"/)

  const koReleaseNotes = fs.readFileSync(new URL("ko/docs/handbook/release-notes/typescript-3-8.html", dist), "utf8")
  assert.match(koReleaseNotes, /<span id="jsdoc-property-modifiers" aria-hidden="true"><\/span><h2 id="jsdoc-프로퍼티-지정자-jsdoc-property-modifiers"/)

  const ptJsdoc = fs.readFileSync(new URL("pt/docs/handbook/jsdoc-supported-types.html", dist), "utf8")
  assert.match(ptJsdoc, /<span id="jsdoc-property-modifiers" aria-hidden="true"><\/span><h3 id="modificadores-de-propriedades-jsdoc"/)

  const jaJsdoc = fs.readFileSync(new URL("ja/docs/handbook/jsdoc-supported-types.html", dist), "utf8")
  assert.match(jaJsdoc, /<span id="jsdoc-property-modifiers" aria-hidden="true"><\/span><h3 id="jsdocプロパティ修飾子"/)
})
