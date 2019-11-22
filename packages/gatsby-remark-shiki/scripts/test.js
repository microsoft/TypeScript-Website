const remark = require('remark')
const gatsbyRemarkShiki = require('../')
const { readFileSync } = require('fs')

const markdownAST = remark().parse(readFileSync(__dirname + '/index.md', 'utf8'))
gatsbyRemarkShiki({ markdownAST }).then(() => {
  console.log(markdownAST)
})
