---
title: Modules - ESM/CJS Interoperability
short: ESM/CJS Interoperability
layout: docs
permalink: /docs/handbook/modules/appendices/esm-cjs-interop.html
oneline: A detailed look at interoperability between ES modules and CommonJS modules
---

It’s 2015, and you’re writing an ESM-to-CJS transpiler. There’s no specification for how to do this; all you have is a specification of how ES modules are supposed to interact with each other, knowledge of how CommonJS modules interact with each other, and a knack for figuring things out. Consider an exporting ES module:

```ts
export const A = {};
export const B = {};
export default "Hello, world!";
```

How would you turn this into a CommonJS module? Recalling that default exports are just named exports with special syntax, there seems to be only one choice:

```ts
exports.A = {};
exports.B = {};
exports.default = "Hello, world!";
```

This is a nice analog, and it lets you implement a similar on the importing side:

```ts
import hello, { A, B } from "./module";
console.log(hello, A, B);

// transpiles to:

const module_1 = require("./module");
console.log(module_1.default, module_1.A, module_1.B);
```

So far, everything in CJS-world matches up one-to-one with everything in ESM-world. Extending the equivalence above one step further, we can see that we also have:

```ts
import * as mod from "./module";
console.log(mod.default, mod.A, mod.B);

// transpiles to:

const mod = require("./module");
console.log(mod.default, mod.A, mod.B);
```

You might notice that in this scheme, there’s no way to write an ESM export that produces an output where `exports` is assigned a function, class, or primitive:

```ts
// @Filename: exports-function.js
module.exports = function hello() {
  console.log("Hello, world!");
};
```

But existing CommonJS modules frequently take this form. How might an ESM import, processed with our transpiler, access this module? We just established that a namespace import (`import *`) transpiles to a plain `require` call, so we can support an input like:

```ts
import * as hello from "./exports-function";
hello();

// transpiles to:

const hello = require("./exports-function");
hello();
```

Our output works at runtime, but we have a compliance problem: according to the JavaScript specification, a namespace import always resolves to a [_Module Namespace Object_](https://tc39.es/ecma262/#sec-module-namespace-objects), that is, an object whose members are the exports of the module. In this case, `require` would return the function `hello`, but `import *` can never return a function. The correspondence we assumed appears invalid.

It’s worth taking a step back here and clarifying what the _goal_ is. As soon as modules landed in the ES2015 specification, transpilers emerged with support for downleveling ESM to CJS, allowing users to adopt the new syntax long before runtimes implemented support for it. There was even a sense that writing ESM code was a good way to “future-proof” new projects. For this to be true, there needed to be a seamless migration path from executing the transpilers’ CJS output to executing the ESM input natively once runtimes developed support for it. The goal was to find a way to downlevel ESM to CJS that would allow any or all of those transpiled outputs to be replaced by their true ESM inputs in a future runtime, with no observable change in behavior.

By following the specification, it was easy enough for transpilers to find a set of transformations that made the semantics of their transpiled CommonJS outputs match the specified semantics of their ESM inputs (arrows represent imports):

![A flowchart with two similar flows side-by-side. Left: ESM. Right: ESM transpiled to CJS. In the ESM flow: "Importing module" flows to "Imported module" through arrow labeled "specified behavior". In the ESM transpiled to CJS flow: "Importing module" flows to "Imported module" through arrow labeled "designed based on spec".](../diagrams/esm-cjs-interop.md-1.svg)

However, CommonJS modules (written as CommonJS, not as ESM transpiled to CommonJS) were already well-established in the Node.js ecosystem, so it was inevitable that modules written as ESM and transpiled to CJS would start “importing” modules written as CommonJS. The behavior for this interoperability, though, was not specified by ES2015, and didn’t yet exist in any real runtime.

![A flowchart with three areas side-by-side. Left: ESM. Middle: True CJS. Right: ESM transpiled to CJS. Left: ESM "Importing module" flows to ESM "Imported module" through arrow labeled "specified behavior," and to True CJS "Imported module" through dotted arrow labeled "unspecified behavior." Right: ESM transpiled to CJS "Importing module" flows to ESM transpiled to CJS "Imported module" through arrow labeled "designed based on spec," and to True CJS "Imported module" through dotted arrow labeled "❓🤷‍♂️❓"](../diagrams/esm-cjs-interop.md-2.svg)

Even if transpiler authors did nothing, a behavior would emerge from the existing semantics between the `require` calls they emitted in transpiled code and the `exports` defined in existing CJS modules. And to allow users to transition seamlessly from transpiled ESM to true ESM once their runtime supported it, that behavior would have to match the one the runtime chose to implement.

Guessing what interop behavior runtimes would support wasn’t limited to ESM importing “true CJS” modules either. Whether ESM would be able to recognize ESM-transpiled-from-CJS as distinct from CJS, and whether CJS would be able to `require` ES modules, were also unspecified. Even whether ESM imports would use the same module resolution algorithm as CJS `require` calls was unknowable. All these variables would have to be predicted correctly in order to give transpiler users a seamless migration path toward native ESM.

## `allowSyntheticDefaultImports` and `esModuleInterop`

Let’s return to our specification compliance problem, where `import *` transpiles to `require`:

```ts
// Invalid according to the spec:
import * as hello from "./exports-function";
hello();

// but the transpilation works:
const hello = require("./exports-function");
hello();
```

When TypeScript first added support for writing and transpiling ES modules, the compiler addressed this problem by issuing an error on any namespace import of a module whose `exports` was not a namespace-like object:

```ts
import * as hello from "./exports-function";
// TS2497              ^^^^^^^^^^^^^^^^^^^^
// External module '"./exports-function"' resolves to a non-module entity
// and cannot be imported using this construct.
```

The only workaround was for users to go back to using the older TypeScript import syntax representing a CommonJS `require`:

```ts
import hello = require("./exports-function");
```

Forcing users to revert to non-ESM syntax was essentially an admission that “we don’t know how or if a CJS module like `"./exports-function"` will be accessible with ESM imports in the future, but we know it _can’t_ be with `import *`, even though it will work at runtime in the transpilation scheme we’re using.” It doesn’t meet the goal of allowing this file to be migrated to real ESM without changes, but neither does the alternative of allowing the `import *` to link to a function. This is still the behavior in TypeScript today when `allowSyntheticDefaultImports` and `esModuleInterop` are disabled.

> Unfortunately, this is a slight oversimplification—TypeScript didn’t fully avoid the compliance issue with this error, because it allowed namespace imports of functions to work, and retain their call signatures, as long as the function declaration merged with a namespace declaration—even if the namespace was empty. So while a module exporting a bare function was recognized as a “non-module entity”:
> ```ts
> declare function $(selector: string): any;
> export = $; // Cannot `import *` this 👍
> ```
> A should-be-meaningless change allowed the invalid import to type check without errors:
> ```ts
> declare namespace $ {}
> declare function $(selector: string): any;
> export = $; // Allowed to `import *` this and call it 😱
> ```

Meanwhile, other transpilers were coming up with a way to solve the same problem. The thought process went something like this:

1. To import a CJS module that exports a function or a primitive, we clearly need to use a default import. A namespace import would be illegal, and named imports don’t make sense here.
2. Most likely, this means that runtimes implementing ESM/CJS interop will choose to make default imports of CJS modules _always_ link directly to the whole `exports`, rather than only doing so if the `exports` is a function or primitive.
3. So, a default import of a true CJS module should work just like a `require` call. But we’ll need a way to disambiguate true CJS modules from our transpiled CJS modules, so we can still transpile `export default "hello"` to `exports.default = "hello"` and have a default import of _that_ module link to `exports.default`. Basically, a default import of one of our own transpiled modules needs to work one way (to simulate ESM-to-ESM imports), while a default import of any other existing CJS module needs to work another way (to simulate how we think ESM-to-CJS imports will work).
4. When we transpile an ES module to CJS, let’s add a special extra field to the output:
   ```ts
   exports.A = {};
   exports.B = {};
   exports.default = "Hello, world!";
   // Extra special flag!
   exports.__esModule = true;
   ```
   that we can check for when we transpile a default import:
   ```ts
   // import hello from "./module";
   const _mod = require("./module");
   const hello = _mod.__esModule ? _mod.default : _mod;
   ```

The `__esModule` flag first appeared in Traceur, then in Babel, SystemJS, and Webpack shortly after. TypeScript added the `allowSyntheticDefaultImports` in 1.8 to allow the type checker to link default imports directly to the `exports`, rather than the `exports.default`, of any module types that lacked an `export default` declaration. The flag didn’t modify how imports or exports were emitted, but it allowed default imports to reflect how other transpilers would treat them. Namely, it allowed a default import to be used to resolve to “non-module entities,” where `import *` was an error:

```ts
// Error:
import * as hello from "./exports-function";

// Old workaround:
import hello = require("./exports-function");

// New way, with `allowSyntheticDefaultImports`:
import hello from "./exports-function";
```

This was usually enough to let Babel and Webpack users write code that already worked in those systems without TypeScript complaining, but it was only a partial solution, leaving a few issues unsolved:

1. Babel and others varied their default import behavior on whether an `__esModule` property was found on the target module, but `allowSyntheticDefaultImports` only enabled a _fallback_ behavior when no default export was found in the target module’s types. This created an inconsistency if the target module had an `__esModule` flag but _no_ default export. Transpilers and bundlers would still link a default import of such a module to its `exports.default`, which would be `undefined`, and would ideally be an error in TypeScript, since real ESM imports cause errors if they can’t be linked. But with `allowSyntheticDefaultImports`, TypeScript would think a default import of such an import links to the whole `exports` object, allowing named exports to be accessed as its properties.
2. `allowSyntheticDefaultImports` didn’t change how namespace imports were typed, creating an odd inconsistency where both could be used and would have the same type:
   ```ts
   // @Filename: exportEqualsObject.d.ts
   declare const obj: object;
   export = obj;

   // @Filename: main.ts
   import objDefault from "./exportEqualsObject";
   import * as objNamespace from "./exportEqualsObject";

   // This should be true at runtime, but TypeScript gives an error:
   objNamespace.default === objDefault;
   //           ^^^^^^^ Property 'default' does not exist on type 'typeof import("./exportEqualsObject")'.
   ```
3. Most importantly, `allowSyntheticDefaultImports` did not change the JavaScript emitted by `tsc`. So while the flag enabled more accurate checking as long as the code was fed into another tool like Babel or Webpack, it created a real danger for users who were emitting `--module commonjs` with `tsc` and running in Node.js. If they encountered an error with `import *`, it may have appeared as if enabling `allowSyntheticDefaultImports` would fix it, but in fact it only silenced the build-time error while emitting code that would crash in Node.

TypeScript introduced the `esModuleInterop` flag in 2.7, which refined the type checking of imports to address the remaining inconsistencies between TypeScript’s analysis and the interop behavior used in existing transpilers and bundlers, and critically, adopted the same `__esModule`-conditional CommonJS emit that transpilers had adopted years before. (Another new emit helper for `import *` ensured the result was always an object, with call signatures stripped, fully resolving the specification compliance issue that the aforementioned “resolves to a non-module entity” error didn’t quite sidestep.) Finally, with the new flag enabled, TypeScript’s type checking, TypeScript’s emit, and the rest of the transpiling and bundling ecosystem were in agreement on a CJS/ESM interop scheme that was spec-legal and, perhaps, plausibly adoptable by Node.

## Interop in Node.js

Node.js shipped support for ES modules unflagged in v12. Like the bundlers and transpilers began doing years before, Node.js gave CommonJS modules a “synthetic default export” of their `exports` object, allowing the entire module contents to be accessed with a default import from ESM:

```ts
// @Filename: export.cjs
module.exports = { hello: "world" };

// @Filename: import.mjs
import greeting from "./export.cjs";
greeting.hello; // "world"
```

That’s one win for seamless migration! Unfortunately, the similarities mostly end there.

### No `__esModule` detection (the “double default” problem)

Node.js wasn’t able to respect the `__esModule` marker to vary its default import behavior. So a transpiled module with a “default export” behaves one way when “imported” by another transpiled module, and another way when imported by a true ES module in Node.js:

```ts
// @Filename: node_modules/dependency/index.js
exports.__esModule = true;
exports.default = function doSomething() { /*...*/ }

// @Filename: transpile-vs-run-directly.{js/mjs}
import doSomething from "dependency";
// Works after transpilation, but not a function in Node.js ESM:
doSomething();
// Doesn't exist after trasnpilation, but works in Node.js ESM:
doSomething.default();
```

While the transpiled default import only makes the synthetic default export if the target module lacks an `__esModule` flag, Node.js _always_ synthesizes a default export, creating a “double default” on the transpiled module.

### Unreliable named exports

In addition to making a CommonJS module’s `exports` object available as a default import, Node.js attempts to find properties of `exports` to make available as named imports. This behavior matches bundlers and transpilers when it works; however, Node.js uses [syntactic analysis](https://github.com/nodejs/cjs-module-lexer) to synthesize named exports before any code executes, whereas transpiled modules resolve their named imports at runtime. The result is that imports from CJS modules that work in transpiled modules may not work in Node.js:

```ts
// @Filename: named-exports.cjs
exports.hello = "world";
exports["worl" + "d"] = "hello";

// @Filename: transpile-vs-run-directly.{js/mjs}
import { hello, world } from "./named-exports.cjs";
// `hello` works, but `world` is missing in Node.js 💥

import mod from "./named-exports.cjs";
mod.world;
// Accessing properties from the default always works ✅
```

### Cannot `require` a true ES module

True CommonJS modules can `require` an ESM-transpiled-to-CJS module, since they’re both CommonJS at runtime. But in Node.js, `require` crashes if it resolves to an ES module. This means published libraries cannot migrate from transpiled modules to true ESM without breaking their CommonJS (true or transpiled) consumers:

```ts
// @Filename: node_modules/dependency/index.js
export function doSomething() { /* ... */ }

// @Filename: dependent.js
import { doSomething } from "dependency";
// ✅ Works if dependent and dependency are both transpiled
// ✅ Works if dependent and dependency are both true ESM
// ✅ Works if dependent is true ESM and dependency is transpiled
// 💥 Crashes if dependent is transpiled and dependency is true ESM
```

### Different module resolution algorithms

Node.js introduced a new module resolution algorithm for resolving ESM imports that differed significantly from the long-standing algorithm for resolving `require` calls. While not directly related to interop between CJS and ES modules, this difference was one more reason why a seamless migration from transpiled modules to true ESM might not be possible:

```ts
// @Filename: add.js
export function add(a, b) {
  return a + b;
}

// @Filename: math.js
export * from "./add";
//            ^^^^^^^
// Works when transpiled to CJS,
// but would have to be "./add.js"
// in Node.js ESM.
```

## Conclusions

Clearly, a seamless migration from transpiled modules to ESM isn’t possible, at least in Node.js. Where does this leave us?

### Setting the right `module` compiler option is critical

Since interoperability rules differ between hosts, TypeScript can’t offer correct checking behavior unless it understands what kind of module is represented by each file it sees, and what set of rules to apply to them. This is the purpose of the `module` compiler option. (In particular, code that is intended to run in Node.js is subject to stricter rules than code that will be processed by a bundler. The compiler’s output is not checked for Node.js compatibility unless `module` is set to `node16` or `nodenext`.)

### Applications with CommonJS code should always enable `esModuleInterop`

In a TypeScript _application_ (as opposed to a library that others may consume) where `tsc` is used to emit JavaScript files, whether `esModuleInterop` is enabled doesn’t have major consequences. The way you write imports for certain kinds of modules will change, but TypeScript’s checking and emit are in sync, so error-free code should be safe to run in either mode. The downside of leaving `esModuleInterop` disabled in this case is that it allows you to write JavaScript code with semantics that clearly violate the ECMAScript specification, confusing intuitions about namespace imports and making it harder to migrate to running ES modules in the future.

In an application that gets processed by a third-party transpiler or bundler, on the other hand, enabling `esModuleInterop` is more important. All major bundlers and transpilers use an `esModuleInterop`-like emit strategy, so TypeScript needs to adjust its checking to match. (The compiler always reasons about what will happen in the JavaScript files that `tsc` would emit, so even if another tool is being used in place of `tsc`, emit-affecting compiler options should still be set to match the output of that tool as closely as possible.)

`allowSyntheticDefaultImports` without `esModuleInterop` should be avoided. It changes the compiler’s checking behavior without changing the code emitted by `tsc`, allowing potentially unsafe JavaScript to be emitted. Additionally, the checking changes it introduces are an incomplete version of the ones introduced by `esModuleInterop`. Even if `tsc` isn’t being used for emit, it’s better to enable `esModuleInterop` than `allowSyntheticDefaultImports`.

Some people object to the inclusion of the `__importDefault` and `__importStar` helper functions included in `tsc`’s JavaScript output when `esModuleInterop` is enabled, either because it marginally increases the output size on disk or because the interop algorithm employed by the helpers seems to misrepresent Node.js’s interop behavior by checking for `__esModule`, leading to the hazards discussed earlier. Both of these objections can be addressed, at least partially, without accepting the flawed checking behavior exhibited with `esModuleInterop` disabled. First, the `importHelpers` compiler option can be used to import the helper functions from `tslib` rather than inlining them into each file that needs them. To discuss the second objection, let’s look at a final example:

```ts
// @Filename: node_modules/transpiled-dependency/index.js
exports.__esModule = true;
exports.default = function doSomething() { /* ... */ };
exports.something = "something";

// @Filename: node_modules/true-cjs-dependency/index.js
module.exports = function doSomethingElse() { /* ... */ };

// @Filename: src/sayHello.ts
export default function sayHello() { /* ... */ }
export const hello = "hello";

// @Filename: src/main.ts
import doSomething from "transpiled-dependency";
import doSomethingElse from "true-cjs-dependency";
import sayHello from "./sayHello.js";
```

Assume we’re compiling `src` to CommonJS for use in Node.js. Without `allowSyntheticDefaultImports` or `esModuleInterop`, the import of `doSomethingElse` from `"true-cjs-dependency"` is an error, and the others are not. To fix the error without changing any compiler options, you could change the import to `import doSomethingElse = require("true-cjs-dependency")`. However, depending on how the types for the module (not shown) are written, you may also be able to write and call a namespace import, which would be a language-level specification violation. With `esModuleInterop`, none of the imports shown are errors (and all are callable), but the invalid namespace import would be caught.

What would change if we decided to migrate `src` to true ESM in Node.js (say, add `"type": "module"` to our root package.json)? The first import, `doSomething` from `"transpiled-dependency"`, would no longer be callable—it exhibits the “double default” problem, where we’d have to call `doSomething.default()` rather than `doSomething()`. (TypeScript understands and catches this under `--module node16` and `nodenext`.) But notably, the _second_ import of `doSomethingElse`, which needed `esModuleInterop` to work when compiling to CommonJS, works fine in true ESM.

If there’s something to complain about here, it’s not what `esModuleInterop` does with the second import. The changes it makes, both allowing the default import and preventing callable namespace imports, are exactly in line with Node.js’s real ESM/CJS interop strategy, and made migration to real ESM easier. The problem, if there is one, is that `esModuleInterop` seems to fail at giving us a seamless migration path for the _first_ import. But this problem was not introduced by enabling `esModuleInterop`; the first import was completely unaffected by it. Unfortunately, this problem cannot be solved without breaking the semantic contract between `main.ts` and `sayHello.ts`, because the CommonJS output of `sayHello.ts` looks structurally identical to `transpiled-dependency/index.js`. If `esModuleInterop` changed the way the transpiled import of `doSomething` works to be identical to the way it would work in Node.js ESM, it would change the behavior of the `sayHello` import in the same way, making the input code violate ESM semantics (thus still preventing the `src` directory from being migrated to ESM without changes).

As we’ve seen, there is no seamless migration path from transpiled modules to true ESM. But `esModuleInterop` is one step in the right direction. For those who still prefer to minimize module syntax transformations and the inclusion of the import helper functions, enabling `verbatimModuleSyntax` is a better choice than disabling `esModuleInterop`. `verbatimModuleSyntax` enforces that the `import mod = require("mod")` and `export = ns` syntax be used in CommonJS-emitting files, avoiding all the kinds of import ambiguity we’ve discussed, at the cost of ease of migration to true ESM.

### Library code needs special considerations

Libraries that ship as CommonJS should avoid using default exports, since the way those transpiled exports can be accessed varies between different tools and runtimes, and some of those ways will look confusing to users. A default export, transpiled to CommonJS by `tsc`, is accessible in Node.js as the default property of a default import:

```js
import pkg from "pkg";
pkg.default();
```

in most bundlers or transpiled ESM as the default import itself:

```js
import pkg from "pkg";
pkg();
```

and in vanilla CommonJS as the default property of a `require` call:

```js
const pkg = require("pkg");
pkg.default();
```

Users will detect a misconfigured module smell if they have to access the `.default` property of a default import, and if they’re trying to write code that will run both in Node.js and a bundler, they might be stuck. Some third-party TypeScript transpilers expose options that change the way default exports are emitted to mitigate this difference, but they don’t produce their own declaration (`.d.ts`) files, so that creates a mismatch between the runtime behavior and the type checking, further confusing and frustrating users. Instead of using default exports, libraries that need to ship as CommonJS should use `export =` for modules that have a single main export, or named exports for modules that have multiple exports:

```diff
- export default function doSomething() { /* ... */ }
+ export = function doSomething() { /* ... */ }
```

Libraries (that ship declaration files) should also take extra care to ensure the types they write are error-free under a wide range of compiler options. For example, it’s possible to write one interface that extends another in such a way that it only compiles successfully when `strictNullChecks` is disabled. If a library were to publish types like that, it would force all their users to disable `strictNullChecks` too. `esModuleInterop` can allow type declarations to contain similarly “infectious” default imports:

```ts
// @Filename: /node_modules/dependency/index.d.ts
import express from "express";
declare function doSomething(req: express.Request): any;
export = doSomething;
```

Suppose this default import _only_ works with `esModuleInterop` enabled, and causes an error when a user without that option references this file. The user should _probably_ enable `esModuleInterop` anyway, but it’s generally seen as bad form for libraries to make their configurations infectious like this. It would be much better for the library to ship a declaration file like:

```ts
import express = require("express");
// ...
```

Examples like this have led to conventional wisdom that says libraries should _not_ enable `esModuleInterop`. This advice is a reasonable start, but we’ve looked at examples where the type of a namespace import changes, potentially _introducing_ an error, when enabling `esModuleInterop`. So whether libraries compile with or without `esModuleInterop`, they run the risk of writing syntax that makes their choice infectious.

Library authors who want to go above and beyond to ensure maximum compatibility would do well to validate their declaration files against a matrix of compiler options. But using `verbatimModuleSyntax` completely sidesteps the issue with `esModuleInterop` by forcing CommonJS-emitting files to use CommonJS-style import and export syntax. Additionally, since `esModuleInterop` only affects CommonJS, as more libraries move to ESM-only publishing over time, the relevance of this issue will decline.

<!--

https://github.com/babel/babel/issues/493
https://github.com/babel/babel/issues/95
https://github.com/nodejs/node/pull/16675
https://github.com/nodejs/ecmascript-modules/pull/31
https://github.com/google/traceur-compiler/pull/785#issuecomment-35633727
https://github.com/microsoft/TypeScript/pull/2460
https://github.com/systemjs/systemjs/commit/3b3b03a4b8ffc0f71fab263ef9d5c70f0adc5339
https://github.com/microsoft/TypeScript/pull/5577
https://github.com/microsoft/TypeScript/pull/19675
https://github.com/microsoft/TypeScript/issues/16093
https://github.com/nodejs/modules/issues/139
https://github.com/microsoft/TypeScript/issues/54212

-->
