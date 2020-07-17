import { danger, message } from "danger";

// dangerfile.js
import spellcheck from "danger-plugin-spellcheck";

const hasElevatedAccess =
  danger.github.pr.author_association === "COLLABORATOR" ||
  danger.github.pr.author_association === "OWNER" ||
  danger.github.pr.author_association === "MEMBER";

// Run the spell check only on PRs from staff
if (hasElevatedAccess) {
  spellcheck({
    settings: "artsy/peril-settings@spellcheck.json",
    codeSpellCheck: ["Examples/**/*.ts", "Examples/**/*.js"]
  });
