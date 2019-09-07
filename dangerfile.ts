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

  // This deploy only happens for staff also
  const deployURL = `https://typescript-playbook-${danger.github.pr.number}.ortam.now.sh`;
  message(`Deployed to [a PR branch](${deployURL})`);
}
