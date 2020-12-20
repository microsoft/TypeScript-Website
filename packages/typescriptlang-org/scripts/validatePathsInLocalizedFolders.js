// @ts-check

//  node packages/typescriptlang-org/scripts/validatePathsInLocalizedFolders.js

const { join } = require("path")
const { recursiveReadDirSync } = require("../lib/utils/recursiveReadDirSync")
const { readdirSync, statSync } = require("fs")

const filesNotMatching = []

// Compares the locales files against the english ones to account for case, or typoes
const check = (englishFiles, root, lang) => {
  const thisLangFiles = recursiveReadDirSync(join(root, lang))
  thisLangFiles.forEach((en, index) => {
    const localFile = en.replace("/" + lang + "/", "/en/")
    if (!englishFiles.includes(localFile)) {
      filesNotMatching.push(en)
    }
  })
}

// The four roots of docs in the TS site
const docsRoots = [
  join(__dirname, "..", "..", "tsconfig-reference", "copy"),
  join(__dirname, "..", "..", "playground-examples", "copy"),
  join(__dirname, "..", "..", "documentation", "copy"),
  join(__dirname, "..", "src", "copy"),
]

// Loop through each root, grabbing the en files and then comparing
// it per language
docsRoots.forEach(root => {
  const isDir = f => statSync(join(root, f)).isDirectory()

  const tsconfigLangs = readdirSync(root).filter(
    f => f !== "en" && !f.startsWith(".") && isDir(f)
  )

  const en = join(root, "en")
  const englishFiles = recursiveReadDirSync(en)
  tsconfigLangs.forEach(lang => {
    check(englishFiles, root, lang)
  })
})

if (filesNotMatching.length) {
  // Fail and give a useful error message
  process.exitCode = 1

  console.log(`There files which do not match the english folder structure:`)
  filesNotMatching.forEach(f => {
    console.log(` - ${f}`)
  })

  console.log(
    "\n\nPlease compare them to the english files and see what is different, or they will not show up."
  )
}
