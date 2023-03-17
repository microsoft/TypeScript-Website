import { getCompilerOptionsFromParams, getDefaultSandboxCompilerOptions } from "../src/compilerOptions"
import ts from "typescript"

const fauxMonaco: any = {
  languages: {
    typescript: {
      ModuleResolutionKind: ts.ModuleResolutionKind,
      ScriptTarget: ts.ScriptTarget,
      JsxEmit: ts.JsxEmit,
      ModuleKind: ts.ModuleKind,
    },
  },
}

describe(getCompilerOptionsFromParams, () => {
  it("ignores compiler flags which are the same as the defaults", () => {
    // noImplicitReturns=true is the default, and shouldnt be in the object
    const params = new URLSearchParams("?noImplicitThis=false&noImplicitReturns=true#code/JYOw")
    const defaults = getDefaultSandboxCompilerOptions({ filetype: "js" } as any, fauxMonaco, { versionMajorMinor: "4.9"})

    expect(getCompilerOptionsFromParams(defaults, ts, params)).toMatchInlineSnapshot(`
      Object {
        "noImplicitThis": false,
      }
    `)
  })

  it("ignores non-compiler flags", () => {
    const params = new URLSearchParams("?asdasdasdasd=false")
    const defaults = getDefaultSandboxCompilerOptions({ filetype: "js" } as any, fauxMonaco, { versionMajorMinor: "4.9"})

    expect(getCompilerOptionsFromParams(defaults, ts, params)).toMatchInlineSnapshot(`Object {}`)
  })

  it("handles mapped types like target et", () => {
    const params = new URLSearchParams("?target=6")
    const defaults = getDefaultSandboxCompilerOptions({ filetype: "js" } as any, fauxMonaco, { versionMajorMinor: "4.9"})

    expect(getCompilerOptionsFromParams(defaults, ts, params)).toMatchInlineSnapshot(`
      Object {
        "target": 6,
      }
    `)
  })

  it("handles settings options which haven't been given defaults in the monaco defaults", () => {
    const search = "?ts=4.4.0-beta&exactOptionalPropertyTypes=true#code/JYOw"
    const params = new URLSearchParams(search)
    expect(params.has("exactOptionalPropertyTypes")).toBeTruthy()

    const defaults = getDefaultSandboxCompilerOptions({ filetype: "js" } as any, fauxMonaco, { versionMajorMinor: "4.9"})

    expect(getCompilerOptionsFromParams(defaults, ts, params)).toMatchInlineSnapshot(`
      Object {
        "exactOptionalPropertyTypes": true,
      }
    `)
  })

  it("handles TS >= 5.0", () => {
    const params = new URLSearchParams("?target=6")
    const defaults = getDefaultSandboxCompilerOptions({ filetype: "js" } as any, fauxMonaco, { versionMajorMinor: "5.0"} as any)

    expect(getCompilerOptionsFromParams(defaults, ts, params)).toMatchInlineSnapshot(`
      Object {
        "target": 6,
      }
    `)
  })
})
