import { readdirSync, readFileSync } from 'fs';
import { join, extname, parse } from 'path';
import { toMatchFile } from 'jest-file-snapshot';
import { twoslasher } from '../src/index';
import { format } from 'prettier';

expect.extend({ toMatchFile });

// To add a test, create a file in the fixtures folder and it will will run through
// as though it was the codeblock.

describe('with fixtures', () => {
  // Add all codefixes
  const fixturesFolder = join(__dirname, 'fixtures');
  const resultsFolder = join(__dirname, 'results');

  readdirSync(fixturesFolder).forEach(fixtureName => {
    it('Fixture: ' + fixtureName, () => {
      const fixture = join(fixturesFolder, fixtureName);
      const resultName = parse(fixtureName).name + '.json';
      const result = join(resultsFolder, resultName);

      const file = readFileSync(fixture, 'utf8');

      const fourslashed = twoslasher(file, extname(fixtureName).substr(1));
      const jsonString = format(JSON.stringify(fourslashed), {
        parser: 'json',
      });
      expect(jsonString).toMatchFile(result);
    });
  });
});
