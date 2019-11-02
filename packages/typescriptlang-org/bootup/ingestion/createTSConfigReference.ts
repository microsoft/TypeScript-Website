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

  // start with just the english one
  console.log(docs)
  const english = docs.find(doc => doc.name === "en")

  if (!english) {
    throw new Error("Could not find the TSConfig Reference markdown file: you probably need to run `yarn bootstrap` in the project root")
  }

  createPage({
    path: "/tsconfig",
    component: tsConfigRefPage,
    context: {
      tsconfigMDPath: english.absolutePath,
    },
  })
}
