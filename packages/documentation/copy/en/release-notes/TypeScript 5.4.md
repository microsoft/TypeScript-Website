---
title: TypeScript 5.4
layout: docs
permalink: /docs/handbook/release-notes/typescript-5-4.html
oneline: TypeScript 5.4 Release Notes
---

## Preserved Narrowing in Closures Following Last Assignments

TypeScript can usually figure out a more specific type for a variable based on checks that you might perform.
This process is called narrowing.

```ts
function uppercaseStrings(x: string | number) {
    if (typeof x === "string") {
        // TypeScript knows 'x' is a 'string' here.
        return x.toUpperCase();
    }
}
```

One common pain-point was that these narrowed types weren't always preserved within function closures.

```ts
function getUrls(url: string | URL, names: string[]) {
    if (typeof url === "string") {
        url = new URL(url);
    }

    return names.map(name => {
        url.searchParams.set("name", name)
        //  ~~~~~~~~~~~~
        // error!
        // Property 'searchParams' does not exist on type 'string | URL'.

        return url.toString();
    });
}
```

Here, TypeScript decided that it wasn't "safe" to assume that `url` was *actually* a `URL` object in our callback function because it was mutated elsewhere;
however, in this instance, that arrow function is *always* created after that assignment to `url`, and it's also the *last* assignment to `url`.

TypeScript 5.4 takes advantage of this to make narrowing a little smarter.
When parameters and `let` variables are used in non-[hoisted](https://developer.mozilla.org/en-US/docs/Glossary/Hoisting) functions, the type-checker will look for a last assignment point.
If one is found, TypeScript can safely narrow from outside the containing function.
What that means is the above example just works now.

Note that narrowing analysis doesn't kick in if the variable is assigned anywhere in a nested function.
This is because there's no way to know for sure whether the function will be called later.

```ts
function printValueLater(value: string | undefined) {
    if (value === undefined) {
        value = "missing!";
    }

    setTimeout(() => {
        // Modifying 'value', even in a way that shouldn't affect
        // its type, will invalidate type refinements in closures.
        value = value;
    }, 500);

    setTimeout(() => {
        console.log(value.toUpperCase());
        //          ~~~~~
        // error! 'value' is possibly 'undefined'.
    }, 1000);
}
```

This should make lots of typical JavaScript code easier to express.
You can [read more about the change on GitHub](https://github.com/microsoft/TypeScript/pull/56908).

## The `NoInfer` Utility Type

When calling generic functions, TypeScript is able to infer type arguments from whatever you pass in.

```ts
function doSomething<T>(arg: T) {
    // ...
}


// We can explicitly say that 'T' should be 'string'.
doSomething<string>("hello!");

// We can also just let the type of 'T' get inferred.
doSomething("hello!");
```

One challenge, however, is that it is not always clear what the "best" type is to infer.
This might lead to TypeScript rejecting valid calls, accepting questionable calls, or just reporting worse error messages when it catches a bug.

For example, let's imagine a `createStreetLight` function that takes a list of color names, along with an optional default color.

```ts
function createStreetLight<C extends string>(colors: C[], defaultColor?: C) {
    // ...
}

createStreetLight(["red", "yellow", "green"], "red");
```

What happens when we pass in a `defaultColor` that wasn't in the original `colors` array?
In this function, `colors` is supposed to be the "source of truth" and describe what can be passed to `defaultColor`.

```ts
// Oops! This undesirable, but is allowed!
createStreetLight(["red", "yellow", "green"], "blue");
```

In this call, type inference decided that `"blue"` was just as valid of a type as `"red"` or `"yellow"` or `"green"`.
So instead of rejecting the call, TypeScript infers the type of `C` as `"red" | "yellow" | "green" | "blue"`.
You might say that inference just blue up in our faces!

One way people currently deal with this is to add a separate type parameter that's bounded by the existing type parameter.

```ts
function createStreetLight<C extends string, D extends C>(colors: C[], defaultColor?: D) {
}

createStreetLight(["red", "yellow", "green"], "blue");
//                                            ~~~~~~
// error!
// Argument of type '"blue"' is not assignable to parameter of type '"red" | "yellow" | "green" | undefined'.
```

This works, but is a little bit awkward because `D` probably won't be used anywhere else in the signature for `createStreetLight`.
While not bad *in this case*, using a type parameter only once in a signature is often a code smell.

That's why TypeScript 5.4 introduces a new `NoInfer<T>` utility type.
Surrounding a type in `NoInfer<...>` gives a signal to TypeScript not to dig in and match against the inner types to find candidates for type inference.

Using `NoInfer`, we can rewrite `createStreetLight` as something like this:

```ts
function createStreetLight<C extends string>(colors: C[], defaultColor?: NoInfer<C>) {
    // ...
}

createStreetLight(["red", "yellow", "green"], "blue");
//                                            ~~~~~~
// error!
// Argument of type '"blue"' is not assignable to parameter of type '"red" | "yellow" | "green" | undefined'.
```

Excluding the type of `defaultColor` from being explored for inference means that `"blue"` never ends up as an inference candidate, and the type-checker can reject it.

You can see the specific changes in [the implementing pull request](https://github.com/microsoft/TypeScript/pull/56794), along with [the initial implementation](https://github.com/microsoft/TypeScript/pull/52968) provided thanks to [Mateusz Burzyński](https://github.com/Andarist)!

## `Object.groupBy` and `Map.groupBy`

TypeScript 5.4 adds declarations for JavaScript's new `Object.groupBy` and `Map.groupBy` static methods.

`Object.groupBy` takes an iterable, and a function that decides which "group" each element should be placed in.
The function needs to make a "key" for each distinct group, and `Object.groupBy` uses that key to make an object where every key maps to an array with the original element in it.

So the following JavaScript:

```js
const array = [0, 1, 2, 3, 4, 5];

const myObj = Object.groupBy(array, (num, index) => {
    return num % 2 === 0 ? "even": "odd";
});
```

is basically equivalent to writing this:

```js
const myObj = {
    even: [0, 2, 4],
    odd: [1, 3, 5],
};
```

`Map.groupBy` is similar, but produces a `Map` instead of a plain object.
This might be more desirable if you need the guarantees of `Map`s, you're dealing with APIs that expect `Map`s, or you need to use any kind of key for grouping - not just keys that can be used as property names in JavaScript.

```js
const myObj = Map.groupBy(array, (num, index) => {
    return num % 2 === 0 ? "even" : "odd";
});
```

and just as before, you could have created `myObj` in an equivalent way:

```js
const myObj = new Map();

myObj.set("even", [0, 2, 4]);
myObj.set("odd", [1, 3, 5]);
```

Note that in the above example of `Object.groupBy`, the object produced uses all optional properties.

```ts
interface EvenOdds {
    even?: number[];
    odd?: number[];
}

const myObj: EvenOdds = Object.groupBy(...);

myObj.even;
//    ~~~~
// Error to access this under 'strictNullChecks'.
```

This is because there's no way to guarantee in a general way that *all* the keys were produced by `groupBy`.

Note also that these methods are only accessible by configuring your `target` to `esnext` or adjusting your `lib` settings.
We expect they will eventually be available under a stable `es2024` target.

We'd like to extend a thanks to [Kevin Gibbons](https://github.com/bakkot) for [adding the declarations to these `groupBy` methods](https://github.com/microsoft/TypeScript/pull/56805).

## Support for `require()` calls in `--moduleResolution bundler` and `--module preserve`

TypeScript has a `moduleResolution` option called `bundler` that is meant to model the way modern bundlers figure out which file an import path refers to.
One of the limitations of the option is that it had to be paired with `--module esnext`, making it impossible to use the `import ... = require(...)` syntax.

```ts
// previously errored
import myModule = require("module/path");
```

That might not seem like a big deal if you're planning on just writing standard ECMAScript `import`s, but there's a difference when using a package with [conditional exports](https://nodejs.org/api/packages.html#conditional-exports).

In TypeScript 5.4, `require()` can now be used when setting the `module` setting to a new option called `preserve`.

Between `--module preserve` and `--moduleResolution bundler`, the two more accurately model what bundlers and runtimes like Bun will allow, and how they'll perform module lookups.
In fact, when using `--module preserve`, the `bundler` option will be implicitly set for `--moduleResolution` (along with `--esModuleInterop` and `--resolveJsonModule`)

```json5
{
    "compilerOptions": {
        "module": "preserve",
        // ^ also implies:
        // "moduleResolution": "bundler",
        // "esModuleInterop": true,
        // "resolveJsonModule": true,

        // ...
    }
}
```

Under `--module preserve`, an ECMAScript `import` will always be emitted as-is, and `import ... = require(...)` will be emitted as a `require()` call (though in practice you may not even use TypeScript for emit, since it's likely you'll be using a bundler for your code).
This holds true regardless of the file extension of the containing file.
So the output of this code:

```ts
import * as foo from "some-package/foo";
import bar = require("some-package/bar");
```

should look something like this:

```js
import * as foo from "some-package/foo";
var bar = require("some-package/bar");
```

What this also means is that the syntax you choose directs how [conditional exports](https://nodejs.org/api/packages.html#conditional-exports) are matched.
So in the above example, if the `package.json` of `some-package` looks like this:

```json5
{
  "name": "some-package",
  "version": "0.0.1",
  "exports": {
    "./foo": {
        "import": "./esm/foo-from-import.mjs",
        "require": "./cjs/foo-from-require.cjs"
    },
    "./bar": {
        "import": "./esm/bar-from-import.mjs",
        "require": "./cjs/bar-from-require.cjs"
    }
  }
}
```

TypeScript will resolve these paths to `[...]/some-package/esm/foo-from-import.mjs` and `[...]/some-package/cjs/bar-from-require.cjs`.

For more information, you can [read up on these new settings here](https://github.com/microsoft/TypeScript/pull/56785).

## Checked Import Attributes and Assertions

Import attributes and assertions are now checked against the global `ImportAttributes` type.
This means that runtimes can now more accurately describe the import attributes 

```ts
// In some global file.
interface ImportAttributes {
    type: "json";
}

// In some other module
import * as ns from "foo" with { type: "not-json" };
//                                     ~~~~~~~~~~
// error!
//
// Type '{ type: "not-json"; }' is not assignable to type 'ImportAttributes'.
//  Types of property 'type' are incompatible.
//    Type '"not-json"' is not assignable to type '"json"'.
```

[This change](https://github.com/microsoft/TypeScript/pull/56034) was provided thanks to [Oleksandr Tarasiuk](https://github.com/a-tarasyuk).

## Quick Fix for Adding Missing Parameters

TypeScript now has a quick fix to add a new parameter to functions that are called with too many arguments.

![A quick fix being offered when someFunction calls someHelperFunction with 2 more arguments than are expected.](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2024/01/add-missing-params-5-4-beta-before.png)

![The missing arguments have been added to someHelperFunction after the quick fix was applied.](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2024/01/add-missing-params-5-4-beta-after.png)

This can be useful when threading a new argument through several existing functions, which can be cumbersome today.

[This quick fix](https://github.com/microsoft/TypeScript/pull/56411) was provided courtsey of [Oleksandr Tarasiuk](https://github.com/a-tarasyuk).

## Upcoming Changes from TypeScript 5.0 Deprecations

TypeScript 5.0 deprecated the following options and behaviors:

 * `charset`
 * `target: ES3`
 * `importsNotUsedAsValues`
 * `noImplicitUseStrict`
 * `noStrictGenericChecks`
 * `keyofStringsOnly`
 * `suppressExcessPropertyErrors`
 * `suppressImplicitAnyIndexErrors`
 * `out`
 * `preserveValueImports`
 * `prepend` in project references
 * implicitly OS-specific `newLine`

 To continue using them, developers using TypeScript 5.0 and other more recent versions have had to specify a new option called `ignoreDeprecations` with the value `"5.0"`.
 
 However, TypScript 5.4 will be the last version in which these will continue to function as normal.
 By TypeScript 5.5 (likely June 2024), these will become hard errors, and code using them will need to be migrated away.

 For more information, you can [read up on this plan on GitHub](https://github.com/microsoft/TypeScript/issues/51909), which contains suggestions in how to best adapt your codebase.

## Notable Behavioral Changes

This section highlights a set of noteworthy changes that should be acknowledged and understood as part of any upgrade.
Sometimes it will highlight deprecations, removals, and new restrictions.
It can also contain bug fixes that are functionally improvements, but which can also affect an existing build by introducing new errors.

### `lib.d.ts` Changes

Types generated for the DOM may have an impact on type-checking your codebase.
For more information, [see the DOM updates for TypeScript 5.4](https://github.com/microsoft/TypeScript/pull/57027).

### More Accurate Conditional Type Constraints

The following code no longer allows the second variable declaration in the function `foo`.

```ts
type IsArray<T> = T extends any[] ? true : false;

function foo<U extends object>(x: IsArray<U>) {
    let first: true = x;    // Error
    let second: false = x;  // Error, but previously wasn't
}
```

Previously, when TypeScript checked the initializer for `second`, it needed to determine whether `IsArray<U>` was assignable to the unit type `false`.
While `IsArray<U>` isn't compatible any obvious way, TypeScript looks at the *constraint* of that type as well.
In a conditional type like `T extends Foo ? TrueBranch : FalseBranch`, where `T` is generic, the type system would look at the constraint of `T`, substitute it in for `T` itself, and decide on either the true or false branch.

But this behavior was inaccurate because it was overly-eager.
Even if the constraint of `T` isn't assignable to `Foo`, that doesn't mean that it won't be instantiated with something that is.
And so the more correct behavior is to produce a union type for the constraint of the conditional type in cases where it can't be proven that `T` *never* or *always* extends `Foo.`

TypeScript 5.4 adopts this more accuratre behavior.
What this means in practice is that you may begin to find that some conditional type instances are no longer compatible with their branches.

[You can read about the specific changes here](https://github.com/microsoft/TypeScript/pull/56004).

### More Aggressive Reduction of Intersections Between Type Variables and Primitive Types

TypeScript now reduces intersections with type variables and primitives more aggressively, depending on how the type variable's constraint overlaps with those primitives.

```ts
declare function intersect<T, U>(x: T, y: U): T & U;

function foo<T extends "abc" | "def">(x: T, str: string, num: number) {

    // Was 'T & string', now is just 'T'
    let a = intersect(x, str);

    // Was 'T & number', now is just 'never'
    let b = intersect(x, num)

    // Was '(T & "abc") | (T & "def")', now is just 'T'
    let c = Math.random() < 0.5 ?
        intersect(x, "abc") :
        intersect(x, "def");
}
```

For more information, [see the change here](https://github.com/microsoft/TypeScript/pull/56515).

### Improved Checking Against Template Strings with Interpolations

TypeScript now more accurately checks whether or not strings are assignable to the placeholder slots of a template string type.

```ts
function a<T extends {id: string}>() {
    let x: `-${keyof T & string}`;
    
    // Used to error, now doesn't.
    x = "-id";
}
```

This behavior is more desirable, but may cause breaks in code using constructs like conditional types, where these rule changes are easy to witness.

[See this change](https://github.com/microsoft/TypeScript/pull/56598) for more details.

### Errors When Type-Only Imports Conflict with Local Values

Previously, TypeScript would permit the following code under `isolatedModules` if the import to `Something` only referred to a type.

```ts
import { Something } from "./some/path";

let Something = 123;
```

However, it's not safe for a single-file compilers to assume whether it's "safe" to drop the `import`, even if the code is guaranteed to fail at runtime.
In TypeScript 5.4, this code will trigger an error like the following:

```
Import 'Something' conflicts with local value, so must be declared with a type-only import when 'isolatedModules' is enabled.
```

The fix should be to either make a local rename, or, as the error states, add the `type` modifier to the import:

```ts
import type { Something } from "./some/path";

// or

import { type Something } from "./some/path";
```

[See more information on the change itself](https://github.com/microsoft/TypeScript/pull/56354).

### New Enum Assignability Restrictions

When two enums have the same declared names and enum member names, they were previously always considered compatible;
however, when the values were known, TypeScript would silently allow them to have differing values.

TypeScript 5.4 tightens this restriction by requiring the values to be identical when they are known.

```ts
namespace First {
    export enum SomeEnum {
        A = 0,
        B = 1,
    }
}

namespace Second {
    export enum SomeEnum {
        A = 0,
        B = 2,
    }
}

function foo(x: First.SomeEnum, y: Second.SomeEnum) {
    // Both used to be compatible - no longer the case,
    // TypeScript errors with something like:
    //
    //  Each declaration of 'SomeEnum.B' differs in its value, where '1' was expected but '2' was given.
    x = y;
    y = x;
}
```

Additionally, there are new restrictions for when one of the enum members does not have a statically-known value.
In these cases, the other enum must at least be implicitly numeric (e.g. it has no statically resolved initializer), or it is explicitly numeric (meaning TypeScript could resolve the value to something numeric).
Practically speaking, what this means is that string enum members are only ever compatible with other string enums of the same value.

```ts
namespace First {
    export declare enum SomeEnum {
        A,
        B,
    }
}

namespace Second {
    export declare enum SomeEnum {
        A,
        B = "some known string",
    }
}

function foo(x: First.SomeEnum, y: Second.SomeEnum) {
    // Both used to be compatible - no longer the case,
    // TypeScript errors with something like:
    //
    //  One value of 'SomeEnum.B' is the string '"some known string"', and the other is assumed to be an unknown numeric value.
    x = y;
    y = x;
}
```

For more information, [see the pull request that introduced this change](https://github.com/microsoft/TypeScript/pull/55924).

### Name Restrictions on Enum Members

TypeScript no longer allows enum members to use the names `Infinity`, `-Infinity`, or `NaN`.

```ts
// Errors on all of these:
//
//  An enum member cannot have a numeric name.
enum E {
    Infinity = 0,
    "-Infinity" = 1,
    NaN = 2,
}
```

[See more details here](https://github.com/microsoft/TypeScript/pull/56161).

### Better Mapped Type Preservation Over Tuples with `any` Rest Elements

Previously, applying a mapped type with `any` into a tuple would create an `any` element type.
This is undesirable and is now fixed.

```ts
Promise.all(["", ...([] as any)])
    .then((result) => {
        const head = result[0];       // 5.3: any, 5.4: string
        const tail = result.slice(1); // 5.3 any, 5.4: any[]
    });
```

For more information, see [the fix](https://github.com/microsoft/TypeScript/pull/57031) along with [the follow-on discussion around behavioral changes](https://github.com/microsoft/TypeScript/issues/57389) and [further tweaks](https://github.com/microsoft/TypeScript/issues/57389).

### Emit Changes

While not a breaking change per-se, developers may have implicitly taken dependencies on TypeScript's JavaScript or declaration emit outputs.
The following are notable changes.

* [Preserve type parameter names more often when shadowed](https://github.com/microsoft/TypeScript/pull/55820)
* [Move complex parameter lists of async function into downlevel generator body](https://github.com/microsoft/TypeScript/pull/56296)
* [Do not remove binding alias in function declarations](https://github.com/microsoft/TypeScript/pull/57020)
* [ImportAttributes should go through the same emit phases when in an ImportTypeNode](https://github.com/microsoft/TypeScript/pull/56395)