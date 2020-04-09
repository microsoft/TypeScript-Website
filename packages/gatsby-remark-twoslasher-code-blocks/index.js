// // @ts-check

const visit = require('unist-util-visit')
const { twoslasher } = require(require.resolve('@typescript/twoslash'))

/**
 * The function doing the work of transforming any codeblock samples
 * which have opted-in to the twoslash pattern.
 *
 * @param {Node} node
 */
const visitor = (node) => {
  if (!node.meta || !node.meta.includes('twoslash')) return

  const results = twoslasher(node.value, node.lang)
  node.value = results.code
  node.lang = results.extension
  node.twoslash = results
}

/** The plugin API */
module.exports = ({ markdownAST }) => {
  visit(markdownAST, 'code', visitor)
}

module.exports.visitor = visitor
