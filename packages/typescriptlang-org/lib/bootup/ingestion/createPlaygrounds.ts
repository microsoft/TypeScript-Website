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
    const examplesForLang = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "playground-examples",
      "generated",
      lang.name + ".json"
    )

    const exampleTOC = JSON.parse(fs.readFileSync(examplesForLang, "utf8"))
    // console.log(lang, categoriesForLang)

    createPage({
      path: lang.name + "/play",
      component: playPage,
      context: {
        lang: lang.name,
        examplesTOC: exampleTOC,
      },
    })
  })
}
