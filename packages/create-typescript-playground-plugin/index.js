#!/usr/bin/env node
// @ts-check

// A fork of https://github.com/c8r/initit/blob/master/index.js
// which is MIT licensed

// Changes:
//  - Less dependencies
//  - Ability for me to define the branch and the depth to extract from a zip
//  - yarn not npm

const path = require("path")
const os = require("os")
const fs = require("fs")
const exec = require("child_process").execSync
const spawn = require("cross-spawn")
const tar = require("tar-fs")
const gunzip = require("gunzip-maybe")
const https = require("https")

const install = () => {
  return new Promise((resolve, reject) => {
    const child = spawn("yarn", ["install"], {
      stdio: "inherit",
    })
    child.on("close", code => {
      if (code !== 0) {
        reject()
        process.exitCode = 1
        return
      }
      resolve()
    })
  })
}

const gitInit = () => {
  try {
    exec("git --version", { stdio: "inherit" })
    exec("git init", { stdio: "inherit" })
    exec("git add .", { stdio: "inherit" })
    exec('git commit -am "Init"', { stdio: "inherit" })
  } catch (e) {
    console.error(e)
  }
  return true
}

const getTar = ({ user, repo, templatepath = "", name }) => {
  return new Promise((resolve, reject) => {
    console.log("Downloading template...", templatepath)
    const ignorePrefix = "__INITIT_IGNORE__/"
    const ignorepath = path.join(name, ignorePrefix)
    const extractTar = tar.extract(name, {
      map: header => {
        const prefix = `${repo}-2/${templatepath}`
        if (header.name.startsWith(prefix)) {
          return Object.assign({}, header, {
            name: header.name.substr(prefix.length),
          })
        } else {
          return Object.assign({}, header, {
            name: ignorePrefix + header.name,
          })
        }
      },
      ignore: filepath => {
        const isInIgnoreFolder = !path.relative(ignorepath, filepath).startsWith("..")
        return isInIgnoreFolder
      },
    })
    https.get(`https://codeload.github.com/${user}/${repo}/tar.gz/v2`, response =>
      response.pipe(gunzip()).pipe(extractTar)
    )
    console.log(`https://codeload.github.com/${user}/${repo}/tar.gz/v2`)
    extractTar.on("error", reject)
    extractTar.on("finish", resolve)
  })
}

const create = async (opts = {}) => {
  if (!opts.name) {
    throw new Error("name argument required")
  }

  if (!opts.template) {
    throw new Error("template argument required")
  }

  const dirname = path.resolve(opts.name)
  const name = path.basename(dirname)
  const [user, repo, ...paths] = opts.template.split("/")

  if (!fs.existsSync(name)) {
    fs.mkdirSync(name)
  }

  await getTar(
    Object.assign({}, opts, {
      name,
      user,
      repo,
      templatepath: paths.join("/"),
    })
  )

  const templatePkg = require(path.join(dirname, "package.json"))

  const pkg = Object.assign({}, templatePkg, {
    name,
    version: "0.0.1",
  })

  fs.writeFileSync(path.join(dirname, "package.json"), JSON.stringify(pkg, null, 2) + os.EOL)

  process.chdir(dirname)

  await install()
  gitInit()

  const readmePath = path.join(dirname, "README.md")
  const README = fs.readFileSync(readmePath, "utf8")
  README.replace(/\[name\]/g, opts.name)
  fs.writeFileSync(readmePath, README)

  console.log("\nAlright, you're good to go!\n")

  console.log("To get started:")
  console.log(` - code ${name}`)
  console.log(` - cd ${name}`)
  console.log(` - yarn start`)

  console.log(
    "\nCome and ask questions to other plugin authors in the TypeScript Community Discord: https://discord.gg/typescript"
  )

  return { name, dirname }
}

const [name] = process.argv.slice(2)
const template = "microsoft/TypeScript-Website/packages/create-typescript-playground-plugin/template/"

create({ name, template })
