// You can test it by running
// yarn danger pr https://github.com/microsoft/TypeScript-Website/pull/115

import spellcheck from "danger-plugin-spellcheck"
import { warn, danger } from "danger"
import { execSync } from "child_process"

// Spell check all the things
spellcheck({ settings: "microsoft/TypeScript-Website@spellcheck.json" })

const gitStatus = execSync("git status --porcelain").toString()
if (gitStatus.includes("M")) {
    const files = gitStatus.split("\n").filter(f => f.startsWith(" M ")).map(f => f.substr(3))
    const linksToChangedFiles = danger.github.utils.fileLinks(files)
    
    warn(`There are un-staged changes to generated files: \n ${linksToChangedFiles}`)
}