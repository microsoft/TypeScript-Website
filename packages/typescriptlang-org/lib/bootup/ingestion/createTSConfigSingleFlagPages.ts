import path from "path"
const { green } = require("chalk")

import { NodePluginArgs, CreatePagesArgs, withPrefix } from "gatsby"

export const createTSConfigSingleFlagPages = async (
  graphql: CreatePagesArgs["graphql"],
  createPage: NodePluginArgs["actions"]["createPage"]
) => {
  console.log(`${green("success")} Creating TSConfig One Off Pages`)

  const playPage = path.resolve(`./src/templates/tsconfigOptionOnePage.tsx`)
  const result = await graphql(`
    query GetAllHandbookDocs {
      allFile(
        filter: {
          sourceInstanceName: { eq: "tsconfig-en" }
          extension: { eq: "md" }
        }
      ) {
        nodes {
          id
          name
          absolutePath
          childMarkdownRemark {
            html
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const anyData = result.data as any
  const options = anyData.allFile.nodes

  // {
  //   "id": "419262d5-8911-5ad4-a7a2-91a318ad0e1f",
  //   "name": "allowJs",
  //   "absolutePath": "/Users/ortatherox/dev/typescript/new-website/packages/tsconfig-reference/copy/en/options/allowJs.md"
  //   "html": "..."
  // },

  options.forEach(option => {
    // Intentionally not adding addPathToSite here
    const url = `/tsconfig/${option.name}`

    createPage({
      path: url + ".html",
      component: playPage,
      context: {
        title: option.name,
        lang: "en",
        html: option.childMarkdownRemark.html,
        redirectHref: `/tsconfig#${option.name}`,
      },
    })
  })
}
