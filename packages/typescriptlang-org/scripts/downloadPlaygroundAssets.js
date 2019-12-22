// @ts-check

// Ensure Playground assets are up to date

const nodeFetch = require("node-fetch").default
const { writeFileSync } = require("fs")
const { join } = require("path")

const getFileAndStoreLocally = async (url, path) => {
  const packageJSON = await nodeFetch(url)
  const contents = await packageJSON.text()
  writeFileSync(join(__dirname, "..", path), contents, "utf8")
}

const go = async () => {
  await getFileAndStoreLocally(
    "https://unpkg.com/monaco-editor@0.19.0/min/vs/loader.js",
    "static/js/vs.loader.js"
  )
}

go()
