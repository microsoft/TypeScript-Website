const path = require(`path`)
const { green } = require("chalk")
const { readFileSync } = require("fs")

import { NodePluginArgs, CreatePagesArgs } from "gatsby"
import { addPathToSite } from "../pathsOnSiteTracker"
import { isMultiLingual } from "./languageFilter"

export const createGlossaryPages = async (
  graphql: CreatePagesArgs["graphql"],
  createPage: NodePluginArgs["actions"]["createPage"]
) => {
  console.log(`${green("success")} Creating Glossary pages`)
  const GlossaryTemplatePath = path.resolve(`./src/templates/glossary.tsx`)
  const result = await graphql(`
    query GetAllHandbookDocs {
      allFile(
        filter: { sourceInstanceName: { eq: "glossary" }, ext: { eq: ".md" } }
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
    const lang = element.name
    if (!isMultiLingual && lang !== "en") return

    // prettier-ignore
    const termsForLang = JSON.parse(readFileSync(path.join( __dirname, "..", "..", "..", "..", "glossary", "output", element.name + ".json"), "utf8"))

    // Support urls being consistent with the current infra, e.g. en with no prefix
    const pagePath = (lang === "en" ? "" : "/" + lang) + "/glossary"
    addPathToSite(pagePath)

    createPage({
      path: pagePath,
      component: GlossaryTemplatePath,
      context: {
        locale: element.name,
        glossaryPath: element.absolutePath,
        languageMeta: termsForLang,
      },
    })
  })
}
