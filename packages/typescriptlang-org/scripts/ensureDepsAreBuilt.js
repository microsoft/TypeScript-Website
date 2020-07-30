const fs = require("fs")
const { join } = require("path")
const chalk = require("chalk").default

const code = str => chalk.bold.greenBright(str)

const nodeModsPath = join(__dirname, "..", "..", "..", "node_modules")
if (!fs.existsSync(nodeModsPath)) {
  throw new Error(`Please run ${code("yarn install")}`)
}

const twoslashDist = join(__dirname, "..", "..", "ts-twoslasher", "dist")
const vfsDist = join(__dirname, "..", "..", "typescript-vfs", "dist")
const shiki = join(__dirname, "..", "..", "render-shiki-twoslash", "dist")

for (const distDir of [twoslashDist, vfsDist, shiki]) {
  if (!fs.existsSync(distDir)) {
    console.clear()
    // prettier-ignore
    console.log(`

${chalk.bgBlueBright.white("    ")}
${chalk.bgBlueBright.white.bold("  ts")}

  First of all, awesome! Welcome to the TypeScript website monorepo. 
  To get the site up and running, the other modules need building first.
  
  Please run ${code("yarn bootstrap")} to build the website's local dependencies,
  and pre-cache the website's pages.
  
  This should take about 5m, so maybe go make a tea/coffee.
  
  Finally re-run ${code("yarn start")}.
  `)
    process.exit(0)
  }
}
