import { GatsbyNode } from "gatsby"
const { createFilePath } = require(`gatsby-source-filesystem`)

export const onCreateNode: GatsbyNode["onCreateNode"] = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  
  if (node.context === `MarkdownRemark`) {
    console.log("ADDING")
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}
