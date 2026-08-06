import { test, expect } from "@playwright/test"
import AxeBuilder from "@axe-core/playwright"
import fs from "node:fs"
import path from "node:path"
import pixelmatch from "pixelmatch"
import { PNG } from "pngjs"

const evidence = path.resolve("../typescriptlang-org/.tsupgrader/framework-migration/evidence")
const visualRoot = path.join(evidence, "visual")
const records = []
const accessibility = []
const playgroundInteractions = []
const viewportName = project => project.startsWith("desktop") ? "desktop-1440x900" : "mobile-412x915"
const pixelThreshold = 0.15
const maximumDifferenceRatio = 0.05
const masks = []
const axeTags = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]
const playgroundReadyText = "Welcome to the TypeScript playground"

const scenarios = [
  { id: "home", path: "/", ready: "main" },
  { id: "docs-sidebar-toc", path: "/docs/handbook/2/everyday-types.html", ready: "#handbook-content" },
  { id: "tsconfig", path: "/tsconfig", ready: '[data-route-family="tsconfig"]' },
  { id: "playground-loaded", path: "/play?strict=true#example/hello-world", ready: "#playground-app", waitFor: "#monaco-editor-embed" },
  { id: "developer-workbench", path: "/dev/playground-plugins", ready: ".developer-workbench" },
  { id: "locale-recommendation", path: "/ja/download", ready: "#language-recommendation", locale: "fr-FR" },
  { id: "search-open", path: "/docs/handbook/2/everyday-types.html", ready: "#docsearch-results", state: "search" },
  { id: "theme-font", path: "/", ready: "main", state: "theme-font" },
  { id: "redirect-destination", path: "/Tutorial", ready: "main" },
  { id: "not-found", path: "/p23-objective-missing", ready: "main" },
]
const scenarioOrder = new Map(scenarios.map((scenario, index) => [scenario.id, index]))

const observedDifferences = {
  home: "Material: Astro replaces Gatsby's composed hero/editor, version bar, feature and Get Started cards, gradual-adoption visualization, migration carousel, and repeated CTA with a compact linear article; typography, spacing, backgrounds, controls, and height differ.",
  "docs-sidebar-toc": "Material: sidebar hierarchy/spacing, content width, typography, Twoslash code/error rendering, feedback, navigation cards, attribution, footer placement, and height differ.",
  tsconfig: "Material: navigation, option cards, code/error presentation, typography, spacing, and long-page height differ; mobile code containment changes line presentation.",
  "playground-loaded": "Material: toolbar controls, editor/sidebar allocation, editor chrome, footer, URL-state presentation, and height differ.",
  "developer-workbench": "Material: Astro adds a separate workbench and uses different structure, spacing, controls, and height.",
  "locale-recommendation": "Material: localized composition, recommendation styling/positioning, typography, spacing, and responsive presentation differ.",
  "search-open": "Material: search trigger, results overlay styling/content placement, documentation shell, and responsive state differ.",
  "theme-font": "Material: dark theme is applied to a substantially different home composition; backgrounds, typography, code, controls, spacing, and height differ.",
  "redirect-destination": "Material: destination documentation uses a compact card/list presentation instead of Gatsby's composition; typography, spacing, and height differ.",
  "not-found": "Material: Astro uses a standalone composition instead of Gatsby's shell; header/footer, typography, spacing, recovery UI, width, and height differ.",
}

const stabilize = async page => {
  await page.addStyleTag({ content: "*,*::before,*::after{animation-duration:0s!important;transition-duration:0s!important;caret-color:transparent!important}html{scroll-behavior:auto!important}" })
  await page.evaluate(async () => {
    if (document.fonts?.ready) await document.fonts.ready
    await Promise.all([...document.images].map(image => image.complete ? undefined : new Promise(resolve => { image.addEventListener("load", resolve, { once: true }); image.addEventListener("error", resolve, { once: true }) })))
    await new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve)))
  })
}

const prepare = async (page, origin, scenario, isTarget, viewport) => {
  if (scenario.locale) await page.addInitScript(locale => {
    localStorage.removeItem("ts-hide-language-recommendation")
    Object.defineProperty(navigator, "language", { configurable: true, value: locale })
  }, scenario.locale)
  await page.addInitScript(() => {
    localStorage.setItem("force-color-theme", "force-light")
    window.__TS_DOCSEARCH_FIXTURE__ = [
      { title: "Everyday Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html" },
      { title: "Narrowing", url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html" },
    ]
    window.WcpConsent = { init: (_culture, _name, callback) => callback?.(null, { isConsentRequired: false }) }
  })
  await page.route("https://consentdeliveryfd.azurefd.net/**", route => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }))
  const waitUntil = scenario.id === "playground-loaded" ? "domcontentloaded" : "networkidle"
  const response = await page.goto(`${origin}${scenario.path}`, { waitUntil, timeout: 30_000 })
  if (scenario.state === "search") {
    const search = page.locator("#search-box-top")
    if (await search.count()) {
      if (!await search.isVisible()) {
        const menu = page.locator("#top-menu-toggle")
        if (await menu.isVisible()) await menu.click()
      }
      if (await search.isVisible()) await search.fill("everyday")
    }
  }
  if (scenario.state === "theme-font") {
    const theme = page.locator("#theme-select")
    const font = page.locator("#font-select")
    if (await theme.count()) await theme.selectOption("dark")
    if (await font.count()) await font.selectOption("consolas")
  }
  if (scenario.waitFor) {
    await page.locator(scenario.waitFor).waitFor({ state: "attached", timeout: 30_000 })
    if (scenario.id === "playground-loaded") {
      await page.locator(`${scenario.waitFor} .monaco-editor`).waitFor({ state: "visible", timeout: 30_000 })
      await page.locator("#monaco-editor-embed .view-line").filter({ hasText: playgroundReadyText }).waitFor({ state: "visible", timeout: 30_000 })
      await page.waitForFunction(() => Boolean(document.querySelector(".playground-plugin-tabview, #playground-plugin-tabbar")), null, { timeout: 30_000 })
      if (!viewport.startsWith("mobile")) await page.waitForFunction(() => (document.querySelector(".playground-sidebar")?.textContent?.length || 0) > 200, null, { timeout: 30_000 })
    }
  }
  await stabilize(page)
  const responsiveReady = viewport.startsWith("mobile") && (scenario.id === "locale-recommendation" || scenario.id === "search-open") ? "main" : scenario.ready
  await expect(page.locator(isTarget ? responsiveReady : "body")).toBeVisible()
  return response?.status()
}

const compare = (baselinePath, targetPath, diffPath) => {
  const baseline = PNG.sync.read(fs.readFileSync(baselinePath))
  const target = PNG.sync.read(fs.readFileSync(targetPath))
  const width = Math.max(baseline.width, target.width)
  const height = Math.max(baseline.height, target.height)
  const left = new PNG({ width, height, fill: true })
  const right = new PNG({ width, height, fill: true })
  PNG.bitblt(baseline, left, 0, 0, baseline.width, baseline.height, 0, 0)
  PNG.bitblt(target, right, 0, 0, target.width, target.height, 0, 0)
  const diff = new PNG({ width, height })
  const differentPixels = pixelmatch(left.data, right.data, diff.data, width, height, { threshold: pixelThreshold, includeAA: false })
  fs.writeFileSync(diffPath, PNG.sync.write(diff))
  return { baseline: { width: baseline.width, height: baseline.height }, target: { width: target.width, height: target.height }, canvasPixels: width * height, differentPixels, ratio: differentPixels / (width * height) }
}

const normalizeViolation = violation => ({
  id: violation.id,
  impact: violation.impact,
  description: violation.description,
  help: violation.help,
  helpUrl: violation.helpUrl,
  nodes: violation.nodes.map(node => ({ target: node.target, html: node.html, failureSummary: node.failureSummary, colorsAndContrast: node.failureSummary?.split("\n").filter(line => /foreground|background|contrast ratio/i.test(line)) || [] })),
})

const classifyAxe = (baselineResults, targetResults) => {
  const summarize = results => new Map(results.map(violation => [violation.id, normalizeViolation(violation)]))
  const baseline = summarize(baselineResults)
  const target = summarize(targetResults)
  const ids = new Set([...baseline.keys(), ...target.keys()])
  return [...ids].map(rule => {
    const source = baseline.get(rule)
    const migrated = target.get(rule)
    let classification
    if (!source) classification = "regression"
    else if (!migrated) classification = "improvement"
    else if (migrated.nodes.length > source.nodes.length) classification = "regression"
    else if (migrated.nodes.length === source.nodes.length) classification = "pre-existing-debt"
    else classification = "improvement"
    return { rule, classification, baselineCount: source?.nodes.length || 0, targetCount: migrated?.nodes.length || 0, baseline: source, target: migrated }
  })
}

const collectDiagnostics = async page => page.evaluate(() => {
  const selectors = ["body", "main", "#playground-app", ".playground-topbar", "#playground-container", "#editor-container", "#editor-toolbar", "#monaco-editor-embed", ".playground-sidebar", "#site-footer", "#top-menu"]
  const element = selector => {
    const node = document.querySelector(selector)
    if (!(node instanceof HTMLElement)) return null
    const rect = node.getBoundingClientRect()
    const style = getComputedStyle(node)
    const center = { x: Math.max(0, Math.min(innerWidth - 1, rect.left + rect.width / 2)), y: Math.max(0, Math.min(innerHeight - 1, rect.top + Math.min(rect.height, innerHeight) / 2)) }
    const hit = document.elementFromPoint(center.x, center.y)
    return { selector, tag: node.tagName, id: node.id, classes: node.className, text: node.innerText.slice(0, 500), rect: { x: rect.x, y: rect.y, top: rect.top, bottom: rect.bottom, left: rect.left, right: rect.right, width: rect.width, height: rect.height }, scroll: { width: node.scrollWidth, height: node.scrollHeight, clientWidth: node.clientWidth, clientHeight: node.clientHeight }, style: { display: style.display, position: style.position, width: style.width, height: style.height, margin: style.margin, padding: style.padding, font: style.font, color: style.color, backgroundColor: style.backgroundColor, overflow: style.overflow, zIndex: style.zIndex, pointerEvents: style.pointerEvents, visibility: style.visibility, opacity: style.opacity }, centerHit: hit ? { tag: hit.tagName, id: hit.id, classes: hit.className } : null }
  }
  const controls = [...document.querySelectorAll("#playground-app a, #playground-app button, #playground-app select, #playground-app input")].map(node => {
    const rect = node.getBoundingClientRect(); const style = getComputedStyle(node); const x = Math.max(0, Math.min(innerWidth - 1, rect.left + rect.width / 2)); const y = Math.max(0, Math.min(innerHeight - 1, rect.top + rect.height / 2)); const hit = document.elementFromPoint(x, y)
    return { tag: node.tagName, id: node.id, text: node.textContent?.trim(), label: node.getAttribute("aria-label"), rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height }, visible: rect.width > 0 && rect.height > 0 && style.visibility !== "hidden", disabled: node.disabled || node.getAttribute("aria-disabled") === "true", pointerEvents: style.pointerEvents, hit: hit ? { tag: hit.tagName, id: hit.id, classes: hit.className, containsTarget: node === hit || node.contains(hit) } : null, hasInlineHandler: Boolean(node.onclick) }
  })
  return {
    url: location.href, userAgent: navigator.userAgent, locale: navigator.language, devicePixelRatio,
    document: { clientWidth: document.documentElement.clientWidth, clientHeight: document.documentElement.clientHeight, scrollWidth: document.documentElement.scrollWidth, scrollHeight: document.documentElement.scrollHeight, bodyScrollWidth: document.body.scrollWidth, bodyScrollHeight: document.body.scrollHeight },
    dom: selectors.map(element),
    text: document.querySelector("#playground-app")?.textContent?.replace(/\s+/g, " ").trim(),
    assets: [...document.querySelectorAll("#playground-app img, #playground-app source")].map(node => ({ tag: node.tagName, src: node.currentSrc || node.src || node.srcset, complete: node.complete, naturalWidth: node.naturalWidth, naturalHeight: node.naturalHeight })),
    stylesheets: [...document.styleSheets].map(sheet => ({ href: sheet.href, disabled: sheet.disabled, rules: (() => { try { return sheet.cssRules.length } catch { return "cross-origin" } })() })),
    fonts: document.fonts ? [...document.fonts].map(font => ({ family: font.family, style: font.style, weight: font.weight, status: font.status })) : [],
    mediaQueries: ["(max-width: 620px)", "(max-width: 790px)", "(max-width: 800px)", "(max-width: 900px)", "(prefers-color-scheme: dark)", "(prefers-reduced-motion: reduce)"].map(query => ({ query, matches: matchMedia(query).matches })),
    hydration: { sandbox: Boolean(window.sandbox), editor: Boolean(window.sandbox?.editor), playground: Boolean(window.playground), monaco: Boolean(document.querySelector("#monaco-editor-embed .monaco-editor")), astroIslands: document.querySelectorAll("astro-island").length },
    overlays: [...document.querySelectorAll("body *")].map(node => { const style = getComputedStyle(node); const rect = node.getBoundingClientRect(); return { tag: node.tagName, id: node.id, classes: node.className, zIndex: style.zIndex, position: style.position, pointerEvents: style.pointerEvents, rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height } } }).filter(item => item.position === "fixed" || item.position === "sticky" || (item.zIndex !== "auto" && Number(item.zIndex) > 0)).slice(0, 100),
    controls,
  }
})

test.afterAll(() => {
  fs.mkdirSync(visualRoot, { recursive: true })
  const viewport = records[0]?.viewport || accessibility[0]?.viewport
  if (!viewport) return
  const mergeEvidence = (file, updates, key) => {
    let previous = []
    if (fs.existsSync(file)) {
      try { previous = JSON.parse(fs.readFileSync(file, "utf8")) } catch { previous = [] }
    }
    const merged = new Map(previous.map(entry => [key(entry), entry]))
    for (const entry of updates) merged.set(key(entry), entry)
    const result = [...merged.values()].sort((left, right) => (scenarioOrder.get(left.scenario) ?? 999) - (scenarioOrder.get(right.scenario) ?? 999))
    fs.writeFileSync(file, JSON.stringify(result, null, 2) + "\n")
    return result
  }
  mergeEvidence(path.join(visualRoot, `comparison-${viewport}.json`), records, entry => entry.scenario)
  mergeEvidence(path.join(visualRoot, `accessibility-${viewport}.json`), accessibility, entry => entry.scenario)
  const allRecords = fs.readdirSync(visualRoot).filter(name => /^comparison-(desktop|mobile).*\.json$/.test(name)).flatMap(name => JSON.parse(fs.readFileSync(path.join(visualRoot, name), "utf8")))
  const allAccessibility = fs.readdirSync(visualRoot).filter(name => /^accessibility-(desktop|mobile).*\.json$/.test(name)).flatMap(name => JSON.parse(fs.readFileSync(path.join(visualRoot, name), "utf8")))
  fs.writeFileSync(path.join(visualRoot, "comparison.json"), JSON.stringify({
    captured: new Date().toISOString(),
    method: `Paired full-page Chromium screenshots from retained Gatsby production build and Astro production preview; pixelmatch threshold ${pixelThreshold} with anti-aliasing excluded. Images are padded to the larger dimensions before comparison.`,
    tolerance: { pixelThreshold, maximumDifferenceRatio, antiAliasingExcluded: true, masks, acceptance: "Each pair must remain at or below the measured-difference threshold and have no material unexplained UI difference. Intentional differences require explicit user approval as approved-difference." },
    comparisons: allRecords,
  }, null, 2) + "\n")
  const serious = allAccessibility.flatMap(entry => entry.violations.filter(v => v.impact === "serious" || v.impact === "critical").map(v => ({ scenario: entry.scenario, viewport: entry.viewport, ...v })))
  const incompleteSerious = allAccessibility.flatMap(entry => entry.incomplete.filter(v => v.impact === "serious" || v.impact === "critical").map(v => ({ scenario: entry.scenario, viewport: entry.viewport, ...v })))
  fs.writeFileSync(path.join(evidence, "accessibility.json"), JSON.stringify({
    captured: new Date().toISOString(),
    engine: "axe-core via @axe-core/playwright",
    standard: ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"],
    scope: "Astro production preview; representative pages and interactive states in the P23 matrix",
    summary: { scans: allAccessibility.length, violations: allAccessibility.reduce((n, x) => n + x.violations.length, 0), seriousOrCritical: serious.length, seriousOrCriticalIncomplete: incompleteSerious.length },
    seriousOrCritical: serious,
    seriousOrCriticalIncomplete: incompleteSerious,
    results: allAccessibility,
  }, null, 2) + "\n")
  if (playgroundInteractions.length) {
    const interactionsFile = path.join(visualRoot, `playground-interactions-${viewport}.json`)
    fs.writeFileSync(interactionsFile, JSON.stringify(playgroundInteractions, null, 2) + "\n")
  }
})

for (const scenario of scenarios) {
  test(`${scenario.id}: paired visual and target accessibility`, async ({ browser }, testInfo) => {
    const viewport = viewportName(testInfo.project.name)
    const pairDir = path.join(visualRoot, viewport, scenario.id)
    fs.mkdirSync(pairDir, { recursive: true })

    const projectUse = testInfo.project.use
    const contextOptions = {
      viewport: projectUse.viewport,
      deviceScaleFactor: projectUse.deviceScaleFactor,
      isMobile: projectUse.isMobile,
      hasTouch: projectUse.hasTouch,
      userAgent: projectUse.userAgent,
      locale: "en-US",
      colorScheme: "light",
      reducedMotion: "reduce",
    }
    const baselineContext = await browser.newContext(contextOptions)
    const targetContext = await browser.newContext(contextOptions)
    const baseline = await baselineContext.newPage()
    const target = await targetContext.newPage()
    const baselineStatus = await prepare(baseline, "http://127.0.0.1:9000", scenario, false, viewport)
    const targetStatus = await prepare(target, "http://127.0.0.1:4321", scenario, true, viewport)
    const baselinePath = path.join(pairDir, "gatsby.png")
    const targetPath = path.join(pairDir, "astro.png")
    const diffPath = path.join(pairDir, "diff.png")
    await baseline.screenshot({ path: baselinePath, fullPage: true, animations: "disabled" })
    await target.screenshot({ path: targetPath, fullPage: true, animations: "disabled" })

    const baselineAxe = await new AxeBuilder({ page: baseline }).withTags(axeTags).analyze()
    const targetAxe = await new AxeBuilder({ page: target }).withTags(axeTags).analyze()
    const axeClassification = classifyAxe(baselineAxe.violations, targetAxe.violations)
    const blockingRegressions = axeClassification.filter(result => result.classification === "regression" && (result.target?.impact === "serious" || result.target?.impact === "critical"))
    expect(blockingRegressions, `${scenario.id} has new or worsened serious/critical axe violations`).toEqual([])
    const expectedStatus = scenario.id === "not-found" ? 404 : 200
    expect(targetStatus).toBe(expectedStatus)
    expect(baselineStatus).toBe(expectedStatus)
    if (scenario.id === "playground-loaded") {
      expect(new URL(baseline.url()).pathname.replace(/\/$/, "")).toBe("/play")
      expect(baseline.url().endsWith("?strict=true#example/hello-world")).toBe(true)
      await expect(target.locator("#monaco-editor-embed .monaco-editor")).toBeVisible()
      expect(new URL(target.url()).pathname).toBe("/play")
      expect(target.url().endsWith("?strict=true#example/hello-world")).toBe(true)
      const [baselineDiagnostics, targetDiagnostics] = await Promise.all([collectDiagnostics(baseline), collectDiagnostics(target)])
      const diagnosticsFile = path.join(pairDir, "diagnostics.json")
      fs.writeFileSync(diagnosticsFile, JSON.stringify({ captured: new Date().toISOString(), scenario: scenario.id, viewport, baseline: baselineDiagnostics, target: targetDiagnostics }, null, 2) + "\n")
    }
    const targetGeometry = await target.evaluate(() => ({
      viewportWidth: document.documentElement.clientWidth,
      scrollWidth: document.documentElement.scrollWidth,
      horizontalOverflowPixels: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
      mainRect: (() => { const rect = document.querySelector("main")?.getBoundingClientRect(); return rect ? { left: rect.left, right: rect.right, width: rect.width } : null })(),
      overflowingElements: [...document.querySelectorAll("body *")].map(element => {
        const rect = element.getBoundingClientRect()
        return { tag: element.tagName, id: element.id, classes: element.className, left: rect.left, right: rect.right, width: rect.width, scrollWidth: element.scrollWidth, clientWidth: element.clientWidth }
      }).filter(element => element.right > document.documentElement.clientWidth + 1 || element.left < -1).sort((left, right) => right.right - left.right).slice(0, 12),
    }))
    expect(targetGeometry.horizontalOverflowPixels, `${scenario.id} has page-level horizontal overflow: ${JSON.stringify(targetGeometry.overflowingElements)}`).toBeLessThanOrEqual(1)
    accessibility.push({ scenario: scenario.id, path: scenario.path, viewport, baselineStatus, targetStatus, classification: axeClassification, baseline: { violations: baselineAxe.violations.map(normalizeViolation), passes: baselineAxe.passes.length, incomplete: baselineAxe.incomplete.map(normalizeViolation) }, target: { violations: targetAxe.violations.map(normalizeViolation), passes: targetAxe.passes.length, incomplete: targetAxe.incomplete.map(normalizeViolation) }, violations: targetAxe.violations.map(normalizeViolation), passes: targetAxe.passes.length, incomplete: targetAxe.incomplete.map(normalizeViolation) })
    const comparison = compare(baselinePath, targetPath, diffPath)
    records.push({ scenario: scenario.id, requestedPath: scenario.path, baselineFinalUrl: baseline.url(), targetFinalUrl: target.url(), viewport, baselineStatus, targetStatus, targetGeometry, responsiveState: viewport.startsWith("mobile") && scenario.id === "locale-recommendation" ? "recommendation hidden at Astro's mobile breakpoint; not approved" : viewport.startsWith("mobile") && scenario.id === "search-open" ? "Astro mobile results overlay hidden; not approved" : "requested state visible", diffMethod: "pixelmatch", pixelThreshold, antiAliasingExcluded: true, masks, actualDifference: { pixels: comparison.differentPixels, ratio: comparison.ratio }, observedDifferences: observedDifferences[scenario.id], disposition: comparison.ratio <= maximumDifferenceRatio ? "requires material-difference review" : "failed: measured difference exceeds threshold", files: { baseline: path.relative(evidence, baselinePath).replaceAll("\\", "/"), target: path.relative(evidence, targetPath).replaceAll("\\", "/"), diff: path.relative(evidence, diffPath).replaceAll("\\", "/") }, comparison })

    await baselineContext.close()
    await targetContext.close()
    expect(comparison.ratio, `${scenario.id} has an unapproved visual difference of ${(comparison.ratio * 100).toFixed(2)}%: ${observedDifferences[scenario.id]}`).toBeLessThanOrEqual(maximumDifferenceRatio)
  })
}

test("playground-controls: paired meaningful interactions", async ({ browser }, testInfo) => {
  const viewport = viewportName(testInfo.project.name)
  const scenario = scenarios.find(item => item.id === "playground-loaded")
  const contextOptions = {
    viewport: testInfo.project.use.viewport,
    deviceScaleFactor: testInfo.project.use.deviceScaleFactor,
    isMobile: testInfo.project.use.isMobile,
    hasTouch: testInfo.project.use.hasTouch,
    userAgent: testInfo.project.use.userAgent,
    locale: "en-US",
    colorScheme: "light",
    reducedMotion: "reduce",
    permissions: ["clipboard-read", "clipboard-write"],
  }
  const results = {}
  for (const [application, origin] of [["baseline", "http://127.0.0.1:9000"], ["target", "http://127.0.0.1:4321"]]) {
    const context = await browser.newContext(contextOptions)
    const page = await context.newPage()
    const consoleMessages = []
    const failedRequests = []
    page.on("console", message => consoleMessages.push({ type: message.type(), text: message.text() }))
    page.on("requestfailed", request => failedRequests.push({ method: request.method(), url: request.url(), failure: request.failure()?.errorText }))
    await prepare(page, origin, scenario, application === "target", viewport)
    const interactions = []
    const snapshot = async (id, before, error) => {
      const locator = page.locator(`#${id}`)
      const after = await locator.count() ? await locator.evaluate(node => {
        const rect = node.getBoundingClientRect()
        const center = { x: Math.max(0, Math.min(innerWidth - 1, rect.left + rect.width / 2)), y: Math.max(0, Math.min(innerHeight - 1, rect.top + rect.height / 2)) }
        const hit = document.elementFromPoint(center.x, center.y)
        const sidebar = document.querySelector(".playground-sidebar")
        return {
          className: node.parentElement?.className,
          expanded: node.getAttribute("aria-expanded"),
          text: node.textContent?.trim(),
          rect: { x: rect.x, y: rect.y, width: rect.width, height: rect.height },
          hit: hit ? { tag: hit.tagName, id: hit.id, classes: hit.className, containsTarget: node === hit || node.contains(hit) } : null,
          sidebarDisplay: sidebar ? getComputedStyle(sidebar).display : null,
          activePluginTab: document.querySelector(".playground-plugin-tabview button.active")?.id,
          hash: location.hash,
          hydration: { sandbox: Boolean(window.sandbox), playground: Boolean(window.playground), monaco: Boolean(document.querySelector("#monaco-editor-embed .monaco-editor")) },
        }
      }) : null
      interactions.push({ id, before, after, error: error ? String(error) : undefined })
      return after
    }
    const click = async (id, assertion) => {
      await page.evaluate(() => {
        history.replaceState(history.state, "", `${location.pathname}${location.search}`)
        scrollTo(0, 0)
      })
      await page.waitForTimeout(50)
      const locator = page.locator(`#${id}`)
      await expect(locator, `${application} is missing #${id}`).toHaveCount(1)
      const before = await snapshot(id)
      try {
        await locator.click({ timeout: 5_000 })
        await page.waitForTimeout(100)
        const after = await snapshot(id, before)
        await assertion?.(after, before)
        return after
      } catch (error) {
        await snapshot(id, before, error)
        throw error
      }
    }
    const assertOpen = after => expect(after.className, `${application} dropdown did not open`).toContain("open")
    const sidebar = page.locator(".playground-sidebar")
    const sidebarInitiallyVisible = await sidebar.isVisible()
    const exercisePluginTabs = async () => { for (const id of ["playground-plugin-tab-js", "playground-plugin-tab-dts", "playground-plugin-tab-errors", "playground-plugin-tab-logs", "playground-plugin-tab-plugins"]) {
      await click(id)
      await expect(page.locator(`#${id}`), `${application} ${id} did not activate`).toHaveClass(/active/)
    } }
    if (sidebarInitiallyVisible) await exercisePluginTabs()
    await click("sidebar-toggle")
    expect(await sidebar.isVisible(), `${application} sidebar toggle did not change visibility`).toBe(!sidebarInitiallyVisible)
    if (!sidebarInitiallyVisible) await exercisePluginTabs()
    await prepare(page, origin, scenario, application === "target", viewport)
    if (viewport.startsWith("mobile")) await page.evaluate(() => {
      const sidebar = document.querySelector(".playground-sidebar")
      if (sidebar instanceof HTMLElement) sidebar.style.display = "none"
      document.getElementById("sidebar-toggle")?.setAttribute("aria-label", "Show Sidebar")
      window.sandbox?.editor?.layout?.()
    })
    for (const id of ["compiler-options-button", "examples-button"]) {
      await click(id, assertOpen)
      await click(id, after => expect(after.className).not.toContain("open"))
    }
    await click("playground-settings", after => expect(after.className).toContain("open"))
    await click("playground-settings")
    await click("versions-button", assertOpen)
    await click("versions-button", after => expect(after.className).not.toContain("open"))
    await click("exports-dropdown", assertOpen)
    await click("exports-dropdown", after => expect(after.className).not.toContain("open"))
    await click("examples-button", assertOpen)
    const exampleTabs = page.locator('#examples [role="tab"]:visible')
    for (let index = 0; index < await exampleTabs.count(); index++) {
      const tab = exampleTabs.nth(index)
      await tab.click()
      expect(await tab.getAttribute("class")).toContain("selected")
      interactions.push({ id: `example-tab-${index}`, text: await tab.textContent(), action: "activated examples section" })
    }
    await click("examples-button", after => expect(after.className).not.toContain("open"))
    await click("compiler-options-button", assertOpen)
    const language = page.locator("#language-selector")
    const languageBefore = await language.inputValue()
    await language.selectOption({ label: languageBefore === "JavaScript" ? "TypeScript" : "JavaScript" })
    interactions.push({ id: "language-selector", before: languageBefore, after: await language.inputValue(), hasUseJavaScriptState: new URL(page.url()).searchParams.has("useJavaScript"), url: page.url(), action: "selected an alternate language" })
    const visibleCheckboxes = page.locator("#compiler-options-dropdown input[type=checkbox]:visible")
    const checkboxCount = await visibleCheckboxes.count()
    for (let index = 0; index < checkboxCount; index++) {
      const checkbox = visibleCheckboxes.nth(index)
      const id = await checkbox.getAttribute("id")
      const before = await checkbox.isChecked()
      await checkbox.click()
      expect(await checkbox.isChecked(), `${application} ${id} did not toggle`).toBe(!before)
      await checkbox.click()
      interactions.push({ id, before, after: !before, restored: await checkbox.isChecked(), action: "toggled compiler option" })
    }
    const compilerClose = page.locator("#compiler-options-dropdown .examples-close")
    if (await compilerClose.isVisible()) await compilerClose.click()
    await click("run-button")
    await expect(page.locator("#playground-plugin-tab-logs")).toHaveClass(/active/)
    await click("share-button")
    expect(new URL(page.url()).hash, `${application} Share did not serialize editor state`).toMatch(/^#code\//)
    await click("handbook-button", after => {
      expect(after.className).toContain("open")
      expect(after.hash).toContain("handbook")
    })
    results[application] = {
      url: page.url(),
      interactions,
      console: consoleMessages,
      failedRequests,
      finalDiagnostics: await collectDiagnostics(page),
    }
    await context.close()
  }
  const required = ["compiler-options-button", "examples-button", "handbook-button", "playground-settings", "versions-button", "run-button", "exports-dropdown", "share-button", "sidebar-toggle", "playground-plugin-tab-js", "playground-plugin-tab-dts", "playground-plugin-tab-errors", "playground-plugin-tab-logs", "playground-plugin-tab-plugins", "language-selector"]
  for (const application of ["baseline", "target"]) {
    const exercised = new Set(results[application].interactions.map(item => item.id))
    expect(required.filter(id => !exercised.has(id)), `${application} controls lacked meaningful interaction coverage`).toEqual([])
  }
  const baselineLanguage = results.baseline.interactions.find(item => item.id === "language-selector")
  const targetLanguage = results.target.interactions.find(item => item.id === "language-selector")
  expect({ value: targetLanguage.after, hasUseJavaScriptState: targetLanguage.hasUseJavaScriptState }, "Astro language selector behavior differs from Gatsby").toEqual({ value: baselineLanguage.after, hasUseJavaScriptState: baselineLanguage.hasUseJavaScriptState })
  playgroundInteractions.push({ captured: new Date().toISOString(), scenario: "playground-controls", viewport, ...results })
})

test("keyboard focus, landmarks, labels, and mobile overflow", async ({ page }, testInfo) => {
  await page.goto("/docs/handbook/2/everyday-types.html")
  await expect(page.locator("main")).toHaveCount(1)
  await expect(page.getByRole("navigation").first()).toBeVisible()
  await page.keyboard.press("Tab")
  const firstFocus = await page.evaluate(() => ({ tag: document.activeElement?.tagName, text: document.activeElement?.textContent?.trim(), id: document.activeElement?.id }))
  expect(firstFocus.tag).not.toBe("BODY")
  const unlabeled = await page.locator('button:not([aria-label]):not([aria-labelledby])').evaluateAll(nodes => nodes.filter(node => !node.textContent?.trim() && !node.getAttribute("title")).length)
  expect(unlabeled).toBe(0)
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
  expect(overflow).toBeLessThanOrEqual(1)
  accessibility.push({ scenario: "keyboard-landmarks-labels-overflow", path: "/docs/handbook/2/everyday-types.html", viewport: viewportName(testInfo.project.name), violations: [], passes: 4, incomplete: [], manualAssertions: { firstFocus, oneMain: true, navigationVisible: true, unlabeledButtons: unlabeled, horizontalOverflowPixels: overflow } })
})
