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

  describe("given a package.json", () => {
    const moduleName = 'some-module'
    const version = '^1.0.0'
    const packageJsons = [
      {
        key: "dependencies",
        pkgJsonContent: {
          dependencies: {
            [moduleName]: version
          }
        } 
      },
      {
        key: "devDependencies",
        pkgJsonContent: {
          devDependencies: {
            [moduleName]: version
          }
        } 
      },
      {
        key: "peerDependencies",
        pkgJsonContent: {
          peerDependencies: {
            [moduleName]: version
          }
        } 
      },
      {
        key: "optionalDependencies",
        pkgJsonContent: {
          optionalDependencies: {
            [moduleName]: version
          }
        } 
      },
    ]
    it.each(packageJsons)("uses $key as source of truth for the module's version", (pkgJson) => {
      const code = `import {asda} from '${moduleName}'`
      expect(getReferencesForModule(ts, code, pkgJson.pkgJsonContent)[0]).toEqual({ module: moduleName, version: version })
    })
  })
})

describe("ignores lib references", () => {
  it("extracts imports", () => {
    const code = "import 'dom'"
    expect(getReferencesForModule(ts, code).map(m => m.module)).toEqual([])
  })
})
