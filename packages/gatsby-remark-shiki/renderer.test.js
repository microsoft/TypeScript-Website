const remark = require('remark')
const gatsbyRemarkShiki = require('./index')
const gatsbyTwoSlash = require('gatsby-remark-twoslasher-code-blocks')

const getMarkdownASTForCode = async code => {
  const markdownAST = remark().parse(code)
  gatsbyTwoSlash({ markdownAST })
  await gatsbyRemarkShiki({ markdownAST })
  return markdownAST
}

describe('supports hiding the example code', () => {
  const file = `
hello world

\`\`\`ts twoslash
const a = "123"
const b = "345"
\`\`\`

OK world
`

  it('has all the right metadata set up', async () => {
    const markdownAST = await getMarkdownASTForCode(file)
    const code = markdownAST.children[1]

    // Comes from remark
    expect(code.lang).toEqual('ts')
    expect(code.meta).toEqual('twoslash')
  })

  it('shows the right LSP results', async () => {
    const markdownAST = await getMarkdownASTForCode(file)
    const code = markdownAST.children[1]

    expect(code.value).toContain(`data-lsp`)
    expect(code.value).toContain(`const a: "123"`)
    expect(code.value).toContain(`const b: "345"`)
  })
})
