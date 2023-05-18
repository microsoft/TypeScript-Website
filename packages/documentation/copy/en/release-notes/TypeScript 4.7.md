---
title: TypeScript 4.7
layout: docs
permalink: /docs/handbook/release-notes/typescript-4-7.html
oneline: TypeScript 4.7 Release Notes
---

## ECMAScript Module Support in Node.js

For the last few years, Node.js has been working to support ECMAScript modules (ESM).
This has been a very difficult feature, since the Node.js ecosystem is built on a different module system called CommonJS (CJS).
Interoperating between the two brings large challenges, with many new features to juggle;
however, support for ESM in Node.js was largely implemented in Node.js 12 and later.
Around TypeScript 4.5 we rolled out nightly-only support for ESM in Node.js to get some feedback from users and let library authors ready themselves for broader support.

TypeScript 4.7 adds this functionality with two new `module` settings: `node16` and `nodenext`.

```jsonc
{
    "compilerOptions": {
        "module": "node16",
    }
}
```

These new modes bring a few high-level features which we'll explore here.

### `type` in `package.json` and New Extensions

Node.js supports [a new setting in `package.json`](https://nodejs.org/api/packages.html#packages_package_json_and_file_extensions) called `type`.
`"type"` can be set to either `"module"` or `"commonjs"`.

```jsonc
{
    "name": "my-package",
    "type": "module",

    "//": "...",
    "dependencies": {
    }
}
```

This setting controls whether `.js` and `.d.ts` files are interpreted as ES modules or CommonJS modules, and defaults to CommonJS when not set.
When a file is considered an ES module, a few different rules come into play compared to CommonJS:

* `import`/`export` statements can be used.
* Top-level `await` can be used
* Relative import paths need full extensions (we have to write `import "./foo.js"` instead of `import "./foo"`).
* Imports might resolve differently from dependencies in `node_modules`.
* Certain global-like values like `require` and `module` cannot be used directly.
* CommonJS modules get imported under certain special rules.

We'll come back to some of these.

To overlay the way TypeScript works in this system, `.ts` and `.tsx` files now work the same way.
When TypeScript finds a `.ts`, `.tsx`, `.js`, or `.jsx` file, it will walk up looking for a `package.json` to see whether that file is an ES module, and use that to determine:

* how to find other modules which that file imports
* and how to transform that file if producing outputs

When a `.ts` file is compiled as an ES module, ECMAScript `import`/`export` statements are left alone in the `.js` output;
when it's compiled as a CommonJS module, it will produce the same output you get today under `--module commonjs`.

This also means paths resolve differently between `.ts` files that are ES modules and ones that are CJS modules.
For example, let's say you have the following code today:

```ts
// ./foo.ts
export function helper() {
    // ...
}

// ./bar.ts
import { helper } from "./foo"; // only works in CJS

helper();
```

This code works in CommonJS modules, but will fail in ES modules because relative import paths need to use extensions.
As a result, it will have to be rewritten to use the extension of the *output* of `foo.ts` - so `bar.ts` will instead have to import from `./foo.js`.

```ts
// ./bar.ts
import { helper } from "./foo.js"; // works in ESM & CJS

helper();
```

This might feel a bit cumbersome at first, but TypeScript tooling like auto-imports and path completion will typically just do this for you.

One other thing to mention is the fact that this applies to `.d.ts` files too.
When TypeScript finds a `.d.ts` file in a package, it is interpreted based on the containing package.

### New File Extensions

The `type` field in `package.json` is nice because it allows us to continue using the `.ts` and `.js` file extensions which can be convenient;
however, you will occasionally need to write a file that differs from what `type` specifies.
You might also just prefer to always be explicit.

Node.js supports two extensions to help with this: `.mjs` and `.cjs`.
`.mjs` files are always ES modules, and `.cjs` files are always CommonJS modules, and there's no way to override these.

In turn, TypeScript supports two new source file extensions: `.mts` and `.cts`.
When TypeScript emits these to JavaScript files, it will emit them to `.mjs` and `.cjs` respectively.

Furthermore, TypeScript also supports two new declaration file extensions: `.d.mts` and `.d.cts`.
When TypeScript generates declaration files for `.mts` and `.cts`, their corresponding extensions will be `.d.mts` and `.d.cts`.

Using these extensions is entirely optional, but will often be useful even if you choose not to use them as part of your primary workflow.

### CommonJS Interoperability

Node.js allows ES modules to import CommonJS modules as if they were ES modules with a default export.

```ts
// ./foo.cts
export function helper() {
    console.log("hello world!");
}

// ./bar.mts
import foo from "./foo.cjs";

// prints "hello world!"
foo.helper();
```

In some cases, Node.js also synthesizes named exports from CommonJS modules, which can be more convenient.
In these cases, ES modules can use a "namespace-style" import (i.e. `import * as foo from "..."`), or named imports (i.e. `import { helper } from "..."`).

```ts
// ./foo.cts
export function helper() {
    console.log("hello world!");
}

// ./bar.mts
import { helper } from "./foo.cjs";

// prints "hello world!"
helper();
```

There isn't always a way for TypeScript to know whether these named imports will be synthesized, but TypeScript will err on being permissive and use some heuristics when importing from a file that is definitely a CommonJS module.

One TypeScript-specific note about interop is the following syntax:

```ts
import foo = require("foo");
```

In a CommonJS module, this just boils down to a `require()` call, and in an ES module, this imports [`createRequire`](https://nodejs.org/api/module.html#module_module_createrequire_filename) to achieve the same thing.
This will make code less portable on runtimes like the browser (which don't support `require()`), but will often be useful for interoperability.
In turn, you can write the above example using this syntax as follows:

```ts
// ./foo.cts
export function helper() {
    console.log("hello world!");
}

// ./bar.mts
import foo = require("./foo.cjs");

foo.helper()
```

Finally, it's worth noting that the only way to import ESM files from a CJS module is using dynamic `import()` calls.
This can present challenges, but is the behavior in Node.js today.

You can [read more about ESM/CommonJS interop in Node.js here](https://nodejs.org/api/esm.html#esm_interoperability_with_commonjs).

### `package.json` Exports, Imports, and Self-Referencing

Node.js supports [a new field for defining entry points in `package.json` called `"exports"`](https://nodejs.org/api/packages.html#packages_exports).
This field is a more powerful alternative to defining `"main"` in `package.json`, and can control what parts of your package are exposed to consumers.

Here's a `package.json` that supports separate entry-points for CommonJS and ESM:

```jsonc
// package.json
{
    "name": "my-package",
    "type": "module",
    "exports": {
        ".": {
            // Entry-point for `import "my-package"` in ESM
            "import": "./esm/index.js",

            // Entry-point for `require("my-package") in CJS
            "require": "./commonjs/index.cjs",
        },
    },

    // CJS fall-back for older versions of Node.js
    "main": "./commonjs/index.cjs",
}
```

There's a lot to this feature, [which you can read more about on the Node.js documentation](https://nodejs.org/api/packages.html).
Here we'll try to focus on how TypeScript supports it.

With TypeScript's original Node support, it would look for a `"main"` field, and then look for declaration files that corresponded to that entry.
For example, if `"main"` pointed to `./lib/index.js`, TypeScript would look for a file called `./lib/index.d.ts`.
A package author could override this by specifying a separate field called `"types"` (e.g. `"types": "./types/index.d.ts"`).

The new support works similarly with [import conditions](https://nodejs.org/api/packages.html).
By default, TypeScript overlays the same rules with import conditions - if you write an `import` from an ES module, it will look up the `import` field, and from a CommonJS module, it will look at the `require` field.
If it finds them, it will look for a corresponding declaration file.
If you need to point to a different location for your type declarations, you can add a `"types"` import condition.

```jsonc
// package.json
{
    "name": "my-package",
    "type": "module",
    "exports": {
        ".": {
            // Entry-point for `import "my-package"` in ESM
            "import": {
                // Where TypeScript will look.
                "types": "./types/esm/index.d.ts",

                // Where Node.js will look.
                "default": "./esm/index.js"
            },
            // Entry-point for `require("my-package") in CJS
            "require": {
                // Where TypeScript will look.
                "types": "./types/commonjs/index.d.cts",

                // Where Node.js will look.
                "default": "./commonjs/index.cjs"
            },
        }
    },

    // Fall-back for older versions of TypeScript
    "types": "./types/index.d.ts",

    // CJS fall-back for older versions of Node.js
    "main": "./commonjs/index.cjs"
}
```

> The `"types"` condition should always come first in `"exports"`.

It's important to note that the CommonJS entrypoint and the ES module entrypoint each needs its own declaration file, even if the contents are the same between them.
Every declaration file is interpreted either as a CommonJS module or as an ES module, based on its file extension and the `"type"` field of the `package.json`, and this detected module kind must match the module kind that Node will detect for the corresponding JavaScript file for type checking to be correct.
Attempting to use a single `.d.ts` file to type both an ES module entrypoint and a CommonJS entrypoint will cause TypeScript to think only one of those entrypoints exists, causing compiler errors for users of the package.

TypeScript also supports [the `"imports"` field of `package.json`](https://nodejs.org/api/packages.html#packages_imports) in a similar manner by looking for declaration files alongside corresponding files, and supports [packages self-referencing themselves](https://nodejs.org/api/packages.html#packages_self_referencing_a_package_using_its_name).
These features are generally not as involved to set up, but are supported.

### Your Feedback Wanted!

As we continue working on TypeScript 4.7, we expect to see more documentation and polish go into this functionality.
Supporting these new features has been an ambitious under-taking, and that's why we're looking for early feedback on it!
Please try it out and let us know how it works for you.

For more information, [you can see the implementing PR here](https://github.com/microsoft/TypeScript/pull/44501).

## Control over Module Detection

One issue with the introduction of modules to JavaScript was the ambiguity between existing "script" code and the new module code.
JavaScript code in a module runs slightly differently, and has different scoping rules, so tools have to make decisions as to how each file runs.
For example, Node.js requires module entry-points to be written in a `.mjs`, or have a nearby `package.json` with `"type": "module"`.
TypeScript treats a file as a module whenever it finds any `import` or `export` statement in a file, but otherwise, will assume a `.ts` or `.js` file is a script file acting on the global scope.

This doesn't quite match up with the behavior of Node.js where the `package.json` can change the format of a file, or the `--jsx` setting `react-jsx`, where any JSX file contains an implicit import to a JSX factory.
It also doesn't match modern expectations where most new TypeScript code is written with modules in mind.

That's why TypeScript 4.7 introduces a new option called `moduleDetection`.
`moduleDetection` can take on 3 values: `"auto"` (the default), `"legacy"` (the same behavior as 4.6 and prior), and `"force"`.

Under the mode `"auto"`, TypeScript will not only look for `import` and `export` statements, but it will also check whether

* the `"type"` field in `package.json` is set to `"module"` when running under `--module nodenext`/`--module node16`, and
* check whether the current file is a JSX file when running under `--jsx react-jsx`

In cases where you want every file to be treated as a module, the `"force"` setting ensures that every non-declaration file is treated as a module.
This will be true regardless of how `module`, `moduleResolution`, and `jsx` are configured.

Meanwhile, the `"legacy"` option simply goes back to the old behavior of only seeking out `import` and `export` statements to determine whether a file is a module.

You can [read up more about this change on the pull request](https://github.com/microsoft/TypeScript/pull/47495).

## Control-Flow Analysis for Bracketed Element Access

TypeScript 4.7 now narrows the types of element accesses when the indexed keys are literal types and unique symbols.
For example, take the following code:

```ts
const key = Symbol();

const numberOrString = Math.random() < 0.5 ? 42 : "hello";

const obj = {
    [key]: numberOrString,
};

if (typeof obj[key] === "string") {
    let str = obj[key].toUpperCase();
}
```

Previously, TypeScript would not consider any type guards on `obj[key]`, and would have no idea that `obj[key]` was really a `string`.
Instead, it would think that `obj[key]` was still a `string | number` and accessing `toUpperCase()` would trigger an error.

TypeScript 4.7 now knows that `obj[key]` is a string.

This also means that under `--strictPropertyInitialization`, TypeScript can correctly check that computed properties are initialized by the end of a constructor body.

```ts
// 'key' has type 'unique symbol'
const key = Symbol();

class C {
    [key]: string;

    constructor(str: string) {
        // oops, forgot to set 'this[key]'
    }

    screamString() {
        return this[key].toUpperCase();
    }
}
```

Under TypeScript 4.7, `--strictPropertyInitialization` reports an error telling us that the `[key]` property wasn't definitely assigned by the end of the constructor.

We'd like to extend our gratitude to [Oleksandr Tarasiuk](https://github.com/a-tarasyuk) who provided [this change](https://github.com/microsoft/TypeScript/pull/45974)!

## Improved Function Inference in Objects and Methods

TypeScript 4.7 can now perform more granular inferences from functions within objects and arrays.
This allows the types of these functions to consistently flow in a left-to-right manner just like for plain arguments.

```ts
declare function f<T>(arg: {
    produce: (n: string) => T,
    consume: (x: T) => void }
): void;

// Works
f({
    produce: () => "hello",
    consume: x => x.toLowerCase()
});

// Works
f({
    produce: (n: string) => n,
    consume: x => x.toLowerCase(),
});

// Was an error, now works.
f({
    produce: n => n,
    consume: x => x.toLowerCase(),
});

// Was an error, now works.
f({
    produce: function () { return "hello"; },
    consume: x => x.toLowerCase(),
});

// Was an error, now works.
f({
    produce() { return "hello" },
    consume: x => x.toLowerCase(),
});
```

Inference failed in some of these examples because knowing the type of their `produce` functions would indirectly request the type of `arg` before finding a good type for `T`.
TypeScript now gathers functions that could contribute to the inferred type of `T` and infers from them lazily.

For more information, you can [take a look at the specific modifications to our inference process](https://github.com/microsoft/TypeScript/pull/48538).

## Instantiation Expressions

Occasionally functions can be a bit more general than we want.
For example, let's say we had a `makeBox` function.

```ts
interface Box<T> {
    value: T;
}

function makeBox<T>(value: T) {
    return { value };
}
```

Maybe we want to create a more specialized set of functions for making `Box`es of `Wrench`es and `Hammer`s.
To do that today, we'd have to wrap `makeBox` in other functions, or use an explicit type for an alias of `makeBox`.

```ts
function makeHammerBox(hammer: Hammer) {
    return makeBox(hammer);
}

// or...

const makeWrenchBox: (wrench: Wrench) => Box<Wrench> = makeBox;
```

These work, but wrapping a call to `makeBox` is a bit wasteful, and writing the full signature of `makeWrenchBox` could get unwieldy.
Ideally, we would be able to say that we just want to alias `makeBox` while replacing all of the generics in its signature.

TypeScript 4.7 allows exactly that!
We can now take functions and constructors and feed them type arguments directly.

```ts
const makeHammerBox = makeBox<Hammer>;
const makeWrenchBox = makeBox<Wrench>;
```

So with this, we can specialize `makeBox` to accept more specific types and reject anything else.

```ts
const makeStringBox = makeBox<string>;

// TypeScript correctly rejects this.
makeStringBox(42);
```

This logic also works for constructor functions such as `Array`, `Map`, and `Set`.

```ts
// Has type `new () => Map<string, Error>`
const ErrorMap = Map<string, Error>;

// Has type `// Map<string, Error>`
const errorMap = new ErrorMap();
```

When a function or constructor is given type arguments, it will produce a new type that keeps all signatures with compatible type parameter lists, and replaces the corresponding type parameters with the given type arguments.
Any other signatures are dropped, as TypeScript will assume that they aren't meant to be used.

For more information on this feature, [check out the pull request](https://github.com/microsoft/TypeScript/pull/47607).

## `extends` Constraints on `infer` Type Variables

Conditional types are a bit of a power-user feature.
They allow us to match and infer against the shape of types, and make decisions based on them.
For example, we can write a conditional type that returns the first element of a tuple type if it's a `string`-like type.

```ts
type FirstIfString<T> =
    T extends [infer S, ...unknown[]]
        ? S extends string ? S : never
        : never;

 // string
type A = FirstIfString<[string, number, number]>;

// "hello"
type B = FirstIfString<["hello", number, number]>;

// "hello" | "world"
type C = FirstIfString<["hello" | "world", boolean]>;

// never
type D = FirstIfString<[boolean, number, string]>;
```

`FirstIfString` matches against any tuple with at least one element and grabs the type of the first element as `S`.
Then it checks if `S` is compatible with `string` and returns that type if it is.

Note that we had to use two conditional types to write this.
We could have written `FirstIfString` as follows:

```ts
type FirstIfString<T> =
    T extends [string, ...unknown[]]
        // Grab the first type out of `T`
        ? T[0]
        : never;
```

This works, but it's slightly more "manual" and less declarative.
Instead of just pattern-matching on the type and giving the first element a name, we have to fetch out the `0`th element of `T` with `T[0]`.
If we were dealing with types more complex than tuples, this could get a lot trickier, so `infer` can simplify things.

Using nested conditionals to infer a type and then match against that inferred type is pretty common.
To avoid that second level of nesting, TypeScript 4.7 now allows you to place a constraint on any `infer` type.

```ts
type FirstIfString<T> =
    T extends [infer S extends string, ...unknown[]]
        ? S
        : never;
```

This way, when TypeScript matches against `S`, it also ensures that `S` has to be a `string`.
If `S` isn't a `string`, it takes the false path, which in these cases is `never`.

For more details, you can [read up on the change on GitHub](https://github.com/microsoft/TypeScript/pull/48112).

## Optional Variance Annotations for Type Parameters

Let's take the following types.

```ts
interface Animal {
    animalStuff: any;
}

interface Dog extends Animal {
    dogStuff: any;
}

// ...

type Getter<T> = () => T;

type Setter<T> = (value: T) => void;
```

Imagine we had two different instances of `Getter`s.
Figuring out whether any two different `Getter`s are substitutable for one another depends entirely on `T`.
In the case of whether an assignment of `Getter<Dog>`&nbsp;&rarr;&nbsp;`Getter<Animal>` is valid, we have to check whether `Dog`&nbsp;&rarr;&nbsp;`Animal` is valid.
Because each type for `T` just gets related in the same "direction", we say that the `Getter` type is *covariant* on `T`.
On the other hand, checking whether `Setter<Dog>`&nbsp;&rarr;&nbsp;`Setter<Animal>` is valid involves checking whether `Animal`&nbsp;&rarr;&nbsp;`Dog` is valid.
That "flip" in direction is kind of like how in math, checking whether &minus;*x*&nbsp;&lt;&nbsp;*&minus;y* is the same as checking whether *y*&nbsp;&lt;&nbsp;*x*.
When we have to flip directions like this to compare `T`, we say that `Setter` is *contravariant* on `T`.

With TypeScript 4.7, we're now able to *explicitly* specify variance on type parameters.

So now, if we want to make it explicit that `Getter` is covariant on `T`, we can now give it an `out` modifier.

```ts
type Getter<out T> = () => T;
```

And similarly, if we also want to make it explicit that `Setter` is contravariant on `T`, we can give it an `in` modifier.

```ts
type Setter<in T> = (value: T) => void;
```

`out` and `in` are used here because a type parameter's variance depends on whether it's used in an *output* or an *input*.
Instead of thinking about variance, you can just think about if `T` is used in output and input positions.

There are also cases for using both `in` and `out`.

```ts
interface State<in out T> {
    get: () => T;
    set: (value: T) => void;
}
```

When a `T` is used in both an output and input position, it becomes *invariant*.
Two different `State<T>`s can't be interchanged unless their `T`s are the same.
In other words, `State<Dog>` and `State<Animal>` aren't substitutable for the other.

Now technically speaking, in a purely structural type system, type parameters and their variance don't really matter - you can just plug in types in place of each type parameter and check whether each matching member is structurally compatible.
So if TypeScript uses a structural type system, why are we interested in the variance of type parameters?
And why might we ever want to annotate them?

One reason is that it can be useful for a reader to explicitly see how a type parameter is used at a glance.
For much more complex types, it can be difficult to tell whether a type is meant to be read, written, or both.
TypeScript will also help us out if we forget to mention how that type parameter is used.
As an example, if we forgot to specify both `in` and `out` on `State`, we'd get an error.

```ts
interface State<out T> {
    //          ~~~~~
    // error!
    // Type 'State<sub-T>' is not assignable to type 'State<super-T>' as implied by variance annotation.
    //   Types of property 'set' are incompatible.
    //     Type '(value: sub-T) => void' is not assignable to type '(value: super-T) => void'.
    //       Types of parameters 'value' and 'value' are incompatible.
    //         Type 'super-T' is not assignable to type 'sub-T'.
    get: () => T;
    set: (value: T) => void;
}
```

Another reason is precision and speed!
TypeScript already tries to infer the variance of type parameters as an optimization.
By doing this, it can type-check larger structural types in a reasonable amount of time.
Calculating variance ahead of time allows the type-checker to skip deeper comparisons and just compare type arguments which can be *much* faster than comparing the full structure of a type over and over again.
But often there are cases where this calculation is still fairly expensive, and the calculation may find circularities that can't be accurately resolved, meaning there's no clear answer for the variance of a type.

```ts
type Foo<T> = {
    x: T;
    f: Bar<T>;
}

type Bar<U> = (x: Baz<U[]>) => void;

type Baz<V> = {
    value: Foo<V[]>;
}

declare let foo1: Foo<unknown>;
declare let foo2: Foo<string>;

foo1 = foo2;  // Should be an error but isn't ❌
foo2 = foo1;  // Error - correct ✅
```

Providing an explicit annotation can speed up type-checking at these circularities and provide better accuracy.
For instance, marking `T` as invariant in the above example can help stop the problematic assignment.

```diff
- type Foo<T> = {
+ type Foo<in out T> = {
      x: T;
      f: Bar<T>;
  }
```

We don't necessarily recommend annotating every type parameter with its variance;
For example, it's possible (but not recommended) to make variance a little stricter than is necessary, so TypeScript won't stop you from marking something as invariant if it's really just covariant, contravariant, or even independent.
So if you do choose to add explicit variance markers, we would encourage thoughtful and precise use of them.

But if you're working with deeply recursive types, especially if you're a library author, you may be interested in using these annotations to the benefit of your users.
Those annotations can provide wins in both accuracy and type-checking speed, which can even affect their code editing experience.
Determining when variance calculation is a bottleneck on type-checking time can be done experimentally, and determined using tooling like our [analyze-trace](https://github.com/microsoft/typescript-analyze-trace) utility.


For more details on this feature, you can [read up on the pull request](https://github.com/microsoft/TypeScript/pull/48240).

## Resolution Customization with `moduleSuffixes`

TypeScript 4.7 now supports a `moduleSuffixes` option to customize how module specifiers are looked up.

```jsonc
{
    "compilerOptions": {
        "moduleSuffixes": [".ios", ".native", ""]
    }
}
```

Given the above configuration, an import like the following...

```ts
import * as foo from "./foo";
```

will try to look at the relative files `./foo.ios.ts`, `./foo.native.ts`, and finally `./foo.ts`.

<aside>

Note that the empty string `""` in `moduleSuffixes` is necessary for TypeScript to also look-up `./foo.ts`.
In a sense, the default value for `moduleSuffixes` is `[""]`.

</aside>

This feature can be useful for React Native projects where each target platform can use a separate `tsconfig.json` with differing `moduleSuffixes`.

[The `moduleSuffixes` option](https://github.com/microsoft/TypeScript/pull/48189) was contributed thanks to [Adam Foxman](https://github.com/afoxman)!

## resolution-mode

With Node's ECMAScript resolution, the mode of the containing file and the syntax you use determines how imports are resolved;
however it would be useful to reference the types of a CommonJS module from an ECMAScript module, or vice-versa.

TypeScript now allows `/// <reference types="..." />` directives.

```ts
/// <reference types="pkg" resolution-mode="require" />

// or

/// <reference types="pkg" resolution-mode="import" />
```

Additionally, in nightly versions of TypeScript, `import type` can specify an import assertion to achieve something similar.

```ts
// Resolve `pkg` as if we were importing with a `require()`
import type { TypeFromRequire } from "pkg" assert {
    "resolution-mode": "require"
};

// Resolve `pkg` as if we were importing with an `import`
import type { TypeFromImport } from "pkg" assert {
    "resolution-mode": "import"
};

export interface MergedType extends TypeFromRequire, TypeFromImport {}
```

These import assertions can also be used on `import()` types.

```ts
export type TypeFromRequire =
    import("pkg", { assert: { "resolution-mode": "require" } }).TypeFromRequire;

export type TypeFromImport =
    import("pkg", { assert: { "resolution-mode": "import" } }).TypeFromImport;

export interface MergedType extends TypeFromRequire, TypeFromImport {}
```

The `import type` and `import()` syntaxes only support `resolution-mode` in [nightly builds of TypeScript](https://www.typescriptlang.org/docs/handbook/nightly-builds.html).
You'll likely get an error like

```
Resolution mode assertions are unstable. Use nightly TypeScript to silence this error. Try updating with 'npm install -D typescript@next'.
```

If you do find yourself using this feature in nightly versions of TypeScript, [consider providing feedback on this issue](https://github.com/microsoft/TypeScript/issues/49055).

You can see the respective changes [for reference directives](https://github.com/microsoft/TypeScript/pull/47732) and [for type import assertions](https://github.com/microsoft/TypeScript/pull/47807).

## Go to Source Definition

TypeScript 4.7 contains support for a new experimental editor command called *Go To Source Definition*.
It's similar to *Go To Definition*, but it never returns results inside declaration files.
Instead, it tries to find corresponding *implementation* files (like `.js` or `.ts` files), and find definitions there &mdash; even if those files are normally shadowed by `.d.ts` files.

This comes in handy most often when you need to peek at the implementation of a function you're importing from a library instead of its type declaration in a `.d.ts` file.

![The "Go to Source Definition" command on a use of the yargs package jumps the editor to an index.cjs file in yargs.](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2022/05/go-to-source-definition-4-7-v1.gif)

You can try this new command in the latest versions of Visual Studio Code.
Note, though, that this functionality is still in preview, and there are some known limitations.
In some cases TypeScript uses heuristics to guess which `.js` file corresponds to the given result of a definition, so these results might be inaccurate.
Visual Studio Code also doesn't yet indicate whether a result was a guess, but it's something we're collaborating on.

You can leave feedback about the feature, read about known limitations, or learn more at [our dedicated feedback issue](https://github.com/microsoft/TypeScript/issues/49003).

## Group-Aware Organize Imports

TypeScript has an *Organize Imports* editor feature for both JavaScript and TypeScript.
Unfortunately, it could be a bit of a blunt instrument, and would often naively sort your import statements.

For instance, if you ran Organize Imports on the following file...

```ts
// local code
import * as bbb from "./bbb";
import * as ccc from "./ccc";
import * as aaa from "./aaa";

// built-ins
import * as path from "path";
import * as child_process from "child_process"
import * as fs from "fs";

// some code...
```

You would get something like the following

```ts
// local code
import * as child_process from "child_process";
import * as fs from "fs";
// built-ins
import * as path from "path";
import * as aaa from "./aaa";
import * as bbb from "./bbb";
import * as ccc from "./ccc";


// some code...
```

This is... not ideal.
Sure, our imports are sorted by their paths, and our comments and newlines are preserved, but not in a way we expected.
Much of the time, if we have our imports grouped in a specific way, then we want to keep them that way.

TypeScript 4.7 performs Organize Imports in a group-aware manner.
Running it on the above code looks a little bit more like what you'd expect:

```ts
// local code
import * as aaa from "./aaa";
import * as bbb from "./bbb";
import * as ccc from "./ccc";

// built-ins
import * as child_process from "child_process";
import * as fs from "fs";
import * as path from "path";

// some code...
```

We'd like to extend our thanks to [Minh Quy](https://github.com/MQuy) who provided [this feature](https://github.com/microsoft/TypeScript/pull/48330).

## Object Method Snippet Completions

TypeScript now provides snippet completions for object literal methods.
When completing members in an object, TypeScript will provide a typical completion entry for just the name of a method, along with a separate completion entry for the full method definition!

![Completion a full method signature from an object](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2022/05/object-method-completions-4-7-v2.gif)

For more details, [see the implementing pull request](https://github.com/microsoft/TypeScript/pull/48168).

## Breaking Changes

### `lib.d.ts` Updates

While TypeScript strives to avoid major breaks, even small changes in the built-in libraries can cause issues.
We don't expect major breaks as a result of DOM and `lib.d.ts` updates, but there may be some small ones.

### Stricter Spread Checks in JSX

When writing a `...spread` in JSX, TypeScript now enforces stricter checks that the given type is actually an object.
As a result, values with the types `unknown` and `never` (and more rarely, just bare `null` and `undefined`) can no longer be spread into JSX elements.

So for the following example:

```tsx
import * as React from "react";

interface Props {
    stuff?: string;
}

function MyComponent(props: unknown) {
    return <div {...props} />;
}
```

you'll now receive an error like the following:

```
Spread types may only be created from object types.
```

This makes this behavior more consistent with spreads in object literals.

For more details, [see the change on GitHub](https://github.com/microsoft/TypeScript/pull/48570).

### Stricter Checks with Template String Expressions

When a `symbol` value is used in a template string, it will trigger a runtime error in JavaScript.

```js
let str = `hello ${Symbol()}`;
// TypeError: Cannot convert a Symbol value to a string
```

As a result, TypeScript will issue an error as well;
however, TypeScript now also checks if a generic value that is constrained to a symbol in some way is used in a template string.

```ts
function logKey<S extends string | symbol>(key: S): S {
    // Now an error.
    console.log(`${key} is the key`);
    return key;
}

function get<T, K extends keyof T>(obj: T, key: K) {
    // Now an error.
    console.log(`Grabbing property '${key}'.`);
    return obj[key];
}
```

TypeScript will now issue the following error:

```
Implicit conversion of a 'symbol' to a 'string' will fail at runtime. Consider wrapping this expression in 'String(...)'.
```

In some cases, you can get around this by wrapping the expression in a call to `String`, just like the error message suggests.

```ts
function logKey<S extends string | symbol>(key: S): S {
    // No longer an error.
    console.log(`${String(key)} is the key`);
    return key;
}
```

In others, this error is too pedantic, and you might not ever care to even allow `symbol` keys when using `keyof`.
In such cases, you can switch to `string & keyof ...`:

```ts
function get<T, K extends string & keyof T>(obj: T, key: K) {
    // No longer an error.
    console.log(`Grabbing property '${key}'.`);
    return obj[key];
}
```

For more information, you can [see the implementing pull request](https://github.com/microsoft/TypeScript/pull/44578).

### `readFile` Method is No Longer Optional on `LanguageServiceHost`

If you're creating `LanguageService` instances, then provided `LanguageServiceHost`s will need to provide a `readFile` method.
This change was necessary to support the new `moduleDetection` compiler option.

You can [read more on the change here](https://github.com/microsoft/TypeScript/pull/47495).

### `readonly` Tuples Have a `readonly` `length` Property

A `readonly` tuple will now treat its `length` property as `readonly`.
This was almost never witnessable for fixed-length tuples, but was an oversight which could be observed for tuples with trailing optional and rest element types.

As a result, the following code will now fail:

```ts
function overwriteLength(tuple: readonly [string, string, string]) {
    // Now errors.
    tuple.length = 7;
}
```

You can [read more on this change here](https://github.com/microsoft/TypeScript/pull/47717).
