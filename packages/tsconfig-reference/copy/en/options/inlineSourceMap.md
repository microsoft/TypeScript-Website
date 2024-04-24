---
display: "Inline Source Map"
oneline: "Include sourcemap files inside the emitted JavaScript."
---

When set, instead of writing out a `.js.map` file to provide source maps, TypeScript will embed the source map content in the `.js` files.
Although this results in larger JS files, it can be convenient in some scenarios.
For example, you might want to debug JS files on a webserver that doesn't allow `.map` files to be served.

Mutually exclusive with [`sourceMap`](#sourceMap).

For example, with this TypeScript:

```ts
const helloWorld = "hi";
console.log(helloWorld);
```

Converts to this JavaScript:

```ts twoslash
// @showEmit
const helloWorld = "hi";
console.log(helloWorld);
```

Then enable building it with `inlineSourceMap` enabled there is a comment at the bottom of the file which includes
a source-map for the file.

```ts twoslash
// @inlineSourceMap
// @showEmit
const helloWorld = "hi";
console.log(helloWorld);
```
