import { GatsbyNode } from "gatsby"
const { createFilePath } = require(`gatsby-source-filesystem`)

export const onCreateNode: GatsbyNode["onCreateNode"] = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  // This wasn't ever passing anyway
  // if (node.context === `MarkdownRemark`) {
  //   console.log("got through")
  //   const value = createFilePath({ node, getNode })
  //   createNodeField({
  //     node,
  //     name: `slug`,
  //     value,
  //   })
  // }
}
