import { test, expect } from "@playwright/test"
import fs from "node:fs"
import path from "node:path"

const evidence = path.resolve("../typescriptlang-org/.tsupgrader/framework-migration/evidence/playwright")
const screenshot = async (page, project, name) => {
  const directory = path.join(evidence, name)
  fs.mkdirSync(directory, { recursive: true })
  await page.screenshot({ path: path.join(directory, `${project}.png`), fullPage: true })
}

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

test("localized fallback and recommendation are route-aware", async ({ page }, testInfo) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "language", { value: "fr-FR" }))
  await page.setViewportSize({ width: 1100, height: 800 })
  await page.goto("/ja/download")
  const recommendation = page.locator("#language-recommendation")
  await expect(recommendation).toBeVisible()
  await expect(page.locator("#my-lang-quick-jump")).toHaveAttribute("href", "/fr/download")
  await page.locator("#language-recommendation-no-more").click()
  await expect(recommendation).toBeHidden()
  await page.reload()
  await expect(recommendation).toBeHidden()
  await screenshot(page, testInfo.project.name, "localization")
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
    await expect(page.locator("#sidebar a").first()).toBeFocused()
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
  await screenshot(page, testInfo.project.name, "docs")
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

  const previous = page.getByRole("navigation", { name: "Previous and next pages" }).getByText("Previous").locator("..")
  const previousHref = await previous.getAttribute("href")
  await previous.click()
  await expect(page).toHaveURL(new RegExp(`${previousHref?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/?$`))
  await page.goBack()

  const feedback = page.locator("#like-dislike-subnav")
  await feedback.getByRole("button", { name: "Yes" }).click()
  await expect(feedback).toHaveText("Thanks for the feedback")
  await screenshot(page, testInfo.project.name, "docs-navigation-feedback")
})

test("TSConfig reference quick navigation, active section, hash, and localized root work", async ({ page }, testInfo) => {
  await page.goto("/ja/tsconfig")
  await expect(page.locator("html")).toHaveAttribute("lang", "ja")
  await expect(page.locator('[data-route-family="tsconfig"]')).toBeVisible()

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
  await screenshot(page, testInfo.project.name, "tsconfig")
})

test("TSConfig option keeps indexable bot content and redirects a human browser", async ({ browser }, testInfo) => {
  const bot = await browser.newContext({ userAgent: "Googlebot/2.1 (+http://www.google.com/bot.html)" })
  const botPage = await bot.newPage()
  await botPage.goto("/tsconfig/allowJs.html")
  await expect(botPage).toHaveURL(/\/tsconfig\/allowJs\.html$/)
  await expect(botPage.locator('[data-route-family="tsconfig-option"] h2')).toHaveText("allowJs")
  await expect(botPage.locator('[data-route-family="tsconfig-option"]')).toContainText("JavaScript files")
  await botPage.screenshot({ path: path.join(evidence, "tsconfig", `${testInfo.project.name}-bot-option.png`), fullPage: true })
  await bot.close()

  const human = await browser.newContext()
  const humanPage = await human.newPage()
  await humanPage.goto("/tsconfig/allowJs.html")
  await expect(humanPage).toHaveURL(/\/tsconfig\/?#allowJs$/)
  await expect(humanPage.locator("#allowJs")).toBeVisible()
  await humanPage.screenshot({ path: path.join(evidence, "tsconfig", `${testInfo.project.name}-human-redirect.png`), fullPage: true })
  await human.close()
})

test("theme and font persist and consent initializes", async ({ page }, testInfo) => {
  await page.goto("/")
  await page.locator("#theme-select").selectOption("dark")
  await page.locator("#font-select").selectOption("consolas")
  await page.reload()
  await expect(page.locator("html")).toHaveClass(/dark-theme/)
  await expect(page.locator("html")).toHaveClass(/font-consolas/)
  await expect(page.locator("#theme-select")).toHaveValue("dark")
  await expect.poll(() => page.evaluate(() => window.__consentCalls.length)).toBeGreaterThan(0)
  await screenshot(page, testInfo.project.name, "consent-settings")
})

test("documented marketing journeys reach useful outcomes", async ({ page }, testInfo) => {
  await page.goto("/")
  await page.getByRole("link", { name: /Get TypeScript|Download/i }).first().click()
  await expect(page).toHaveURL(/\/download\/?$/)
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible()
  await page.goto("/")
  await page.getByRole("link", { name: /Playground/i }).first().click()
  await expect(page).toHaveURL(/\/play\/?$/)
  await expect(page.locator("#playground-app")).toBeVisible()
  await page.goto("/")
  await page.getByRole("link", { name: /Learn TypeScript|Documentation|Docs/i }).first().click()
  await expect(page).toHaveURL(/\/docs\/?$/)
  await screenshot(page, testInfo.project.name, "user-journeys")
})

test("developer routes preserve Gatsby semantics and useful workbenches", async ({ page }, testInfo) => {
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
    const semantics = route === "/branding" ? page.locator("main") : page.locator("#developer-semantic-content")
    await expect(semantics).toBeVisible()
    await expect(semantics).toContainText(heading)
    if (route !== "/branding") await expect(page.locator(".developer-workbench")).toBeVisible()
  }
  await page.goto("/dev/playground-plugins")
  await expect(page.locator("#developer-semantic-content img")).toHaveAttribute("src", "/static/playground-plugin-preview-3fa319f7efff676f839a57ad3d8be916.png")
  await page.getByLabel("Display name").fill("Parity Inspector")
  await expect(page.locator(".developer-workbench pre")).toContainText("Parity Inspector")
  await screenshot(page, testInfo.project.name, "developer")
})

test("localized Playground semantics preserve settings, fragment, and independent runtime", async ({ page }, testInfo) => {
  await page.goto("/zh/play?strict=true&jsx=2&target=7#example/hello-world")
  await expect(page.locator("#compiler-options-button")).toHaveText("配置")
  await expect(page.locator("#compiler-options-dropdown h3")).toHaveText("配置")
  await expect(page.locator("#examples-button")).toHaveText("示例")
  await expect(page).toHaveURL(/\/zh\/play\?strict=true&jsx=2&target=7#example\/hello-world$/)
  await expect(page.locator("#playground-app")).toBeVisible()
  await expect(page.locator("#monaco-editor-embed")).toBeAttached()
  await screenshot(page, testInfo.project.name, "playground-localized")
})
