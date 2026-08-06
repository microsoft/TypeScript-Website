import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./browser",
  testMatch: "p23.spec.mjs",
  timeout: 180_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "../typescriptlang-org/.tsupgrader/framework-migration/evidence/visual/playwright-results.json" }]],
  outputDir: "../typescriptlang-org/.tsupgrader/framework-migration/evidence/visual/artifacts",
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    reducedMotion: "reduce",
  },
  projects: [
    { name: "desktop-1440x900", use: { ...devices["Desktop Chrome"], viewport: { width: 1440, height: 900 } } },
    { name: "mobile-412x915", use: { ...devices["Pixel 7"], viewport: { width: 412, height: 915 } } },
  ],
  webServer: [
    {
      command: "pnpm preview --host 127.0.0.1 --port 4321",
      url: "http://127.0.0.1:4321/",
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: "node scripts/serve-gatsby-baseline.mjs",
      url: "http://127.0.0.1:9000/",
      reuseExistingServer: false,
      timeout: 30_000,
    },
  ],
})
