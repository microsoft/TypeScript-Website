---
display: "Declaration"
oneline: "Generate .d.ts files from TypeScript and JavaScript files in your project."
---

Generate `.d.ts` files for every TypeScript or JavaScript file inside your project.
These `.d.ts` files are type definition files which describe the external API of your module.
With `.d.ts` files, tools like TypeScript can provide intellisense and accurate types for un-typed code.

When `declaration` is set to `true`, running the compiler with this TypeScript code:

```ts 
export let helloWorld = "hi";
```

Will generate an `index.js` file like this:

```ts twoslash
// @showEmit
export let helloWorld = "hi";
```

With a corresponding `helloWorld.d.ts`:

```ts twoslash
// @showEmittedFile: index.d.ts
// @showEmit
// @declaration
export let helloWorld = "hi";
```

When working with `.d.ts` files for JavaScript files you may want to use [`emitDeclarationOnly`](#emitDeclarationOnly) or use [`outDir`](#outDir) to ensure that the JavaScript files are not overwritten.
