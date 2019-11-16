const { readdirSync, readFileSync, lstatSync } = require('fs');
const { join, parse } = require('path');
const ts = require('typescript');

const fixturesFolder = join(__dirname, '../', 'test', 'fixtures');
const resultsFolder = join(__dirname, '../', 'test', 'results');

const wrapCode = (code, ext) => '```' + ext + '\n' + code + '```';

module.exports = {
  transforms: {
    /* Match <!-- AUTO-GENERATED-CONTENT:START (FIXTURES) --> */
    FIXTURES(content, options) {
      const mds = []

      const fileToParse = join(__dirname, '../', 'src', 'index.ts')
      let program = ts.createProgram([fileToParse], {});
      program.getTypeChecker({});

      const sourceFile = program.getSourceFile(fileToParse)
      let optionsInterface, mainExport

      ts.forEachChild(sourceFile, node => {
        if (node.kind === ts.SyntaxKind.InterfaceDeclaration && node.symbol.escapedName === "ExampleOptions") {
            optionsInterface = node
        }

        if (node.kind === ts.SyntaxKind.FunctionDeclaration && node.symbol.escapedName === "twoslasher") {
          mainExport = node
          mainExport.body = null
        }
      });

      const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
      const twoslasher = printer.printNode(ts.EmitHint.Unspecified, mainExport, sourceFile) + "\n";
      const optionsObj = printer.printNode(ts.EmitHint.Unspecified, optionsInterface, sourceFile) + "\n";

      mds.push("The markup API lives inline inside the code, where you can do special commands. These are the config variables available")
      mds.push(wrapCode(optionsObj, "ts"))

      mds.push("As well as all compiler API options are available, which you can see in the examples below.")

      mds.push('### Examples');

      readdirSync(fixturesFolder).forEach(fixtureName => {
        const fixture = join(fixturesFolder, fixtureName);
        if (lstatSync(fixture).isDirectory()) {  return; }

        const resultName = parse(fixtureName).name + '.json';
        const result = join(resultsFolder, resultName);

        const input = readFileSync(fixture, 'utf8');
        const output = JSON.parse(readFileSync(result, 'utf8'));

        mds.push(`#### \`${fixtureName}\``);
        mds.push(wrapCode(input, parse(fixtureName).ext));
        mds.push('Turns to:');

        mds.push(wrapCode(output.code, output.extension));
        
        mds.push('With:');

        const codeless = { ...output, code: "See above" }
        mds.push(wrapCode(JSON.stringify(codeless, null, "  ") + "\n", "json"));
      });

      mds.push('### API');
      mds.push("The API is one main exported function:")
      mds.push(wrapCode(twoslasher, "ts"))

      return mds.join('\n\n');
    },
  },
  callback: function() {
    console.log('done');
  },
};
