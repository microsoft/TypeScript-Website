const { createFilePath } = require(`gatsby-source-filesystem`)

const onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions
  console.log("Creating node: ")
  console.log(node)

  if (node.internal.type === `MarkdownRemark`) {
    const value = createFilePath({ node, getNode })
    createNodeField({
      name: `slug`,
      node,
      value,
    })
  }
}

module.exports = {
  onCreateNode
}
