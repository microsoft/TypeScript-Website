import { getReferencesForModule } from "../src/index"
import * as ts from "typescript"

describe(getReferencesForModule, () => {
  it("extracts imports", () => {
    const code = "import 'abc'"
    expect(getReferencesForModule(ts, code)).toEqual(["abc"])
  })

  it("extracts from imports", () => {
    const code = "import {asda} from '123'"
    expect(getReferencesForModule(ts, code)).toEqual(["123"])
  })
})

it("OK", () => {})
