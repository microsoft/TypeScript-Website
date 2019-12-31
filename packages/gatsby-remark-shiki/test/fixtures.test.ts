const toHAST = require(`mdast-util-to-hast`)
const hastToHTML = require(`hast-util-to-html`)
import { readdirSync, readFileSync, lstatSync } from 'fs'
import { join, parse } from 'path'
import { toMatchFile } from 'jest-file-snapshot'
import { format } from 'prettier'
import gatsbyRemarkShiki from '../src/index'
const remark = require('remark')
const gatsbyTwoSlash = require('gatsby-remark-twoslasher-code-blocks')

expect.extend({ toMatchFile })

const getHTML = async (code: string, settings?: any) => {
  const markdownAST = remark().parse(code)
  gatsbyTwoSlash({ markdownAST })
  await gatsbyRemarkShiki({ markdownAST }, settings)
  const hAST = toHAST(markdownAST, { allowDangerousHTML: true })
  return hastToHTML(hAST, { allowDangerousHTML: true })
}

// To add a test, create a file in the fixtures folder and it will will run through
// as though it was the codeblock.

describe('with fixtures', () => {
  // Add all codefixes
  const fixturesFolder = join(__dirname, 'fixtures')
  const resultsFolder = join(__dirname, 'results')

  readdirSync(fixturesFolder).forEach(fixtureName => {
    const fixture = join(fixturesFolder, fixtureName)
    if (lstatSync(fixture).isDirectory()) {
      return
    }
    // if(!fixtureName.includes("compiler_fl")) return
    it('Fixture: ' + fixtureName, async () => {
      const resultName = parse(fixtureName).name + '.html'
      const result = join(resultsFolder, resultName)
      const code = readFileSync(fixture, 'utf8')
      const html = await getHTML(code, {})
      const htmlString = format(html, { parser: 'html' })
      expect(htmlString).toMatchFile(result)
    })
  })
})
