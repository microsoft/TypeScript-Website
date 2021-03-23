const mdx = require("@mdx-js/mdx")
import remarkShikiTwoslash from "../src"

it("renders twoslash", async () => {
  const content = `
  # Hello, world!

  \`\`\`ts twoslash
  const a = '123'
  \`\`\`
  `
  const transpile = async () => {
    const jsx = await mdx(content, {
      filepath: "file/path/file.mdx",
      remarkPlugins: [remarkShikiTwoslash],
    })
    return jsx
  }
  const res = await transpile()
  expect(res).toContain("shiki twoslash lsp")
})

it("renders twoslash with settings", async () => {
  const content = `
  # Hello, world!

  \`\`\`ts twoslash
  const a = '123'
  \`\`\`
  `
  const transpile = async () => {
    const jsx = await mdx(content, {
      filepath: "file/path/file.mdx",
      remarkPlugins: [[remarkShikiTwoslash, { theme: "dark-plus" }]],
    })
    return jsx
  }
  const res = await transpile()
  expect(res).toContain("shiki twoslash lsp")
})
