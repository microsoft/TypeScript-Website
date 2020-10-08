import { canHighlightLang, renderCodeToHTML, runTwoSlash, createShikiHighlighter } from "../src/index"

describe("langs", () => {
  it("gives reasonable results", () => {
    expect(canHighlightLang("js")).toBeTruthy()
    expect(canHighlightLang("ts")).toBeTruthy()
    expect(canHighlightLang("tsx")).toBeTruthy()
    expect(canHighlightLang("html")).toBeTruthy()

    expect(canHighlightLang("adasdasd")).toBeFalsy()
  })
})
