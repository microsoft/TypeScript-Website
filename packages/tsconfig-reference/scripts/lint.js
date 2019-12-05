// Loops through all the sample code and ensures that twoslash doesn't raise
const chalk = require("chalk")

const tick = chalk.bold.greenBright("✓")

const { readdirSync, readFileSync } = require('fs')
const { join } = require('path')

const remark = require('remark')
const remarkTwoSlash = require('gatsby-remark-twoslasher-code-blocks')

const languages = readdirSync(join(__dirname, '..', 'copy')).filter(f => !f.startsWith("."))

console.log("Linting the sample code which uses twoslasher in ts-config")

// Pass in a 2nd arg to filter which markdown to run
const filterString = process.argv[2] ? process.argv[2] : ""

languages.forEach(lang => {
  const locale = join(__dirname, '..', 'copy', lang)
  const options = readdirSync(join(locale, 'options')).filter(f => !f.startsWith("."))
  console.log("\n" + lang + ":")

  options.forEach(option => {
    if (filterString.length && !option.includes(filterString)) return;

    const optionPath = join(locale, 'options', option)
    const markdown = readFileSync(optionPath, "utf8")
    const markdownAST = remark().parse(markdown)
    remarkTwoSlash({ markdownAST })
    process.stdout.write(option + " " + tick + ", ")
  })
})
