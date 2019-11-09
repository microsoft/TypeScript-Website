---
display: "Declaration"
---

Generate `d.ts` files for every TypeScript or JavaScript file inside your project. 
These `d.ts` files are type definition files which describe the external API of your module. 
With `d.ts files, tools like TypeScript can provide intellisense and accurate types for un-typed code.

When `declaration` is set to `true`, running the compiler with this TypeScript code:

```ts
// helloWorld.ts
export const helloWorld = "hi"
```

Will generate a `helloWorld.js` file like this:

```js
// Example.js
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.helloWorld = "hi";
```

With a corresponding  this `helloWorld.d.ts`:

```js
// Example.d.ts
export declare const helloWorld = "hi";
```

