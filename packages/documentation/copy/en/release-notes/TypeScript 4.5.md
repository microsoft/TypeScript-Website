---
title: TypeScript 4.5
layout: docs
permalink: /docs/handbook/release-notes/typescript-4-5.html
oneline: TypeScript 4.5 Release Notes
---

## Supporting `lib` from `node_modules`

To ensure that TypeScript and JavaScript support works well out of the box, TypeScript bundles a series of declaration files (`.d.ts` files).
These declaration files represent the available APIs in the JavaScript language, and the standard browser DOM APIs.
While there are some reasonable defaults based on your [`target`](/tsconfig#target), you can pick and choose which declaration files your program uses by configuring the [`lib`](https://www.typescriptlang.org/tsconfig#lib) setting in the `tsconfig.json`.

There are two occasional downsides to including these declaration files with TypeScript though:

- When you upgrade TypeScript, you're also forced to handle changes to TypeScript's built-in declaration files, and this can be a challenge when the DOM APIs change as frequently as they do.
- It is hard to customize these files to match your needs with the needs of your project's dependencies (e.g. if your dependencies declare that they use the DOM APIs, you might also be forced into using the DOM APIs).

TypeScript 4.5 introduces a way to override a specific built-in `lib` in a manner similar to how `@types/` support works.
When deciding which `lib` files TypeScript should include, it will first look for a scoped `@typescript/lib-*` package in `node_modules`.
For example, when including `dom` as an option in `lib`, TypeScript will use the types in `node_modules/@typescript/lib-dom` if available.

You can then use your package manager to install a specific package to take over for a given `lib`
For example, today TypeScript publishes versions of the DOM APIs on `@types/web`.
If you wanted to lock your project to a specific version of the DOM APIs, you could add this to your `package.json`:

```json
{
  "dependencies": {
    "@typescript/lib-dom": "npm:@types/web"
  }
}
```

Then from 4.5 onwards, you can update TypeScript and your dependency manager's lockfile will ensure that it uses the exact same version of the DOM types.
That means you get to update your types on your own terms.

We'd like to give a shout-out to [saschanaz](https://github.com/saschanaz) who has been extremely helpful and patient as we've been building out and experimenting with this feature.

For more information, you can [see the implementation of this change](https://github.com/microsoft/TypeScript/pull/45771).

## The `Awaited` Type and `Promise` Improvements

TypeScript 4.5 introduces a new utility type called the `Awaited` type.
This type is meant to model operations like `await` in `async` functions, or the `.then()` method on `Promise`s - specifically, the way that they recursively unwrap `Promise`s.

```ts
// A = string
type A = Awaited<Promise<string>>;

// B = number
type B = Awaited<Promise<Promise<number>>>;

// C = boolean | number
type C = Awaited<boolean | Promise<number>>;
```

The `Awaited` type can be helpful for modeling existing APIs, including JavaScript built-ins like `Promise.all`, `Promise.race`, etc.
In fact, some of the problems around inference with `Promise.all` served as motivations for `Awaited`.
Here's an example that fails in TypeScript 4.4 and earlier.

```ts
declare function MaybePromise<T>(value: T): T | Promise<T> | PromiseLike<T>;

async function doSomething(): Promise<[number, number]> {
  const result = await Promise.all([MaybePromise(100), MaybePromise(200)]);

  // Error!
  //
  //    [number | Promise<100>, number | Promise<200>]
  //
  // is not assignable to type
  //
  //    [number, number]
  return result;
}
```

Now `Promise.all` leverages the combination of certain features with `Awaited` to give much better inference results, and the above example works.

For more information, you [can read about this change on GitHub](https://github.com/microsoft/TypeScript/pull/45350).

## Template String Types as Discriminants

TypeScript 4.5 now can narrow values that have template string types, and also recognizes template string types as discriminants.

As an example, the following used to fail, but now successfully type-checks in TypeScript 4.5.

```ts twoslash
export interface Success {
    type: `${string}Success`;
    body: string;
}

export interface Error {
    type: `${string}Error`;
    message: string
}

export function handler(r: Success | Error) {
    if (r.type === "HttpSuccess") {
        const token = r.body;
        //            ^?
    }
}
```

For more information, [see the change that enables this feature](https://github.com/microsoft/TypeScript/pull/46137).

## `module es2022`

Thanks to [Kagami S. Rosylight](https://github.com/saschanaz), TypeScript now supports a new `module` setting: `es2022`.
The main feature in [`module es2022`](/tsconfig#module) is top-level `await`, meaning you can use `await` outside of `async` functions.
This was already supported in `--module esnext` (and now [`--module nodenext`](/tsconfig#target)), but `es2022` is the first stable target for this feature.

You can [read up more on this change here](https://github.com/microsoft/TypeScript/pull/44656).

## Tail-Recursion Elimination on Conditional Types

TypeScript often needs to gracefully fail when it detects possibly infinite recursion, or any type expansions that can take a long time and affect your editor experience.
As a result, TypeScript has heuristics to make sure it doesn't go off the rails when trying to pick apart an infinitely-deep type, or working with types that generate a lot of intermediate results.

```ts
type InfiniteBox<T> = { item: InfiniteBox<T> };

type Unpack<T> = T extends { item: infer U } ? Unpack<U> : T;

// error: Type instantiation is excessively deep and possibly infinite.
type Test = Unpack<InfiniteBox<number>>;
```

The above example is intentionally simple and useless, but there are plenty of types that are actually useful, and unfortunately trigger our heuristics.
As an example, the following `TrimLeft` type removes spaces from the beginning of a string-like type.
If given a string type that has a space at the beginning, it immediately feeds the remainder of the string back into `TrimLeft`.

```ts
type TrimLeft<T extends string> =
    T extends ` ${infer Rest}` ? TrimLeft<Rest> : T;

// Test = "hello" | "world"
type Test = TrimLeft<"   hello" | " world">;
```

This type can be useful, but if a string has 50 leading spaces, you'll get an error.

```ts
type TrimLeft<T extends string> =
    T extends ` ${infer Rest}` ? TrimLeft<Rest> : T;

// error: Type instantiation is excessively deep and possibly infinite.
type Test = TrimLeft<"                                                oops">;
```

That's unfortunate, because these kinds of types tend to be extremely useful in modeling operations on strings - for example, parsers for URL routers.
To make matters worse, a more useful type typically creates more type instantiations, and in turn has even more limitations on input length.

But there's a saving grace: `TrimLeft` is written in a way that is _tail-recursive_ in one branch.
When it calls itself again, it immediately returns the result and doesn't do anything with it.
Because these types don't need to create any intermediate results, they can be implemented more quickly and in a way that avoids triggering many of type recursion heuristics that are built into TypeScript.

That's why TypeScript 4.5 performs some tail-recursion elimination on conditional types.
As long as one branch of a conditional type is simply another conditional type, TypeScript can avoid intermediate instantiations.
There are still heuristics to ensure that these types don't go off the rails, but they are much more generous.

Keep in mind, the following type _won't_ be optimized, since it uses the result of a conditional type by adding it to a union.

```ts
type GetChars<S> =
    S extends `${infer Char}${infer Rest}` ? Char | GetChars<Rest> : never;
```

If you would like to make it tail-recursive, you can introduce a helper that takes an "accumulator" type parameter, just like with tail-recursive functions.

```ts
type GetChars<S> = GetCharsHelper<S, never>;
type GetCharsHelper<S, Acc> =
    S extends `${infer Char}${infer Rest}` ? GetCharsHelper<Rest, Char | Acc> : Acc;
```

You can read up more on the implementation [here](https://github.com/microsoft/TypeScript/pull/45711).

## Disabling Import Elision

There are some cases where TypeScript can't detect that you're using an import.
For example, take the following code:

```ts
import { Animal } from "./animal.js";

eval("console.log(new Animal().isDangerous())");
```

By default, TypeScript always removes this import because it appears to be unused.
In TypeScript 4.5, you can enable a new flag called [`preserveValueImports`](/tsconfig#preserveValueImports) to prevent TypeScript from stripping out any imported values from your JavaScript outputs.
Good reasons to use `eval` are few and far between, but something very similar to this happens in Svelte:

```html
<!-- A .svelte File -->
<script>
  import { someFunc } from "./some-module.js";
</script>

<button on:click="{someFunc}">Click me!</button>
```

along with in Vue.js, using its `<script setup>` feature:

```html
<!-- A .vue File -->
<script setup>
  import { someFunc } from "./some-module.js";
</script>

<button @click="someFunc">Click me!</button>
```

These frameworks generate some code based on markup outside of their `<script>` tags, but TypeScript _only_ sees code within the `<script>` tags.
That means TypeScript will automatically drop the import of `someFunc`, and the above code won't be runnable!
With TypeScript 4.5, you can use [`preserveValueImports`](/tsconfig#preserveValueImports) to avoid these situations.

Note that this flag has a special requirement when combined with [--isolatedModules`](/tsconfig#isolatedModules): imported
types _must_ be marked as type-only because compilers that process single files at a time have no way of knowing whether imports are values that appear unused, or a type that must be removed in order to avoid a runtime crash.

```ts
// Which of these is a value that should be preserved? tsc knows, but `ts.transpileModule`,
// ts-loader, esbuild, etc. don't, so `isolatedModules` gives an error.
import { someFunc, BaseType } from "./some-module.js";
//                 ^^^^^^^^
// Error: 'BaseType' is a type and must be imported using a type-only import
// when 'preserveValueImports' and 'isolatedModules' are both enabled.
```

That makes another TypeScript 4.5 feature, [`type` modifiers on import names](#type-on-import-names), especially important.

For more information, [see the pull request here](https://github.com/microsoft/TypeScript/pull/44619).

## `type` Modifiers on Import Names

As mentioned above, [`preserveValueImports`](/tsconfig#preserveValueImports) and [`isolatedModules`](/tsconfig#isolatedModules) have special requirements so that there's no ambiguity for build tools whether it's safe to drop type imports.

```ts
// Which of these is a value that should be preserved? tsc knows, but `ts.transpileModule`,
// ts-loader, esbuild, etc. don't, so `isolatedModules` issues an error.
import { someFunc, BaseType } from "./some-module.js";
//                 ^^^^^^^^
// Error: 'BaseType' is a type and must be imported using a type-only import
// when 'preserveValueImports' and 'isolatedModules' are both enabled.
```

When these options are combined, we need a way to signal when an import can be legitimately dropped.
TypeScript already has something for this with `import type`:

```ts
import type { BaseType } from "./some-module.js";
import { someFunc } from "./some-module.js";

export class Thing implements BaseType {
  // ...
}
```

This works, but it would be nice to avoid two import statements for the same module.
That's part of why TypeScript 4.5 allows a `type` modifier on individual named imports, so that you can mix and match as needed.

```ts
import { someFunc, type BaseType } from "./some-module.js";

export class Thing implements BaseType {
    someMethod() {
        someFunc();
    }
}
```

In the above example, `BaseType` is always guaranteed to be erased and `someFunc` will be preserved under [`preserveValueImports`](/tsconfig#preserveValueImports), leaving us with the following code:

```js
import { someFunc } from "./some-module.js";

export class Thing {
  someMethod() {
    someFunc();
  }
}
```

For more information, see [the changes on GitHub](https://github.com/microsoft/TypeScript/pull/45998).

## Private Field Presence Checks

TypeScript 4.5 supports an ECMAScript proposal for checking whether an object has a private field on it.
You can now write a class with a `#private` field member and see whether another object has the same field by using the `in` operator.

```ts
class Person {
    #name: string;
    constructor(name: string) {
        this.#name = name;
    }

    equals(other: unknown) {
        return other &&
            typeof other === "object" &&
            #name in other && // <- this is new!
            this.#name === other.#name;
    }
}
```

One interesting aspect of this feature is that the check `#name in other` implies that `other` must have been constructed as a `Person`, since there's no other way that field could be present.
This is actually one of the key features of the proposal, and it's why the proposal is named "ergonomic brand checks" - because private fields often act as a "brand" to guard against objects that aren't instances of their class.
As such, TypeScript is able to appropriately narrow the type of `other` on each check, until it ends up with the type `Person`.

We'd like to extend a big thanks to our friends at Bloomberg [who contributed this pull request](https://github.com/microsoft/TypeScript/pull/44648): [Ashley Claymore](https://github.com/acutmore), [Titian Cernicova-Dragomir](https://github.com/dragomirtitian), [Kubilay Kahveci](https://github.com/mkubilayk), and [Rob Palmer](https://github.com/robpalme)!

## Import Assertions

TypeScript 4.5 supports an ECMAScript proposal for _import assertions_.
This is a syntax used by runtimes to make sure that an import has an expected format.

```ts
import obj from "./something.json" assert { type: "json" };
```

The contents of these assertions are not checked by TypeScript since they're host-specific, and are simply left alone so that browsers and runtimes can handle them (and possibly error).

```ts
// TypeScript is fine with this.
// But your browser? Probably not.
import obj from "./something.json" assert {
    type: "fluffy bunny"
};
```

Dynamic `import()` calls can also use import assertions through a second argument.

```ts
const obj = await import("./something.json", {
  assert: { type: "json" },
});
```

The expected type of that second argument is defined by a new type called `ImportCallOptions`, and currently only accepts an `assert` property.

We'd like to thank [Wenlu Wang](https://github.com/Kingwl/) for [implementing this feature](https://github.com/microsoft/TypeScript/pull/40698)!

## Const Assertions and Default Type Arguments in JSDoc

TypeScript 4.5 brings some extra expressivity to our JSDoc support.

One example of this is with `const` assertions. In TypeScript, you can get a more precise and immutable type by writing `as const` after a literal.

```ts
// type is { prop: string }
let a = { prop: "hello" };

// type is { readonly prop: "hello" }
let b = { prop: "hello" } as const;
```

In JavaScript files, you can now use JSDoc type assertions to achieve the same thing.

```ts
// type is { prop: string }
let a = { prop: "hello" };

// type is { readonly prop: "hello" }
let b = /** @type {const} */ ({ prop: "hello" });
```

As a reminder, JSDoc type assertions comments start with `/** @type {TheTypeWeWant} */` and are followed by a parenthesized expression:

```js
/** @type {TheTypeWeWant} */` (someExpression)
```

TypeScript 4.5 also adds default type arguments to JSDoc, which means the following `type` declaration in TypeScript:

```ts
type Foo<T extends string | number = number> = { prop: T };
```

can be rewritten as the following `@typedef` declaration in JavaScript:

```js
/**
 * @template {string | number} [T=number]
 * @typedef Foo
 * @property prop {T}
 */

// or

/**
 * @template {string | number} [T=number]
 * @typedef {{ prop: T }} Foo
 */
 ```
 
For more information, see [the pull request for const assertions](https://github.com/microsoft/TypeScript/pull/45464) along with [the changes for type argument defaults](https://github.com/microsoft/TypeScript/pull/45483).

## Faster Load Time with `realPathSync.native`

TypeScript now leverages a system-native implementation of the Node.js `realPathSync` function on all operating systems.

Previously this function was only used on Linux, but in TypeScript 4.5 it has been adopted to operating systems that are typically case-insensitive, like Windows and MacOS.
On certain codebases, this change sped up project loading by 5-13% (depending on the host operating system).

For more information, see [the original change here](https://github.com/microsoft/TypeScript/pull/44966), along with [the 4.5-specific changes here](https://github.com/microsoft/TypeScript/pull/44966).

## Snippet Completions for JSX Attributes

TypeScript 4.5 brings _snippet completions_ for JSX attributes.
When writing out an attribute in a JSX tag, TypeScript will already provide suggestions for those attributes;
but with snippet completions, they can remove a little bit of extra typing by adding an initializer and putting your cursor in the right place.

![Snippet completions for JSX attributes. For a string property, quotes are automatically added. For a numeric properties, braces are added.](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/10/jsx-attributes-snippets-4-5.gif)

TypeScript will typically use the type of an attribute to figure out what kind of initializer to insert, but you can customize this behavior in Visual Studio Code.

![Settings in VS Code for JSX attribute completions](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/10/jsx-snippet-settings-4-5.png)

Keep in mind, this feature will only work in newer versions of Visual Studio Code, so you might have to use an Insiders build to get this working.
For more information, [read up on the original pull request](https://github.com/microsoft/TypeScript/pull/45903)

## Better Editor Support for Unresolved Types

In some cases, editors will leverage a lightweight "partial" semantic mode - either while the editor is waiting for the full project to load, or in contexts like [GitHub's web-based editor](https://docs.github.com/en/codespaces/developing-in-codespaces/web-based-editor).

In older versions of TypeScript, if the language service couldn't find a type, it would just print `any`.

![Hovering over a signature where `Buffer` isn't found, TypeScript replaces it with `any`.](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/10/quick-info-unresolved-4-4.png)

In the above example, `Buffer` wasn't found, so TypeScript replaced it with `any` in _quick info_.
In TypeScript 4.5, TypeScript will try its best to preserve what you wrote.

![Hovering over a signature where `Buffer` isn't found, it continues to use the name `Buffer`.](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/10/quick-info-unresolved-4-5.png)

However, if you hover over `Buffer` itself, you'll get a hint that TypeScript couldn't find `Buffer`.

![TypeScript displays `type Buffer = /* unresolved */ any;`](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2021/10/quick-info-unresolved-on-type-4-5.png)

Altogether, this provides a smoother experience when TypeScript doesn't have the full program available.
Keep in mind, you'll always get an error in regular scenarios to tell you when a type isn't found.

For more information, [see the implementation here](https://github.com/microsoft/TypeScript/pull/45976).

## Breaking Changes

### `lib.d.ts` Changes

TypeScript 4.5 contains changes to its built-in declaration files which may affect your compilation;
however, [these changes were fairly minimal](https://github.com/microsoft/TypeScript-DOM-lib-generator/issues/1143), and we expect most code will be unaffected.

### Inference Changes from `Awaited`

Because `Awaited` is now used in `lib.d.ts` and as a result of `await`, you may see certain generic types change that might cause incompatibilities;
however, given many intentional design decisions around `Awaited` to avoid breakage, we expect most code will be unaffected.

### Compiler Options Checking at the Root of `tsconfig.json`

It's an easy mistake to accidentally forget about the `compilerOptions` section in a `tsconfig.json`.
To help catch this mistake, in TypeScript 4.5, it is an error to add a top-level field which matches any of the available options in `compilerOptions` _without_ having also defined `compilerOptions` in that `tsconfig.json`.
