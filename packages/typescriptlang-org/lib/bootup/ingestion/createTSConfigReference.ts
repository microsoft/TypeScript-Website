const path = require(`path`)
const fs = require(`fs`)
const { green } = require("chalk")

import { read as readMarkdownFile } from "gray-matter"
import { NodePluginArgs, CreatePagesArgs } from "gatsby"
import { addPathToSite } from "../pathsOnSiteTracker"
import { isMultiLingual } from "./languageFilter"
import remark = require("remark")
import remarkHTML = require("remark-html")

const parseMarkdown = (md: string) =>
  remark().use(remarkHTML).processSync(md).toString()

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
    const lang = element.name
    if (lang.includes("-")) {
      return
    }

    // prettier-ignore
    const categoriesForLang = path.join( __dirname, "..", "..", "..", "..", "tsconfig-reference", "output", element.name + ".json")

    // prettier-ignore
    const localeIntro = path.join( __dirname, "..", "..", "..", "..", "tsconfig-reference", "copy", lang, "intro.md")
    // prettier-ignore
    const enIntro = path.join( __dirname, "..", "..", "..", "..", "tsconfig-reference", "copy", "en", "intro.md")
    const introPath = fs.existsSync(localeIntro) ? localeIntro : enIntro
    const intro = readMarkdownFile(introPath)
    const introHTML = parseMarkdown(intro.content)

    if (lang.length !== 2) return
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
        intro: {
          html: introHTML,
          header: intro.data.header,
          preview: intro.data.firstLine,
        },
        categories: require(categoriesForLang).categories,
      },
    })
  })
}
