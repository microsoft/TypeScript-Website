// @ts-check

const { execSync } = require('child_process')
const { join } = require('path')

const copyDir = join(__dirname, '..', 'copy', '*')
const jsonDir = join(__dirname, '..', 'generated', '*.json')
const outDir = join(__dirname, '..', '..', 'typescriptlang-org', 'static', 'js', 'examples')

try {
  execSync(`mkdir ${outDir}`)
} catch (error) {
  // This can safely fail
}

// Move samples
execSync(`cp -R ${copyDir} ${outDir}`)

// Move the JSON files which are generated
execSync(`cp ${jsonDir} ${outDir}`)
