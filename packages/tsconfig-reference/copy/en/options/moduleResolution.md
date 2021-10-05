---
display: "Module Resolution"
oneline: "Specify how TypeScript looks up a file from a given module specifier."
---

Specify the module resolution strategy:

- `'node'` for Node.js' CommonJS implementation
- `'node12'` or `'nodenext'` for Node.js' ECMAScript Module Support [from TypeScript 4.5 onwards](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5-beta/)
- `'classic'` used in TypeScript before the release of 1.6. You probably won't need to use `classic` in modern code

There is a handbook reference page on [Module Resolution](/docs/handbook/module-resolution.html)
