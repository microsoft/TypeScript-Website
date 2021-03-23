import { parseCodeFenceInfo, shouldBeHighlightable, shouldHighlightLine } from "../src/parseCodeFenceInfo"

it("ignores twoslash", () => {
  const parsed = parseCodeFenceInfo("ts", "twoslash {12,3}")
  expect(parsed.meta).toMatchInlineSnapshot(`
    Object {
      "12": true,
      "3": true,
    }
  `)
})

it("handles strings", () => {
  const parsed = parseCodeFenceInfo("ts", `twoslash {one:123, four: 2}`)
  expect(parsed.meta).toMatchInlineSnapshot(`
    Object {
      "four": 2,
      "one": 123,
    }
  `)
})

it("handles ranges", () => {
  const parsed = parseCodeFenceInfo("ts", `twoslash {1-23}`)
  expect(parsed.meta).toMatchInlineSnapshot(`
    Object {
      "1-23": true,
    }
  `)
})

it("correctly says it's highlightable", () => {
  const parsed = parseCodeFenceInfo("ts", `twoslash {1-23}`)
  expect(shouldBeHighlightable(parsed.meta)).toBeTruthy()

  const number = parseCodeFenceInfo("ts", `twoslash {1}`)
  expect(shouldBeHighlightable(number.meta)).toBeTruthy()
})

it("correctly says a particular line is highlightable", () => {
  const parsed = parseCodeFenceInfo("ts", `twoslash {4-23}`)
  expect(shouldBeHighlightable(parsed.meta)).toBeTruthy()

  const highlight = shouldHighlightLine(parsed.meta)
  expect(highlight(1)).toBeFalsy()
  expect(highlight(3)).toBeFalsy()

  expect(highlight(4)).toBeTruthy()
  expect(highlight(6)).toBeTruthy()
  expect(highlight(12)).toBeTruthy()
  expect(highlight(23)).toBeTruthy()

  expect(highlight(24)).toBeFalsy()
})
