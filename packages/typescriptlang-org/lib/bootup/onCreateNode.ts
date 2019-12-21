import { GatsbyNode, Node } from "gatsby"
import { readFileSync } from "fs"

interface TSConfigNode extends Node {
  path: string
  context: {
    categoriesPath: string
  }
}

export const onCreateNode: GatsbyNode["onCreateNode"] = ({
  node,
  actions,
  getNode,
}) => {
  const { createNodeField } = actions

  // if (isTSConfigNode(node)) {
  //   const categoryPath = node.context.categoriesPath
  //   const categoriesJSON = JSON.parse(readFileSync(categoryPath, "utf8"))

  //   createNodeField({
  //     node,
  //     name: `categories`,
  //     value: categoriesJSON,
  //   })
  // }
}

// function isTSConfigNode(node: any): node is TSConfigNode {
//   return node.path && node.path.endsWith("/tsconfig")
// }
