const toHAST = require(`mdast-util-to-hast`)
const hastToHTML = require(`hast-util-to-html`)
import { readdirSync, readFileSync, lstatSync } from "fs"
import { join, parse } from "path"
import { toMatchFile } from "jest-file-snapshot"
import { format } from "prettier"
import { runTwoSlashOnNode } from "../src/index"
const remark = require("remark")
// const gatsbyTwoSlash = require('shiki-twoslasher')
import { Node } from "unist"
expect.extend({ toMatchFile })
import visit from "unist-util-visit"

const getHTML = async (code: string, settings?: any) => {
  const markdownAST: Node = remark().parse(code)
  // gatsbyTwoSlash({ markdownAST })
  visit(markdownAST, "code", runTwoSlashOnNode(settings))
  // await gatsbyRemarkShiki({ markdownAST }, settings, {})

  // @ts-ignore
  const twoslashes = markdownAST.children.filter(c => c.meta && c.meta.includes("twoslash")).map(c => c.twoslash)
  const hAST = toHAST(markdownAST, { allowDangerousHTML: true })
  return {
    html: hastToHTML(hAST, { allowDangerousHTML: true }),
    twoslashes,
  }
}

// To add a test, create a file in the fixtures folder and it will will run through
// as though it was the codeblock.

describe("with fixtures", () => {
  // Add all codefixes
  const fixturesFolder = join(__dirname, "fixtures")
  const resultsFolder = join(__dirname, "results")

  readdirSync(fixturesFolder).forEach(fixtureName => {
    const fixture = join(fixturesFolder, fixtureName)
    if (lstatSync(fixture).isDirectory()) {
      return
    }

    // if (!fixtureName.includes('exporting')) {
    //   return
    // }

    it("Fixture: " + fixtureName, async () => {
      const resultHTMLName = parse(fixtureName).name + ".html"
      const resultTwoSlashName = parse(fixtureName).name + ".json"

      const resultHTMLPath = join(resultsFolder, resultHTMLName)
      const resultTwoSlashPath = join(resultsFolder, resultTwoSlashName)

      const code = readFileSync(fixture, "utf8")
      const results = await getHTML(code, {
        theme: require.resolve("../../typescriptlang-org/lib/themes/typescript-beta-light.json"),
      })

      const htmlString = format(results.html + style, { parser: "html" })
      expect(htmlString).toMatchFile(resultHTMLPath)

      const twoString = format(JSON.stringify(results.twoslashes), { parser: "json" })
      expect(twoString).toMatchFile(resultTwoSlashPath)
    })
  })
})

const style = `

<style>
.shiki {
background-color: lightgrey;
padding: 8px;
}

.error,
.error-behind {
margin-left: -20px;
margin-right: -12px;
margin-top: 4px;
margin-bottom: 4px;
padding: 6px;
padding-left: 14px;

white-space: pre-wrap;
display: block;
}

.error {
position: absolute;
background-color: #ffeeee;
border-left: 2px solid #bf1818;
width: 100%;

display: flex;
align-items: center;
color: black;
}

.error-behind {
user-select: none;
color: #ffeeee;
}
.query {
  color: white;
}
</style>
`
