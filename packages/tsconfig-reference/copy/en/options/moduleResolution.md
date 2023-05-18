---
display: "Module Resolution"
oneline: "Specify how TypeScript looks up a file from a given module specifier."
---

Specify the module resolution strategy:

- `'node'` for Node.js' CommonJS implementation
- `'node16'` or `'nodenext'` for Node.js' ECMAScript Module Support [from TypeScript 4.7 onwards](https://devblogs.microsoft.com/typescript/announcing-typescript-4-7/#esm-nodejs)
- `'classic'` used in TypeScript before the release of 1.6. You probably won't need to use `classic` in modern code

There is a handbook reference page on [Module Resolution](/docs/handbook/module-resolution.html)
