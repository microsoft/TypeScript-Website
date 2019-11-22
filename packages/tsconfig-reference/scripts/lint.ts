// Loops through all the sample code and ensures that twoslash doesn't raise
const chalk = require("chalk")

const tick = chalk.bold.greenBright("✓")

import { readdirSync, readFileSync } from 'fs'
import { join } from 'path'

const remark = require('remark')
const remarkTwoSlash = require('gatsby-remark-twoslasher-code-blocks')

const languages = readdirSync(join(__dirname, '..', 'copy')).filter(f => !f.startsWith("."))

console.log("Linting the sample code which uses twoslasher in ts-config")

languages.forEach(lang => {
  const locale = join(__dirname, '..', 'copy', lang)
  const options = readdirSync(join(locale, 'options')).filter(f => !f.startsWith("."))
  console.log("\n" + lang + ":")

  options.forEach(option => {
    const optionPath = join(locale, 'options', option)
    const markdown = readFileSync(optionPath, "utf8")
    const markdownAST = remark().parse(markdown)
    remarkTwoSlash({ markdownAST })
    process.stdout.write(option + " " + tick + ", ")
  })
})
