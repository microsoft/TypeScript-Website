import path from "path"
import fs from "fs"

import { NodePluginArgs, CreatePagesArgs } from "gatsby"
import { recursiveReadDirSync } from "../../utils/recursiveReadDirSync"

/**
 * Basically you can have a set of files in src/templates/pages
 * and we'll make a language prefixed version of it when there are languages
 * in the copy dir.
 */

export const createRootPagesLocalized = async (
  graphql: CreatePagesArgs["graphql"],
  createPage: NodePluginArgs["actions"]["createPage"]
) => {
  // prettier-ignore
  const rootPagesDir = path.join(__dirname, "..", "..", "..", "src", "templates", "pages")
  const languageRootDir = path.join(__dirname, "..", "..", "..", "src", "copy")

  const langs = fs
    .readdirSync(languageRootDir)
    .filter(f => f.endsWith(".ts"))
    .map(f => path.basename(f, ".ts"))
    .filter(f => f !== "en")

  const files = recursiveReadDirSync(rootPagesDir)
    .filter(f => !f.startsWith(".")) // only useful files
    .filter(f => !f.includes("dev") && !f.includes("css")) // skip these

  console.log(files)

  files.forEach(f => {
    const fullpath = path.join(__dirname, "..", "..", "..", "..", f)
    let originalSitePath = path
      .relative(rootPagesDir, fullpath)
      .replace(/.tsx$/g, "")

    // Remove the index files
    if (originalSitePath.endsWith("index")) {
      // prettier-ignore
      originalSitePath = originalSitePath.substring(0, originalSitePath.length - 5)
    }
    // If they have .en then just drop that completely
    if (originalSitePath.endsWith(".en")) {
      // prettier-ignore
      originalSitePath = originalSitePath.substring(0, originalSitePath.length - 3)
    }

    ;["", ...langs].forEach(lang => {
      const prefix = lang === "" ? "/" : `/${lang}/`
      const sitePath = `${prefix}${originalSitePath}`

      const pageOpts = {
        path: sitePath,
        component: fullpath,
        context: {
          lang: lang === "" ? "en" : lang,
        },
      }

      console.log(pageOpts)
      createPage(pageOpts)
    })
  })
}
