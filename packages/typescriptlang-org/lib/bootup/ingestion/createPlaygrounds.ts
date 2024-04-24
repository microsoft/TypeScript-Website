const path = require(`path`)
const fs = require(`fs`)
const { green } = require("chalk")

import { NodePluginArgs, CreatePagesArgs } from "gatsby"
import { addPathToSite } from "../pathsOnSiteTracker"
import { isMultiLingual } from "./languageFilter"

export const createPlaygrounds = async (
  graphql: CreatePagesArgs["graphql"],
  createPage: NodePluginArgs["actions"]["createPage"]
) => {
  console.log(`${green("success")} Creating Playground Pages`)

  const playPage = path.resolve(`./src/templates/play.tsx`)
  const result = await graphql(`
    query GetAllPlaygroundLocalizations {
      allFile(
        filter: {
          sourceInstanceName: { eq: "playground-examples" }
          ext: { eq: ".json" }
        }
      ) {
        nodes {
          name
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const anyData = result.data as any
  const docs = anyData.allFile.nodes

  docs.forEach(lang => {
    if (!isMultiLingual && lang !== "en") return

    const appRoot = path.join(__dirname, "..", "..", "..", "..")

    const examplesForLang = path.join(appRoot, "playground-examples", "generated", lang.name + ".json")
    const examplesTOC = JSON.parse(fs.readFileSync(examplesForLang, "utf8"))

    const playgroundHandbookTOCPath = path.join(appRoot, "playground-handbook", "output", "play-handbook.json")
    const playgroundHandbookTOC = JSON.parse(fs.readFileSync(playgroundHandbookTOCPath, "utf8"))

    // prettier-ignore
    const compilerOptsForLang = path.join(appRoot, "tsconfig-reference", "output", lang.name + "-summary.json")
    // prettier-ignore
    const compilerOptsForLangFallback = path.join(appRoot, "tsconfig-reference", "output", "en-summary.json")

    const hasOptsForLang = fs.existsSync(compilerOptsForLang)
    const optionsPath = hasOptsForLang
      ? compilerOptsForLang
      : compilerOptsForLangFallback

    const optionsSummary = JSON.parse(fs.readFileSync(optionsPath, "utf8"))
      .options

    const pathName = lang.name === "en" ? "/play" : `/${lang.name}/play`
    addPathToSite(pathName)

    createPage({
      path: pathName,
      component: playPage,
      context: {
        lang: lang.name,
        examplesTOC,
        optionsSummary,
        playgroundHandbookTOC
      },
    })
  })
}
