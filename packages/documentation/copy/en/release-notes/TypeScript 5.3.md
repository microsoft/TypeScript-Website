---
title: TypeScript 5.3
layout: docs
permalink: /docs/handbook/release-notes/typescript-5-3.html
oneline: TypeScript 5.3 Release Notes
---

## Import Attributes

TypeScript 5.3 supports the latest updates to the [import attributes](https://github.com/tc39/proposal-import-attributes) proposal.

One use-case of import attributes is to provide information about the expected format of a module to the runtime.

```ts
// We only want this to be interpreted as JSON,
// not a runnable/malicious JavaScript file with a `.json` extension.
import obj from "./something.json" with { type: "json" };
```

The contents of these attributes are not checked by TypeScript since they're host-specific, and are simply left alone so that browsers and runtimes can handle them (and possibly error).

```ts
// TypeScript is fine with this.
// But your browser? Probably not.
import * as foo from "./foo.js" with { type: "fluffy bunny" };
```

Dynamic `import()` calls can also use import attributes through a second argument.

```ts
const obj = await import("./something.json", {
    with: { type: "json" }
});
```

The expected type of that second argument is defined by a type called `ImportCallOptions`, which by default just expects a property called `with`.

Note that import attributes are an evolution of an earlier proposal called ["import assertions", which were implemented in TypeScript 4.5](https://devblogs.microsoft.com/typescript/announcing-typescript-4-5/#import-assertions).
The most obvious difference is the use of the `with` keyword over the `assert` keyword.
But the less-visible difference is that runtimes are now free to use attributes to guide the resolution and interpretation of import paths, whereas import assertions could only assert some characteristics after loading a module.

Over time, TypeScript will be deprecating the old syntax for import assertions in favor of the proposed syntax for import attributes.
Existing code using `assert` should migrate towards the `with` keyword.
New code that needs an import attribute should use `with` exclusively.

We'd like to thank [Oleksandr Tarasiuk](https://github.com/a-tarasyuk) for [implementing this proposal](https://github.com/microsoft/TypeScript/pull/54242)!
And we'd also like to call out [Wenlu Wang](https://github.com/Kingwl) for their implementation of [import assertions](https://github.com/microsoft/TypeScript/pull/40698)!

## Stable Support `resolution-mode` in Import Types

In TypeScript 4.7, TypeScript added support for a `resolution-mode` attribute in `/// <reference types="..." />` to control whether a specifier should be resolved via `import` or `require` semantics.

```ts
/// <reference types="pkg" resolution-mode="require" />

// or

/// <reference types="pkg" resolution-mode="import" />
```

A corresponding field was added to import assertions on type-only imports as well;
however, it was only supported in nightly versions of TypeScript.
The rationale was that in spirit, import *assertions* were not intended to guide module resolution.
So this feature was shipped experimentally in a nightly-only mode to get more feedback.

But given that *[import attributes](#import-attributes)* can guide resolution, and that we've seen reasonable use-cases, TypeScript 5.3 now supports the `resolution-mode` attribute for `import type`.

```ts
// Resolve `pkg` as if we were importing with a `require()`
import type { TypeFromRequire } from "pkg" with {
    "resolution-mode": "require"
};

// Resolve `pkg` as if we were importing with an `import`
import type { TypeFromImport } from "pkg" with {
    "resolution-mode": "import"
};

export interface MergedType extends TypeFromRequire, TypeFromImport {}
```

These import attributes can also be used on `import()` types.

```ts
export type TypeFromRequire =
    import("pkg", { with: { "resolution-mode": "require" } }).TypeFromRequire;

export type TypeFromImport =
    import("pkg", { with: { "resolution-mode": "import" } }).TypeFromImport;

export interface MergedType extends TypeFromRequire, TypeFromImport {}
```

For more information, [check out the change here](https://github.com/microsoft/TypeScript/pull/55725)

## `resolution-mode` Supported in All Module Modes

Previously, using `resolution-mode` was only allowed under the `moduleResolution` options `node16` and `nodenext`.
To make it easier to look up modules specifically for type purposes, `resolution-mode` now works appropriately in all other `moduleResolution` options like `bundler`, `node10`, and simply doesn't error under `classic`.

For more information, [see the implementing pull request](https://github.com/microsoft/TypeScript/pull/55725).

## `switch (true)` Narrowing

TypeScript 5.3 now can perform narrowing based on conditions in each `case` clause within a `switch (true)`.

```ts
function f(x: unknown) {
    switch (true) {
        case typeof x === "string":
            // 'x' is a 'string' here
            console.log(x.toUpperCase());
            // falls through...

        case Array.isArray(x):
            // 'x' is a 'string | any[]' here.
            console.log(x.length);
            // falls through...

        default:
          // 'x' is 'unknown' here.
          // ...
    }
}
```

[This feature](https://github.com/microsoft/TypeScript/pull/55991) was spearheaded [initial work](https://github.com/microsoft/TypeScript/pull/53681) by [Mateusz Burzyński](https://github.com/Andarist)
We'd like to extend a "thank you!" for this contribution.

## Narrowing On Comparisons to Booleans

Occasionally you may find yourself performing a direct comparison with `true` or `false` in a condition.
Usually these are unnecessary comparisons, but you might prefer it as a point of style, or to avoid certain issues around JavaScript truthiness.
Regardless, previously TypeScript just didn't recognize such forms when performing narrowing.

TypeScript 5.3 now keeps up and understands these expressions when narrowing variables.

```ts
interface A {
    a: string;
}

interface B {
    b: string;
}

type MyType = A | B;

function isA(x: MyType): x is A {
    return "a" in x;
}

function someFn(x: MyType) {
    if (isA(x) === true) {
        console.log(x.a); // works!
    }
}
```

We'd like to thank [Mateusz Burzyński](https://github.com/Andarist) for [the pull request](https://github.com/microsoft/TypeScript/pull/53681) that implemented this.

## `instanceof` Narrowing Through `Symbol.hasInstance`

A slightly esoteric feature of JavaScript is that it is possible to override the behavior of the `instanceof` operator.
To do so, the value on the right side of the `instanceof` operator needs to have a specific method named by `Symbol.hasInstance`.

```js
class Weirdo {
    static [Symbol.hasInstance](testedValue) {
        // wait, what?
        return testedValue === undefined;
    }
}

// false
console.log(new Thing() instanceof Weirdo);

// true
console.log(undefined instanceof Weirdo);
```

To better model this behavior in `instanceof`, TypeScript now checks if such a `[Symbol.hasInstance]` method exists and is declared as a type predicate function.
If it does, the tested value on the left side of the `instanceof` operator will be narrowed appropriately by that type predicate.

```ts
interface PointLike {
    x: number;
    y: number;
}

class Point implements PointLike {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    distanceFromOrigin() {
        return Math.sqrt(this.x ** 2 + this.y ** 2);
    }

    static [Symbol.hasInstance](val: unknown): val is PointLike {
        return !!val && typeof val === "object" &&
            "x" in val && "y" in val &&
            typeof val.x === "number" &&
            typeof val.y === "number";
    }
}


function f(value: unknown) {
    if (value instanceof Point) {
        // Can access both of these - correct!
        value.x;
        value.y;

        // Can't access this - we have a 'PointLike',
        // but we don't *actually* have a 'Point'.
        value.distanceFromOrigin();
    }
}
```

As you can see in this example, `Point` defines its own `[Symbol.hasInstance]` method.
It actually acts as a custom type guard over a separate type called `PointLike`.
In the function `f`, we were able to narrow `value` down to a `PointLike` with `instanceof`, but *not* a `Point`.
That means that we can access the properties `x` and `y`, but not the method `distanceFromOrigin`.

For more information, you can [read up on this change here](https://github.com/microsoft/TypeScript/pull/55052).

## Checks for `super` Property Accesses on Instance Fields

In JavaScript, it's possible to access a declaration in a base class through the `super` keyword.

```js
class Base {
    someMethod() {
        console.log("Base method called!");
    }
}

class Derived extends Base {
    someMethod() {
        console.log("Derived method called!");
        super.someMethod();
    }
}

new Derived().someMethod();
// Prints:
//   Derived method called!
//   Base method called!
```

This is different from writing something like `this.someMethod()`, since that could invoke an overridden method.
This is a subtle distinction, made more subtle by the fact that often the two can be interchangeable if a declaration is never overridden at all.

```js
class Base {
    someMethod() {
        console.log("someMethod called!");
    }
}

class Derived extends Base {
    someOtherMethod() {
        // These act identically.
        this.someMethod();
        super.someMethod();
    }
}

new Derived().someOtherMethod();
// Prints:
//   someMethod called!
//   someMethod called!
```

The problem is using them interchangeably is that `super` only works on members declared on the prototype &mdash; *not* instance properties.
That means that if you wrote `super.someMethod()`, but `someMethod` was defined as a field, you'd get a runtime error!

```ts
class Base {
    someMethod = () => {
        console.log("someMethod called!");
    }
}

class Derived extends Base {
    someOtherMethod() {
        super.someMethod();
    }
}

new Derived().someOtherMethod();
// 💥
// Doesn't work because 'super.someMethod' is 'undefined'.
```

TypeScript 5.3 now more-closely inspects `super` property accesses/method calls to see if they correspond to class fields.
If they do, we'll now get a type-checking error.

[This check](https://github.com/microsoft/TypeScript/pull/54056) was contributed thanks to [Jack Works](https://github.com/Jack-Works)!

## Interactive Inlay Hints for Types

TypeScript's inlay hints now support jumping to the definition of types!
This makes it easier to casually navigate your code.

![Ctrl-clicking an inlay hint to jump to the definition of a parameter type.](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2023/10/clickable-inlay-hints-for-types-5-3-beta.gif)

See more at [the implementation here](https://github.com/microsoft/TypeScript/pull/55141).

## Settings to Prefer `type` Auto-Imports

Previously when TypeScript generated auto-imports for something in a type position, it would add a `type` modifier based on your settings.
For example, when getting an auto-import on `Person` in the following:

```ts
export let p: Person
```

TypeScript's editing experience would usually add an import for `Person` as:

```ts
import { Person } from "./types";

export let p: Person
```

and under certain settings like `verbatimModuleSyntax`, it would add the `type` modifier:

```ts
import { type Person } from "./types";

export let p: Person
```

However, maybe your codebase isn't able to use some of these options; or you just have a preference for explicit `type` imports when possible.

[With a recent change](https://github.com/microsoft/TypeScript/pull/56090), TypeScript now enables this to be an editor-specific option.
In Visual Studio Code, you can enable it in the UI under "TypeScript › Preferences: Prefer Type Only Auto Imports", or as the JSON configuration option `typescript.preferences.preferTypeOnlyAutoImports`

<!--
## Triggerable Refactor to Convert to Template String

https://github.com/microsoft/TypeScript/pull/54647

-->

## Optimizations by Skipping JSDoc Parsing

When running TypeScript via `tsc`, the compiler will now avoid parsing JSDoc.
This drops parsing time on its own, but also reduces memory usage to store comments along with time spent in garbage collection.
All-in-all, you should see slightly faster compiles and quicker feedback in `--watch` mode.

[The specific changes can be viewed here](https://github.com/microsoft/TypeScript/pull/52921).

Because not every tool using TypeScript will need to store JSDoc (e.g. typescript-eslint and Prettier), this parsing strategy has been surfaced as part of the API itself.
This can enable these tools to gain the same memory and speed improvements we've brought to the TypeScript compiler.
The new options for comment parsing strategy are described in `JSDocParsingMode`.
More information is available [on this pull request](https://github.com/microsoft/TypeScript/pull/55739).

## Optimizations by Comparing Non-Normalized Intersections

In TypeScript, unions and intersections always follow a specific form, where intersections can't contain union types.
That means that when we create an intersection over a union like `A & (B | C)`, that intersection will be normalized into `(A & B) | (A & C)`.
Still, in some cases the type system will maintain the original form for display purposes.

It turns out that the original form can be used for some clever fast-path comparisons between types.

For example, let's say we have `SomeType & (Type1 | Type2 | ... | Type99999NINE)` and we want to see if that's assignable to `SomeType`.
Recall that we don't really have an intersection as our source type &mdash; we have a union that looks like `(SomeType & Type1) | (SomeType & Type2) | ... |(SomeType & Type99999NINE)`.
When checking if a union is assignable to some target type, we have to check if *every* member of the union is assignable to the target type, and that can be very slow.

In TypeScript 5.3, we peek at the original intersection form that we were able to tuck away.
When we compare the types, we do a quick check to see if the target exists in any constituent of the source intersection.

For more information, [see this pull request](https://github.com/microsoft/TypeScript/pull/55851).

## Consolidation Between `tsserverlibrary.js` and `typescript.js`

TypeScript itself ships two library files: `tsserverlibrary.js` and `typescript.js`.
There are certain APIs available only in `tsserverlibrary.js` (like the `ProjectService` API), which may be useful to some importers.
Still, the two are distinct bundles with have a lot of overlap, duplicating code in the package.
What's more, it can be challenging to consistently use one over the other due to auto-imports or muscle memory.
Accidentally loading both modules is far too easy, and code may not work properly on a different instance of the API.
Even if it does work, loading a second bundle increases resource usage.

Given this, we've decided to consolidate the two.
`typescript.js` now contains what `tsserverlibrary.js` used to contain, and `tsserverlibrary.js` now simply re-exports `typescript.js`.
Comparing the before/after of this consolidation, we saw the following reduction in package size:

|  | Before | After | Diff | Diff (percent) |
| - | - | - | - | - |
| Packed | 6.90 MiB | 5.48 MiB | -1.42 MiB | -20.61% |
| Unpacked | 38.74 MiB | 30.41 MiB | -8.33 MiB | -21.50% |

|  | Before | After | Diff | Diff (percent) |
| - | - | - | - | - |
| `lib/tsserverlibrary.d.ts` | 570.95 KiB | 865.00 B | -570.10 KiB | -99.85% |
| `lib/tsserverlibrary.js` | 8.57 MiB | 1012.00 B | -8.57 MiB | -99.99% |
| `lib/typescript.d.ts` | 396.27 KiB | 570.95 KiB | +174.68 KiB | +44.08% |
| `lib/typescript.js` | 7.95 MiB | 8.57 MiB | +637.53 KiB | +7.84% |

In other words, this is over a 20.5% reduction in package size.

For more information, you can [see the work involved here](https://github.com/microsoft/TypeScript/pull/55273).

## Breaking Changes and Correctness Improvements

### `lib.d.ts` Changes

Types generated for the DOM may have an impact on your codebase.
For more information, [see the DOM updates for TypeScript 5.3](https://github.com/microsoft/TypeScript/pull/55798).

### Checks for `super` Accesses on Instance Properties

TypeScript 5.3 now detects when the declaration referenced by a `super.` property access is a class field and issues an error.
This prevents errors that might occur at runtime.

[See more on this change here](https://github.com/microsoft/TypeScript/pull/54056).