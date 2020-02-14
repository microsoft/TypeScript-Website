const { join } = require("path")
const fs = require("fs")
const path = require("path")

const getAllTODOFiles = lang => {
  const diffFolders = (root, lang) => {
    const en = join(root, "en")
    const thisLang = join(root, lang)

    const englishFiles = getFilePaths(en)
    const thisLangFiles = getFilePaths(thisLang)

    const todo = []
    const done = []
    englishFiles.forEach((en, index) => {
      const localFile = en.replace("/en/", "/" + lang + "/")
      if (thisLangFiles.includes(localFile)) {
        done.push(localFile)
      } else {
        todo.push(en)
      }
    })

    return { todo, done }
  }

  // TS Config
  const tsconfigRoot = join(__dirname, "..", "..", "tsconfig-reference", "copy")
  const tsconfigFilesTODO = diffFolders(tsconfigRoot, lang)

  // Playground
  const playRoot = join(__dirname, "..", "..", "playground-examples", "copy")
  const playgroundTODO = diffFolders(playRoot, lang)

  // Layouts
  const appRoot = join(__dirname, "..", "src", "copy")
  const appTODO = diffFolders(appRoot, lang)

  // Handbook TBD

  const all = {
    tsconfig: tsconfigFilesTODO,
    playground: playgroundTODO,
    app: appTODO,
  }

  return all
}

/** Recursively retrieve file paths from a given folder and its subfolders. */
// https://gist.github.com/kethinov/6658166#gistcomment-2936675
/** @returns {string[]} */
const getFilePaths = folderPath => {
  if (!fs.existsSync(folderPath)) return []

  const entryPaths = fs
    .readdirSync(folderPath)
    .map(entry => path.join(folderPath, entry))
  const filePaths = entryPaths.filter(entryPath =>
    fs.statSync(entryPath).isFile()
  )
  const dirPaths = entryPaths.filter(
    entryPath => !filePaths.includes(entryPath)
  )
  const dirFiles = dirPaths.reduce(
    (prev, curr) => prev.concat(getFilePaths(curr)),
    []
  )

  return [...filePaths, ...dirFiles]
    .filter(f => !f.endsWith(".DS_Store") && !f.endsWith("README.md"))
    .map(f => {
      const root = join(__dirname, "..", "..", "..")
      return f.replace(root, "")
    })
}

const toMarkdown = files => {
  const md = []

  const markdownLink = (f, done) => {
    const name = path.basename(f)
    const url = "https://github.com/microsoft/TypeScript-Website/blob/v2"
    const check = done ? "x" : " "
    return `- [${check}] [\`${name}\`](${url}${encodeURIComponent(f)})`
  }

  Object.keys(files).forEach(section => {
    const todo = files[section].todo
    const done = files[section].done

    md.push("\n\n## " + section + "\n\n")

    done.forEach(f => {
      md.push(markdownLink(f, true))
    })

    todo.forEach(f => {
      md.push(markdownLink(f))
    })
  })

  return md.join("\n")
}

if (!module.parent) {
  const lang = process.argv.slice(2)[0]
  if (!lang) {
    console.log("You need to run this script with a language arg")
    console.log(
      "> node packages/typescriptlang-org/scripts/makeMarkdownOfTranslations.js jp"
    )
  }

  const files = getAllTODOFiles(lang)
  console.log(toMarkdown(files))
}

module.exports = { toMarkdown, getAllTODOFiles }
