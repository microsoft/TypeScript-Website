import {danger, message} from "danger"

// dangerfile.js
import spellcheck from 'danger-plugin-spellcheck'

const hasElevatedAccess = danger.github.pr.author_association === "COLLABORATOR" ||
                          danger.github.pr.author_association === "OWNER" ||
                          danger.github.pr.author_association === "MEMBER"

// Start with the spell-check as a bit less spammy

  spellcheck({
    codeSpellCheck: ["Examples/**/*.ts", "Examples/**/*.js"]
  })

  message(`Deployed to: https://typescript-playbook-${danger.github.pr.number}.ortam.now.sh`) 
