// You can test it by running
// pnpm danger pr https://github.com/microsoft/TypeScript-Website/pull/115

import spellcheck from "danger-plugin-spellcheck"

// Blocked on PR deploys, see CI.yml
// import lighthouse from "danger-plugin-lighthouse"

// Spell check all the things
spellcheck({ settings: "microsoft/TypeScript-Website@spellcheck.json" })
