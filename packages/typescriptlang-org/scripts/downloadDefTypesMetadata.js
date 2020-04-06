// @ts-check

// Ensure Playground assets are up to date

const nodeFetch = require("node-fetch").default
const { writeFileSync, readFileSync } = require("fs")
const { join } = require("path")

const getFileAndStoreLocally = async (url, path) => {
  const packageJSON = await nodeFetch(url)
  const contents = await packageJSON.text()
  writeFileSync(join(__dirname, "..", path), contents, "utf8")
}

const go = async () => {
  const tsqueryJSONPath = join(
    __dirname,
    "..",
    "src",
    "lib",
    "types-search-index-min.json"
  )

  await getFileAndStoreLocally(
    "https://typespublisher.blob.core.windows.net/typespublisher/data/search-index-min.json",
    tsqueryJSONPath
  )
}

go()
