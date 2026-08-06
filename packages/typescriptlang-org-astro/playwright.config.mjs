import { defineConfig, devices } from "@playwright/test"

export default defineConfig({
  testDir: "./browser",
  timeout: 30_000,
  expect: { timeout: 7_000 },
  fullyParallel: false,
  retries: 0,
  reporter: [["list"], ["json", { outputFile: "../typescriptlang-org/.tsupgrader/framework-migration/evidence/playwright/results.json" }]],
  outputDir: "../typescriptlang-org/.tsupgrader/framework-migration/evidence/playwright/artifacts",
  use: {
    baseURL: "http://127.0.0.1:4321",
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: {
    command: "pnpm preview --host 127.0.0.1 --port 4321",
    url: "http://127.0.0.1:4321/",
    reuseExistingServer: false,
    timeout: 30_000,
  },
})
