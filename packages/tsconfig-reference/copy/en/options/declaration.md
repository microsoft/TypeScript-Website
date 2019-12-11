---
display: "Declaration"
---

Generate `d.ts` files for every TypeScript or JavaScript file inside your project. 
These `d.ts` files are type definition files which describe the external API of your module. 
With `d.ts` files, tools like TypeScript can provide intellisense and accurate types for un-typed code.

When `declaration` is set to `true`, running the compiler with this TypeScript code:

```ts twoslash
export const helloWorld = "hi"
```

Will generate an `index.js` file like this:

```ts twoslash
// @showEmit
export const helloWorld = "hi"
```

With a corresponding `helloWorld.d.ts`:

```js
// @showEmittedFile: index.d.ts
// @showEmit
// @declaration
export declare const helloWorld = "hi";
```

