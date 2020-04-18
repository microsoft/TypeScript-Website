const path = require(`path`)
import { NodePluginArgs, CreatePagesArgs } from "gatsby"
import {
  getNextPageID,
  getPreviousPageID,
} from "../../../src/lib/oldHandbookNavigation"

export const createOldHandbookPages = async (
  graphql: CreatePagesArgs["graphql"],
  createPage: NodePluginArgs["actions"]["createPage"]
) => {
  const handbookPage = path.resolve(`./src/templates/handbook.tsx`)
  const result = await graphql(`
    query GetAllHandbookDocs {
      allFile(
        filter: {
          sourceInstanceName: { eq: "handbook-v1" }
          extension: { eq: "md" }
        }
      ) {
        nodes {
          id
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

  docs.forEach((post: any) => {
    const id = idFromURL(post.childMarkdownRemark.frontmatter.permalink)

    let previousID = undefined
    const previousPath = getPreviousPageID(id)
    if (previousPath) {
      const path = getPreviousPageID(id)!.path
      // prettier-ignore
      const previousDoc = docs.find((d) => d.childMarkdownRemark.frontmatter.permalink === path)
      if (previousDoc) previousID = previousDoc.id
    }

    let nextID = undefined
    const nextPath = getNextPageID(id)
    if (nextPath) {
      const path = getNextPageID(id)!.path
      // prettier-ignore
      const nextDoc = docs.find((d) => d.childMarkdownRemark.frontmatter.permalink === path)
      if (nextDoc) nextID = nextDoc.id
    }
    // const nextPath = getNextPageID(id) && getNextPageID(id)!.path

    if (post.childMarkdownRemark) {
      createPage({
        path: post.childMarkdownRemark.frontmatter.permalink,
        component: handbookPage,
        context: {
          slug: post.childMarkdownRemark.frontmatter.permalink,
          previousID,
          nextID,
          isOldHandbook: true,
        },
      })
    } else {
      console.log(`skipping page generation for ${post.name}`)
    }
  })
}

export const idFromURL = (url: string) => {
  // TODO: this needs to support ID's like:         id: "templates/global-plugin-d-ts",
  return url.split("/").pop()!.replace(".html", "") || "index"
}
