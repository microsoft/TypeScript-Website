import { canHighlightLang, renderCodeToHTML, runTwoSlash, createShikiHighlighter } from "../src/index"
import { join } from "path"

describe("langs", () => {
  it("gives reasonable results", () => {
    expect(canHighlightLang("js")).toBeTruthy()
    expect(canHighlightLang("ts")).toBeTruthy()
    expect(canHighlightLang("tsx")).toBeTruthy()
    expect(canHighlightLang("html")).toBeTruthy()

    expect(canHighlightLang("adasdasd")).toBeFalsy()
  })
})

describe("with a simple example", () => {
  it("shows the right LSP results", async () => {
    const highlighter = await createShikiHighlighter({ theme: "dark_vs" })
    const code = `
// Hello
const a = "123"
const b = "345"
    `
    const twoslash = runTwoSlash(code, "ts", {})
    const html = renderCodeToHTML(twoslash.code, "ts", ["twoslash"], {}, highlighter, twoslash)

    expect(html).toContain(`data-lsp`)
    expect(html).toContain(`<data-lsp lsp='const a:`)
    expect(html).toContain(`<data-lsp lsp='const b:`)
    expect(html.split("<data-lsp").length).toEqual(twoslash.staticQuickInfos.length + 1)
  })
})

describe("with a more complex example", () => {
  const file = `
// @errors: 2345
function longest<T extends { length: number }>(a: T, b: T) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'string'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);

const hello = longest("alice", "bob");
console.log(hello);
`

  it("shows the right LSP results", async () => {
    const highlighter = await createShikiHighlighter({ theme: "dark_vs" })

    const twoslash = runTwoSlash(file, "ts", {})
    const html = renderCodeToHTML(twoslash.code, "ts", ["twoslash"], {}, highlighter, twoslash)

    expect(html).toContain(`data-lsp`)
    expect(html).toContain(`<data-lsp lsp='function longest`)

    // Error message
    expect(html).toContain(`span class="error"`)
    expect(html).toContain(`span class="error-behind"`)
    // The error code
    expect(html).toContain(`<span class="code">2345</span>`)
  })

  it("shows the right LSP results when a theme doesnt have unique tokens for identifiers", async () => {
    const highlighter = await createShikiHighlighter({ theme: "dark_vs" })

    const twoslash = runTwoSlash(file, "ts", {})
    const html = renderCodeToHTML(twoslash.code, "ts", ["twoslash"], {}, highlighter, twoslash)

    expect(html).toContain(`<data-lsp lsp='function longest`)

    // Error message
    expect(html).toContain(`span class="error"`)
    expect(html).toContain(`span class="error-behind"`)
    // The error code
    expect(html).toContain(`<span class="code">2345</span>`)

    expect(html.split("<data-lsp").length).toEqual(twoslash.staticQuickInfos.length + 1)
  })
})

describe("raw LSP details example", () => {
  const file = `
// @errors: 2345
function longest<T extends { length: number }>(a: T, b: T) {
  if (a.length >= b.length) {
    return a;
  } else {
    return b;
  }
}

// longerArray is of type 'number[]'
const longerArray = longest([1, 2], [1, 2, 3]);
// longerString is of type 'string'
const longerString = longest("alice", "bob");
// Error! Numbers don't have a 'length' property
const notOK = longest(10, 100);

const hello = longest("alice", "bob");
console.log(hello);
`

  it("shows the right LSP results when a theme doesnt have unique tokens for identifiers", async () => {
    const highlighter = await createShikiHighlighter({ theme: "dark_vs" })

    const twoslash = runTwoSlash(file, "ts", {})
    const html = renderCodeToHTML(twoslash.code, "ts", ["twoslash"], {}, highlighter, twoslash)

    expect(html).toContain(`data-lsp`)
    expect(html).toContain(`<data-lsp lsp='function longest`)

    expect(html.split("<data-lsp").length).toEqual(twoslash.staticQuickInfos.length + 1)
  })

  it("shows the right LSP results with the typescript site theme", async () => {
    const highlighter = await createShikiHighlighter({
      theme: join(__dirname, "..", "..", "typescriptlang-org", "lib", "themes", "typescript-beta-light.json") as any,
    })

    const twoslash = runTwoSlash(file, "ts", {})
    const html = renderCodeToHTML(twoslash.code, "ts", ["twoslash"], {}, highlighter, twoslash)

    expect(html).toContain(`data-lsp`)
    expect(html).toContain(`<data-lsp lsp='function longest`)
    expect(html.split("<data-lsp").length).toEqual(twoslash.staticQuickInfos.length + 1)
  })
})

it("handles multi-line queries with comments", async () => {
  const highlighter = await createShikiHighlighter({
    theme: join(__dirname, "..", "..", "typescriptlang-org", "lib", "themes", "typescript-beta-light.json") as any,
  })

  const file = `
  function f() {
    return { x: 10, y: 3 };
  }
  type P = ReturnType<typeof f>;
  //   ^?
`
  const twoslash = runTwoSlash(file, "ts", {})
  const html = renderCodeToHTML(twoslash.code, "ts", ["twoslash"], {}, highlighter, twoslash)

  expect(html).toMatchInlineSnapshot(`
    "<pre class=\\"shiki twoslash lsp\\"><div class='code-container'><code><span style=\\"color: #D4D4D4\\">  </span><span style=\\"color: #569CD6\\">function</span><span style=\\"color: #D4D4D4\\"> <data-lsp lsp='function f(): {&amp;#13;    x: number;&amp;#13;    y: number;&amp;#13;}'>f</data-lsp>() {</span>
    <span style=\\"color: #D4D4D4\\">    </span><span style=\\"color: #569CD6\\">return</span><span style=\\"color: #D4D4D4\\"> { <data-lsp lsp='(property) x: number'>x</data-lsp>: </span><span style=\\"color: #B5CEA8\\">10</span><span style=\\"color: #D4D4D4\\">, <data-lsp lsp='(property) y: number'>y</data-lsp>: </span><span style=\\"color: #B5CEA8\\">3</span><span style=\\"color: #D4D4D4\\"> };</span>
    <span style=\\"color: #D4D4D4\\">  }</span>
    <span style=\\"color: #D4D4D4\\">  </span><span style=\\"color: #569CD6\\">type</span><span style=\\"color: #D4D4D4\\"> <data-lsp lsp='type P = {&amp;#13;    x: number;&amp;#13;    y: number;&amp;#13;}'>P</data-lsp> = <data-lsp lsp='type ReturnType&amp;lt;T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any'>ReturnType</data-lsp>&lt;</span><span style=\\"color: #569CD6\\">typeof</span><span style=\\"color: #D4D4D4\\"> <data-lsp lsp='function f(): {&amp;#13;    x: number;&amp;#13;    y: number;&amp;#13;}'>f</data-lsp>>;</span>
    <span class='query'>  //   ^ = type P = {
      //       x: number;
      //       y: number;
      //   }</span></code><a href='https://www.typescriptlang.org/play/#code/FAAhDMFcDsGMBcCWB7aEAUBKEBvUYQAnAU3kkLRxAA8AuEARgAYAaEAT3oGYQBfAbny988dgAdiIAAogAvCABKpctAAq44gB5RE5OAgA+QWAD0JggD0A-MCA'>Try</a></div></pre>"
  `)
})
