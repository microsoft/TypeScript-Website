import { twoslasher } from "../src/index"
import { createDefaultMapFromNodeModules } from "@typescript/vfs"

const dt = `
declare namespace G {
      function hasMagic(pattern: string, options?: IOptions): boolean;
}        
export = G;
`

it("works with a dependency in @types for the project", () => {
  const fsMap = createDefaultMapFromNodeModules({})
  fsMap.set("/node_modules/@types/glob/index.d.ts", dt)

  const file = `
import glob from "glob"
glob.hasMagic("OK")
//   ^?
  `
  const result = twoslasher(file, "ts", { fsMap })
  expect(result.errors).toEqual([])
  expect(result.queries[0].text!.includes("hasMagic")).toBeTruthy()
})
