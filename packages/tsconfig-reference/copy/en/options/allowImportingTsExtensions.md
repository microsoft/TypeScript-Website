---
display: "Allow Importing TS Extensions"
oneline: "Allow imports to include TypeScript file extensions."
---

`--allowImportingTsExtensions` allows TypeScript files to import each other with a TypeScript-specific extension like `.ts`, `.mts`, or `.tsx`.

This flag is only allowed when `--noEmit` or `--emitDeclarationOnly` is enabled, since these import paths would not be resolvable at runtime in JavaScript output files.
The expectation here is that your resolver (e.g. your bundler, a runtime, or some other tool) is going to make these imports between `.ts` files work.
