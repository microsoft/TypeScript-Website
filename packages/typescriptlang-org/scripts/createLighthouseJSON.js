const nodeFetch = require("node-fetch").default
const { writeFileSync } = require("fs")
const { join } = require("path")
const parser = require("xml-js")

const prRoot =
  process.env.PR_DEPLOY_URL_ROOT || "https://www.staging-typescript.org/"

const go = async () => {
  const sitemap = `${prRoot}/sitemap.xml`
  try {
    const packageJSON = await nodeFetch(sitemap)

    const contents = await packageJSON.text()
    const sitemapJSON = JSON.parse(
      parser.xml2json(contents, { compact: true, spaces: 4 })
    )

    /** @type {string[]} */
    const grabbedURLs = sitemapJSON.urlset.url.map(u => u.loc)

    const urls = grabbedURLs
      .filter(Boolean)
      .map(url => {
        // from "https://www.typescriptlang.org/docs/handbook/advanced-types.html",
        // to   "https://typescript-v2-" + prNumber + ".vercel.app/docs/handbook/advanced-types.html",

        return url._text.replace("https://www.typescriptlang.org/", prRoot)
      })
      .reverse()

    // Assume that ja/pt/es/etc all have the same issues as the en version
    const removeNonEnglish = urls =>
      urls.filter(u => u.includes("/en/") || u.includes("docs"))

    // These aren't user facing, don't spend the time
    const removeTypeScriptExamples = urls =>
      urls.filter(u => !u.includes("/play/"))

    // Shuffle the handbooks to cycle through
    const randomHandbooks = urls => {
      const handbooks = urls.filter(u => u.includes("/docs/"))
      return [
        ...urls.filter(u => !u.includes("/docs/")),
        handbooks[Math.floor(Math.random() * handbooks.length)],
        handbooks[Math.floor(Math.random() * handbooks.length)],
        handbooks[Math.floor(Math.random() * handbooks.length)],
        handbooks[Math.floor(Math.random() * handbooks.length)],
        handbooks[Math.floor(Math.random() * handbooks.length)],
      ]
    }

    const repoRoot = join(__dirname, "..", "..", "..")
    const lighthouseFiles = join(repoRoot, ".lighthouserc.json")
    const json = {
      ci: {
        collect: {
          url: randomHandbooks(
            removeTypeScriptExamples(removeNonEnglish(urls))
          ),
        },
      },
    }

    console.log(`Looking at ${json.ci.collect.url.length} urls:\n`)
    console.log(` - ${json.ci.collect.url.join("\n - ")}`)
    writeFileSync(lighthouseFiles, JSON.stringify(json))
  } catch (error) {
    console.log(error)
    console.log(
      "Failed to generate lighthouse JSON, this is fine if you are not an orta"
    )
  }
}

go()
