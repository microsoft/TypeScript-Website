const mdx = require("@mdx-js/mdx")
import { UserConfigSettings } from "../../shiki-twoslash/src"
import remarkShikiTwoslash from "../src"

const transpile = async (str: string, opts: UserConfigSettings = { theme: "dark-plus" }) => {
  const jsx = await mdx(str, {
    filepath: "file/path/file.mdx",
    remarkPlugins: [[remarkShikiTwoslash, opts]],
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
  expect(res).toContain("shiki dark-plus twoslash lsp")
})

it("renders twoslash with settings", async () => {
  const content = `
# Hello, world!

\`\`\`ts twoslash
const a = '123'
\`\`\`
  `

  const res = await transpile(content)
  expect(res).toContain("shiki dark-plus twoslash lsp")
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
  expect(res).toContain("shiki dark-plus twoslash lsp")

  // This would bail if the include did not work (because c would not exist in the code sample)
})

it("rendered multiple copies when requested", async () => {
  const content = `
# Hello, world!

\`\`\`ts
const a = 123
\`\`\`
`
  const res = await transpile(content, {
    themes: ["light-plus", "dark-plus"],
  })
  // console.log(res)

  // Basically, we expect two copies of the codeblock
  expect(res.split('"className": "shiki').length).toEqual(3)

  // Make sure that it adds the theme name to the classes
  expect(res).toContain("shiki dark-plus")
  // expect(res).toContain("shiki light-plus twoslash lsp")
})
