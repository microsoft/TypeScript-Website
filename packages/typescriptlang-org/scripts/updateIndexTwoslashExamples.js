// @ts-check

const { join } = require(`path`)
const { readdirSync, readFileSync, lstatSync, writeFileSync } = require("fs")

// prettier-ignore
const examplesPath = join(__dirname,"..", "src", "components", "index", "generated")

// Loop through all code sames in src/components/index/twoslash and generate HTML
const go = async () => {
  console.log("Parsing index examples ->")
  for (const path of readdirSync(examplesPath, "utf-8")) {
    const filePath = join(examplesPath, path)
    if (lstatSync(filePath).isDirectory()) {
      continue
    }

    writeFileSync(
      filePath,
      readFileSync(filePath, "utf8").replace("267F99", "227289")
    )
  }
}

go()
