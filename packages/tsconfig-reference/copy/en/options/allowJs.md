---
display: "Allow JS"
---

Allow JavaScript files to be imported inside your project, instead of just `.ts` and `.tsx` files. For example, this JS file:

```js
// message.js
export const helloWorld = "Hi"
```

When imported into a TypeScript file:

```ts
// index.ts
import { helloWorld } from "./def"

console.log(helloWorld)
```

Raises an error without `allowJs`:

```sh
index.ts(1,28): error TS7016: Could not find a declaration file for module './message'. '/message.js' implicitly has an 'any' type.
```

This flag can be used as a way to incrementally add TypeScript files into JS projects.
