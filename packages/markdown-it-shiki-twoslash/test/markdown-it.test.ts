import { markdownItShikiTwoslashSetup } from "../src/index"
import markdownShiki from "markdown-it-shiki"

import MarkdownIt from "markdown-it"

describe("with a simple example", () => {
  const file = `
hello world

\`\`\`ts twoslash
// Hello
const a = "123"
const b = "345"
\`\`\`

OK world
`

  it.only("has all the right metadata set up", async () => {
    const md = MarkdownIt()

    const shiki = await markdownItShikiTwoslashSetup({
      theme: "nord",
    })
    md.use(shiki)

    const html = md.render(file)
    expect(html).toContain("shiki  node twoslash lsp")
  })
})
