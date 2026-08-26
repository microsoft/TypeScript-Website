import { execFile } from "node:child_process"
import path from "node:path"
import { promisify } from "node:util"
import { fileURLToPath } from "node:url"

import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"

const execute = promisify(execFile)
const documentationRoot = fileURLToPath(new URL("../documentation/copy", import.meta.url))
const documentationCompiler = fileURLToPath(new URL("./scripts/compile-documentation.mjs", import.meta.url))
const documentationNavigationGenerator = fileURLToPath(
  new URL("../documentation/scripts/generateDocsNavigationPerLanguage.js", import.meta.url)
)

const documentationHotReload = {
  name: "documentation-hot-reload",
  apply: "serve",
  configureServer(server) {
    let rebuildTimer
    let rebuilding = false
    let pendingFullRebuild = false
    const pendingSources = new Set()

    const isDocumentationMarkdown = file => {
      const relative = path.relative(documentationRoot, path.resolve(file))
      return relative && !relative.startsWith("..") && !path.isAbsolute(relative) && relative.endsWith(".md")
    }

    const rebuild = async () => {
      if (rebuilding) return

      rebuilding = true
      const fullRebuild = pendingFullRebuild
      const sources = [...pendingSources]
      pendingFullRebuild = false
      pendingSources.clear()
      try {
        server.config.logger.info(
          `Documentation changed, rebuilding ${fullRebuild ? "all Markdown" : `${sources.length} page(s)`}...`
        )
        await execute(process.execPath, [documentationNavigationGenerator])
        await execute(process.execPath, [documentationCompiler, ...(fullRebuild ? [] : sources)])
        server.config.logger.info("Documentation rebuilt; reloading Astro.")
        await server.restart()
      } catch (error) {
        server.config.logger.error(`Documentation rebuild failed: ${error.stderr || error.message}`)
      } finally {
        rebuilding = false
        if (pendingFullRebuild || pendingSources.size) void rebuild()
      }
    }

    const scheduleRebuild = (event, file) => {
      if (!["add", "change", "unlink"].includes(event) || !isDocumentationMarkdown(file)) return
      if (event === "change") pendingSources.add(path.resolve(file))
      else pendingFullRebuild = true
      clearTimeout(rebuildTimer)
      rebuildTimer = setTimeout(() => void rebuild(), 100)
    }

    server.watcher.add(documentationRoot)
    server.watcher.on("all", scheduleRebuild)
  },
}

export default defineConfig({
  site: "https://www.typescriptlang.org/",
  publicDir: ".generated-public",
  output: "static",
  trailingSlash: "ignore",
  integrations: [react(), sitemap({ filter: page => !page.includes("/vo/") && !page.endsWith("/glossary/") })],
  vite: {
    plugins: [documentationHotReload],
    build: {
      sourcemap: true,
    },
  },
})
