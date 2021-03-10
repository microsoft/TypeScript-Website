import path from "path"
import fs from "fs"
const { green } = require("chalk")

import { NodePluginArgs, CreatePagesArgs } from "gatsby"
import { recursiveReadDirSync } from "../../utils/recursiveReadDirSync"
import { isMultiLingual } from "./languageFilter"
import { addPathToSite } from "../pathsOnSiteTracker"

/**
 * Basically you can have a set of files in src/templates/pages
 * and we'll make a language prefixed version of it when there are languages
 * in the copy dir.
 */

export const createRootPagesLocalized = async (
  graphql: CreatePagesArgs["graphql"],
  createPage: NodePluginArgs["actions"]["createPage"]
) => {
  console.log(`${green("success")} Creating Internationalized Pages`)

  // prettier-ignore
  const rootPagesDir = path.join(__dirname, "..", "..", "..", "src", "templates", "pages")
  const languageRootDir = path.join(__dirname, "..", "..", "..", "src", "copy")

  const langs = fs
    .readdirSync(languageRootDir)
    .filter(
      f =>
        !(
          f.endsWith(".ts") ||
          f.endsWith(".ts") ||
          f.endsWith(".md") ||
          f.startsWith(".")
        )
    )

  const files = recursiveReadDirSync(rootPagesDir)
    .filter(f => !f.startsWith(".")) // only useful files
    .filter(f => !f.includes("dev") && !f.includes("css")) // skip these

  files.forEach(f => {
    const fullpath = path
      .join(__dirname, "..", "..", "..", "..", f)
      .replace("..//", "../")
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

    // Always use /s for the path, because the join above in windows would be \
    originalSitePath = originalSitePath.split("\\").join("/")

    langs.forEach(lang => {
      if (!isMultiLingual && lang !== "en") return

      const prefix = lang === "en" ? "/" : `/${lang}/`
      const sitePath = `${prefix}${originalSitePath}`
      const pageOpts = {
        path: sitePath,
        component: fullpath,
        context: {
          lang: lang === "" ? "en" : lang,
        },
      }

      addPathToSite(sitePath)
      createPage(pageOpts)
    })
  })
}
