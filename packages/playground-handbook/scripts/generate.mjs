// @ts-check
/*
  node packages/playground-handbook/scripts/generate.mjs
*/

import { writeFileSync, readdirSync, existsSync, mkdirSync, copyFileSync } from "fs"

import { dirname, join } from "path"
import { fileURLToPath } from "url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, "..")
const files = readdirSync(root)
const mds = files.filter(f => f.includes(".md"))
const types = `export type PHandbookPage = ${mds.map(t => `"${t}"`).join(" | ")}`
writeFileSync(join(__dirname, "types.d.ts"), types)

/** @type {import("./types").PHandbookPage[]} */
const contents = [
  "Overview.md",
  "Compiler Settings.md",
  "Examples.md",
  "JS + DTS sidebars.md",
  "Running Code.md",
  "Type Acquisition.md",
  "Settings Panel.md",
  "Writing JavaScript.md",
  "Writing DTS Files.md",
  "TypeScript Versions.md",
  "URL Structure.md",
  "Plugins.md",
  "Exporting Your Code.md",
]

/** @type {import("./types").PHandbookPage[]} */
const extended = [
  "Extended Edition.md",
  "Twoslash Annotations.md",
  "Multi-File Playgrounds.md",
  "Gist Docsets.md",
  "Bug Workbench.md",
  "Writing Plugins.md",
  "Implementation Details.md",
]

const outputDir = join(__dirname, "../output")
if (!existsSync(outputDir)) mkdirSync(outputDir)

const orderedFiles = [...contents, ...extended]
orderedFiles.forEach((path, i) => {
  let num = i < 10 ? `0${i}` : i
  if (i >= contents.length) num++
  copyFileSync(join(__dirname, "..", path), join(outputDir, `${num} ~ ${path}`))
})
