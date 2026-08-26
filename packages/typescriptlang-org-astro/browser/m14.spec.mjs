import fs from "node:fs"
import { test, expect } from "@playwright/test"

const hasLocalizedTSConfig = fs.existsSync(new URL("../../tsconfig-reference/copy/ja/", import.meta.url))
const hasLocalizedPlayground = fs.existsSync(new URL("../../playground-examples/copy/zh/", import.meta.url))

test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    window.__TS_DOCSEARCH_FIXTURE__ = [
      { title: "Everyday Types", url: "https://www.typescriptlang.org/docs/handbook/2/everyday-types.html" },
      { title: "Narrowing", url: "https://www.typescriptlang.org/docs/handbook/2/narrowing.html" },
    ]
    window.__consentCalls = []
    window.WcpConsent = { init: (...args) => { window.__consentCalls.push(args.slice(0, 2)); args[2]?.(null, { isConsentRequired: true }) } }
  })
  await page.route("https://consentdeliveryfd.azurefd.net/**", route => route.fulfill({ status: 200, contentType: "application/javascript", body: "" }))
})

test("localized fallback and recommendation are route-aware", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "language", { value: "fr-FR" }))
  await page.setViewportSize({ width: 1100, height: 800 })
  await page.goto("/ja/download")
  const recommendation = page.locator("#language-recommendation")
  await expect(recommendation).toBeVisible()
  await expect(page.locator("#my-lang-quick-jump a")).toHaveAttribute("href", "/fr/download")
  await page.locator("#language-recommendation-no-more").click()
  await expect(recommendation).toBeHidden()
  await page.reload()
  await expect(recommendation).toBeHidden()
})

test("header, search, docs sidebar and keyboard controls work", async ({ page }, testInfo) => {
  await page.goto("/docs/handbook/2/everyday-types.html")
  const search = page.locator("#search-box-top")
  if (testInfo.project.name === "desktop") {
    await search.fill("everyday")
    await expect(page.locator("#docsearch-results")).toBeVisible()
    await expect(page.locator("#docsearch-results a")).toHaveAttribute("href", /\/docs\/handbook\/2\/everyday-types\.html/)
    await search.press("ArrowDown")
    await expect(page.locator("#docsearch-results a")).toBeFocused()
  }
  const sidebarToggle = page.locator("#sidebar-toggle")
  if (await sidebarToggle.isVisible()) {
    await sidebarToggle.click()
    await expect(sidebarToggle).toHaveAttribute("aria-expanded", "true")
    await expect(page.locator('#sidebar a[aria-current="page"]')).toBeFocused()
    await page.keyboard.press("ArrowDown")
    await page.keyboard.press("Escape")
    await expect(sidebarToggle).toBeFocused()
  } else {
    const current = page.locator('#sidebar a[aria-current="page"]')
    await expect(current).toBeVisible()
    await current.focus()
    await page.keyboard.press("ArrowDown")
    await expect(current).not.toBeFocused()
  }
})

test("documentation ToC, hash, previous-next and feedback work", async ({ page }, testInfo) => {
  await page.goto("/docs/handbook/2/everyday-types.html")
  const toc = page.getByRole("navigation", { name: "Table of contents" })
  await expect(toc).toBeVisible()
  const tocLink = toc.locator('a[href^="#"]').first()
  const hash = await tocLink.getAttribute("href")
  await tocLink.click()
  await expect(page).toHaveURL(new RegExp(`${hash?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`))
  await expect(page.locator(hash || "#missing")).toBeVisible()

  const previous = page.getByRole("navigation", { name: "Previous and next pages" }).getByRole("link", { name: /Previous/ })
  const previousHref = await previous.getAttribute("href")
  expect(previousHref).toBeTruthy()
  await previous.click()
  await expect(page).toHaveURL(new RegExp(`${previousHref?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?$`))
  await page.goBack()

  const feedback = page.locator("#like-dislike-subnav")
  await feedback.getByRole("button", { name: "Yes" }).click()
  await expect(feedback).toHaveText("Thanks for the feedback")
})

test("localized TSConfig root works", async ({ page }) => {
  test.skip(!hasLocalizedTSConfig, "requires synchronized TSConfig translations")
  await page.goto("/ja/tsconfig")
  await expect(page.locator("html")).toHaveAttribute("lang", "ja")
  await expect(page.locator('[data-route-family="tsconfig"]')).toBeVisible()
})

test("TSConfig reference quick navigation, active section, and hash work", async ({ page }) => {
  await page.goto("/tsconfig")
  const quickLink = page.locator('.tsconfig-quick-nav a[href="#allowJs"]')
  await expect(quickLink).toBeVisible()
  await quickLink.click()
  await expect(page).toHaveURL(/\/tsconfig\/?#allowJs$/)
  await expect(page.locator("#allowJs")).toBeVisible()
  await expect(quickLink).toHaveClass(/current/)
  await expect(quickLink).toHaveAttribute("aria-current", "location")

  const sectionLink = page.locator('article#compilerOptions nav a[href="#JavaScript_Support_6247"]')
  await sectionLink.click()
  await expect(page).toHaveURL(/#JavaScript_Support_6247$/)
  await expect(sectionLink).toHaveClass(/current/)
})

test("TSConfig option keeps indexable bot content and redirects a human browser", async ({ browser }) => {
  const bot = await browser.newContext({ userAgent: "Googlebot/2.1 (+http://www.google.com/bot.html)" })
  const botPage = await bot.newPage()
  await botPage.goto("/tsconfig/allowJs.html")
  await expect(botPage).toHaveURL(/\/tsconfig\/allowJs\.html$/)
  await expect(botPage.locator('[data-route-family="tsconfig-option"] h2')).toHaveText("allowJs")
  await expect(botPage.locator('[data-route-family="tsconfig-option"]')).toContainText("JavaScript files")
  await bot.close()

  const human = await browser.newContext()
  const humanPage = await human.newPage()
  await humanPage.goto("/tsconfig/allowJs.html")
  await expect(humanPage).toHaveURL(/\/tsconfig\/?#allowJs$/)
  await expect(humanPage.locator("#allowJs")).toBeVisible()
  await human.close()
})

test("theme and font persist and consent initializes", async ({ page }) => {
  await page.goto("/docs/handbook/2/everyday-types.html")
  await page.locator("#theme-select").selectOption("force-dark")
  await page.locator("#font-select").selectOption("consolas")
  await page.reload()
  await expect(page.locator("html")).toHaveClass(/dark-theme/)
  await expect(page.locator("html")).toHaveClass(/font-consolas/)
  await expect(page.locator("#theme-select")).toHaveValue("force-dark")
  await expect.poll(() => page.evaluate(() => window.__consentCalls.length)).toBeGreaterThan(0)
})

test("documented marketing journeys reach useful outcomes", async ({ page }, testInfo) => {
  await page.goto("/")
  await expect(page.locator("#index-2")).toBeVisible()
  await expect(page.locator("#above-the-fold-headline-code")).toBeVisible()
  await expect(page.getByText(/is now available/).first()).toBeVisible()
  const editorTabs = page.locator("#index-2 .editor-tabs [role=tab]")
  await editorTabs.nth(1).click()
  await expect(editorTabs.nth(1)).toHaveAttribute("aria-selected", "true")
  await expect(page.locator("#above-the-fold-headline-code")).toHaveAttribute("data-selected-example", "1")
  await page.locator('main a[href="/download"]').first().click()
  await expect(page).toHaveURL(/\/download\/?$/)
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  await page.goto("/")
  await page.locator('main a[href="/play/"]').first().click()
  await expect(page).toHaveURL(/\/play\/?$/)
  await expect(page.locator("#playground-app")).toBeVisible()
  await page.goto("/")
  await page.locator('main a[href^="/docs/"]').first().click()
  await expect(page).toHaveURL(/\/docs\//)
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
})

test("docs landing preserves its established card layout", async ({ page }) => {
  await page.goto("/docs/")
  await expect(page).toHaveTitle("TypeScript: The starting point for learning TypeScript")
  await expect(page.locator("#docs-landing .columns.wide")).toBeVisible()
  await expect(page.locator("#docs-landing .item.raised")).toHaveCount(13)
  await expect(page.locator("#docs-landing .root-semantic-content")).toHaveCount(0)
})

test("developer routes preserve useful content and workbenches", async ({ page }) => {
  const routes = [
    ["/branding", "Branding"],
    ["/dev/bug-workbench", "Bug Workbench"],
    ["/dev/playground-plugins", "Your toys, our sandbox"],
    ["/dev/sandbox", "TypeScript Sandbox"],
    ["/dev/twoslash", "TypeScript Twoslash"],
    ["/dev/typescript-vfs", "Easy access to the compiler API"],
  ]
  for (const [route, heading] of routes) {
    await page.goto(route)
    const semantics = route === "/branding"
      ? page.locator("main")
      : route === "/dev/playground-plugins"
        ? page.locator(".plugin-intro")
        : page.locator("#developer-semantic-content")
    await expect(semantics).toBeVisible()
    await expect(semantics).toContainText(heading)
    if (route !== "/branding") await expect(page.locator(".developer-workbench")).toBeVisible()
  }
  await page.goto("/dev/playground-plugins")
  await expect(page.locator(".plugin-intro img")).toHaveAttribute("src", "/static/playground-plugin-preview-3fa319f7efff676f839a57ad3d8be916.png")
  await page.getByLabel("Display name").fill("Parity Inspector")
  await expect(page.locator(".developer-workbench pre")).toContainText("Parity Inspector")
})

test("localized Playground semantics preserve settings, fragment, and independent runtime", async ({ page }) => {
  test.skip(!hasLocalizedPlayground, "requires synchronized Playground translations")
  await page.goto("/zh/play?strict=true&jsx=2&target=7#example/hello-world")
  await expect(page.locator("#compiler-options-button")).toHaveText("配置")
  await expect(page.locator("#compiler-options-dropdown h3")).toHaveText("配置")
  await expect(page.locator("#examples-button")).toHaveText("示例")
  await expect(page).toHaveURL(/\/zh\/play\?strict=true&jsx=2&target=7#example\/hello-world$/)
  await expect(page.locator("#playground-app")).toBeVisible()
  await expect(page.locator("#monaco-editor-embed")).toBeAttached()
})
