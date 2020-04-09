const { readdirSync, readFileSync, lstatSync } = require('fs')
const { join, parse } = require('path')
const ts = require('typescript')

const fixturesFolder = join(__dirname, '../', 'test', 'fixtures')
const resultsFolder = join(__dirname, '../', 'test', 'results')

const wrapCode = (code, ext) => '```' + ext + '\n' + code + '```'
const wrapCodeAsQuote = (code, ext) => '> ```' + ext + '\n> ' + code.split('\n').join('\n> ') + '```'

module.exports = {
  transforms: {
    /* Match <!-- AUTO-GENERATED-CONTENT:START (FIXTURES) --> */
    FIXTURES(content, options) {
      const mds = []

      const fileToParse = join(__dirname, '../', 'src', 'index.ts')
      let program = ts.createProgram([fileToParse], {})

      const sourceFile = program.getSourceFile(fileToParse)
      let optionsInterface, mainExport, returnInterface

      ts.forEachChild(sourceFile, (node) => {
        if (node.name && node.name.escapedText) {
          const name = node.name.escapedText
          if (name === 'ExampleOptions') {
            optionsInterface = node
          }

          if (name === 'TwoSlashReturn') {
            returnInterface = node
          }

          if (name === 'twoslasher') {
            mainExport = node
            mainExport.body = null
          }
        }
      })

      const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })
      const twoslasher = printer.printNode(ts.EmitHint.Unspecified, mainExport, sourceFile) + '\n'
      const returnObj = printer.printNode(ts.EmitHint.Unspecified, returnInterface, sourceFile) + '\n'
      const optionsObj = printer.printNode(ts.EmitHint.Unspecified, optionsInterface, sourceFile) + '\n'

      mds.push(
        'The twoslash markup API lives inside your code samples code as comments, which can do special commands. There are the following commands:'
      )
      mds.push(wrapCode(optionsObj, 'ts'))

      mds.push('In addition to this set, you can use `@filename` which allow for exporting between files.')

      mds.push(
        'Finally you can set any tsconfig compiler flag using this syntax, which you can see in some of the examples below.'
      )

      mds.push('### Examples')

      readdirSync(fixturesFolder).forEach((fixtureName) => {
        const fixture = join(fixturesFolder, fixtureName)
        if (lstatSync(fixture).isDirectory()) {
          return
        }

        const resultName = parse(fixtureName).name + '.json'
        const result = join(resultsFolder, resultName)

        const input = readFileSync(fixture, 'utf8')
        const output = JSON.parse(readFileSync(result, 'utf8'))

        mds.push(`#### \`${fixtureName}\``)
        mds.push(wrapCode(input, parse(fixtureName).ext.replace('.', '')))
        mds.push('Turns to:')

        mds.push(wrapCodeAsQuote(output.code, output.extension))

        mds.push('> With:')

        const codeless = {
          ...output,
          code: 'See above',
          staticQuickInfos: `[ ${output.staticQuickInfos.length} items ]`,
        }
        mds.push(wrapCodeAsQuote(JSON.stringify(codeless, null, '  ') + '\n', 'json'))
      })

      mds.push('### API')
      mds.push('The API is one main exported function:')
      mds.push(wrapCode(twoslasher, 'ts'))
      mds.push('Which returns:')
      mds.push(wrapCode(returnObj, 'ts'))

      return mds.join('\n\n')
    },
  },
  callback: function () {
    console.log('done')
  },
}
