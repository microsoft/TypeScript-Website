## .JS + .D.TS Sidebars

### .JS Emit

Two of the key arguments for using TypeScript are its JavaScript interoperability and "downleveling" the emitted JavaScript to an older versions of JavaScript. You may have heard of "downleveling" as "transpile" or "backport" but the rough gist is taking modern syntax and re-implementing it using older syntax for older browsers and JavaScript engines.

Because understanding the JavaScript output from your TypeScript is so important, we made it the default view in the Playground. The "JS" sidebar shows what happens when the code in your editor is converted to JavScript version (mostly) according to your `target` compiler setting, which defaults to `ES2017`. This works with `.tsx`, `.ts`, `.js` files, and `.d.ts` files are (accurately) shown to have no JavaScript equivalent. The "JS" sidebar will update as you type.

### .D.TS Emit

`.d.ts` files are the behind the scenes tooling which power the editing experiences for working with JavaScript libraries. If you're writing TypeScript all day and interacting with TypeScript codebases, you might not need to write and understand the output of a `.d.ts` too often. However, this isn't the case for everyone and the `.d.ts` sidebar tab helps you understand how TypeScript will generate a `.d.ts` for your code.

There are two use cases for using the `.d.ts` tab:

- **TypeScript to `.d.ts`**. Understanding the effects of `export` in your code and how TypeScript resolves your types.

- **JavaScript to `.d.ts`**. When you are writing a library in JavaScript and use a mix of type inference and [JSDoc support](https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html) to add type annotations.

### Other files

No-one has really asked for `.map` support, which is the other file the TypeScript compiler could emit. However, you could turn on [`inlineSourceMap`](https://www.typescriptlang.org/tsconfig#inlineSourceMap) to have it included in the `.js` emit [for example](https://www.typescriptlang.org/play?inlineSourceMap=true#code/PTAEAEEsDsBsYKYGUD2BXATgYwQWQIYAOAUFitAM4Auo+oAvKAEQDyA0k0A).
