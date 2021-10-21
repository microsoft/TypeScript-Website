---
display: "Disable Source Project Reference Redirect"
oneline: "Disable preferring source files instead of declaration files when referencing composite projects."
---

When working with [composite TypeScript projects](/docs/handbook/project-references.html), this option provides a way to go [back to the pre-3.7](/docs/handbook/release-notes/typescript-3-7.html#build-free-editing-with-project-references) behavior where d.ts files were used to as the boundaries between modules.
In 3.7 the source of truth is now your TypeScript files.
