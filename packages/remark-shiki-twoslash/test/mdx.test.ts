const mdx = require("@mdx-js/mdx")

it("renders", async () => {
  const content = `
  # Hello, world!
  `
  const transpile = async () => {
    const jsx = await mdx(content, {
      filepath: "file/path/file.mdx",
      remarkPlugins: [
        // remarkGfm.call({ }),
        // () => (ctx: any) => gatsbyRemarkShikiTwoslash({ markdownAST: ctx }, { theme: 'Material-Theme-Darker' }, { nodeModulesTypesPath: undefined }),
      ],
    })
    return jsx
  }
  const res = await transpile()
  console.log(res)
})
