const toHAST = require(`mdast-util-to-hast`)
const hastToHTML = require(`hast-util-to-html`)
import { readdirSync, readFileSync, lstatSync } from 'fs'
import { join, parse } from 'path'
import { toMatchFile } from 'jest-file-snapshot'
import { format } from 'prettier'
import gatsbyRemarkShiki from '../src/index'
const remark = require('remark')
const gatsbyTwoSlash = require('gatsby-remark-twoslasher-code-blocks')
import { Node } from 'unist'
expect.extend({ toMatchFile })

const getHTML = async (code: string, settings?: any) => {
  const markdownAST: Node = remark().parse(code)
  gatsbyTwoSlash({ markdownAST })
  await gatsbyRemarkShiki({ markdownAST }, settings)

  // @ts-ignore
  const twoslashes = markdownAST.children.filter(c => c.meta && c.meta.includes('twoslash')).map(c => c.twoslash)
  const hAST = toHAST(markdownAST, { allowDangerousHTML: true })
  return {
    html: hastToHTML(hAST, { allowDangerousHTML: true }),
    twoslashes,
  }
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

    it('Fixture: ' + fixtureName, async () => {
      const resultHTMLName = parse(fixtureName).name + '.html'
      const resultTwoSlashName = parse(fixtureName).name + '.json'

      const resultHTMLPath = join(resultsFolder, resultHTMLName)
      const resultTwoSlashPath = join(resultsFolder, resultTwoSlashName)

      const code = readFileSync(fixture, 'utf8')
      const results = await getHTML(code, {})

      const htmlString = format(results.html, { parser: 'html' })
      expect(htmlString).toMatchFile(resultHTMLPath)

      const twoString = format(JSON.stringify(results.twoslashes), { parser: 'json' })
      expect(twoString).toMatchFile(resultTwoSlashPath)
    })
  })
})
