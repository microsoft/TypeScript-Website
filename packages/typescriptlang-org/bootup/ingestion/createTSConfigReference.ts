const path = require(`path`)
import { NodePluginArgs, CreatePagesArgs } from "gatsby"

export const createTSConfigReference = async (
  graphql: CreatePagesArgs["graphql"],
  createPage: NodePluginArgs["actions"]["createPage"]
) => {
  const handbookPage = path.resolve(`./src/templates/handbook.tsx`)
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
  const english = docs.find(doc => doc.name === "en" && doc.childMarkdownRemark)

  if (english) {
    console.log("Eng", english)
    createPage({
      path: english.absolutePath,
      component: handbookPage,
      context: {
        slug: "/tsconfig",
        tsconfigMDPath: english.absolutePath,
        isOldHandbook: false,
      },
    })
  }
}
