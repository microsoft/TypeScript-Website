// @ts-check

// Looks at all the npm packages with the playground-plugin keyword, which
// is a default in the templates.

// Run via: CI=true pnpm run --filter=typescript-playground run bootstrap

if (!process.env.CI) {
  console.log("Skipping because it's not the CI")
  process.exit(0)
}

const nodeFetch = require("node-fetch").default
const { writeFileSync } = require("fs")
const { join } = require("path")
const { format } = require("prettier")

const get = async url => {
  const packageJSON = await nodeFetch(url)
  const contents = await packageJSON.json()
  return contents
}

const go = async () => {
  const defaultRepo = "https://github.com/[you]/[repo]"
  const results = await get("http://registry.npmjs.com/-/v1/search?size=50&text=keywords:playground-plugin")
  const summary = results["objects"].map(o => ({
    name: fixDesc(o.package.displayName) || toName(o.package.name),
    id: o.package.name,
    description: fixDesc(o.package.description),
    author: o.package.publisher.username,
    href:
      o.package.links.repository && o.package.links.repository !== defaultRepo
        ? o.package.links.repository
        : o.package.links.npm || o.package.links.npm,
  }))

  const path = join(__dirname, "..", "src", "sidebar", "fixtures", "npmPlugins.ts")
  const file = `export const allNPMPlugins = ${JSON.stringify(summary)}`
  writeFileSync(path, format(file, { filepath: path }))
}

// basically a fancy ID -> Name
// with a few edge cases.

const capitalize = str => str.charAt(0).toUpperCase() + str.substr(1).toLowerCase()

const toName = str => {
  return fixDesc(
    str
      .replace("typescript-playground-", "")
      .replace("ts-playground-plugin-", "")
      .replace("playground-plugin-", "")
      .replace("playground-", "")
      .replace(/-/g, " ")
      .replace(/\w\S*/g, capitalize)
  )
}

const fixDesc = str => {
  return (str || "")
    .replace(/typescript/gi, "TypeScript")
    .replace(/github/gi, "GitHub")
    .trim()
}

go()
