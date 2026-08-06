import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"

export default defineConfig({
  site: "https://www.typescriptlang.org/",
  publicDir: ".generated-public",
  output: "static",
  trailingSlash: "ignore",
  integrations: [react(), sitemap({ filter: page => !page.includes("/vo/") && !page.endsWith("/glossary/") })],
  vite: {
    build: {
      sourcemap: true,
    },
  },
})
