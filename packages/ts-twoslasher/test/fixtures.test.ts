import { readdirSync, readFileSync, lstatSync } from "fs"
import { join, extname, parse } from "path"
import { toMatchFile } from "jest-file-snapshot"
import { twoslasher, TwoSlashReturn } from "../src/index"
import { format } from "prettier"

expect.extend({ toMatchFile })

// To add a test, create a file in the fixtures folder and it will will run through
// as though it was the codeblock.

describe("with fixtures", () => {
  // Add all codefixes
  const fixturesFolder = join(__dirname, "fixtures")
  const resultsFolder = join(__dirname, "results")

  readdirSync(join(fixturesFolder, "tests")).forEach(fixtureName => {
    const fixture = join(fixturesFolder, "tests", fixtureName)
    if (lstatSync(fixture).isDirectory()) {
      return
    }

    // if(!fixtureName.includes("imports")) return
    it("Hidden Fixtures: " + fixtureName, () => {
      const resultName = parse(fixtureName).name + ".json"
      const result = join(resultsFolder, "tests", resultName)

      const file = readFileSync(fixture, "utf8")

      const fourslashed = twoslasher(file, extname(fixtureName).substr(1), { customTags: ["annotate"] })
      const jsonString = format(JSON.stringify(cleanFixture(fourslashed)), { parser: "json" })
      expect(jsonString).toMatchFile(result)
    })
  })

  readdirSync(fixturesFolder).forEach(fixtureName => {
    const fixture = join(fixturesFolder, fixtureName)
    if (lstatSync(fixture).isDirectory()) {
      return
    }

    // if(!fixtureName.includes("compiler_fl")) return
    it("README Fixtures: " + fixtureName, () => {
      const resultName = parse(fixtureName).name + ".json"
      const result = join(resultsFolder, resultName)

      const file = readFileSync(fixture, "utf8")

      const fourslashed = twoslasher(file, extname(fixtureName).substr(1))
      const jsonString = format(JSON.stringify(cleanFixture(fourslashed)), { parser: "json" })
      expect(jsonString).toMatchFile(result)
    })
  })

  readdirSync(join(fixturesFolder, "tests")).forEach(fixtureName => {
    const fixture = join(fixturesFolder, "tests", fixtureName)
    if (lstatSync(fixture).isDirectory()) {
      return
    }

    // if(!fixtureName.includes("compiler_fl")) return
    it("Hidden Fixtures: " + fixtureName, () => {
      const resultName = parse(fixtureName).name + ".json"
      const result = join(resultsFolder, "tests", resultName)

      const file = readFileSync(fixture, "utf8")

      const fourslashed = twoslasher(file, extname(fixtureName).substr(1))
      const jsonString = format(JSON.stringify(cleanFixture(fourslashed)), { parser: "json" })
      expect(jsonString).toMatchFile(result)
    })
  })

  const throwingFixturesFolder = join(__dirname, "fixtures", "throws")

  readdirSync(throwingFixturesFolder).forEach(fixtureName => {
    const fixture = join(throwingFixturesFolder, fixtureName)
    if (lstatSync(fixture).isDirectory()) {
      return
    }

    it("Throwing Fixture: " + fixtureName, () => {
      const resultName = parse(fixtureName).name + ".json"
      const result = join(resultsFolder, resultName)

      const file = readFileSync(fixture, "utf8")

      let thrown = false
      try {
        twoslasher(file, extname(fixtureName).substr(1))
      } catch (err) {
        thrown = true
        if (err instanceof Error) expect(err.message).toMatchFile(result)
      }

      if (!thrown) throw new Error("Did not throw")
    })
  })
})

const cleanFixture = (ts: TwoSlashReturn) => {
  const wd = process.cwd()
  ts.staticQuickInfos.forEach(info => {
    info.text = info.text.replace(new RegExp(wd, "g"), "[home]")
  })
  return ts
}
