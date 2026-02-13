// @ts-check

// Ensure Playground assets are up to date

const { writeFileSync, readFileSync } = require("fs")
const { join } = require("path")

const getFileAndStoreLocally = async (url, path) => {
  const packageJSON = await fetch(url)
  const contents = await packageJSON.text()
  writeFileSync(join(__dirname, "..", path), contents, "utf8")
}

const go = async () => {
  await getFileAndStoreLocally(
    "https://unpkg.com/monaco-editor@0.19.0/min/vs/loader.js",
    "public/js/vs.loader.js"
  )

  const newLoader = readFileSync("public/js/vs.loader.js", "utf8").replace(
    "//# sourceMappingURL=../../min-maps/vs/loader.js.map",
    "//# sourceMappingURL=vs.loader.js.map"
  )
  new writeFileSync("public/js/vs.loader.js", newLoader)

  await getFileAndStoreLocally(
    "https://unpkg.com/monaco-editor@0.19.0/min-maps/vs/loader.js.map",
    "public/js/vs.loader.js.map"
  )

  const newLoaderMap = readFileSync(
    "public/js/vs.loader.js.map",
    "utf8"
  ).replace('"sources":["vs/vs/loader.js"]', '"sources":["vs.loader.js"]')

  new writeFileSync("public/js/vs.loader.js.map", newLoaderMap)
}

go()
