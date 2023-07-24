---
display: "Check JS"
oneline: "Enable error reporting in type-checked JavaScript files."
---

Works in tandem with [`allowJs`](#allowJs). When `checkJs` is enabled then errors are reported in JavaScript files. This is
the equivalent of including `// @ts-check` at the top of all JavaScript files which are included in your project.

For example, this is incorrect JavaScript according to the `parseFloat` type definition which comes with TypeScript:

```js
// parseFloat only takes a string
module.exports.pi = parseFloat(3.142);
```

When imported into a TypeScript module:

```ts twoslash
// @allowJs
// @filename: constants.js
module.exports.pi = parseFloat(3.142);

// @filename: index.ts
import { pi } from "./constants";
console.log(pi);
```

You will not get any errors. However, if you turn on `checkJs` then you will get error messages from the JavaScript file.

```ts twoslash
// @errors: 2345
// @allowjs: true
// @checkjs: true
// @filename: constants.js
module.exports.pi = parseFloat(3.142);

// @filename: index.ts
import { pi } from "./constants";
console.log(pi);
```
