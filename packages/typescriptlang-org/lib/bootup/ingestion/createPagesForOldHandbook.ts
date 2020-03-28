const path = require(`path`)
const dom = require("jsdom")
import { NodePluginArgs, CreatePagesArgs } from "gatsby"

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
          name
          modifiedTime

          childMarkdownRemark {
            frontmatter {
              permalink
            }
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
  const docs = anyData.allFile.nodes

  // create a map(mdToSlug) to replace markdown links to permalinks.
  // E.g. mdToSlug: {foo.md: '/docs/bar/foo.html', ...}
  const mdToSlug: { [mdName: string]: string } = docs.reduce((result, next) => {
    return next.childMarkdownRemark ? {
      ...result,
      [encodeURI(next.name)+".md"]: // encodeURI in case name contains space. ' ' -> '%20'
        next.childMarkdownRemark.frontmatter.permalink,
    } : result
  }, {})
  // console.log("mdToSlug:", mdToSlug)

  const parser = new (new dom.JSDOM()).window.DOMParser() as DOMParser
  docs.forEach((post: any, index: number) => {
    const previous = index === docs.length - 1 ? null : docs[index + 1].node
    const next = index === 0 ? null : docs[index - 1].node

    if (post.childMarkdownRemark) {

      const html = (() => { // html string whose markdown links are replaced to permalinks.
        const document = parser.parseFromString(post.childMarkdownRemark.html, "text/html")
        document.querySelectorAll("a").forEach(a => {
          const link = a.getAttribute("href") || ""
          const mdName = Object.keys(mdToSlug).find(mdName => {
            const regexp = new RegExp(`/${mdName}|^${mdName}`)
            return regexp.test(link)
          })
          if (mdName) {
            const hashPos = link.lastIndexOf("#")
            const hashLink = hashPos > 0 ? link.substr(hashPos) : ""
            a.setAttribute("href", mdToSlug[mdName]+hashLink)
            // console.log("converted a link in ", post.name , ":", link, "->", mdToSlug[mdName]+hashLink)
          }
        })
        return document.documentElement.innerHTML
      })()

      createPage({
        path: post.childMarkdownRemark.frontmatter.permalink,
        component: handbookPage,
        context: {
          slug: post.childMarkdownRemark.frontmatter.permalink,
          previous,
          next,
          isOldHandbook: true,
          html,
        },
      })
    } else {
      console.log(`skipping page generation for ${post.name}`)
    }
  })
}
