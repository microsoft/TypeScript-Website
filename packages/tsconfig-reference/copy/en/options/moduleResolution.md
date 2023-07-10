---
display: "Module Resolution"
oneline: "Specify how TypeScript looks up a file from a given module specifier."
---

Specify the module resolution strategy:

- `'node16'` or `'nodenext'` for modern versions of Node.js. Node.js v12 and later supports both ECMAScript imports and CommonJS `require`, which resolve using different algorithms. These `moduleResolution` values, when combined with the corresponding [`module`](#module) values, picks the right algorithm for each resolution based on whether Node.js will see an `import` or `require` in the output JavaScript code.
- `'node10'` (previously called `'node'`) for Node.js versions older than v10, which only support CommonJS `require`. You probably won't need to use `node10` in modern code.
- `'bundler'` for use with bundlers. Like `node16` and `nodenext`, this mode supports package.json `"imports"` and `"exports"`, but unlike the Node.js resolution modes, `bundler` never requires file extensions on relative paths in imports.
- `'classic'` was used in TypeScript before the release of 1.6. `classic` should not be used.

There is a handbook reference page on [Module Resolution](/docs/handbook/module-resolution.html)
