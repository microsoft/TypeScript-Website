const remark = require('remark')
const gatsbyRemarkShiki = require('../../gatsby-remark-shikii/dist')
const gatsbyTwoSlash = require('gatsby-remark-twoslasher-code-blocks')
const { readFileSync } = require('fs')

const markdownAST = remark().parse(readFileSync(__dirname + '/index.md', 'utf8'))

// Pre-run twoslash
gatsbyTwoSlash({ markdownAST })

gatsbyRemarkShiki({ markdownAST }).then(() => {
  console.log(markdownAST)
})
