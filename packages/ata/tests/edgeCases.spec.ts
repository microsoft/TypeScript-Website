import { mapModuleNameToModule } from "../src/edgeCases"

describe(mapModuleNameToModule, () => {
    it("gives node for known identifiers", () => {
        expect(mapModuleNameToModule("fs")).toEqual("node")
    })

    it("handles the weird node: prefix", () => {
        expect(mapModuleNameToModule("node:fs")).toEqual("node")
    })
})