---
title: TypeScript 5.8
layout: docs
permalink: /docs/handbook/release-notes/typescript-5-8.html
oneline: TypeScript 5.8 Release Notes
---

## Granular Checks for Branches in Return Expressions

Consider some code like the following:

```ts
declare const untypedCache: Map<any, any>;

function getUrlObject(urlString: string): URL {
    return untypedCache.has(urlString) ?
        untypedCache.get(urlString) :
        urlString;
}
```

The intent of this code is to retrieve a URL object from a cache if it exists, or to create a new URL object if it doesn't.
However, there's a bug: we forgot to actually construct a new URL object with the input.
Unfortunately, TypeScript generally didn't catch this sort of bug.

When TypeScript checks conditional expressions like `cond ? trueBranch : falseBranch`, its type is treated as a union of the types of the two branches.
In other words, it gets the type of `trueBranch` and `falseBranch`, and combines them into a union type.
In this case, the type of `untypedCache.get(urlString)` is `any`, and the type of `urlString` is `string`.
This is where things go wrong because `any` is so infectious in how it interacts with other types.
The union `any | string` is simplified to `any`, so by the time TypeScript starts checking whether the expression in our `return` statement is compatible with the expected return type of `URL`, the type system has lost any information that would have caught the bug in this code.

In TypeScript 5.8, the type system special-cases conditional expressions directly inside `return` statements.
Each branch of the conditional is checked against the declared return type of the containing functions (if one exists), so the type system can catch the bug in the example above.

```ts
declare const untypedCache: Map<any, any>;

function getUrlObject(urlString: string): URL {
    return untypedCache.has(urlString) ?
        untypedCache.get(urlString) :
        urlString;
    //  ~~~~~~~~~
    // error! Type 'string' is not assignable to type 'URL'.
}
```

This change was made [within this pull request](https://github.com/microsoft/TypeScript/pull/56941), as part of a broader set of future improvements for TypeScript.

## Support for `require()` of ECMAScript Modules in `--module nodenext`

For years, Node.js supported ECMAScript modules (ESM) alongside CommonJS modules.
Unfortunately, the interoperability between the two had some challenges.

* ESM files could `import` CommonJS files
* CommonJS files ***could not*** `require()` ESM files

In other words, consuming CommonJS files from ESM files was possible, but not the other way around.
This introduced many challenges for library authors who wanted to provide ESM support.
These library authors would either have to break compatibility with CommonJS users, "dual-publish" their libraries (providing separate entry-points for ESM and CommonJS), or just stay on CommonJS indefinitely.
While dual-publishing might sound like a good middle-ground, it is a complex and error-prone process that also roughly doubles the amount of code within a package.

Node.js 22 relaxes some of these restrictions and permits `require("esm")` calls from CommonJS modules to ECMAScript modules.
Node.js still does not permit `require()` on ESM files that contain a top-level `await`, but most other ESM files are now consumable from CommonJS files.
This presents a major opportunity for library authors to provide ESM support without having to dual-publish their libraries.

TypeScript 5.8 supports this behavior under the `--module nodenext` flag.
When `--module nodenext` is enabled, TypeScript will avoid issuing errors on these `require()` calls to ESM files.

Because this feature may be back-ported to older versions of Node.js, there is currently no stable `--module nodeXXXX` option that enables this behavior;
however, we predict future versions of TypeScript may be able to stabilize the feature under `node20`.
In the meantime, we encourage users of Node.js 22 and newer to use `--module nodenext`, while library authors and users of older Node.js versions should remain on `--module node16` (or make the minor update to [`--module node18`](#--module-node18)).

For more information, [see our support for require("esm") here](https://github.com/microsoft/TypeScript/pull/60761).

## `--module node18`

TypeScript 5.8 introduces a stable `--module node18` flag.
For users who are fixed on using Node.js 18, this flag provides a stable point of reference that does not incorporate certain behaviors that are in `--module nodenext`.
Specifically:

* `require()` of ECMAScript modules is disallowed under `node18`, but allowed under `nodenext`
* import assertions (deprecated in favor of import attributes) are allowed under `node18`, but are disallowed under `nodenext`

See more at both [the `--module node18` pull request](https://github.com/microsoft/TypeScript/pull/60722) and [changes made to `--module nodenext`](https://github.com/microsoft/TypeScript/pull/60761).

## The `--erasableSyntaxOnly` Option

Recently, Node.js 23.6 unflagged [experimental support for running TypeScript files directly](https://nodejs.org/api/typescript.html#type-stripping);
however, only certain constructs are supported under this mode.
Node.js has unflagged a mode called `--experimental-strip-types` which requires that any TypeScript-specific syntax cannot have runtime semantics.
Phrased differently, it must be possible to easily *erase* or "strip out" any TypeScript-specific syntax from a file, leaving behind a valid JavaScript file.

That means constructs like the following are not supported:

* `enum` declarations
* `namespace`s and `module`s with runtime code
* parameter properties in classes
* Non-ECMAScript `import =` and `export =` assignments

Here are some examples of what does not work:

```ts
// ❌ error: An `import ... = require(...)` alias
import foo = require("foo");

// ❌ error: A namespace with runtime code.
namespace container {
}

// ❌ error: An `import =` alias
import Bar = container.Bar;

class Point {
    // ❌ error: Parameter properties
    constructor(public x: number, public y: number) { }
}

// ❌ error: An `export =` assignment.
export = Point;

// ❌ error: An enum declaration.
enum Direction {
    Up,
    Down,
    Left,
    Right,
}
```

Similar tools like [ts-blank-space](https://github.com/bloomberg/ts-blank-space) or [Amaro](https://github.com/nodejs/amaro) (the underlying library for type-stripping in Node.js) have the same limitations.
These tools will provide helpful error messages if they encounter code that doesn't meet these requirements, but you still won't find out your code doesn't work until you actually try to run it.

That's why TypeScript 5.8 introduces the `--erasableSyntaxOnly` flag.
When this flag is enabled, TypeScript will error on most TypeScript-specific constructs that have runtime behavior.
```ts
class C {
    constructor(public x: number) { }
    //          ~~~~~~~~~~~~~~~~
    // error! This syntax is not allowed when 'erasableSyntaxOnly' is enabled.
    }
}
```

Typically, you will want to combine this flag with the `--verbatimModuleSyntax`, which ensures that a module contains the appropriate import syntax, and that import elision does not take place.

For more information, [see the implementation here](https://github.com/microsoft/TypeScript/pull/61011).

## The `--libReplacement` Flag

In TypeScript 4.5, we introduced the possibility of substituting the default `lib` files with custom ones.
This was based on the possibility of resolving a library file from packages named `@typescript/lib-*`.
For example, you could lock your `dom` libraries onto a specific version of [the `@types/web` package](https://www.npmjs.com/package/@types/web?activeTab=readme) with the following `package.json`:

```json
{
    "devDependencies": {
       "@typescript/lib-dom": "npm:@types/web@0.0.199"
     }
}
```

When installed, a package called `@typescript/lib-dom` should exist, and TypeScript will currently always look it up when `dom` is implied by your settings.

This is a powerful feature, but it also incurs a bit of extra work.
Even if you're not using this feature, TypeScript always performs this lookup, and has to watch for changes in `node_modules` in case a `lib`-replacement package *begins* to exist.

TypeScript 5.8 introduces the `--libReplacement` flag, which allows you to disable this behavior.
If you're not using `--libReplacement`, you can now disable it with `--libReplacement false`.
In the future `--libReplacement false` may become the default, so if you currently rely on the behavior you should consider explicitly enabling it with `--libReplacement true`.

For more information, [see the change here](https://github.com/microsoft/TypeScript/issues/61023).

## Preserved Computed Property Names in Declaration Files

In an effort to make computed properties have more predictable emit in declaration files, TypeScript 5.8 will consistently preserve entity names (`bareVariables` and `dotted.names.that.look.like.this`) in computed property names in classes.

For example, consider the following code:

```ts
export let propName = "theAnswer";

export class MyClass {
    [propName] = 42;
//  ~~~~~~~~~~
// error!
// A computed property name in a class property declaration must have a simple literal type or a 'unique symbol' type.
}
```

Previous versions of TypeScript would issue an error when generating a declaration file for this module, and a best-effort declaration file would generate an index signature.

```ts
export declare let propName: string;
export declare class MyClass {
    [x: string]: number;
}
```

In TypeScript 5.8, the example code is now allowed, and the emitted declaration file will match what you wrote:

```ts
export declare let propName: string;
export declare class MyClass {
    [propName]: number;
}
```

Note that this does not create statically-named properties on the class.
You'll still end up with what is effectively an index signature like `[x: string]: number`, so for that use case, you'd need to use `unique symbol`s or literal types.

Note that writing this code was and currently is an error under the `--isolatedDeclarations` flag;
but we expect that thanks to this change, computed property names will generally be permitted in declaration emit.

Note that it's possible (though unlikely) that a file compiled in TypeScript 5.8 may generate a declaration file that is not backward compatible in TypeScript 5.7 or earlier.

For more information, [see the implementing PR](https://github.com/microsoft/TypeScript/pull/60052).

## Optimizations on Program Loads and Updates

TypeScript 5.8 introduces a number of optimizations that can both improve the time to build up a program, and also to update a program based on a file change in either `--watch` mode or editor scenarios.

First, TypeScript now [avoids array allocations that would be involved while normalizing paths](https://github.com/microsoft/TypeScript/pull/60812).
Typically, path normalization would involve segmenting each portion of a path into an array of strings, normalizing the resulting path based on relative segments, and then joining them back together using a canonical separator.
For projects with many files, this can be a significant and repetitive amount of work.
TypeScript now avoids allocating an array, and operates more directly on indexes of the original path.

Additionally, when edits are made that don't change the fundamental structure of a project, [TypeScript now avoids re-validating the options provided to it](https://github.com/microsoft/TypeScript/pull/60754) (e.g. the contents of a `tsconfig.json`).
This means, for example, that a simple edit might not require checking that the output paths of a project don't conflict with the input paths.
Instead, the results of the last check can be used.
This should make edits in large projects feel more responsive.

## Notable Behavioral Changes

This section highlights a set of noteworthy changes that should be acknowledged and understood as part of any upgrade.
Sometimes it will highlight deprecations, removals, and new restrictions.
It can also contain bug fixes that are functionally improvements, but which can also affect an existing build by introducing new errors.

### `lib.d.ts`

Types generated for the DOM may have an impact on type-checking your codebase.
For more information, [see linked issues related to DOM and `lib.d.ts` updates for this version of TypeScript](https://github.com/microsoft/TypeScript/issues/60985).

### Restrictions on Import Assertions Under `--module nodenext`

Import assertions were a proposed addition to ECMAScript to ensure certain properties of an import (e.g. "this module is JSON, and is not intended to be executable JavaScript code").
They were reinvented as a proposal called [import attributes](https://github.com/tc39/proposal-import-attributes).
As part of the transition, they swapped from using the `assert` keyword to using the `with` keyword.

```ts
// An import assertion ❌ - not future-compatible with most runtimes.
import data from "./data.json" assert { type: "json" };

// An import attribute ✅ - the preferred way to import a JSON file.
import data from "./data.json" with { type: "json" };
```

Node.js 22 no longer accepts import assertions using the `assert` syntax.
In turn when `--module nodenext` is enabled in TypeScript 5.8, TypeScript will issue an error if it encounters an import assertion.

```ts
import data from "./data.json" assert { type: "json" };
//                             ~~~~~~
// error! Import assertions have been replaced by import attributes. Use 'with' instead of 'assert'
```

For more information, [see the change here](https://github.com/microsoft/TypeScript/pull/60761)
