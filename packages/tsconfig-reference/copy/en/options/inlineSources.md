---
display: "Inline Sources"
---

When set, TypeScript will include the original content of the `.ts` file as an embedded string in the source map.
This is often useful in the same cases as `inlineSourceMap`.

Requires either `sourceMap` or `inlineSourceMap` to be set.


For example, with this TypeScript:

```ts
const helloWorld = "hi";
console.log(helloWorld)
```

By default converts to this JavaScript:

```ts twoslasher
// @showEmit
const helloWorld = "hi";
console.log(helloWorld)
```

Then enable building it with `inlineSources` and `inlineSourceMap` enabled there is a comment at the bottom of the file which includes
a source-map for the file. 
Note that the end is different from the example in [`inlineSourceMap`](#inlineSourceMap) because the source-map now contains the original source code also.

```ts twoslasher
// @inlineSources
// @inlineSourceMap
// @showEmit
const helloWorld = "hi";
console.log(helloWorld)
```
