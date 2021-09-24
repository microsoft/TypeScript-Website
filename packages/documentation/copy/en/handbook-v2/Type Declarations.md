---
title: Type Declarations
layout: docs
permalink: /docs/handbook/2/type-declarations.html
oneline: "How TypeScript provides types for un-typed JavaScript."
---

Throughout the sections you've read so far, we've been demonstrating basic TypeScript concepts using the built-in functions present in all JavaScript runtimes.
However, almost all JavaScript today includes many libraries to accomplish common tasks.
Having types for the parts of your application that _aren't_ your code will greatly improve your TypeScript experience.
Where do these types come from?

## What Do Type Declarations Look Like?

Let's say you write some code like this:

```ts twoslash
// @errors: 2339
const k = Math.max(5, 6);
const j = Math.mix(7, 8);
```

How did TypeScript know that `max` was present but not `mix`, even though `Math`'s implementation wasn't part of your code?

The answer is that there are _declaration files_ describing these built-in objects.
A declaration file provides a way to _declare_ the existence of some types or values without actually providing implementations for those values.

## `.d.ts` files

TypeScript has two main kinds of files.
`.ts` files are _implementation_ files that contain types and executable code.
These are the files that produce `.js` outputs, and are where you'd normally write your code.

`.d.ts` files are _declaration_ files that contain _only_ type information.
These files don't produce `.js` outputs; they are only used for typechecking.
We'll learn more about how to write our own declaration files later.

## Built-in Type Definitions

TypeScript includes declaration files for all of the standardized built-in APIs available in JavaScript runtimes.
This includes things like methods and properties of built-in types like `string` or `function`, top-level names like `Math` and `Object`, and their associated types.
By default, TypeScript also includes types for things available when running inside the browser, such as `window` and `document`; these are collectively referred to as the DOM APIs.

TypeScript names these declaration files with the pattern `lib.[something].d.ts`.
If you navigate into a file with that name, you can know that you're dealing with some built-in part of the platform, not user code.

### `target` setting

The methods, properties, and functions available to you actually vary based on the _version_ of JavaScript your code is running on.
For example, the `startsWith` method of strings is available only starting with the version of JavaScript referred as _ECMAScript 6_.

Being aware of what version of JavaScript your code ultimately runs on is important because you don't want to use APIs that are from a newer version than the platform you deploy to.
This is one function of the [`target`](/tsconfig#target) compiler setting.

TypeScript helps with this problem by varying which `lib` files are included by default based on your [`target`](/tsconfig#target) setting.
For example, if [`target`](/tsconfig#target) is `ES5`, you will see an error if trying to use the `startsWith` method, because that method is only available in `ES6` or later.

### `lib` setting

The [`lib`](/tsconfig#lib) setting allows more fine-grained control of which built-in declaration files are considered available in your program.
See the documentation page on [`lib`](/tsconfig#lib) for more information.

## External Definitions

For non-built-in APIs, there are a variety of ways you can get declaration files.
How you do this depends on exactly which library you're getting types for.

### Bundled Types

If a library you're using is published as an npm package, it may include type declaration files as part of its distribution already.
You can read the project's documentation to find out, or simply try importing the package and see if TypeScript is able to automatically resolve the types for you.

If you're a package author considering bundling type definitions with your package, you can read our guide on [bundling type definitions](/docs/handbook/declaration-files/publishing.html#including-declarations-in-your-npm-package).

### DefinitelyTyped / `@types`

The [DefinitelyTyped repository](https://github.com/DefinitelyTyped/DefinitelyTyped/) is a centralized repo storing declaration files for thousands of libraries.
The vast majority of commonly-used libraries have declaration files available on DefinitelyTyped.

Definitions on DefinitelyTyped are also automatically published to npm under the `@types` scope.
The name of the types package is always the same as the name of the underlying package itself.
For example, if you installed the `react` npm package, you can install its corresponding types by running

```sh
npm install --save-dev @types/react
```

TypeScript automatically finds type definitions under `node_modules/@types`, so there's no other step needed to get these types available in your program.

### Your Own Definitions

In the uncommon event that a library didn't bundle its own types and didn't have a definition on DefinitelyTyped, you can write a declaration file yourself.
See the appendix [Writing Declaration Files](/docs/handbook/declaration-files/introduction.html) for a guide.

If you want to silence warnings about a particular module without writing a declaration file, you can also quick declare the module as type `any` by putting an empty declaration for it in a `.d.ts` file in your project.
For example, if you wanted to use a module named `some-untyped-module` without having definitions for it, you would write:

```ts twoslash
declare module "some-untyped-module";
```
