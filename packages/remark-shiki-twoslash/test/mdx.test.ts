const mdx = require("@mdx-js/mdx")
import remarkShikiTwoslash from "../src"

const transpile = async (str: string) => {
  const jsx = await mdx(str, {
    filepath: "file/path/file.mdx",
    remarkPlugins: [[remarkShikiTwoslash, { theme: "dark-plus" }]],
  })
  return jsx
}

it("renders twoslash", async () => {
  const content = `
# Hello, world!

\`\`\`ts twoslash
const a = '123'
\`\`\`
  `
  const res = await transpile(content)
  expect(res).toContain("shiki twoslash lsp")
})

it("renders twoslash with settings", async () => {
  const content = `
# Hello, world!

\`\`\`ts twoslash
const a = '123'
\`\`\`
  `

  const res = await transpile(content)
  expect(res).toContain("shiki twoslash lsp")
})

it("handles includes", async () => {
  const content = `
# Hello, world!

\`\`\`twoslash include main
const a = 1
// - 1
const b = 2
// - 2
const c= 3
\`\`\`

OK

\`\`\`ts twoslash
// @include: main
c.toString()
\`\`\`
`
  const res = await transpile(content)
  expect(res).toContain("shiki twoslash lsp")

  // This would bail if the include did not work (because c would not exist in the code sample)
})
