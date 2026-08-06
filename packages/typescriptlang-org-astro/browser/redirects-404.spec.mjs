import { test, expect } from "@playwright/test"
import fs from "node:fs"
import path from "node:path"

const evidence = path.resolve("../typescriptlang-org/.tsupgrader/framework-migration/evidence/playwright")

const saveScreenshot = async (page, project, name) => {
  const directory = path.join(evidence, name)
  fs.mkdirSync(directory, { recursive: true })
  await page.screenshot({ path: path.join(directory, `${project}.png`), fullPage: true })
}

test("static redirect documents preserve internal, fragment, and case-collision behavior", async ({ page }, testInfo) => {
  await page.goto("/Tutorial")
  await expect(page).toHaveURL(/\/docs\/?$/)

  await page.goto("/docs/handbook/module-resolution.html")
  await expect(page).toHaveURL(/\/docs\/handbook\/modules\/theory\.html#module-resolution$/)
  await expect(page.locator("#module-resolution")).toBeVisible()

  for (const route of ["/Playground", "/playground"]) {
    await page.goto(route)
    await expect(page).toHaveURL(/\/play\/?$/)
  }
  await saveScreenshot(page, testInfo.project.name, "redirects")
})

test("external redirect requests the exact Webpack destination without relying on that service", async ({ page }) => {
  let destination = ""
  await page.route("https://webpack.js.org/guides/typescript/", async route => {
    destination = route.request().url()
    await route.fulfill({ status: 200, contentType: "text/html", body: "<h1>Webpack destination intercepted</h1>" })
  })
  await page.goto("/docs/handbook/react-&-webpack.html")
  await expect.poll(() => destination).toBe("https://webpack.js.org/guides/typescript/")
})

test("unknown production-preview routes return and render the custom 404", async ({ page, request }, testInfo) => {
  const unknown = `/migration-p18-missing-${testInfo.project.name}`
  const response = await request.get(unknown)
  expect(response.status()).toBe(404)
  expect(await response.text()).toContain("Page not found")

  const navigation = await page.goto(unknown)
  expect(navigation?.status()).toBe(404)
  await expect(page.getByRole("heading", { level: 1, name: "Page not found" })).toBeVisible()
  await expect(page.getByRole("link", { name: "Return to the TypeScript home page" })).toHaveAttribute("href", "/")
  await saveScreenshot(page, testInfo.project.name, "404")
})
