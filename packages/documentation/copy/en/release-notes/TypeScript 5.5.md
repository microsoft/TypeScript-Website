---
title: TypeScript 5.5
layout: docs
permalink: /docs/handbook/release-notes/typescript-5-5.html
oneline: TypeScript 5.5 Release Notes
---

## Inferred Type Predicates

*This section was written by [Dan Vanderkam](https://github.com/danvk), who [implemented this feature in TypeScript 5.5](https://github.com/microsoft/TypeScript/pull/57465). Thanks Dan!*

TypeScript's control flow analysis does a great job of tracking how the type of a variable changes as it moves through your code:

```tsx
interface Bird {
    commonName: string;
    scientificName: string;
    sing(): void;
}

// Maps country names -> national bird.
// Not all nations have official birds (looking at you, Canada!)
declare const nationalBirds: Map<string, Bird>;

function makeNationalBirdCall(country: string) {
  const bird = nationalBirds.get(country);  // bird has a declared type of Bird | undefined
  if (bird) {
    bird.sing();  // bird has type Bird inside the if statement
  } else {
    // bird has type undefined here.
  }
}
```

By making you handle the `undefined` case, TypeScript pushes you to write more robust code.

In the past, this sort of type refinement was more difficult to apply to arrays. This would have been an error in all previous versions of TypeScript:

```tsx
function makeBirdCalls(countries: string[]) {
  // birds: (Bird | undefined)[]
  const birds = countries
    .map(country => nationalBirds.get(country))
    .filter(bird => bird !== undefined);

  for (const bird of birds) {
    bird.sing();  // error: 'bird' is possibly 'undefined'.
  }
}
```

This code is perfectly fine: we've filtered all the `undefined` values out of the list.
But TypeScript hasn't been able to follow along.

With TypeScript 5.5, the type checker is fine with this code:

```tsx
function makeBirdCalls(countries: string[]) {
  // birds: Bird[]
  const birds = countries
    .map(country => nationalBirds.get(country))
    .filter(bird => bird !== undefined);

  for (const bird of birds) {
    bird.sing();  // ok!
  }
}
```

Note the more precise type for `birds`.

This works because TypeScript now infers a [type predicate](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates) for the `filter` function.
You can see what's going on more clearly by pulling it out into a standalone function:

```tsx
// function isBirdReal(bird: Bird | undefined): bird is Bird
function isBirdReal(bird: Bird | undefined) {
  return bird !== undefined;
}
```

`bird is Bird` is the type predicate.
It means that, if the function returns `true`, then it's a `Bird` (if the function returns `false` then it's `undefined`).
The type declarations for `Array.prototype.filter` know about type predicates, so the net result is that you get a more precise type and the code passes the type checker.

TypeScript will infer that a function returns a type predicate if these conditions hold:

1. The function does not have an explicit return type or type predicate annotation.
2. The function has a single `return` statement and no implicit returns.
3. The function does not mutate its parameter.
4. The function returns a `boolean` expression that's tied to a refinement on the parameter.

Generally this works how you'd expect.
Here's a few more examples of inferred type predicates:

```tsx
// const isNumber: (x: unknown) => x is number
const isNumber = (x: unknown) => typeof x === 'number';

// const isNonNullish: <T>(x: T) => x is NonNullable<T>
const isNonNullish = <T,>(x: T) => x != null;
```

Previously, TypeScript would have just inferred that these functions return `boolean`.
It now infers signatures with type predicates like `x is number` or `x is NonNullable<T>`.

Type predicates have "if and only if" semantics.
If a function returns `x is T`, then it means that:

1. If the function returns `true` then `x` is has type `T`.
2. If the function returns `false` then `x` does *not* have type `T`.

If you're expecting a type predicate to be inferred but it's not, then you may be running afoul of the second rule. This often comes up with "truthiness" checks:

```tsx
function getClassroomAverage(students: string[], allScores: Map<string, number>) {
  const studentScores = students
    .map(student => allScores.get(student))
    .filter(score => !!score);

  return studentScores.reduce((a, b) => a + b) / studentScores.length;
  //     ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  // error: Object is possibly 'undefined'.
}
```

TypeScript did not infer a type predicate for `score => !!score`, and rightly so: if this returns `true` then `score` is a `number`.
But if it returns `false`, then `score` could be either `undefined` or a `number` (specifically, `0`).
This is a real bug: if any student got a zero on the test, then filtering out their score will skew the average upwards.
Fewer will be above average and more will be sad!

As with the first example, it's better to explicitly filter out `undefined` values:

```tsx
function getClassroomAverage(students: string[], allScores: Map<string, number>) {
  const studentScores = students
    .map(student => allScores.get(student))
    .filter(score => score !== undefined);

  return studentScores.reduce((a, b) => a + b) / studentScores.length;  // ok!
}
```

A truthiness check *will* infer a type predicate for object types, where there's no ambiguity.
Remember that functions must return a `boolean` to be a candidate for an inferred type predicate: `x => !!x` might infer a type predicate, but `x => x` definitely won't.

Explicit type predicates continue to work exactly as before.
TypeScript will not check whether it would infer the same type predicate.
Explicit type predicates ("is") are no safer than a type assertion ("as").

It's possible that this feature will break existing code if TypeScript now infers a more precise type than you want. For example:

```tsx
// Previously, nums: (number | null)[]
// Now, nums: number[]
const nums = [1, 2, 3, null, 5].filter(x => x !== null);

nums.push(null);  // ok in TS 5.4, error in TS 5.5
```

The fix is to tell TypeScript the type that you want using an explicit type annotation:

```tsx
const nums: (number | null)[] = [1, 2, 3, null, 5].filter(x => x !== null);
nums.push(null);  // ok in all versions
```

For more information, check out the [implementing pull request](https://github.com/microsoft/TypeScript/pull/57465) and [Dan's blog post about implementing this feature](https://effectivetypescript.com/2024/04/16/inferring-a-type-predicate/).

## Control Flow Narrowing for Constant Indexed Accesses

TypeScript is now able to narrow expressions of the form `obj[key]` when both `obj` and `key` are effectively constant.

```ts
function f1(obj: Record<string, unknown>, key: string) {
    if (typeof obj[key] === "string") {
        // Now okay, previously was error
        obj[key].toUpperCase();
    }
}
```

In the above, neither `obj` nor `key` are ever mutated, so TypeScript can narrow the type of `obj[key]` to `string` after the `typeof` check.
For more information, [see the implementing pull request here](https://github.com/microsoft/TypeScript/pull/57847).

## Type Imports in JSDoc

Today, if you want to import something only for type-checking in a JavaScript file, it is cumbersome.
JavaScript developers can't simply import a type named `SomeType` if it's not there at runtime.

```js
// ./some-module.d.ts
export interface SomeType {
    // ...
}

// ./index.js
import { SomeType } from "./some-module"; // ❌ runtime error!

/**
 * @param {SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

`SomeType` won't exist at runtime, so the import will fail.
Developers can instead use a namespace import instead.

```js
import * as someModule from "./some-module";

/**
 * @param {someModule.SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

But `./some-module` is still imported at runtime - which might also not be desirable.

To avoid this, developers typically had to use `import(...)` types in JSDoc comments.

```js
/**
 * @param {import("./some-module").SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

If you wanted to reuse the same type in multiple places, you could use a `typedef` to avoid repeating the import.

```js
/**
 * @typedef {import("./some-module").SomeType} SomeType
 */

/**
 * @param {SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

This helps with local uses of `SomeType`, but it gets repetitive for many imports and can be a bit verbose.

That's why TypeScript now supports a new `@import` comment tag that has the same syntax as ECMAScript imports.

```js
/** @import { SomeType } from "some-module" */

/**
 * @param {SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

Here, we used named imports.
We could also have written our import as a namespace import.

```js
/** @import * as someModule from "some-module" */

/**
 * @param {someModule.SomeType} myValue
 */
function doSomething(myValue) {
    // ...
}
```

Because these are just JSDoc comments, they don't affect runtime behavior at all.

We would like to extend a big thanks to [Oleksandr Tarasiuk](https://github.com/a-tarasyuk) who contributed [this change](https://github.com/microsoft/TypeScript/pull/57207)!

## Regular Expression Syntax Checking

Until now, TypeScript has typically skipped over most regular expressions in code.
This is because regular expressions technically have an extensible grammar and TypeScript never made any effort to compile regular expressions to earlier versions of JavaScript.
Still, this meant that lots of common problems would go undiscovered in regular expressions, and they would either turn into errors at runtime, or silently fail.

But TypeScript now does basic syntax checking on regular expressions!

```ts
let myRegex = /@robot(\s+(please|immediately)))? do some task/;
//                                            ~
// error!
// Unexpected ')'. Did you mean to escape it with backslash?
```

This is a simple example, but this checking can catch a lot of common mistakes.
In fact, TypeScript's checking goes slightly beyond syntactic checks.
For instance, TypeScript can now catch issues around backreferences that don't exist.

```ts
let myRegex = /@typedef \{import\((.+)\)\.([a-zA-Z_]+)\} \3/u;
//                                                        ~
// error!
// This backreference refers to a group that does not exist.
// There are only 2 capturing groups in this regular expression.
```

The same applies to named capturing groups.

```ts
let myRegex = /@typedef \{import\((?<importPath>.+)\)\.(?<importedEntity>[a-zA-Z_]+)\} \k<namedImport>/;
//                                                                                        ~~~~~~~~~~~
// error!
// There is no capturing group named 'namedImport' in this regular expression.
```

TypeScript's checking is now also aware of when certain RegExp features are used when newer than your target version of ECMAScript.
For example, if we use named capturing groups like the above in an ES5 target, we'll get an error.

```ts
let myRegex = /@typedef \{import\((?<importPath>.+)\)\.(?<importedEntity>[a-zA-Z_]+)\} \k<importedEntity>/;
//                                  ~~~~~~~~~~~~         ~~~~~~~~~~~~~~~~
// error!
// Named capturing groups are only available when targeting 'ES2018' or later.
```

The same is true for certain regular expression flags as well.

Note that TypeScript's regular expression support is limited to regular expression *literals*.
If you try calling `new RegExp` with a string literal, TypeScript will not check the provided string.

We would like to thank [GitHub user graphemecluster](https://github.com/graphemecluster/) who iterated a ton with us [to get this feature into TypeScript](https://github.com/microsoft/TypeScript/pull/55600).

## Support for New ECMAScript `Set` Methods

TypeScript 5.5 declares [new proposed methods for the ECMAScript `Set` type](https://github.com/tc39/proposal-set-methods).

Some of these methods, like `union`, `intersection`, `difference`, and `symmetricDifference`, take another `Set` and return a new `Set` as the result.
The other methods, `isSubsetOf`, `isSupersetOf`, and `isDisjointFrom`, take another `Set` and return a `boolean`.
None of these methods mutate the original `Set`s.

Here's a quick example of how you might use these methods and how they behave:

```ts
let fruits = new Set(["apples", "bananas", "pears", "oranges"]);
let applesAndBananas = new Set(["apples", "bananas"]);
let applesAndOranges = new Set(["apples", "oranges"]);
let oranges = new Set(["oranges"]);
let emptySet = new Set();

////
// union
////

// Set(4) {'apples', 'bananas', 'pears', 'oranges'}
console.log(fruits.union(oranges));

// Set(3) {'apples', 'bananas', 'oranges'}
console.log(applesAndBananas.union(oranges));

////
// intersection
////

// Set(2) {'apples', 'bananas'}
console.log(fruits.intersection(applesAndBananas));

// Set(0) {}
console.log(applesAndBananas.intersection(oranges));

// Set(1) {'apples'}
console.log(applesAndBananas.intersection(applesAndOranges));

////
// difference
////

// Set(3) {'apples', 'bananas', 'pears'}
console.log(fruits.difference(oranges));

// Set(2) {'pears', 'oranges'}
console.log(fruits.difference(applesAndBananas));

// Set(1) {'bananas'}
console.log(applesAndBananas.difference(applesAndOranges));

////
// symmetricDifference
////

// Set(2) {'bananas', 'oranges'}
console.log(applesAndBananas.symmetricDifference(applesAndOranges)); // no apples

////
// isDisjointFrom
////

// true
console.log(applesAndBananas.isDisjointFrom(oranges));

// false
console.log(applesAndBananas.isDisjointFrom(applesAndOranges));

// true
console.log(fruits.isDisjointFrom(emptySet));

// true
console.log(emptySet.isDisjointFrom(emptySet));

////
// isSubsetOf
////

// true
console.log(applesAndBananas.isSubsetOf(fruits));

// false
console.log(fruits.isSubsetOf(applesAndBananas));

// false
console.log(applesAndBananas.isSubsetOf(oranges));

// true
console.log(fruits.isSubsetOf(fruits));

// true
console.log(emptySet.isSubsetOf(fruits));

////
// isSupersetOf
////

// true
console.log(fruits.isSupersetOf(applesAndBananas));

// false
console.log(applesAndBananas.isSupersetOf(fruits));

// false
console.log(applesAndBananas.isSupersetOf(oranges));

// true
console.log(fruits.isSupersetOf(fruits));

// false
console.log(emptySet.isSupersetOf(fruits));
```

We'd like to thank [Kevin Gibbons](https://github.com/bakkot) who not only proposed the feature in ECMAScript, but [also provided the declarations for `Set`, `ReadonlySet`, and `ReadonlySetLike` in TypeScript](https://github.com/microsoft/TypeScript/pull/57230)!

## Isolated Declarations

*This section was co-authored by [Rob Palmer](https://github.com/robpalme) who supported the design of isolated declarations.*

Declaration files (a.k.a. `.d.ts` files) describe the shape of existing libraries and modules to TypeScript.
This lightweight description includes the library's type signatures and excludes implementation details such as the function bodies.
They are published so that TypeScript can efficiently check your usage of a library without needing to analyse the library itself.
Whilst it is possible to handwrite declaration files, if you are authoring typed code, it's much safer and simpler to let TypeScript generate them automatically from source files using `--declaration`.

The TypeScript compiler and its APIs have always had the job of generating declaration files;
however, there are some use-cases where you might want to use other tools, or where the traditional build process doesn't scale.

### Use-case: Faster Declaration Emit Tools

Imagine if you wanted to create a faster tool to generate declaration files, perhaps as part of a publishing service or a new bundler.
Whilst there is a thriving ecosystem of blazing fast tools that can turn TypeScript into JavaScript, the same is not true for turning TypeScript into declaration files.
The reason is that TypeScript's inference allows us to write code without explicitly declaring types, meaning declaration emit can be complex.

Let's consider a simple example of a function that adds two imported variables.

```ts
// util.ts
export let one = "1";
export let two = "2";

// add.ts
import { one, two } from "./util";
export function add() { return one + two; }
```

Even if the only thing we want to do is generate `add.d.ts`, TypeScript needs to crawl into another imported file (`util.ts`), infer that the type of `one` and `two` are strings, and then calculate that the `+` operator on two strings will lead to a `string` return type.

```ts
// add.d.ts
export declare function add(): string;
```

While this inference is important for the developer experience, it means that tools that want to generate declaration files would need to replicate parts of the type-checker including inference and the ability to resolve module specifiers to follow the imports.

### Use-case: Parallel Declaration Emit and Parallel Checking

Imagine if you had a monorepo containing many projects and a multi-core CPU that just wished it could help you check your code faster.
Wouldn't it be great if we could check all those projects at the same time by running each project on a different core?

Unfortunately we don't have the freedom to do all the work in parallel.
The reason is that we have to build those projects in dependency order, because each project is checking against the declaration files of their dependencies.
So we must build the dependency first to generate the declaration files.
TypeScript's project references feature works the same way, building the set of projects in "topological" dependency order.

As an example, if we have two projects called `backend` and `frontend`, and they both depend on a project called `core`, TypeScript can't start type-checking either `frontend` or `backend` until `core` has been built and its declaration files have been generated.

![frontend and backend point to core, other stuff might point to each of those](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2024/04/5-5-beta-isolated-declarations-deps.png)

In the above graph, you can see that we have a bottleneck.
Whilst we can build `frontend` and `backend` in parallel, we need to first wait for `core` to finish building before either can start.

How could we improve upon this?
Well, if a fast tool could generate all those declaration files for `core` *in parallel*, TypeScript then could immediately follow that by type-checking `core`, `frontend`, and `backend` also *in parallel*.

### Solution: Explicit Types!

The common requirement in both use-cases is that we need a cross-file type-checker to generate declaration files.
Which is a lot to ask from the tooling community.

As a more complex example, if we want a declaration file for the following code...

```ts
import { add } from "./add";

const x = add();

export function foo() {
    return x;
}
```

...we would need to generate a signature for `foo`.
Well that requires looking at the implementation of `foo`.
`foo` just returns `x`, so getting the type of `x`  requires looking at the implementation of `add`.
But that might require looking at the implementation of `add`'s dependencies, and so on.
What we're seeing here is that generating declaration files requires a whole lot of logic to figure out the types of different places that might not even be local to the current file.

Still, for developers looking for fast iteration time and fully parallel builds, there is another way of thinking about this problem.
A declaration file only requires the types of the public API of a module - in other words, the types of the things that are exported.
If, controversially, developers are willing to explicitly write out the types of the things they export, tools could generate declaration files without needing to look at the implementation of the module - and without reimplementing a full type-checker.

This is where the new `--isolatedDeclarations` option comes in.
`--isolatedDeclarations` reports errors when a module can't be reliably transformed without a type-checker.
More plainly, it makes TypeScript report errors if you have a file that isn't sufficiently annotated on its exports.

That means in the above example, we would see an error like the following:

```ts
export function foo() {
//              ~~~
// error! Function must have an explicit
// return type annotation with --isolatedDeclarations.
    return x;
}
```

### Why are errors desirable?

Because it means that TypeScript can

1. Tell us up-front whether other tools will have issues with generating declaration files
2. Provide a quick fix to help add these missing annotations.

This mode doesn't require annotations *everywhere* though.
For locals, these can be ignored, since they don't affect the public API.
For example, the following code would **not** produce an error:

```ts
import { add } from "./add";

const x = add("1", "2"); // no error on 'x', it's not exported.

export function foo(): string {
    return x;
}
```

There are also certain expressions where the type is "trivial" to calculate.

```ts
// No error on 'x'.
// It's trivial to calculate the type is 'number'
export let x = 10;

// No error on 'y'.
// We can get the type from the return expression.
export function y() {
    return 20;
}

// No error on 'z'.
// The type assertion makes it clear what the type is.
export function z() {
    return Math.max(x, y()) as number;
}
```

### Using `isolatedDeclarations`

`isolatedDeclarations` requires that either the `declaration` or `composite` flags are also set.

Note that `isolatedDeclarations` does not change how TypeScript performs emit - just how it reports errors.
Importantly, and similar to `isolatedModules`, enabling the feature in TypeScript won't immediately bring about the potential benefits discussed here.
So please be patient and look forward to future developments in this space.
Keeping tool authors in mind, we should also recognize that today, not all of TypeScript's declaration emit can be easily replicated by other tools wanting to use it as a guide.
That's something we're actively working on improving.

On top of this, isolated declarations are still a new feature, and we're actively working on improving the experience.
Some scenarios, like using computed property declarations in classes and object literals, are not *yet* supported under `isolatedDeclarations`.
Keep an eye on this space, and feel free to provide us with feedback.

We also feel it is worth calling out that `isolatedDeclarations` should be adopted on a case-by-case basis.
There are some developer ergonomics that are lost when using `isolatedDeclarations`, and thus it may not be the right choice if your setup is not leveraging the two scenarios mentioned earlier.
For others, the work on `isolatedDeclarations` has already uncovered many optimizations and opportunities to unlock different parallel build strategies.
In the meantime, if you're willing to make the trade-offs, we believe `isolatedDeclarations` can be a powerful tool to speed up your build process once external tooling becomes available.

### Credit

Work on `isolatedDeclarations` has been a long-time collaborative effort between the TypeScript team and the infrastructure and tooling teams within Bloomberg and Google.
Individuals like Hana Joo from Google who implemented [the quick fix for isolated declaration errors](https://github.com/microsoft/TypeScript/pull/58260) (more on that soon), as well as Ashley Claymore, Jan Kühle, Lisa Velden, Rob Palmer, and Thomas Chetwin have been involved in discussion, specification, and implementation for many months.
But we feel it is specifically worth calling out the tremendous amount of work provided by [Titian Cernicova-Dragomir](https://github.com/dragomirtitian) from Bloomberg.
Titian has been instrumental in driving the implementation of `isolatedDeclarations` and has been a contributor to the TypeScript project for years prior.

While the feature involved many changes, you can see [the core work for Isolated Declarations here](https://github.com/microsoft/TypeScript/pull/58201).

## The `${configDir}` Template Variable for Configuration Files

It's common in many codebases to reuse a shared `tsconfig.json` file that acts as a "base" for other configuration files.
This is done by using the `extends` field in a `tsconfig.json` file.

```json
{
    "extends": "../../tsconfig.base.json",
    "compilerOptions": {
        "outDir": "./dist"
    }
}
```

One of the issues with this is that all paths in the `tsconfig.json` file are relative to the location of the file itself.
This means that if you have a shared `tsconfig.base.json` file that is used by multiple projects, relative paths often won't be useful in the derived projects.
For example, imagine the following `tsconfig.base.json`:

```json5
{
    "compilerOptions": {
        "typeRoots": [
            "./node_modules/@types"
            "./custom-types"
        ],
        "outDir": "dist"
    }
}
```

If author's intent was that every `tsconfig.json` that extends this file should

1. output to a `dist` directory relative to the derived `tsconfig.json` , and
1. have a `custom-types` directory relative to the derived `tsconfig.json`,

then this would not work.
The `typeRoots` paths would be relative to the location of the shared `tsconfig.base.json` file, not the project that extends it.
Each project that extends this shared file would need to declare its own `outDir` and `typeRoots` with identical contents.
This could be frustrating and hard to keep in sync between projects, and while the example above is using `typeRoots`, this is a common problem for `paths` and other options.

To solve this, TypeScript 5.5 introduces a new template variable `${configDir}`.
When `${configDir}` is written in certain path fields of a `tsconfig.json` or `jsconfig.json` files, this variable is substituted with the containing directory of the configuration file in a given compilation.
This means that the above `tsconfig.base.json` could be rewritten as:

```json5
{
    "compilerOptions": {
        "typeRoots": [
            "${configDir}/node_modules/@types"
            "${configDir}/custom-types"
        ],
        "outDir": "${configDir}/dist"
    }
}
```

Now, when a project extends this file, the paths will be relative to the derived `tsconfig.json`, not the shared `tsconfig.base.json` file.
This makes it easier to share configuration files across projects and ensures that the configuration files are more portable.

If you intend to make a `tsconfig.json` file extendable, consider if a `./` should instead be written with `${configDir}`.

For more information, see [the proposal issue](https://github.com/microsoft/TypeScript/issues/57485) and [the implementing pull request](https://github.com/microsoft/TypeScript/pull/58042).

## Consulting `package.json` Dependencies for Declaration File Generation

Previously, TypeScript would often issue an error message like

```
The inferred type of "X" cannot be named without a reference to "Y". This is likely not portable. A type annotation is necessary.
```

This was often due to TypeScript's declaration file generation finding itself in the contents of files that were never explicitly imported in a program.
Generating an import to such a file could be risky if the path ended up being relative.
Still, for codebases with explicit dependencies in the `dependencies` (or `peerDependencies` and `optionalDependencies`) of a `package.json`, generating such an import should be safe under certain resolution modes.
So in TypeScript 5.5, we're more lenient when that's the case, and many occurrences of this error should disappear.

[See this pull request](https://github.com/microsoft/TypeScript/issues/42873) for more details on the change.

## Editor and Watch-Mode Reliability Improvements

TypeScript has either added some new functionality or fixed existing logic that makes `--watch` mode and TypeScript's editor integration feel more reliable.
That should hopefully translate to fewer TSServer/editor restarts.

### Correctly Refresh Editor Errors in Configuration Files

TypeScript can generate errors for `tsconfig.json` files;
however, those errors are actually generated from loading a project, and editors typically don't directly request those errors for `tsconfig.json` files.
While this sounds like a technical detail, it means that when all errors issued in a `tsconfig.json` are fixed, TypeScript doesn't issue a new fresh empty set of errors, and users are left with stale errors unless they reload their editor.

TypeScript 5.5 now intentionally issues an event to clear these out.
[See more here](https://github.com/microsoft/TypeScript/pull/58120).

### Better Handling for Deletes Followed by Immediate Writes

Instead of overwriting files, some tools will opt to delete them and then create new files from scratch.
This is the case when running `npm ci`, for instance.

While this can be efficient for those tools, it can be problematic for TypeScript's editor scenarios where deleting a watched might dispose of it and all of its transitive dependencies.
Deleting and creating a file in quick succession could lead to TypeScript tearing down an entire project and then rebuilding it from scratch.

TypeScript 5.5 now has a more nuanced approach by keeping parts of a deleted project around until it picks up on a new creation event.
This should make operations like `npm ci` work a lot better with TypeScript.
See [more information on the approach here](https://github.com/microsoft/TypeScript/pull/57492).

### Symlinks are Tracked in Failed Resolutions

When TypeScript fails to resolve a module, it will still need to watch for any failed lookup paths in case the module is added later.
Previously this was not done for symlinked directories, which could cause reliability issues in monorepo-like scenarios when a build occurred in one project but was not witnessed in the other.
This should be fixed in TypeScript 5.5, and means you won't need to restart your editor as often.

[See more information here](https://github.com/microsoft/TypeScript/pull/58139).

### Project References Contribute to Auto-Imports

Auto-imports no longer requires at least one explicit import to dependent projects in a project reference setup.
Instead, auto-import completions should just work across anything you've listed in the `references` field of your `tsconfig.json`.

[See more on the implementing pull request](https://github.com/microsoft/TypeScript/pull/55955).

## Performance and Size Optimizations

### Monomorphized Objects in Language Service and Public API

In TypeScript 5.0, we ensured that our [`Node`](https://github.com/microsoft/TypeScript/pull/51682) and [`Symbol`](https://github.com/microsoft/TypeScript/pull/51880) objects had a consistent set of properties with a consistent initialization order.
Doing so helps reduce polymorphism in different operations, which allows runtimes to fetch properties more quickly.

By making this change, we witnessed impressive speed wins in the compiler;
however, most of these changes were performed on internal allocators for our data structures.
The language service, along with TypeScript's public API, uses a different set of allocators for certain objects.
This allowed the TypeScript compiler to be a bit leaner, as data used only for the language service would never be used in the compiler.

In TypeScript 5.5, the same monomorphization work has been done for the language service and public API.
What this means is that your editor experience, and any build tools that use the TypeScript API, will get a decent amount faster.
In fact, in our benchmarks, we've seen a **5-8% speedup in build times** when using the public TypeScript API's allocators, and **language service operations getting 10-20% faster**.
While this does imply an increase in memory, we believe that tradeoff is worth it and hope to find ways to reduce that memory overhead.
Things should feel a lot snappier now.

For more information, [see the change here](https://github.com/microsoft/TypeScript/pull/58045).

### Monomorphized Control Flow Nodes

In TypeScript 5.5, nodes of the control flow graph have been monomorphized so that they always hold a consistent shape.
By doing so, check times will often be reduced by about 1%.

[See this change here](https://github.com/microsoft/TypeScript/pull/57977).

### Optimizations on our Control Flow Graph

In many cases, control flow analysis will traverse nodes that don't provide any new information.
We observed that in the absence of any early termination or effects in the antecedents (or "dominators") of certain nodes meant that those nodes could always be skipped over.
As such, TypeScript now constructs its control flow graphs to take advantage of this by linking to an earlier node that *does* provide interesting information for control flow analysis.
This yields a flatter control flow graph, which can be more efficient to traverse.
This optimization has yielded modest gains, but with up to 2% reductions in build time on certain codebases.

You can [read more here](https://github.com/microsoft/TypeScript/pull/58013).

### Skipped Checking in `transpileModule` and `transpileDeclaration`

TypeScript's `transpileModule` API can be used for compiling a single TypeScript file's contents into JavaScript.
Similarly, the `transpileDeclaration` API (see below) can be used to generate a declaration file for a single TypeScript file.
One of the issues with these APIs is that TypeScript internally would perform a full type-checking pass over the entire contents of the file before emitting the output.
This was necessary to collect certain information which would later be used for the emit phase.

In TypeScript 5.5, we've found a way to avoid performing a full check, only lazily collecting this information as necessary, and `transpileModule` and `transpileDeclaration` both enable this functionality by default.
As a result, tools that integrate with with these APIs, like [ts-loader](https://www.npmjs.com/package/ts-loader) with `transpileOnly` and [ts-jest](https://www.npmjs.com/package/ts-jest), should see a noticeable speedup.
In our testing, [we generally witness around a 2x speed-up in build time using `transpileModule`](https://github.com/microsoft/TypeScript/pull/58364#issuecomment-2138580690).

### TypeScript Package Size Reduction

Further leveraging [our transition to modules in 5.0](https://devblogs.microsoft.com/typescript/typescripts-migration-to-modules/), we've significantly reduced TypeScript's overall package size [by making `tsserver.js` and `typingsInstaller.js` import from a common API library instead of having each of them produce standalone bundles](https://github.com/microsoft/TypeScript/pull/55326).

This reduces TypeScript's size on disk from 30.2 MB to 20.4 MB, and reduces its packed size from 5.5 MB to 3.7 MB!

### Node Reuse in Declaration Emit

As part of the work to enable `isolatedDeclarations`, we've substantially improved how often TypeScript can directly copy your input source code when producing declaration files.

For example, let's say you wrote

```ts
export const strBool: string | boolean = "hello";
export const boolStr: boolean | string = "world";
```

Note that the union types are equivalent, but the order of the union is different.
When emitting the declaration file, TypeScript has two equivalent output possibilities.

The first is to use a consistent canonical representation for each type:

```ts
export const strBool: string | boolean;
export const boolStr: string | boolean;
```

The second is to re-use the type annotations exactly as written:

```ts
export const strBool: string | boolean;
export const boolStr: boolean | string;
```

The second approach is generally preferable for a few reasons:

* Many equivalent representations still encode some level of intent that is better to preserve in the declaration file
* Producing a fresh representation of a type can be somewhat expensive, so avoiding is better
* User-written types are usually shorter than generated type representations

In 5.5, we've greatly improved the number of places where TypeScript can correctly identify places where it's safe and correct to print back types exactly as they were written in the input file.
Many of these cases are invisible performance improvements - TypeScript would generate fresh sets of syntax nodes and serialize them into a string.
Instead, TypeScript can now operate over the original syntax nodes directly, which is much cheaper and faster.

### Caching Contextual Types from Discriminated Unions

When TypeScript asks for the contextual type of an expression like an object literal, it will often encounter a union type.
In those cases, TypeScript tries to filter out members of the union based on known properties with well known values (i.e. discriminant properties).
This work can be fairly expensive, especially if you end up with an object consisting of many many properties.
In TypeScript 5.5, [much of the computation is cached once so that TypeScript doesn't need to recompute it for every property in the object literal](https://github.com/microsoft/TypeScript/pull/58372).
Performing this optimization shaved 250ms off of compiling the TypeScript compiler itself.

## Easier API Consumption from ECMAScript Modules

Previously, if you were writing an ECMAScript module in Node.js, named imports were not available from the `typescript` package.

```ts
import { createSourceFile } from "typescript"; // ❌ error

import * as ts from "typescript";
ts.createSourceFile // ❌ undefined???

ts.default.createSourceFile // ✅ works - but ugh!
```

This is because [cjs-module-lexer](https://github.com/nodejs/cjs-module-lexer) did not recognize the pattern of TypeScript's generated CommonJS code.
This has been fixed, and users can now use named imports from the TypeScript npm package with ECMAScript modules in Node.js.

```ts
import { createSourceFile } from "typescript"; // ✅ works now!

import * as ts from "typescript";
ts.createSourceFile // ✅ works now!
```

For more information, [see the change here](https://github.com/microsoft/TypeScript/pull/57133).

## The `transpileDeclaration` API

TypeScript's API exposes a function called `transpileModule`.
It's intended to make it easy to compile a single file of TypeScript code.
Because it doesn't have access to an entire *program*, the caveat is that it may not produce the right output if the code violates any errors under the `isolatedModules` option.

In TypeScript 5.5, we've added a new similar API called `transpileDeclaration`.
This API is similar to `transpileModule`, but it's specifically designed to generate a single *declaration file* based on some input source text.
Just like `transpileModule`, it doesn't have access to a full program, and a similar caveat applies: it only generates an accurate declaration file if the input code is free of errors under the new `isolatedDeclarations` option.

If desired, this function can be used to parallelize declaration emit across all files under `isolatedDeclarations` mode.

For more information, [see the implementation here](https://github.com/microsoft/TypeScript/pull/58261).

## Notable Behavioral Changes

This section highlights a set of noteworthy changes that should be acknowledged and understood as part of any upgrade.
Sometimes it will highlight deprecations, removals, and new restrictions.
It can also contain bug fixes that are functionally improvements, but which can also affect an existing build by introducing new errors.

### Disabling Features Deprecated in TypeScript 5.0

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

To continue using the deprecated options above, developers using TypeScript 5.0 and other more recent versions have had to specify a new option called `ignoreDeprecations` with the value `"5.0"`.

In TypeScript 5.5, these options no longer have any effect.
To help with a smooth upgrade path, you may still specify them in your tsconfig, but these will be an error to specify in TypeScript 6.0.
See also the [Flag Deprecation Plan](https://github.com/microsoft/TypeScript/issues/51000) which outlines our deprecation strategy.

[More information around these deprecation plans is available on GitHub](https://github.com/microsoft/TypeScript/issues/51909), which contains suggestions in how to best adapt your codebase.

### `lib.d.ts` Changes

Types generated for the DOM may have an impact on type-checking your codebase.
For more information, [see the DOM updates for TypeScript 5.5](https://github.com/microsoft/TypeScript/pull/58211).

### Respecting File Extensions and `package.json` in Other Module Modes

Before Node.js implemented support for ECMAScript modules in v12, there was never a good way for TypeScript to know whether `.d.ts` files it found in `node_modules` represented JavaScript files authored as CommonJS or ECMAScript modules.
When the vast majority of npm was CommonJS-only, this didn't cause many problems - if in doubt, TypeScript could just assume that everything behaved like CommonJS.
Unfortunately, if that assumption was wrong it could allow unsafe imports:

```ts
// node_modules/dep/index.d.ts
export declare function doSomething(): void;

// index.ts
// Okay if "dep" is a CommonJS module, but fails if
// it's an ECMAScript module - even in bundlers!
import dep from "dep";
dep.doSomething();
```

In practice, this didn't come up very often.
But in the years since Node.js started supporting ECMAScript modules, the share of ESM on npm has grown.
Fortunately, Node.js also introduced a mechanism that can help TypeScript determine if a file is an ECMAScript module or a CommonJS module: the `.mjs` and `.cjs` file extensions and the `package.json` `"type"` field.
TypeScript 4.7 added support for understanding these indicators, as well as authoring `.mts` and `.cts` files;
however, TypeScript would *only* read those indicators under `--module node16` and `--module nodenext`, so the unsafe import above was still a problem for anyone using `--module esnext` and `--moduleResolution bundler`, for example.

To solve this, TypeScript 5.5 reads and stores module format information encoded by file extensions and `package.json` `"type"` in *all* `module` modes, and uses it to resolve ambiguities like the one in the example above in all modes (except for `amd`, `umd`, and `system`).

A secondary effect of respecting this format information is that the format-specific TypeScript file extensions (`.mts` and `.cts`) or an explicitly set package.json `"type"` in your own project will *override* your `--module` option if it's set to `commonjs` or `es2015` through `esnext`.
Previously, it was technically possible to produce CommonJS output into a `.mjs` file or vice versa:

```ts
// main.mts
export default "oops";

// $ tsc --module commonjs main.mts
// main.mjs
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = "oops";
```

Now, `.mts` files (or `.ts` files in scope of a `package.json` with `"type": "module"`) never emit CommonJS output, and `.cts` files (or `.ts` files in scope of a package.json with `"type": "commonjs"`) never emit ESM output.

More details are available [on the change here](https://github.com/microsoft/TypeScript/pull/57896).

### Stricter Parsing for Decorators

Since TypeScript originally introduced support for decorators, the specified grammar for the proposal has been tightened up.
TypeScript is now stricter about what forms it allows.
While rare, existing decorators may need to be parenthesized to avoid errors.

```ts
class DecoratorProvider {
    decorate(...args: any[]) { }
}

class D extends DecoratorProvider {
    m() {
        class C {
            @super.decorate // ❌ error
            method1() { }

            @(super.decorate) // ✅ okay
            method2() { }
        }
    }
}
```

See [more information on the change here](https://github.com/microsoft/TypeScript/pull/57749).

### `undefined` is No Longer a Definable Type Name

TypeScript has always disallowed type alias names that conflict with built-in types:

```ts
// Illegal
type null = any;
// Illegal
type number = any;
// Illegal
type object = any;
// Illegal
type any = any;
```

Due to a bug, this logic didn't also apply to the built-in type `undefined`.
In 5.5, this is now correctly identified as an error:

```ts
// Now also illegal
type undefined = any;
```

Bare references to type aliases named `undefined` never actually worked in the first place.
You could define them, but you couldn't use them as an unqualified type name.

```ts
export type undefined = string;
export const m: undefined = "";
//           ^
// Errors in 5.4 and earlier - the local definition of 'undefined' was not even consulted.
```

For more information, [see the change here](https://github.com/microsoft/TypeScript/pull/57575).

### Simplified Reference Directive Declaration Emit

When producing a declaration file, TypeScript would synthesize a reference directive when it believed one was required.
For example, all Node.js modules are declared ambiently, so cannot be loaded by module resolution alone.
A file like:

```tsx
import path from "path";
export const myPath = path.parse(__filename);
```

Would emit a declaration file like:

```tsx
/// <reference types="node" />
import path from "path";
export declare const myPath: path.ParsedPath;
```

Even though the reference directive never appeared in the original source.

Similarly, TypeScript also *removed* reference directives that it did not believe needed to be a part of the output.
For example, let's imagine we had a reference directive to `jest`;
however, imagine the reference directive isn't necessary to generate the declaration file.
TypeScript would simply drop it.
So in the following example:

```tsx
/// <reference types="jest" />
import path from "path";
export const myPath = path.parse(__filename);
```

TypeScript would still emit:

```tsx
/// <reference types="node" />
import path from "path";
export declare const myPath: path.ParsedPath;
```

In the course of working on `isolatedDeclarations`, we realized that this logic was untenable for anyone attempting to implement a declaration emitter without type checking or using more than a single file's context.
This behavior is also hard to understand from a user's perspective; whether or not a reference directive appeared in the emitted file seems inconsistent and difficult to predict unless you understand exactly what's going on during typechecking.
To prevent declaration emit from being different when `isolatedDeclarations` was enabled, we knew that our emit needed to change.

Through [experimentation](https://github.com/microsoft/TypeScript/pull/57569), we found that nearly all cases where TypeScript synthesized reference directives were just to pull in `node` or `react`.
These are cases where the expectation is that a downstream user already references those types through tsconfig.json `"types"` or library imports, so no longer synthesizing these reference directives would be unlikely to break anyone.
It's worth noting that this is already how it works for `lib.d.ts`; TypeScript doesn't synthesize a reference to `lib="es2015"` when a module exports a `WeakMap`, instead assuming that a downstream user will have included that as part of their environment.

For reference directives that had been written by library authors (not synthesized), [further experimentation](https://github.com/microsoft/TypeScript/pull/57656) showed that nearly all were removed, never showing up in the output.
Most reference directives that were preserved were broken and likely not intended to be preserved.

Given those results, we decided to greatly simplfy reference directives in declaration emit in TypeScript 5.5.
A more consistent strategy will help library authors and consumers have better control of their declaration files.

Reference directives are no longer synthesized.
User-written reference directives are no longer preserved, unless annotated with a new `preserve="true"` attribute.
Concretely, an input file like:

```tsx
/// <reference types="some-lib" preserve="true" />
/// <reference types="jest" />
import path from "path";
export const myPath = path.parse(__filename);
```

will emit:

```tsx
/// <reference types="some-lib" preserve="true" />
import path from "path";
export declare const myPath: path.ParsedPath;
```

Adding `preserve="true"` is backwards compatible with older versions of TypeScript as unknown attributes are ignored.

This change also improved performance; in our benchmarks, the emit stage saw a 1-4% improvement in projects with declaration emit enabled.
