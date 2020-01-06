const path = require(`path`)
const fs = require(`fs`)

import { NodePluginArgs, CreatePagesArgs } from "gatsby"

export const createPlaygrounds = async (
  graphql: CreatePagesArgs["graphql"],
  createPage: NodePluginArgs["actions"]["createPage"]
) => {
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
    const appRoot = path.join(__dirname, "..", "..", "..", "..")
    // prettier-ignore
    const examplesForLang = path.join(appRoot, "playground-examples", "generated", lang.name + ".json")
    const examplesTOC = JSON.parse(fs.readFileSync(examplesForLang, "utf8"))
    // console.log(lang, categoriesForLang)

    // prettier-ignore
    const compilerOptsForLang = path.join(appRoot,"tsconfig-reference","output",lang.name + "-summary.json")
    // prettier-ignore
    const compilerOptsForLangFallback = path.join( appRoot, "playground-examples", "generated", "en-summary.json")

    const hasOptsForLang = fs.existsSync(compilerOptsForLang)
    const optionsPath = hasOptsForLang
      ? compilerOptsForLang
      : compilerOptsForLangFallback

    const optionsSummary = JSON.parse(fs.readFileSync(optionsPath, "utf8"))
      .options

    createPage({
      path: lang.name + "/play",
      component: playPage,
      context: {
        lang: lang.name,
        examplesTOC,
        optionsSummary,
      },
    })
  })
}
