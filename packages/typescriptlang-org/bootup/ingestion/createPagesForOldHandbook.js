const path = require(`path`)

/**
 * @param { import("gatsby").NodePluginArgs["graphql"]} graphql 
 * @param { import("gatsby").NodePluginArgs["actions"]["createPage"]} createPage 
 */
const createOldHandbookPages = async (graphql, createPage) => {
  const handbookPage = path.resolve(`../src/templates/handbook.js`)
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
  
  const v1HandbookDocs = result.data.allFile.edges
  v1HandbookDocs.forEach((post, index) => {
    const previous = index === posts.length - 1 ? null : posts[index + 1].node
    const next = index === 0 ? null : posts[index - 1].node
  
    console.log("Making page")
    createPage({
      path: post.node.childMarkdownRemark.permalink,
      component: handbookPage,
      context: {
        slug: post.node.childMarkdownRemark.permalink,
        previous,
        next,
      },
    })
  })
  
}

module.exports = {
  createOldHandbookPages
}
