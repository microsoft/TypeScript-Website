import { twoslasher } from "../src/index"

it("extracts custom tags", () => {
  const file = `
// @thing: OK, sure
const a = "123"
// @thingTwo - This should stay (note the no ':')
const b = 12331234
  `
  const result = twoslasher(file, "ts", { customTags: ["thing"] })
  expect(result.tags.length).toEqual(1)

  expect(result.code).toMatchInlineSnapshot(`
    "
    const a = \\"123\\"
    // @thingTwo - This should stay (note the no ':')
    const b = 12331234
      "
  `)

  const tag = result.tags[0]
  expect(tag).toMatchInlineSnapshot(`
    Object {
      "annotation": "OK, sure",
      "line": 1,
      "name": "thing",
    }
  `)
})

it("removes tags which are cut", () => {
  const file = `
// @thing: OK, sure
const a = "123"
// ---cut---
// @thing: This one only
const another = ''
    `
  const result = twoslasher(file, "ts", { customTags: ["thing"] })
  expect(result.tags.length).toEqual(1)

  expect(result.code).toMatchInlineSnapshot(`
    "const another = ''
        "
  `)

  const tag = result.tags[0]
  expect(tag).toMatchInlineSnapshot(`
    Object {
      "annotation": "This one only",
      "line": 0,
      "name": "thing",
    }
  `)
})
