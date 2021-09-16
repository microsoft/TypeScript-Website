import { getReferencesForModule } from "../src/index"
import * as ts from "typescript"

describe(getReferencesForModule, () => {
  it("extracts imports", () => {
    const code = "import 'abc'"
    expect(getReferencesForModule(ts, code).map(m => m.module)).toEqual(["abc"])
  })

  it("extracts from imports", () => {
    const code = "import {asda} from '123'"
    expect(getReferencesForModule(ts, code).map(m => m.module)).toEqual(["123"])
  })

  it("extracts a version meta", () => {
    const code = "import {asda} from '123' // types: 1.2.3"
    expect(getReferencesForModule(ts, code)[0]).toEqual({ module: "123", version: "1.2.3" })
  })
})

describe("ignores lib references", () => {
  it("extracts imports", () => {
    const code = "import 'dom'"
    expect(getReferencesForModule(ts, code).map(m => m.module)).toEqual([])
  })
})
