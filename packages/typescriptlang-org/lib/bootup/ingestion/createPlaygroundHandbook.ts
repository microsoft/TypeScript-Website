import path from "path"
const { green } = require("chalk")

import { NodePluginArgs, CreatePagesArgs, withPrefix } from "gatsby"

export const createPlaygroundHandbookPages = async (
  graphql: CreatePagesArgs["graphql"],
  createPage: NodePluginArgs["actions"]["createPage"]
) => {
  console.log(`${green("success")} Creating Playground Handbook Pages`)

  const result = await graphql(`
    query GetAllHandbookDocs {
      allFile(
        filter: {
          sourceInstanceName: { eq: "playground-handbook" }
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

    const idize = string =>
      string
        .toLowerCase()
        .replace(/[^\x00-\x7F]/g, "-")
        .replace(/ /g, "-")
        .replace(/\//g, "-")
        .replace(/\+/g, "-")

    const id = idize(path.basename(option.absolutePath.replace(".md", "")))
    const url = `/_playground-handbook/${id}`
    createPage({
      path: url + ".html",
      component: path.resolve(`./src/templates/playgroundHandbook.tsx`),
      context: {
        title: option.name,
        lang: "en",
        html: option.childMarkdownRemark.html,
      },
    })
  })
}
