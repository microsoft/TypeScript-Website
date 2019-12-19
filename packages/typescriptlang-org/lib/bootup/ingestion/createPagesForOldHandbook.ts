const path = require(`path`)
import { NodePluginArgs, CreatePagesArgs } from "gatsby"

export const createOldHandbookPages = async (
  graphql: CreatePagesArgs["graphql"],
  createPage: NodePluginArgs["actions"]["createPage"]
) => {
  const handbookPage = path.resolve(`./src/templates/handbook.tsx`)
  const result = await graphql(`
    query GetAllHandbookDocs {
      allFile(filter: { sourceInstanceName: { eq: "handbook-v1" } }) {
        nodes {
          name
          modifiedTime

          childMarkdownRemark {
            frontmatter {
              permalink
            }
          }
        }
      }
    }
  `)

  if (result.errors) {
    throw result.errors
  }

  const anyData = result.data as any
  const docs = anyData.allFile.nodes

  docs.forEach((post: any, index: number) => {
    const previous = index === docs.length - 1 ? null : docs[index + 1].node
    const next = index === 0 ? null : docs[index - 1].node

    if (post.childMarkdownRemark) {
      createPage({
        path: post.childMarkdownRemark.frontmatter.permalink,
        component: handbookPage,
        context: {
          slug: post.childMarkdownRemark.frontmatter.permalink,
          previous,
          next,
          isOldHandbook: true,
        },
      })
    } else {
      console.log(`skipping page generation for ${post.name}`)
    }
  })
}
