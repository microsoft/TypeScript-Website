// @ts-check
/*
  node packages/playground-handbook/scripts/generate.mjs
*/

import { writeFileSync, readdirSync, existsSync, mkdirSync, copyFileSync } from "fs"

import { dirname, join } from "path"
import { domainToASCII, fileURLToPath } from "url"

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

const json = {
  docs: [],
}

const idize = string =>
  string
    .toLowerCase()
    .replace(/[^\x00-\x7F]/g, "-")
    .replace(/ /g, "-")
    .replace(/\//g, "-")
    .replace(/\+/g, "-")

const add = strs =>
  strs.forEach((path, i) => {
    json.docs.push({
      type: "href",
      title: path.replace(".md", ""),
      href: "/_playground-handbook/" + idize(path.replace(".md", "")) + ".html",
    })
  })

add(contents)
json.docs.push({ type: "hr" })
add(extended)

writeFileSync(join(outputDir, "play-handbook.json"), JSON.stringify(json))
