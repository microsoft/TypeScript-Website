// @ts-check
import { writeFileSync, readdirSync, existsSync, readFileSync, copyFileSync } from "fs"

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
  "Gist Docsets.md",
  "Multi-File Playgrounds.md",
  "Writing Plugins.md",
  "Implementation Details.md",
  "Twoslash Annotations.md",
  "Bug Workbench.md",
]

const orderedFiles = [...contents, ...extended]
orderedFiles.forEach((path, i) => {
  let num = i < 10 ? `0${i}` : i
  if (i >= contents.length) num++
  copyFileSync(join(__dirname, "..", path), join(__dirname, "../output", `${num} ~ ${path}`))
})
