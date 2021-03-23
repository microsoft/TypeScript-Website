---
display: "Use Define For Class Fields"
oneline: "Emit ECMAScript-standard-compliant class fields."
---

This flag is used as part of migrating to the upcoming standard version of class fields. TypeScript introduced class fields many years before it was ratified in TC39. The latest version of the upcoming specification has a different runtime behavior to TypeScript's implementation but the same syntax.

This flag switches to the upcoming ECMA runtime behavior.

You can read more about the transition in [the 3.7 release notes](/docs/handbook/release-notes/typescript-3-7.html#the-usedefineforclassfields-flag-and-the-declare-property-modifier).
