---
title: TypeScript 6.0
layout: docs
permalink: /docs/handbook/release-notes/typescript-6-0.html
oneline: TypeScript 6.0 Release Notes
---

## Less Context-Sensitivity on `this`-less Functions

When parameters don't have explicit types written out, TypeScript can usually infer them based on an expected type, or even through other arguments in the same function call.

```ts
declare function callIt<T>(obj: {
    produce: (x: number) => T,
    consume: (y: T) => void,
}): void;

// Works, no issues.
callIt({
    produce: (x: number) => x * 2,
    consume: y => y.toFixed(),
});

// Works, no issues even though the order of the properties is flipped.
callIt({
    consume: y => y.toFixed(),
    produce: (x: number) => x * 2,
});
```

Here, TypeScript can infer the type of `y` in the `consume` function based on the inferred `T` from the `produce` function, regardless of the order of the properties.
But what about if these functions were written using *method syntax* instead of arrow function syntax?

```ts
declare function callIt<T>(obj: {
    produce: (x: number) => T,
    consume: (y: T) => void,
}): void;

// Works fine, `x` is inferred to be a number.
callIt({
    produce(x: number) { return x * 2; },
    consume(y) { return y.toFixed(); },
});

callIt({
    consume(y) { return y.toFixed(); },
    //                  ~
    // error: 'y' is of type 'unknown'.

    produce(x: number) { return x * 2; },
});
```

Strangely enough, the second call to `callIt` results in an error because TypeScript is not able to infer the type of `y` in the `consume` method.
What's happening here is that when TypeScript is trying to find candidates for `T`, it will first skip over functions whose parameters don't have explicit types.
It does this because certain functions may need the inferred type of `T` to be correctly checked - in our case, we need to know the type of `T` to analyze our `consume` function.

These functions are called *contextually sensitive functions* - basically, functions that have parameters without explicit types.
Eventually the type system will need to figure out types for these parameters - but this is a bit at odds with how inference works in generic functions because the two "pull" on types in different directions.

```ts
function callFunc<T>(callback: (x: T) => void, value: T) {
    return callback(value);
}

callFunc(x => x.toFixed(), 42);
//       ^
// We need to figure out the type of `x` here,
// but we also need to figure out the type of `T` to check the callback.
```

To solve this, TypeScript skips over contextually sensitive functions during type argument inference, and instead checks and infers from other arguments first.
If skipping over contextually sensitive functions doesn't work, inference just continues across any unchecked arguments, going left-to-right in the argument list.
In the example immediately above, TypeScript will skip over the callback during inference for `T`, but will then look at the second argument, `42`, and infer that `T` is `number`.
Then, when it comes back to check the callback, it will have a contextual type of `(x: number) => void`, which allows it to infer that `x` is a `number` as well.

So what's going on in our earlier examples?

```ts
// Arrow syntax - no errors.
callIt({
    consume: y => y.toFixed(),
    produce: (x: number) => x * 2,
});

// Method syntax - errors!
callIt({
    consume(y) { return y.toFixed(); },
    //                  ~
    // error: 'y' is of type 'unknown'.

    produce(x: number) { return x * 2; },
});
```

In both examples, `produce` is assigned a function with an explicitly-typed `x` parameter.
Shouldn't they be checked identically?

The issue is subtle: most functions (like the ones using method syntax) have an implicit `this` parameter, but arrow functions do not.
Any usage of `this` could require "pulling" on the type of `T` - for example, knowing the type of the containing object literal could in turn require the type of `consume`, which uses `T`.

But we're not using `this`!
Sure, the function might have a `this` value at runtime, but it's never used!

TypeScript 6.0 takes this into account when it decides if a function is contextually sensitive or not.
If `this` is never actually *used* in a function, then it is not considered contextually sensitive.
That means these functions will be seen as higher-priority when it comes to type inference, and all of our examples above now work! 

[This change was provided](https://github.com/microsoft/TypeScript/pull/62243) thanks to the work of [Mateusz Burzyński](https://github.com/Andarist).

## Subpath Imports Starting with `#/`

When Node.js added support for modules, it added a feature called ["subpath imports"](https://nodejs.org/api/packages.html#subpath-imports).
This is basically [a field called `imports`](https://nodejs.org/api/packages.html#imports) which allows packages to create internal aliases for modules within their package.

```json
{
    "name": "my-package",
    "type": "module",
    "imports": {
        "#root/*": "./dist/*"
    }
}
```

This allows modules in `my-package` to import from paths starting with `#root/`

```js
import * as utils from "#root/utils.js";
```

instead of using a relative path like the following.

```js
import * as utils from "../../utils.js";
```

One minor annoyance with this feature has been that developers always had to write *something* after the `#` when specifying a subpath import.
Here, we used `root`, but it is a bit useless since there is no directory we're mapping over other than `./dist/`

Developers who have used bundlers are also accustomed to using path-mapping to avoid long relative paths.
A familiar convention with bundlers has been to use a simple `@/` as the prefix.
Unfortunately, subpath imports could not start with `#/` at all, leading to a lot of confusion for developers trying to adopt them in their projects.

But more recently, [Node.js added support for subpath imports starting with `#/`](https://github.com/nodejs/node/pull/60864).
This allows packages to use a simple `#/` prefix for their subpath imports without needing to add an extra segment.

```json
{
    "name": "my-package",
    "type": "module",
    "imports": {
        "#/*": "./dist/*"
    }
}
```

This is supported in newer Node.js 20 releases, and so TypeScript now supports it under the options `nodenext` and `bundler` for the `--moduleResolution` setting.

This work was done thanks to [magic-akari](https://github.com/magic-akari), and [the implementing pull request can be found here](https://github.com/microsoft/TypeScript/pull/62844).

## Combining `--moduleResolution bundler` with `--module commonjs`

TypeScript's `--moduleResolution bundler` setting was previously only allowed to be used with `--module esnext` or `--module preserve`;
however, with the deprecation of `--moduleResolution node` (a.k.a. `--moduleResolution node10`), this new combination is often the most suitable upgrade path for many projects.

Projects will often want to instead plan out a migration towards either

* `--module preserve` and `--moduleResolution bundler`
* `--module nodenext`

depending on your project type (e.g. bundled web app, Bun app, or Node.js app).

More information can be found at [this implementing pull request](https://github.com/microsoft/TypeScript/pull/62320).

## The `--stableTypeOrdering` Flag

As part of our ongoing work on [TypeScript's native port](https://devblogs.microsoft.com/typescript/typescript-native-port/), we've introduced a new flag called `--stableTypeOrdering` intended to assist with 6.0-to-7.0 migrations.

Today, TypeScript assigns type IDs (internal tracking numbers) to types in the order they are encountered, and uses these IDs to sort union types in a consistent manner.
A similar process occurs for properties.
As a result, the order in which things are declared in a program can have possibly surprising effects on things like declaration emit.

For example, consider the declaration emit from this file:
```ts
// Input: some-file.ts
export function foo(condition: boolean) {
    return condition ? 100 : 500;
}

// Output: some-file.d.ts
export declare function foo(condition: boolean): 100 | 500;
//                                               ^^^^^^^^^
//             Note the order of this union: 100, then 500.
```

If we add an unrelated `const` *above* `foo`, the declaration emit changes:

```ts
// Input: some-file.ts
const x = 500;
export function foo(condition: boolean) {
    return condition ? 100 : 500;
}

// Output: some-file.d.ts
export declare function foo(condition: boolean): 500 | 100;
//                                               ^^^^^^^^^
//                           Note the change in order here.
```

This happens because the literal type `500` gets a lower type ID than `100` because it was processed first when analyzing the `const x` declaration.
In very rare cases this change in ordering can even cause errors to appear or disappear based on program processing order, but in general, the main place you might notice this ordering is in the emitted declaration files, or in the way types are displayed in your editor.

One of the major architectural improvements in TypeScript 7 is parallel type checking, which dramatically improves overall check time.
However, parallelism introduces a challenge: when different type-checkers visit nodes, types, and symbols in different orders, the internal IDs assigned to these constructs become non-deterministic.
This in turn leads to confusing non-deterministic output, where two files with identical contents in the same program can produce different declaration files, or even calculate different errors when analyzing the same file.
To fix this, TypeScript 7.0 sorts its internal objects (e.g. types and symbols) according to a deterministic algorithm based on the content of the object.
This ensures that all checkers encounter the same object order regardless of how and when they were created.
As a consequence, in the given example, TypeScript 7 will *always* print `100 | 500`, removing the ordering instability entirely.

This means that TypeScript 6 and 7 can and do sometimes display different ordering.
While these ordering changes are almost always benign, if you're comparing compiler outputs between runs (for example, checking emitted declaration files in 6.0 vs 7.0), these different orderings can produce a lot of noise that makes it difficult to assess correctness.
Occasionally though, you may witness a change in ordering that causes a type error to appear or disappear, which can be even more confusing.

To help with this situation, in 6.0, you can specify the new `--stableTypeOrdering` flag.
This makes 6.0's type ordering behavior match 7.0's, reducing the number of differences between the two codebases.
Note that we don't necessarily encourage using this flag all the time as it can add a substantial slowdown to type-checking (up to 25% depending on codebase).

If you encounter a type error using `--stableTypeOrdering`, this is typically due to inference differences.
The previous inference without `--stableTypeOrdering` *happened* to work based on the current ordering of types in your program.
To help with this, you'll often benefit from providing an explicit type somewhere.
Often, this will be a type argument

```diff
- someFunctionCall(/*...*/);
+ someFunctionCall<SomeExplicitType>(/*...*/);
```

or a variable annotation for an argument you intend to pass into a call.

```diff
- const someVariable = { /*... some complex object ...*/ };
+ const someVariable: SomeExplicitType = { /*... some complex object ...*/ };

someFunctionCall(someVariable);
```

**Note that this flag is only intended to help diagnose differences between 6.0 and 7.0 - it is not intended to be used as a long-term feature**

[See more at this pull-request](https://github.com/microsoft/TypeScript/pull/63084).

## `es2025` option for `target` and `lib`

TypeScript 6.0 adds support for the `es2025` option for both `target` and `lib`.
While there are no new JavaScript language features in ES2025, this new target adds new types for built-in APIs (e.g. `RegExp.escape`), and moves a few declarations from `esnext` into `es2025` (e.g. `Promise.try`, `Iterator` methods, and `Set` methods).
Work to enable [the new target](https://github.com/microsoft/TypeScript/pull/63046) was contributed thanks to [Kenta Moriuchi](https://github.com/petamoriken).

## New Types for `Temporal`

The long-awaited [Temporal proposal](https://github.com/tc39/proposal-temporal) has reached stage 4 and will be part of a future ECMAScript standard.
TypeScript 6.0 now includes built-in types for the Temporal API, so you can start using it in your TypeScript code today via `--target esnext` or `"lib": ["esnext"]` (or the more-granular `esnext.temporal`).

```ts
let yesterday = Temporal.Now.instant().subtract({
    hours: 24,
});

let tomorrow = Temporal.Now.instant().add({
    hours: 24,
});

console.log(`Yesterday: ${yesterday}`);
console.log(`Tomorrow: ${tomorrow}`);
```

Temporal is already usable in several runtimes, and with stage 4 status it is now officially part of the JavaScript language.
[Documentation on the Temporal APIs is available on MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Temporal).

[This work](https://github.com/microsoft/TypeScript/pull/62628) was contributed thanks to GitHub user [Renegade334](https://github.com/Renegade334).

## New Types for "upsert" Methods (a.k.a. `getOrInsert`)

A common pattern with `Map`s is to check if a key exists, and if not, set and fetch a default value.

```ts
function processOptions(compilerOptions: Map<string, unknown>) {
    let strictValue: unknown;
    if (compilerOptions.has("strict")) {
        strictValue = compilerOptions.get("strict");
    }
    else {
        strictValue = true;
        compilerOptions.set("strict", strictValue);
    }
    // ...
}
```

This pattern can be tedious.
[ECMAScript's "upsert" proposal](https://github.com/tc39/proposal-upsert) recently reached stage 4, and introduces 2 new methods on `Map` and `WeakMap`:

- `getOrInsert`
- `getOrInsertComputed`

These methods have been added to the `esnext` lib so that you can start using them immediately in TypeScript 6.0.

With `getOrInsert`, we can replace our code above with the following:

```ts
function processOptions(compilerOptions: Map<string, unknown>) {
    let strictValue = compilerOptions.getOrInsert("strict", true);
    // ...
}
```

`getOrInsertComputed` works similarly, but is for cases where the default value may be expensive to compute (e.g. requires lots of computations, allocations, or does long-running synchronous I/O).
Instead, it takes a callback that will only be called if the key is not already present.

```ts
someMap.getOrInsertComputed("someKey", () => {
    return computeSomeExpensiveValue(/*...*/);
});
```

This callback is also given the key as an argument, which can be useful for cases where the default value is based on the key.

```ts
someMap.getOrInsertComputed(someKey, computeSomeExpensiveDefaultValue);

function computeSomeExpensiveValue(key: string) {
    // ...
}
```

[This update](https://github.com/microsoft/TypeScript/pull/62612) was contributed thanks to GitHub user [Renegade334](https://github.com/Renegade334).

## `RegExp.escape`

When constructing some literal string to match within a regular expression, it is important to escape special regular expression characters like `*`, `+`, `?`, `(`, `)`, etc.
The [RegExp Escaping ECMAScript proposal](https://github.com/tc39/proposal-regex-escaping) has reached stage 4, and introduces a new `RegExp.escape` function that takes care of this for you.

```ts
function matchWholeWord(word: string, text: string) {
    const escapedWord = RegExp.escape(word);
    const regex = new RegExp(`\\b${escapedWord}\\b`, "g");
    return text.match(regex);
}
```

`RegExp.escape` is available in the `es2025` lib, so you can start using it in TypeScript 6.0 today.

[This work](https://github.com/microsoft/TypeScript/pull/63046) was contributed thanks [Kenta Moriuchi](https://github.com/petamoriken).

## The `dom` lib Now Contains `dom.iterable` and `dom.asynciterable`

TypeScript's `lib` option allows you to specify which global declarations your target runtime has.
One option is `dom` to represent web environments (i.e. browsers, who implement [the DOM APIs](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model)).
Previously, the DOM APIs were partially split out into `dom.iterable` and `dom.asynciterable` for environments that didn't support `Iterable`s and `AsyncIterable`s.
This meant that you had to explicitly add `dom.iterable` to use iteration methods on DOM collections like `NodeList` or `HTMLCollection`.

In TypeScript 6.0, the contents of `lib.dom.iterable.d.ts` and `lib.dom.asynciterable.d.ts` are fully included in `lib.dom.d.ts`.
You can still reference `dom.iterable` and `dom.asynciterable` in your configuration file's `"lib"` array, but they are now just empty files.

```ts
// Before TypeScript 6.0, this required "lib": ["dom", "dom.iterable"]
// Now it works with just "lib": ["dom"]
for (const element of document.querySelectorAll("div")) {
    console.log(element.textContent);
}
```

This is a quality-of-life improvement that eliminates a common point of confusion, since no major modern browser lacks these capabilities.
If you were already including both `dom` and `dom.iterable`, you can now simplify to just `dom`.

See more [at this issue](https://github.com/microsoft/TypeScript/issues/60959) and its [corresponding pull request](https://github.com/microsoft/TypeScript/pull/62111).

## Breaking Changes and Deprecations in TypeScript 6.0

TypeScript 6.0 arrives as a significant transition release, designed to prepare developers for TypeScript 7.0, the upcoming native port of the TypeScript compiler.
While TypeScript 6.0 maintains full compatibility with your existing TypeScript knowledge and continues to be API compatible with TypeScript 5.9, this release introduces a number of breaking changes and deprecations that reflect the evolving JavaScript ecosystem and set the stage for TypeScript 7.0.

In the two years since TypeScript 5.0, we've seen ongoing shifts in how developers write and ship JavaScript:

- Virtually every runtime environment is now "evergreen". True legacy environments (ES5) are vanishingly rare.
- Bundlers and ESM have become the most common module targets for new projects, though CommonJS remains a major target. AMD and other in-browser userland module systems are much rarer than they were in 2012.
- Almost all packages can be consumed through some module system. UMD packages still exist, but virtually no new code is available *only* as a global variable.
- `tsconfig.json` is nearly universal as a configuration mechanism.
- Appetite for "stricter" typing continues to grow.
- TypeScript build performance is top of mind. Despite the gains of TypeScript 7, performance must always remain a key goal, and options which can't be supported in a performant way need to be more strongly justified.

So TypeScript 6.0 and 7.0 are designed with these realities in mind.
For TypeScript 6.0, these deprecations can be ignored by setting `"ignoreDeprecations": "6.0"` in your tsconfig; however, note that TypeScript 7.0 *will not* support any of these deprecated options.

Some necessary adjustments can be automatically performed with a codemod or tool.
For example, the [experimental `ts5to6` tool](https://github.com/andrewbranch/ts5to6) can automatically adjust `baseUrl` and `rootDir` across your codebase.

### Up-Front Adjustments

We'll cover specific adjustments below, but we have to note that some deprecations and behavior changes do not necessarily have an error message that directly points to the underlying issue.
So we'll note up-front that **many projects will need to do at least one of the following**:

* Set the `"types"` array in tsconfig, typically to `"types": ["node"]`.

  `"types": ["*"]` will restore the 5.9 behavior, but we recommend using an explicit array to improve build performance and predictability.
  
  You'll typically know this is the issue if you see a *lot* of type errors related to missing identifiers or unresolved built-in modules.
* Set `"rootDir": "./src"` if you were previously relying on this being inferred
  
  You'll often know this is the issue if you see files being written to `./dist/src/index.js` instead of `./dist/index.js`.

### Simple Default Changes

Several compiler options now have updated default values that better reflect modern development practices.

- **`strict` is now `true` by default**:
  The appetite for stricter typing continues to grow, and we've found that most new projects want `strict` mode enabled.
  If you were already using `"strict": true`, nothing changes for you.
  If you were relying on the previous default of `false`, you'll need to explicitly set `"strict": false` in your `tsconfig.json`.

- **`module` defaults to `esnext`**:
  Similarly, the new default `module` is `esnext`, acknowledging that ESM is now the dominant module format.

- **`target` defaults to current-year ES version**: 
  The new default `target` is the most recent supported ECMAScript spec version (effectively a floating target).
  Right now, that target is `es2025`.
  This reflects the reality that most developers are shipping to evergreen runtimes and don't need to compile down to older ECMAScript versions.

- **`noUncheckedSideEffectImports` is now `true` by default**:
  This helps catch issues with typos in side-effect-only imports.

- **`libReplacement` is now `false` by default**:
  This flag previously incurred a large number of failed module resolutions for every run, which in turn increased the number of locations we needed to watch under `--watch` and editor scenarios.
  In a new project, `libReplacement` never does anything until other explicit configuration takes place, so it makes sense to turn this off by default for the sake of better performance by default.

If these new defaults break your project, you can specify the previous values explicitly in your `tsconfig.json`.

### `rootDir` now defaults to `.`

`rootDir` controls the directory structure of your output files relative to the output directory.
Previously, if you did not specify a `rootDir`, it was inferred based on the common directory of all non-declaration input files.
But this often meant that it was impossible to know if a file belonged to a project without trying to load and parse that project.
It also meant that TypeScript had to spend more time inferring that common source directory by analyzing every file path in the program.

In TypeScript 6.0, the default `rootDir` will always be the directory containing the `tsconfig.json` file.
`rootDir` will only be inferred when using `tsc` from the command line without a `tsconfig.json` file.

If you have source files any level deeper than your `tsconfig.json` directory and were relying on TypeScript to infer a common root directory for source files, you'll need to explicitly set `rootDir`:

```diff
  {
      "compilerOptions": {
          // ...
+         "rootDir": "./src"
      },
      "include": ["./src"]
  }
```

Likewise, if your `tsconfig.json` referenced files outside of the containing `tsconfig.json`, you would need to adjust your `rootDir` to include those files.

```diff
  {
      "compilerOptions": {
          // ...
+         "rootDir": "../src"
      },
      "include": ["../src/**/*.tests.ts"]
  }
```

See more at [the discussion here](https://github.com/microsoft/TypeScript/issues/62194) and [the implementation here](https://github.com/microsoft/TypeScript/pull/62418).

### `types` now defaults to `[]`

In a `tsconfig.json`, the `types` field of `compilerOptions` specifies a list of package names to be included in the global scope during compilation.
Typically, packages in `node_modules` are automatically included via imports in your source code;
but for convenience, TypeScript would also include all packages in `node_modules/@types` by default, so that you can get global declarations like `process` or the `"fs"` module from `@types/node`, or `describe` and `it` from `@types/jest`, without needing to import them directly.

In a sense, the `types` value previously defaulted to "enumerate everything in `node_modules/@types`".
This can be *very* expensive, as a normal repository setup these days might transitively pull in hundreds of `@types` packages, especially in multi-project workspaces with flattened `node_modules`.
Modern projects almost always need only `@types/node`, `@types/jest`, or a handful of other common global-affecting packages.

In TypeScript 6.0, the default `types` value will be `[]` (an empty array).
This change prevents projects from unintentionally pulling in hundreds or even thousands of unneeded declaration files at build time.
Many projects we've looked at have improved their build time anywhere from 20-50% just by setting `types` appropriately.

**This will affect many projects.** You will likely need to add `"types": ["node"]` or a few others:

```diff
  {
      "compilerOptions": {
          // Explicitly list the @types packages you need
+         "types": ["node", "jest"]
      }
  }
```

You can also specify a `*` entry to re-enable the old enumeration behavior:

```diff
  {
      "compilerOptions": {
          // Load ALL the types - the default from TypeScript 5.9 and before.
+         "types": ["*"]
      }
  }
```

If you end up with new error messages like the following:

```
Cannot find module '...' or its corresponding type declarations.
Cannot find name 'fs'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.
Cannot find name 'path'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.
Cannot find name 'process'. Do you need to install type definitions for node? Try `npm i --save-dev @types/node` and then add 'node' to the types field in your tsconfig.
Cannot find name 'Bun'. Do you need to install type definitions for Bun? Try `npm i --save-dev @types/bun` and then add 'bun' to the types field in your tsconfig.
Cannot find name 'describe'. Do you need to install type definitions for a test runner? Try `npm i --save-dev @types/jest` or `npm i --save-dev @types/mocha` and then add 'jest' or 'mocha' to the types field in your tsconfig.
```

it's likely that you need to add some entries to your `types` field.

See more at [the proposal here](https://github.com/microsoft/TypeScript/issues/62195) along with [the implementing pull request here](https://github.com/microsoft/TypeScript/pull/63054).

### Deprecated: `target: es5`

The ECMAScript 5 target was important for a long time to support legacy browsers; but its successor, ECMAScript 2015 (ES6), was released over a decade ago, and all modern browsers have supported it for many years.
With Internet Explorer's retirement, and the universality of evergreen browsers, there are very few use cases for ES5 output today.

TypeScript's lowest target will now be ES2015, and the `target: es5` option is deprecated. If you were using `target: es5`, you'll need to migrate to a newer target or use an external compiler.
If you still need ES5 output, we recommend using an external compiler to either directly compile your TypeScript source, or to post-process TypeScript's outputs.

[See more about this deprecation here](https://github.com/microsoft/TypeScript/issues/62196) along with [its implementing pull request](https://github.com/microsoft/TypeScript/pull/63067).

### Deprecated: `--downlevelIteration`

`--downlevelIteration` only has effects on ES5 emit, and since `--target es5` has been deprecated, `--downlevelIteration` no longer serves a purpose.

Subtly, using `--downlevelIteration false` with `--target es2015` did not error in TypeScript 5.9 and earlier, even though it had no effect.
In TypeScript 6.0, setting `--downlevelIteration` at all will lead to a deprecation error.

See [the implementation here](https://github.com/microsoft/TypeScript/pull/63071).

### Deprecated: `--moduleResolution node` (a.k.a. `--moduleResolution node10`)

`--moduleResolution node` encoded a specific version of Node.js's module resolution algorithm that most-accurately reflected the behavior of Node.js 10.
Unfortunately, this target (and its name) ignores many updates to Node.js's resolution algorithm that have occurred since then, and it is no longer a good representation of the behavior of modern Node.js versions.

In TypeScript 6.0, `--moduleResolution node` (specifically, `--moduleResolution node10`) is deprecated.
Users who were using `--moduleResolution node` should usually migrate to `--moduleResolution nodenext` if they plan on targeting Node.js directly, or `--moduleResolution bundler` if they plan on using a bundler or Bun.

See more [at this issue](https://github.com/microsoft/TypeScript/issues/62200) and [its corresponding pull request](https://github.com/microsoft/TypeScript/pull/62338).

### Deprecated: `amd`, `umd`, and `systemjs` values of `module`

The following flag values are no longer supported

- `--module amd`
- `--module umd`
- `--module systemjs`
- `--module none`

AMD, UMD, and SystemJS were important during the early days of JavaScript modules when browsers lacked native module support.
The semantics of "none" were never well-defined and often led to confusion.
Today, ESM is universally supported in browsers and Node.js, and both import maps and bundlers have become favored ways for filling in the gaps.
If you're still targeting these module systems, consider migrating to an appropriate ECMAScript module-emitting target, adopt a bundler or different compiler, or stay on TypeScript 5.x until you can migrate.

This also implies dropped support for the `amd-module` directive, which will no longer have any effect.

See more at [the proposal issue](https://github.com/microsoft/TypeScript/issues/62199) along with [the implementing pull request](https://github.com/microsoft/TypeScript/pull/62669).

### Deprecated: `--baseUrl`

The `baseUrl` option is most-commonly used in conjunction with `paths`, and is typically used as a prefix for every value in `paths`.
Unfortunately, `baseUrl` is also considered a look-up root for module resolution.

For example, given the following `tsconfig.json`

```json5
{
  "compilerOptions": {
    // ...
    "baseUrl": "./src",
    "paths": {
      "@app/*": ["app/*"],
      "@lib/*": ["lib/*"]
    }
  }
}
```

and an import like

```ts
import * as someModule from "someModule.js";
```

TypeScript will probably resolve this to `src/someModule.js`, even if the developer only intended to add mappings for modules starting with `@app/` and `@lib/`.

In the best case, this also often leads to "worse-looking" paths that bundlers would ignore;
but it often meant that that many import paths that would never have worked at runtime are considered "just fine" by TypeScript.

`path` mappings have not required specifying `baseUrl` for a long time, and in practice, most projects that use `baseUrl` only use it as a prefix for their `paths` entries.
In TypeScript 6.0, `baseUrl` is deprecated and will no longer be considered a look-up root for module resolution.

Developers who used `baseUrl` as a prefix for path-mapping entries can simply remove `baseUrl` and add the prefix to their `paths` entries:

```diff json5
  {
    "compilerOptions": {
      // ...
-     "baseUrl": "./src",
      "paths": {
-       "@app/*": ["app/*"],
-       "@lib/*": ["lib/*"]
+       "@app/*": ["./src/app/*"],
+       "@lib/*": ["./src/lib/*"]
      }
    }
  }
```

Developers who actually *did* use `baseUrl` as a look-up root can also add an explicit path mapping to preserve the old behavior:

```json5
{
  "compilerOptions": {
    // ...
    "paths": {
      // A new catch-all that replaces the baseUrl:
      "*": ["./src/*"],

      // Every other path now has an explicit common prefix:
      "@app/*": ["./src/app/*"],
      "@lib/*": ["./src/lib/*"],
    }
  }
}
```

However, this is extremely rare.
We recommend most developers simply remove `baseUrl` and add the appropriate prefixes to their `paths` entries.

See more [at this issue](https://github.com/microsoft/TypeScript/issues/62207) and [the corresponding pull request](https://github.com/microsoft/TypeScript/pull/62509).

### Deprecated: `--moduleResolution classic`

The `moduleResolution: classic` setting has been removed.
The `classic` resolution strategy was TypeScript's original module resolution algorithm, and predates Node.js's resolution algorithm becoming a de facto standard.
Today, all practical use cases are served by `nodenext` or `bundler`.
If you were using `classic`, migrate to one of these modern resolution strategies.

See more at [this issue](https://github.com/microsoft/TypeScript/issues/62206) and [the implementing pull request](https://github.com/microsoft/TypeScript/pull/62669).

### Deprecated: `--esModuleInterop false` and `--allowSyntheticDefaultImports false`

The following settings can no longer be set to `false`:

- `esModuleInterop`
- `allowSyntheticDefaultImports`

`esModuleInterop` and `allowSyntheticDefaultImports` were originally opt-in to avoid breaking existing projects.
However, the behavior they enable has been the recommended default for years.
Setting them to `false` often led to subtle runtime issues when consuming CommonJS modules from ESM.
In TypeScript 6.0, the safer interop behavior is always enabled.

If you have imports that rely on the old behavior, you may need to adjust them:

```ts
// Before (with esModuleInterop: false)
import * as express from "express";

// After (with esModuleInterop always enabled)
import express from "express";
```

See more at [this issue](https://github.com/microsoft/TypeScript/issues/62529) and [its implementing pull request](https://github.com/microsoft/TypeScript/pull/62567).

### Deprecated: `--alwaysStrict false`

The `alwaysStrict` flag refers to inference and emit of the `"use strict";` directive.
In TypeScript 6.0, all code will be assumed to be in [JavaScript strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode), which is a set of JS semantics that most-noticeably affects syntactic corner cases around reserved words.
If you have "sloppy mode" code that uses reserved words like `await`, `static`, `private`, or `public` as regular identifiers, you'll need to rename them.
If you relied on subtle semantics around the meaning of `this` in non-strict code, you may need to adjust your code as well.

See more [at this issue](https://github.com/microsoft/TypeScript/issues/62213) and [its corresponding pull request](https://github.com/microsoft/TypeScript/pull/63089).

### Deprecated: `outFile`

The `--outFile` option has been removed from TypeScript 6.0. This option was originally designed to concatenate multiple input files into a single output file. However, external bundlers like Webpack, Rollup, esbuild, Vite, Parcel, and others now do this job faster, better, and with far more configurability. Removing this option simplifies the implementation and allows us to focus on what TypeScript does best: type-checking and declaration emit. If you're currently using `--outFile`, you'll need to migrate to an external bundler. Most modern bundlers have excellent TypeScript support out of the box.

### Deprecated: legacy `module` Syntax for namespaces

Early versions of TypeScript used the `module` keyword to declare namespaces:

```ts
// ❌ Deprecated syntax - now an error
module Foo {
    export const bar = 10;
}
```

This syntax was later aliased to the modern preferred form using the `namespace` keyword:

```ts
// ✅ The correct syntax
namespace Foo {
    export const bar = 10;
}
```

When `namespace` was introduced, the `module` syntax was simply discouraged.
A few years ago, the TypeScript language service started marking the keyword as deprecated, suggesting `namespace` in its place.

In TypeScript 6.0, using `module` where `namespace` is expected is now a hard deprecation.
This change is necessary because `module` blocks are a potential ECMAScript proposal that would conflict with the legacy TypeScript syntax.

The ambient module declaration form remains fully supported:

```ts
// ✅ Still works perfectly
declare module "some-module" {
    export function doSomething(): void;
}
```

See [this issue](https://github.com/microsoft/TypeScript/issues/62211) and its [corresponding pull request](https://github.com/microsoft/TypeScript/pull/62876) for more details.

### Deprecated: `asserts` Keyword on Imports

The `asserts` keyword was proposed to the JavaScript language via the import assertions proposal;
however, the proposal eventually morphed into [the import attributes proposal](https://github.com/tc39/proposal-import-attributes), which uses the `with` keyword instead of `asserts`.

Thus, the `asserts` syntax is now deprecated in TypeScript 6.0, and using it will lead to an error:

```ts
// ❌ Deprecated syntax - now an error.
import blob from "./blahb.json" asserts { type: "json" }
//                              ~~~~~~~
// error: Import assertions have been replaced by import attributes. Use 'with' instead of 'asserts'.
```

Instead, use the `with` syntax for import attributes:

```ts
// ✅ Works with the new import attributes syntax.
import blob from "./blahb.json" with { type: "json" }
```

See more at [this issue](https://github.com/microsoft/TypeScript/issues/62210) and its [corresponding pull request](https://github.com/microsoft/TypeScript/pull/63077).


### Deprecated: `no-default-lib` Directives

The `/// <reference no-default-lib="true"/>` directive has been largely misunderstood and misused.
In TypeScript 6.0, this directive is no longer supported.
If you were using it, consider using `--noLib` or `--libReplacement` instead.

[See more here](https://github.com/microsoft/TypeScript/issues/62209) and at [the corresponding pull request](https://github.com/microsoft/TypeScript/pull/62435).

### Specifying Command-Line Files When `tsconfig.json` Exists is Now an Error

Currently, if you run `tsc foo.ts` in a folder where a `tsconfig.json` exists, the config file is completely ignored.
This was often very confusing if you expected checking and emit options to apply to the input file.

In TypeScript 6.0, if you run `tsc` with file arguments in a directory containing a `tsconfig.json`, an error will be issued to make this behavior explicit:

```
error TS5112: tsconfig.json is present but will not be loaded if files are specified on commandline. Use '--ignoreConfig' to skip this error.
```

If it is the case that you wanted to ignore the `tsconfig.json` and just compile `foo.ts` with TypeScript's defaults, you can use the new `--ignoreConfig` flag.

```sh
tsc --ignoreConfig foo.ts
```

See more [at this issue](https://github.com/microsoft/TypeScript/issues/62197) and its [corresponding pull request](https://github.com/microsoft/TypeScript/pull/62477).

## Preparing for TypeScript 7.0

TypeScript 6.0 is designed as a transition release.
While options deprecated in TypeScript 6.0 will continue to work without errors when `"ignoreDeprecations": "6.0"` is set, those options will be **removed entirely in TypeScript 7.0** (the native TypeScript port).
If you're seeing deprecation warnings after upgrading to TypeScript 6.0, we strongly recommend addressing them before adopting TypeScript 7.0 (or trying [native previews](https://www.npmjs.com/package/@typescript/native-preview)) in your project.
