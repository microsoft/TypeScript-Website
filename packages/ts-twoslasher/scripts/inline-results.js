const { readdirSync, readFileSync }  = require('fs')
const { join, parse } = require('path')

const fixturesFolder = join(__dirname, "../", 'test', 'fixtures');
const resultsFolder = join(__dirname, "../", 'test', 'results');

const wrapCode = (code, ext) => "```" + ext + "\n" + code  + "```" 

module.exports = {
  transforms: {
    /* Match <!-- AUTO-GENERATED-CONTENT:START (FIXTURES) --> */
    FIXTURES(content, options) {
      const header = "### Examples"
      
      const examples = []
      
      readdirSync(fixturesFolder).forEach(fixtureName => {
        const fixture = join(fixturesFolder, fixtureName);
        const resultName = parse(fixtureName).name + '.json';
        const result = join(resultsFolder, resultName);

        const input = readFileSync(fixture, 'utf8');
        const output = readFileSync(result, 'utf8');

        examples.push(`#### \`${fixtureName}\``)
        examples.push(wrapCode(input, parse(fixtureName).ext))
        examples.push("Turns to:")
        examples.push(wrapCode(output, "json"))
      })
      
      return `${header}\n\n${examples.join("\n\n")}`
    }
  },
  callback: function () {
    console.log('done')
  }
}
