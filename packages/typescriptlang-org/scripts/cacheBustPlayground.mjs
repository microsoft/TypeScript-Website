// @ts-check
// yarn workspace typescriptlang-org setup-playground-cache-bust

import fs from "fs"
import path from "path"
import { execSync } from "child_process"
const gitSha = execSync("git rev-parse HEAD").toString().trim().slice(0, 7)

// Change the file
const toChange = "src/lib/playgroundURLs.ts"
const content = fs
  .readFileSync(toChange, "utf8")
  .replace(`const commitPrefix = "/"`, `const commitPrefix = "/${gitSha}/"`)

if (!content.includes(gitSha)) throw new Error("Could not run cache busting")

fs.writeFileSync(toChange, content)

// https://stackoverflow.com/posts/52338335/revisions
function copyFolderSync(from, to) {
  fs.mkdirSync(to, { recursive: true })
  fs.readdirSync(from).forEach(element => {
    if (fs.lstatSync(path.join(from, element)).isFile()) {
      fs.copyFileSync(path.join(from, element), path.join(to, element))
    } else {
      copyFolderSync(path.join(from, element), path.join(to, element))
    }
  })
}

// Create a sha copy of the playground and sandbox folders. We want to have
// a copy (and not just move) because folks rely on the un-prefixed URLs.

copyFolderSync("static/js/playground", `static/js/${gitSha}/playground`)
copyFolderSync("static/js/sandbox", `static/js/${gitSha}/sandbox`)
copyFolderSync(
  "static/js/playground-worker",
  `static/js/${gitSha}/playground-worker`
)
