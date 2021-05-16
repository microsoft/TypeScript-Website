import { addIncludes, replaceIncludesInCode } from "../src/includes"

const multiExample = `
const a = 1
// - 1
const b = 2
// - 2
const c = 3
`

it("creates a set of examples", () => {
  const map = new Map()
  addIncludes(map, multiExample, "include main")
  expect(map.size == 3)

  expect(map.get("main")).toContain("const c")
  expect(map.get("main-1")).toContain("const a = 1")
  expect(map.get("main-2")).toContain("const b = 2")
})

it("replaces the code", () => {
  const map = new Map()
  addIncludes(map, multiExample, "include main")
  expect(map.size == 3)

  const sample = `// @include: main`
  const replaced = replaceIncludesInCode(map, sample)
  expect(replaced).toMatchInlineSnapshot(`
    "
    const a = 1
    const b = 2
    const c = 3
    "
  `)
})
