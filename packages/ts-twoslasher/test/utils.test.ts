import ts from 'typescript'
import { getIdentifierTextSpans } from '../src/utils'

it('gets the expected identifiers', () => {
  let file = ts.createSourceFile(
    'anything.ts',
    `
    readdirSync(fixturesFolder).forEach(fixtureName => {
      const fixture = join(fixturesFolder, fixtureName)
      if (lstatSync(fixture).isDirectory()) {
        return
      }
  
      // if(!fixtureName.includes("compiler_fl")) return
      it('Fixture: ' + fixtureName, () => {
        const resultName = parse(fixtureName).name + '.json'
        const result = join(resultsFolder, resultName)
  
        const file = readFileSync(fixture, 'utf8')
  
        const fourslashed = twoslasher(file, extname(fixtureName).substr(1))
        const jsonString = format(JSON.stringify(fourslashed), { parser: 'json' })
        expect(jsonString).toMatchFile(result)
      })
    })
  `,
    ts.ScriptTarget.ES2015
  )

  const allIdentifiers = getIdentifierTextSpans(file)
  expect(allIdentifiers.length).toEqual(40)
})
