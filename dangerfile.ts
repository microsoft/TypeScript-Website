// You can test it by running
// pnpm danger pr https://github.com/microsoft/TypeScript-Website/pull/115

// Blocked on PR deploys, see CI.yml
// import lighthouse from "danger-plugin-lighthouse"

// Spell check all the things
const { default: spellcheck } = require("danger-plugin-spellcheck")
spellcheck({ settings: "microsoft/TypeScript-Website@spellcheck.json" })
