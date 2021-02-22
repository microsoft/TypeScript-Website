const path = require(`path`)
const fs = require(`fs`)
const { green } = require("chalk")
import { NodePluginArgs, CreatePagesArgs } from "gatsby"
import {
  getDocumentationNavForLanguage,
  getNextPageID,
  getPreviousPageID,
  SidebarNavItem,
} from "../../../src/lib/documentationNavigation"
import { addPathToSite } from "../pathsOnSiteTracker"
import { isMultiLingual } from "./languageFilter"

export const createDocumentationPages = async (
  graphql: CreatePagesArgs["graphql"],
  createPage: NodePluginArgs["actions"]["createPage"]
) => {
  console.log(`${green("success")} Creating Documentation Pages`)
  const handbookPage = path.resolve(`./src/templates/documentation.tsx`)
  const result = await graphql(`
    query GetAllHandbookDocs {
      allFile(
        filter: {
          sourceInstanceName: { eq: "documentation" }
          extension: { eq: "md" }
        }
      ) {
        nodes {
          id
          name
          modifiedTime
          absolutePath

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

  // prettier-ignore
  const documentationCopyPath = path.join(__dirname, "..", "..", "..", "..", "documentation", "copy")
  const langs = fs
    .readdirSync(documentationCopyPath)
    .filter(f => fs.statSync(path.join(documentationCopyPath, f)).isDirectory())

  const anyData = result.data as any
  const docs = anyData.allFile.nodes as any

  const findWithPage = (item: SidebarNavItem, permalink: string) => {
    if (item.permalink === permalink) return item.id
    if (!item.items) return false
    for (const subItem of item.items) {
      const foundID = findWithPage(subItem, permalink)
      if (foundID) return foundID
    }
    return undefined
  }

  docs.forEach((post: any) => {
    const permalink = post.childMarkdownRemark.frontmatter.permalink
    if (!permalink)
      // prettier-ignore
      throw new Error(`Did not find a permalink for page: ${JSON.stringify(post)}`)

    const lang = langs.find(l => permalink.startsWith("/" + l + "/")) || "en"
    if (!isMultiLingual && lang !== "en") return

    const handbookNav = getDocumentationNavForLanguage(lang)

    const fakeTopRoot = {
      id: "if-you-see-this-there-is-a-bug",
      items: handbookNav,
      title: "misc",
    }
    const id = findWithPage(fakeTopRoot, permalink)

    let previousID = undefined
    let nextID = undefined
    if (id) {
      const previousPath = getPreviousPageID(handbookNav, id)
      if (previousPath) {
        const path = getPreviousPageID(handbookNav, id)!.path
        // prettier-ignore
        const previousDoc = docs.find((d) => d.childMarkdownRemark.frontmatter.permalink === path)
        if (previousDoc) previousID = previousDoc.id
      }

      const nextPath = getNextPageID(handbookNav, id)
      if (nextPath) {
        const path = getNextPageID(handbookNav, id)!.path
        // prettier-ignore
        const nextDoc = docs.find((d) => d.childMarkdownRemark.frontmatter.permalink === path)
        if (nextDoc) nextID = nextDoc.id
      }
    }

    const repoRoot = path.join(process.cwd(), "..", "..")
    const repoPath = post.absolutePath.replace(repoRoot, "")

    if (post.childMarkdownRemark) {
      const path = post.childMarkdownRemark.frontmatter.permalink
      addPathToSite(path)

      createPage({
        path,
        component: handbookPage,
        context: {
          id: id,
          slug: path,
          repoPath,
          previousID,
          nextID,
          lang,
          modifiedTime: post.modifiedTime,
        },
      })
    } else {
      console.log(`skipping page generation for ${post.name}`)
    }
  })
}
