---
display: "Check JS"
---


Works in tandem with `allowJs`. When `checkJs` is enabled then errors are reported in JavaScript files. This is 
the equivalent of including `// @ts-check` at the top of all JavaScript files which are included in your project.

For example, this is incorrect JavaScript according to the `parseFloat` type definition which comes with TypeScript:

```js
export const pi = parseFloat(3.124) // parseFloat only takes a string
```

When imported into a TypeScript module

```ts
import { pi } from "./def"

console.log(pi)
```

You will not get any errors. However, if you turn on `checkJs` then you will get error messages from the JavaScript file.

```js
def.js(1,30): error TS2345: Argument of type '3.124' is not assignable to parameter of type 'string'.
```
