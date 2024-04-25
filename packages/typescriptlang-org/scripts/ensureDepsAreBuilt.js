const fs = require("fs")
const { join } = require("path")
const chalk = require("chalk")

const code = str => chalk.bold.greenBright(str)

const nodeModsPath = join(__dirname, "..", "..", "..", "node_modules")
if (!fs.existsSync(nodeModsPath)) {
  throw new Error(`Please run ${code("pnpm install")}`)
}

const pkgsRoot = join(__dirname, "..", "..")
const twoslashDist = join(pkgsRoot, "ts-twoslasher", "dist")
const vfsDist = join(pkgsRoot, "typescript-vfs", "dist")

for (const distDir of [twoslashDist, vfsDist]) {
  if (!fs.existsSync(distDir)) {
    const readline = require("readline")
    const blank = "\n".repeat(process.stdout.rows)
    console.log(blank)
    readline.cursorTo(process.stdout, 0, 0)
    readline.clearScreenDown(process.stdout)

    // prettier-ignore
    console.log(`

${chalk.bgBlueBright.white("    ")}
${chalk.bgBlueBright.white.bold("  ts")}

  First of all, awesome! Welcome to the TypeScript website monorepo. 
  To get the site up and running, the other modules need building first.
  
  Please run ${code("pnpm bootstrap")} to build the website's local dependencies,
  and pre-cache the website's pages.
  
  This should take about 5m, so maybe go make a tea/coffee.
  
  Finally re-run ${code("pnpm start")}.
  `)
    process.exit(0)
  }
}

const releaseInfo = join(
  pkgsRoot,
  "typescriptlang-org",
  "src",
  "lib",
  "release-info.json"
)

if (!fs.existsSync(releaseInfo)) {
  // prettier-ignore
  console.log(`
Please run:

> ${chalk.bgBlueBright.white.bold("pnpm run --filter=typescriptlang-org update-versions")}

Then re-run the command.`
  )
  process.exit(0)
}
