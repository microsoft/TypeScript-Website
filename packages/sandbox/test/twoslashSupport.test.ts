import { extractTwoSlashCompilerOptions } from "../src/twoslashSupport"
import typescript from "typescript"

const sandboxMock: any = (code: string) => ({
  getText: () => code,
  ts: typescript,
})

describe("gets twoslash compiler error messages", () => {
  it("gets the right vars", () => {
    const sandbox = sandboxMock(`
// @noImplicitAny: false
// @target: ES2015

// This will not throw because of the noImplicitAny
function fn(s) {
  console.log(s.subtr(3))
}

fn(42)
`)
    const compilerOptions = extractTwoSlashCompilerOptions(sandbox.ts)(sandbox.getText())
    expect(compilerOptions).toMatchInlineSnapshot(`
      {
        "noImplicitAny": false,
        "target": 2,
      }
    `)
  })

  it("ignores unknown vars", () => {
    const sandbox = sandboxMock(`
// @noImplicny: false
// @target: ES2015

// This will not throw because of the noImplicitAny
function fn(s) {
  console.log(s.subtr(3))
}

fn(42)
`)
    const compilerOptions = extractTwoSlashCompilerOptions(sandbox.ts)(sandbox.getText())
    expect(compilerOptions).toMatchInlineSnapshot(`
      {
        "target": 2,
      }
    `)
  })
})
