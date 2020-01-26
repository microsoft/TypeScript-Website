// @ts-check

// The backstop JSON file requires setting the right paths for
// screenshots - this updates them to your computer. A bit lossy
// for the git history but acceptable given that mainly orta will
// be running the snapshots.

const { writeFileSync, readFileSync } = require("fs")
const { join } = require("path")
const { format } = require("prettier")

const backstopPath = join(__dirname, "..", "backstop.json")
const backstopJSON = JSON.parse(readFileSync(backstopPath, "utf8"))

// e.g. file:///Users/ortatherox/dev/typescript/new-website/packages/typescriptlang-org/public/index.html
const newPublicRoot = join(__dirname, "..", "public")
backstopJSON.scenarios.forEach(scenario => {
  const fileToCheck = scenario.url.split("/public/")[1]
  const newFileURL = `file://${newPublicRoot}/${fileToCheck}`
  scenario.url = newFileURL
})

writeFileSync(
  backstopPath,
  format(JSON.stringify(backstopJSON), { filepath: backstopPath })
)
