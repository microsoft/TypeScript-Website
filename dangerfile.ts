import {danger} from "danger"

// dangerfile.js
import spellcheck from 'danger-plugin-spellcheck'

const hasElevatedAccess = danger.github.pr.author_association === "COLLABORATOR" ||
                          danger.github.pr.author_association === "OWNER"

// Start with the spell-check as a bit less spammy
if (hasElevatedAccess) {
  spellcheck({
    codeSpellCheck: ["Examples/**/*.ts", "Examples/**/*.js"]
  })
}
