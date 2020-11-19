---
display: "bundledPackageName"
oneline: "Provides a name for bundled UMD .d.ts files"
---

When you mix [`declaration`](#declaration) and [`outFile`](#outFile) the resulting .d.ts needs to know what the root name of the module is so that paths can be correctly resolved internally.

For example, this project:

```ts twoslash
// @filename: projectRoot/index.ts
export * from "./nested/base";

// @filename: projectRoot/nested/base.ts
export const a = "123";
```

With the following `tsconfig.json`:

```json tsconfig
{
  "compilerOptions": {
    "outFile": "index.js",
    "declaration": true,
    "module": "amd",
    "bundledPackageName": "hello"
  }
}
```

Would create this `index.d.ts` where the internal modules resolve according to the name from `bundledPackageName`:

```ts twoslash
// @filename: projectRoot/index.ts
export * from "./nested/base";

// @filename: projectRoot/nested/base.ts
export const a = "123";
// @bundledPackageName: hello
// @module: amd
// @outfile: index.js
// @declaration: true
// @showEmit
// @showEmittedFile: index.d.ts
```
