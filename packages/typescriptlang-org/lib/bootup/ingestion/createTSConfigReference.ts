const path = require(`path`)
const { green } = require("chalk")

import { NodePluginArgs, CreatePagesArgs } from "gatsby"
import { addPathToSite } from "../pathsOnSiteTracker"
import { isMultiLingual } from "./languageFilter"

export const createTSConfigReference = async (
  graphql: CreatePagesArgs["graphql"],
  createPage: NodePluginArgs["actions"]["createPage"]
) => {
  console.log(`${green("success")} Creating TSConfig Reference pages`)
  const tsConfigRefPage = path.resolve(`./src/templates/tsconfigReference.tsx`)
  const result = await graphql(`
    query GetAllHandbookDocs {
      allFile(
        filter: {
          sourceInstanceName: { eq: "tsconfig-reference" }
          ext: { eq: ".md" }
        }
      ) {
        nodes {
          name
          modifiedTime
          absolutePath
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const anyData = result.data as any
  const docs = anyData.allFile.nodes

  docs.forEach(element => {
    const categoriesForLang = path.join(
      __dirname,
      "..",
      "..",
      "..",
      "..",
      "tsconfig-reference",
      "output",
      element.name + ".json"
    )

    const lang = element.name
    if (!isMultiLingual && lang !== "en") return

    // Support urls being consistent with the current infra, e.g. en with no prefix
    const pagePath = (lang === "en" ? "" : "/" + lang) + "/tsconfig"
    addPathToSite(pagePath)

    createPage({
      path: pagePath,
      component: tsConfigRefPage,
      context: {
        locale: element.name,
        tsconfigMDPath: element.absolutePath,
        categoriesPath: categoriesForLang,
      },
    })
  })
}
