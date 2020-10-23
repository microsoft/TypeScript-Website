import { createShikiHighlighter, renderers } from "../src/index"

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
      "<pre class=\\"shiki tsconfig lsp\\"><div class='code-container'><code>
      <span style=\\"color: #D4D4D4\\">{</span>
      <span style=\\"color: #D4D4D4\\">  </span><span style=\\"color: #9CDCFE\\">\\"<a aria-hidden=true href='https://www.typescriptlang.org/tsconfig#compilerOptions'><data-lsp lsp=\\"The set of compiler options for your project\\">compilerOptions</data-lsp></a>\\"</span><span style=\\"color: #D4D4D4\\">: {</span>
      <span style=\\"color: #D4D4D4\\">    </span><span style=\\"color: #9CDCFE\\">\\"<a aria-hidden=true href='https://www.typescriptlang.org/tsconfig#module'><data-lsp lsp=\\"Module code generation.\\">module</data-lsp></a>\\"</span><span style=\\"color: #D4D4D4\\">: </span><span style=\\"color: #CE9178\\">\\"commonjs\\"</span>
      <span style=\\"color: #D4D4D4\\">  },</span>
      <span style=\\"color: #D4D4D4\\">  </span><span style=\\"color: #9CDCFE\\">\\"<a aria-hidden=true href='https://www.typescriptlang.org/tsconfig#files'><data-lsp lsp=\\"Include a list of files. Use includes for pattern support.\\">files</data-lsp></a>\\"</span><span style=\\"color: #D4D4D4\\">: [</span>
      <span style=\\"color: #D4D4D4\\">    </span><span style=\\"color: #CE9178\\">\\"core.ts\\"</span>
      <span style=\\"color: #D4D4D4\\">  ]</span>
      <span style=\\"color: #D4D4D4\\">}</span>
      <span style=\\"color: #D4D4D4\\">    </span></code></div></pre>"
    `)
  })
})

describe("with a simple example", () => {
  it("links to the ts website for a compiler option", async () => {
    const highlighter = await createShikiHighlighter({ theme: "dark_vs" })
    const code = `
{
  "compilerOptions": {
    "jsx": "something"
  }
}
    `
    const tokens = highlighter.codeToThemedTokens(code, "json")
    const html = renderers.tsconfigJSONRenderer(tokens, {})

    expect(html.includes("https://www.typescriptlang.org/tsconfig#jsx")).toBeTruthy()
  })

  it("includes a <data-lsp for the hover", async () => {
    const highlighter = await createShikiHighlighter({ theme: "dark_vs" })
    const code = `
{
  "compilerOptions": {
    "jsx": "something"
  }
}
    `
    const tokens = highlighter.codeToThemedTokens(code, "json")
    const html = renderers.tsconfigJSONRenderer(tokens, {})

    expect(html.includes("<data-lsp")).toBeTruthy()
  })
})
