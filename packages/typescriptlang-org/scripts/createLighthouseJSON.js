const nodeFetch = require("node-fetch").default
const { writeFileSync } = require("fs")
const { join } = require("path")
const parser = require("xml2json")

const getFileAndStoreLocally = async (url, path) => {
  writeFileSync(join(__dirname, "..", path), contents, "utf8")
}

const prNumber = process.env.PR_NUMBER || "245"

const go = async () => {
  const sitemap =
    "https://typescript-v2-" + prNumber + ".ortam.now.sh/sitemap.xml"

  const packageJSON = await nodeFetch(sitemap)
  const contents = await packageJSON.text()

  const sitemapJSON = JSON.parse(parser.toJson(contents))
  const urls = sitemapJSON.urlset.url
    .map(u => u.loc)
    .map(url => {
      // from "https://www.typescriptlang.org/v2/docs/handbook/advanced-types.html",
      // to   "https://typescript-v2-" + prNumber + ".ortam.now.sh/docs/handbook/advanced-types.html",
      return url.replace(
        "https://www.typescriptlang.org/v2/",
        "https://typescript-v2-" + prNumber + ".ortam.now.sh/"
      )
    })
    .filter(url => !url.endsWith(".ts"))
    .reverse()

  const repoRoot = join(__dirname, "..", "..", "..")
  const lighthouseFiles = join(repoRoot, ".lighthouserc.json")
  const json = {
    ci: {
      collect: {
        url: [...urls],
      },
    },
  }

  console.log(`Looking at ${urls.length} urls`)
  writeFileSync(lighthouseFiles, JSON.stringify(json))
}

go()
