import { canHighlightLang, renderCodeToHTML, runTwoSlash, createShikiHighlighter, renderers } from "../src/index"
import { join } from "path"

describe("with a simple example", () => {
  it("renders a tsconfig", async () => {
    const highlighter = await createShikiHighlighter({ theme: "dark_vs" })
    const code = `
{
  "compilerOptions": {
    "module": "commonjs"
  },
  "files": [
    "core.ts"
  ]
}
    `
    const tokens = highlighter.codeToThemedTokens(code, "json")
    const html = renderers.tsconfigJSONRenderer(tokens, {})

    expect(html).toMatchInlineSnapshot(`
      "<pre class=\\"shiki\\"><div class='code-container'><code>
      <span style=\\"color: #D4D4D4\\">{</span>
      <span style=\\"color: #D4D4D4\\">  </span><span style=\\"color: #9CDCFE\\">\\"compilerOptions\\"</span><span style=\\"color: #D4D4D4\\">: {</span>
      <span style=\\"color: #D4D4D4\\">    </span><span style=\\"color: #9CDCFE\\"><data-lsp lsp=\\"Sets the expected module system for your runtime\\">\\"module\\"</data-lsp></span><span style=\\"color: #D4D4D4\\">: </span><span style=\\"color: #CE9178\\">\\"commonjs\\"</span>
      <span style=\\"color: #D4D4D4\\">  },</span>
      <span style=\\"color: #D4D4D4\\">  </span><span style=\\"color: #9CDCFE\\"><data-lsp lsp=\\"Include a set list of files, does not support globs\\">\\"files\\"</data-lsp></span><span style=\\"color: #D4D4D4\\">: [</span>
      <span style=\\"color: #D4D4D4\\">    </span><span style=\\"color: #CE9178\\">\\"core.ts\\"</span>
      <span style=\\"color: #D4D4D4\\">  ]</span>
      <span style=\\"color: #D4D4D4\\">}</span>
      <span style=\\"color: #D4D4D4\\">    </span></code></div></pre>"
    `)
  })
})
