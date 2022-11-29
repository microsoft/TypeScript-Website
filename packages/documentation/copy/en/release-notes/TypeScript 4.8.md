---
title: TypeScript 4.8
layout: docs
permalink: /docs/handbook/release-notes/typescript-4-8.html
oneline: TypeScript 4.8 Release Notes
---

## Improved Intersection Reduction, Union Compatibility, and Narrowing

TypeScript 4.8 brings a series of correctness and consistency improvements under `--strictNullChecks`.
These changes affect how intersection and union types work, and are leveraged in how TypeScript narrows types.

For example, `unknown` is close in spirit to the union type `{} | null | undefined` because it accepts `null`, `undefined`, and any other type.
TypeScript now recognizes this, and allows assignments from `unknown` to `{} | null | undefined`.

```ts
function f(x: unknown, y: {} | null | undefined) {
    x = y; // always worked
    y = x; // used to error, now works
}
```

Another change is that `{}` intersected with any other object type simplifies right down to that object type.
That meant that we were able to rewrite `NonNullable` to just use an intersection with `{}`, because `{} & null` and `{} & undefined` just get tossed away.

```diff
- type NonNullable<T> = T extends null | undefined ? never : T;
+ type NonNullable<T> = T & {};
```

This is an improvement because intersection types like this can be reduced and assigned to, while conditional types currently cannot.
So `NonNullable<NonNullable<T>>` now simplifies at least to `NonNullable<T>`, whereas it didn't before.

```ts
function foo<T>(x: NonNullable<T>, y: NonNullable<NonNullable<T>>) {
    x = y; // always worked
    y = x; // used to error, now works
}
```

These changes also allowed us to bring in sensible improvements in control flow analysis and type narrowing.
For example, `unknown` is now narrowed just like `{} | null | undefined` in truthy branches.

```ts
function narrowUnknownishUnion(x: {} | null | undefined) {
    if (x) {
        x;  // {}
    }
    else {
        x;  // {} | null | undefined
    }
}

function narrowUnknown(x: unknown) {
    if (x) {
        x;  // used to be 'unknown', now '{}'
    }
    else {
        x;  // unknown
    }
}
```

Generic values also get narrowed similarly.
When checking that a value isn't `null` or `undefined`, TypeScript now just intersects it with `{}` - which again, is the same as saying it's `NonNullable`.
Putting many of the changes here together, we can now define the following function without any type assertions.

```ts
function throwIfNullable<T>(value: T): NonNullable<T> {
    if (value === undefined || value === null) {
        throw Error("Nullable value!");
    }

    // Used to fail because 'T' was not assignable to 'NonNullable<T>'.
    // Now narrows to 'T & {}' and succeeds because that's just 'NonNullable<T>'.
    return value;
}
```

`value` now gets narrowed to `T & {}`, and is now identical with `NonNullable<T>` - so the body of the function just works with no TypeScript-specific syntax.

On their own, these changes may appear small - but they represent fixes for many many paper cuts that have been reported over several years.

For more specifics on these improvements, you can [read more here](https://github.com/microsoft/TypeScript/pull/49119).

## Improved Inference for `infer` Types in Template String Types

TypeScript recently introduced a way to add `extends` constraints to `infer` type variables in conditional types.

```ts
// Grabs the first element of a tuple if it's assignable to 'number',
// and returns 'never' if it can't find one.
type TryGetNumberIfFirst<T> =
    T extends [infer U extends number, ...unknown[]] ? U : never;
```

If these `infer` types appear in a template string type and are constrained to a primitive type, TypeScript will now try to parse out a literal type.

```ts
// SomeNum used to be 'number'; now it's '100'.
type SomeNum = "100" extends `${infer U extends number}` ? U : never;

// SomeBigInt used to be 'bigint'; now it's '100n'.
type SomeBigInt = "100" extends `${infer U extends bigint}` ? U : never;

// SomeBool used to be 'boolean'; now it's 'true'.
type SomeBool = "true" extends `${infer U extends boolean}` ? U : never;
```

This can now better convey what a library will do at runtime, and give more precise types.

One note on this is that when TypeScript parses these literal types out it will greedily try to parse out as much of what looks like of the appropriate primitive type;
however it then checks to see if the print-back of that primitive matches up with the string contents.
In other words, TypeScript checks whether the going from the string, to the primitive, and back matches.
If it doesn't see that the string can be "round-tripped", then it will fall back to the base primitive type.

```ts
// JustNumber is `number` here because TypeScript parses out `"1.0"`, but `String(Number("1.0"))` is `"1"` and doesn't match.
type JustNumber = "1.0" extends `${infer T extends number}` ? T : never; 
```

You can [see more about this feature here](https://github.com/microsoft/TypeScript/pull/48094).

## `--build`, `--watch`, and `--incremental` Performance Improvements

TypeScript 4.8 introduces several optimizations that should speed up scenarios around `--watch` and `--incremental`, along with project references builds using `--build`.
For example, TypeScript is now able to avoid spending time updating timestamps during no-op changes in `--watch` mode, which makes rebuilds faster and avoids messing with other build tools that might be watching for TypeScript's output.
Many other optimizations where we're able to reuse information across `--build`, `--watch`, and `--incremental` have been introduced as well.

How big are these improvements?
Well, on a fairly large internal codebase, we've seen time reductions on the order of 10%-25% on many simple common operations, with around 40% time reductions in no-change scenarios.
We've seen similar results on the TypeScript codebase as well.

You can see [the changes, along with the performance results on GitHub](https://github.com/microsoft/TypeScript/pull/48784).

## Errors When Comparing Object and Array Literals

In many languages, operators like `==` perform what's called "value" equality on objects.
For example, in Python it's valid to check whether a list is empty by checking whether a value is equal to the empty list using `==`.

```py
if people_at_home == []:
    print("here's where I lie, broken inside. </3")
    adopt_animals()
```

This is not the case in JavaScript, where `==` and `===` between objects (and therefore, arrays) check whether both references point to the same value.
We believe that similar code in JavaScript is at best an early foot-gun for JavaScript developers, and at worst a bug in production code.
That's why TypeScript now disallows code like the following.

```ts
if (peopleAtHome === []) {
//  ~~~~~~~~~~~~~~~~~~~
// This condition will always return 'false' since JavaScript compares objects by reference, not value.
    console.log("here's where I lie, broken inside. </3")
    adoptAnimals();
}
```

We'd like to extend our gratitude to [Jack Works](https://github.com/Jack-Works) who contributed this check.
You can [view the changes involved here](https://github.com/microsoft/TypeScript/pull/45978).

## Improved Inference from Binding Patterns

In some cases, TypeScript will pick up a type from a binding pattern to make better inferences.

```ts
declare function chooseRandomly<T>(x: T, y: T): T;

let [a, b, c] = chooseRandomly([42, true, "hi!"], [0, false, "bye!"]);
//   ^  ^  ^
//   |  |  |
//   |  |  string
//   |  |
//   |  boolean
//   |
//   number
```

When `chooseRandomly` needs to figure out a type for `T`, it will primarily look at `[42, true, "hi!"]` and `[0, false, "bye!"]`;
but TypeScript needs to figure out whether those two types should be `Array<number | boolean | string>` or the tuple type `[number, boolean, string]`.
To do that, it will look for existing candidates as a hint to see whether there are any tuple types.
When TypeScript sees the binding pattern `[a, b, c]`, it creates the type `[any, any, any]`, and that type gets picked up as a low-priority candidate for `T` which also gets used as a hint for the types of `[42, true, "hi!"]` and `[0, false, "bye!"]`.

You can see how this was good for `chooseRandomly`, but it fell short in other cases.
For example, take the following code

```ts
declare function f<T>(x?: T): T;

let [x, y, z] = f();
```

The binding pattern `[x, y, z]` hinted that `f` should produce an `[any, any, any]` tuple;
but `f` really shouldn't change its type argument based on a binding pattern.
It can't suddenly conjure up a new array-like value based on what it's being assigned to, so the binding pattern type has way too much influence on the produced type.
On top of that, because the binding pattern type is full of `any`s, we're left with `x`, `y`, and `z` being typed as `any`.

In TypeScript 4.8, these binding patterns are never used as candidates for type arguments.
Instead, they're just consulted in case a parameter needs a more specific type like in our `chooseRandomly` example.
If you need to revert to the old behavior, you can always provide explicit type arguments.

You can [look at the change on GitHub](https://github.com/microsoft/TypeScript/pull/49086) if you're curious to learn more.

## File-Watching Fixes (Especially Across `git checkout`s)

We've had a long-standing bug where TypeScript has a very hard time with certain file changes in `--watch` mode and editor scenarios.
Sometimes the symptoms are stale or inaccurate errors that might show up that require restarting `tsc` or VS Code.
Frequently these occur on Unix systems, and you might have seen these after saving a file with vim or swapping branches in git.

This was caused by assumptions of how Node.js handles rename events across file systems.
File systems used by Linux and macOS utilize [inodes](https://en.wikipedia.org/wiki/Inode), and [Node.js will attach file watchers to inodes rather than file paths](https://nodejs.org/api/fs.html#inodes).
So when Node.js returns [a watcher object](https://nodejs.org/api/fs.html#class-fsfswatcher), it might be watching a path or an inode depending on the platform and file system.

To be a bit more efficient, TypeScript tries to reuse the same watcher objects if it detects a path still exists on disk.
This is where things went wrong, because even if a file still exists at that path, a distinct file might have been created, and that file will have a different inode.
So TypeScript would end up reusing the watcher object instead of installing a new watcher at the original location, and watch for changes at what might be a totally irrelevant file.
So TypeScript 4.8 now handles these cases on inode systems and properly installs a new watcher and fixes this.

We'd like to extend our thanks to [Marc Celani](https://github.com/MarcCelani-at) and his team at Airtable who invested lots of time in investigating the issues they were experiencing and pointing out the root cause.
You can view [the specific fixes around file-watching here](https://github.com/microsoft/TypeScript/pull/48997).

## Find-All-References Performance Improvements

When running find-all-references in your editor, TypeScript is now able to act a little smarter as it aggregates references.
This reduced the amount of time TypeScript took to search a widely-used identifier in its own codebase by about 20%.

[You can read up more on the improvement here](https://github.com/microsoft/TypeScript/pull/49581).

## Exclude Specific Files from Auto-Imports

TypeScript 4.8 introduces an editor preference for excluding files from auto-imports.
In Visual Studio Code, file names or globs can be added under "Auto Import File Exclude Patterns" in the Settings UI, or in a `.vscode/settings.json` file:

```jsonc
{
    // Note that `javascript.preferences.autoImportFileExcludePatterns` can be specified for JavaScript too.
    "typescript.preferences.autoImportFileExcludePatterns": [
      "**/node_modules/@types/node"
    ]
}
```

This can be useful in cases where you can't avoid having certain modules or libraries in your compilation but you rarely want to import from them.
These modules might have lots of exports that can pollute the auto-imports list and make it harder to navigate, and this option can help in those situations.

You can [see more specifics about the implementation here](https://github.com/microsoft/TypeScript/pull/49578).

## Correctness Fixes and Breaking Changes

Due to the nature of type system changes, there are very few changes that can be made that don't affect *some* code;
however, there are a few changes that are more likely to require adapting existing code.

### `lib.d.ts` Updates

While TypeScript strives to avoid major breaks, even small changes in the built-in libraries can cause issues.
We don't expect major breaks as a result of DOM and `lib.d.ts` updates, but one notable change is that the `cause` property on `Error`s now has the type `unknown` instead of `Error`.

### Unconstrained Generics No Longer Assignable to `{}`

In TypeScript 4.8, for projects with `strictNullChecks` enabled, TypeScript will now correctly issue an error when an unconstrained type parameter is used in a position where `null` or `undefined` are not legal values.
That will include any type that expects `{}`, `object`, or an object type with all-optional properties.

A simple example can be seen in the following.

```ts
// Accepts any non-null non-undefined value
function bar(value: {}) {
  Object.keys(value); // This call throws on null/undefined at runtime.
}

// Unconstrained type parameter T...
function foo<T>(x: T) {
    bar(x); // Used to be allowed, now is an error in 4.8.
    //  ~
    // error: Argument of type 'T' is not assignable to parameter of type '{}'.
}

foo(undefined);
```

As demonstrated above, code like this has a potential bug - the values `null` and `undefined` can be indirectly passed through these unconstrained type parameters to code that is not supposed to observe those values.

This behavior will also be visible in type positions. One example would be:
```ts
interface Foo<T> {
  x: Bar<T>;
}

interface Bar<T extends {}> { }
```

Existing code that didn't want to handle `null` and `undefined` can be fixed by propagating the appropriate constraints through.

```diff
- function foo<T>(x: T) {
+ function foo<T extends {}>(x: T) {
```

Another work-around would be to check for `null` and `undefined` at runtime.

```diff
  function foo<T>(x: T) {
+     if (x !== null && x !== undefined) {
          bar(x);
+     }
  }
```

And if you know that for some reason, your generic value can't be `null` or `undefined`, you can just use a non-null assertion.

```diff
  function foo<T>(x: T) {
-     bar(x);
+     bar(x!);
  }
```

When it comes to types, you'll often either need to propagate constraints, or intersect your types with `{}`.

For more information, you can [see the change that introduced this](https://github.com/microsoft/TypeScript/pull/49119) along with [the specific discussion issue regarding how unconstrained generics now work](https://github.com/microsoft/TypeScript/issues/49489).

### Decorators are placed on `modifiers` on TypeScript's Syntax Trees

The current direction of decorators in TC39 means that TypeScript will have to handle a break in terms of placement of decorators.
Previously, TypeScript assumed decorators would always be placed prior to all keywords/modifiers.
For example

```ts
@decorator
export class Foo {
  // ...
}
```

Decorators as currently proposed do not support this syntax.
Instead, the `export` keyword must precede the decorator.

```ts
export @decorator class Foo {
  // ...
}
```

Unfortunately, TypeScript's trees are *concrete* rather than *abstract*, and our architecture expects syntax tree node fields to be entirely ordered before or after each other.
To support both legacy decorators and decorators as proposed, TypeScript will have to gracefully parse, and intersperse, modifiers and decorators.

To do this, it exposes a new type alias called `ModifierLike` which is a `Modifier` or a `Decorator`.

```ts
export type ModifierLike = Modifier | Decorator;
```

Decorators are now placed in the same field as `modifiers` which is now a `NodeArray<ModifierLike>` when set, and the entire field is deprecated.

```diff
- readonly modifiers?: NodeArray<Modifier> | undefined;
+ /**
+  * @deprecated ...
+  * Use `ts.canHaveModifiers()` to test whether a `Node` can have modifiers.
+  * Use `ts.getModifiers()` to get the modifiers of a `Node`.
+  * ...
+  */
+ readonly modifiers?: NodeArray<ModifierLike> | undefined;
```

All existing `decorators` properties have been marked as deprecated and will always be `undefined` if read.
The type has also been changed to `undefined` so that existing tools know to handle them correctly.

```diff
- readonly decorators?: NodeArray<Decorator> | undefined;
+ /**
+  * @deprecated ...
+  * Use `ts.canHaveDecorators()` to test whether a `Node` can have decorators.
+  * Use `ts.getDecorators()` to get the decorators of a `Node`.
+  * ...
+  */
+ readonly decorators?: undefined;
```

To avoid new deprecation warnings and other issues, TypeScript now exposes four new functions to use in place of the `decorators` and `modifiers` properties.
There are individual predicates for testing whether a node has support modifiers and decorators, along with respective accessor functions for grabbing them.

```ts
function canHaveModifiers(node: Node): node is HasModifiers;
function getModifiers(node: HasModifiers): readonly Modifier[] | undefined;

function canHaveDecorators(node: Node): node is HasDecorators;
function getDecorators(node: HasDecorators): readonly Decorator[] | undefined;
```

As an example of how to access modifiers off of a node, you can write

```ts
const modifiers = canHaveModifiers(myNode) ? getModifiers(myNode) : undefined;
```

With the note that each call to `getModifiers` and `getDecorators` may allocate a new array.

For more information, see changes around

* [the restructuring of our tree nodes](https://github.com/microsoft/TypeScript/pull/49089)
* [the deprecations](https://github.com/microsoft/TypeScript/pull/50343)
* [exposing the predicate functions](https://github.com/microsoft/TypeScript/pull/50399)

### Types Cannot Be Imported/Exported in JavaScript Files

TypeScript previously allowed JavaScript files to import and export entities declared with a type, but no value, in `import` and `export` statements.
This behavior was incorrect, because named imports and exports for values that don't exist will cause a runtime error under ECMAScript modules.
When a JavaScript file is type-checked under `--checkJs` or through a `// @ts-check` comment, TypeScript will now issue an error.

```ts
// @ts-check

// Will fail at runtime because 'SomeType' is not a value.
import { someValue, SomeType } from "some-module";

/**
 * @type {SomeType}
 */
export const myValue = someValue;

/**
 * @typedef {string | number} MyType
 */

// Will fail at runtime because 'MyType' is not a value.
export { MyType as MyExportedType };
```

To reference a type from another module, you can instead directly qualify the import.

```diff
- import { someValue, SomeType } from "some-module";
+ import { someValue } from "some-module";
  
  /**
-  * @type {SomeType}
+  * @type {import("some-module").SomeType}
   */
  export const myValue = someValue;
```

To export a type, you can just use a `/** @typedef */` comment in JSDoc.
`@typedef` comments already automatically export types from their containing modules.

```diff
  /**
   * @typedef {string | number} MyType
   */

+ /**
+  * @typedef {MyType} MyExportedType
+  */
- export { MyType as MyExportedType };
```

You can [read more about the change here](https://github.com/microsoft/TypeScript/pull/49580).

### Binding Patterns Do Not Directly Contribute to Inference Candidates

As mentioned above, binding patterns no longer change the type of inference results in function calls.
You can [read more about the original change here](https://github.com/microsoft/TypeScript/pull/49086).

### Unused Renames in Binding Patterns are Now Errors in Type Signatures

TypeScript's type annotation syntax often looks like it can be used when destructuring values.
For example, take the following function.

```ts
declare function makePerson({ name: string, age: number }): Person;
```

You might read this signature and think that `makePerson` obviously takes an object with a `name` property with the type `string` and an `age` property with the type `number`;
however, JavaScript's destructuring syntax is actually taking precedence here.
`makePerson` does say that it's going to take an object with a `name` and an `age` property, but instead of specifying a type for them, it's just saying that it renames `name` and `age` to `string` and `number` respectively.

In a pure type construct, writing code like this is useless, and typically a mistake since developers usually assume they're writing a type annotation.

TypeScript 4.8 makes these an error unless they're referenced later in the signature.
The correct way to write the above signature would be as follows:

```ts
declare function makePerson(options: { name: string, age: number }): Person;

// or

declare function makePerson({ name, age }: { name: string, age: number }): Person;
```

This change can catch bugs in declarations, and has been helpful for improving existing code.
We'd like to extend our thanks to [GitHub user uhyo](https://github.com/uhyo) for providing this check.
[You can read up on the change here](https://github.com/microsoft/TypeScript/pull/41044).