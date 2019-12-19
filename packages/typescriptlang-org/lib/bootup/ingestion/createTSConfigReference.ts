const path = require(`path`)
import { NodePluginArgs, CreatePagesArgs } from "gatsby"

export const createTSConfigReference = async (
  graphql: CreatePagesArgs["graphql"],
  createPage: NodePluginArgs["actions"]["createPage"]
) => {
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
    createPage({
      path: element.name + "/tsconfig",
      component: tsConfigRefPage,
      context: {
        tsconfigMDPath: element.absolutePath,
      },
    })
  })
}
