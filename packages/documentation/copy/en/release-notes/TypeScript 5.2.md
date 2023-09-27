---
title: TypeScript 5.2
layout: docs
permalink: /docs/handbook/release-notes/typescript-5-2.html
oneline: TypeScript 5.2 Release Notes
---

## `using` Declarations and Explicit Resource Management

TypeScript 5.2 adds support for the upcoming [Explicit Resource Management](https://github.com/tc39/proposal-explicit-resource-management) feature in ECMAScript.
Let's explore some of the motivations and understand what the feature brings us.

It's common to need to do some sort of "clean-up" after creating an object.
For example, you might need to close network connections, delete temporary files, or just free up some memory.

Let's imagine a function that creates a temporary file, reads and writes to it for various operations, and then closes and deletes it.

```ts
import * as fs from "fs";

export function doSomeWork() {
    const path = ".some_temp_file";
    const file = fs.openSync(path, "w+");

    // use file...

    // Close the file and delete it.
    fs.closeSync(file);
    fs.unlinkSync(path);
}
```

This is fine, but what happens if we need to perform an early exit?

```ts
export function doSomeWork() {
    const path = ".some_temp_file";
    const file = fs.openSync(path, "w+");

    // use file...
    if (someCondition()) {
        // do some more work...

        // Close the file and delete it.
        fs.closeSync(file);
        fs.unlinkSync(path);
        return;
    }

    // Close the file and delete it.
    fs.closeSync(file);
    fs.unlinkSync(path);
}
```

We're starting to see some duplication of clean-up which can be easy to forget.
We're also not guaranteed to close and delete the file if an error gets thrown.
This could be solved by wrapping this all in a `try`/`finally` block.

```ts
export function doSomeWork() {
    const path = ".some_temp_file";
    const file = fs.openSync(path, "w+");

    try {
        // use file...

        if (someCondition()) {
            // do some more work...
            return;
        }
    }
    finally {
        // Close the file and delete it.
        fs.closeSync(file);
        fs.unlinkSync(path);
    }
}
```

While this is more robust, it's added quite a bit of "noise" to our code.
There are also other foot-guns we can run into if we start adding more clean-up logic to our `finally` block — for example, exceptions preventing other resources from being disposed.
This is what the [explicit resource management](https://github.com/tc39/proposal-explicit-resource-management) proposal aims to solve.
The key idea of the proposal is to support resource disposal — this clean-up work we're trying to deal with — as a first class idea in JavaScript.

This starts by adding a new built-in `symbol` called `Symbol.dispose`, and we can create objects with methods named by `Symbol.dispose`.
For convenience, TypeScript defines a new global type called `Disposable` which describes these.

```ts
class TempFile implements Disposable {
    #path: string;
    #handle: number;

    constructor(path: string) {
        this.#path = path;
        this.#handle = fs.openSync(path, "w+");
    }

    // other methods

    [Symbol.dispose]() {
        // Close the file and delete it.
        fs.closeSync(this.#handle);
        fs.unlinkSync(this.#path);
    }
}
```

Later on we can call those methods.

```ts
export function doSomeWork() {
    const file = new TempFile(".some_temp_file");

    try {
        // ...
    }
    finally {
        file[Symbol.dispose]();
    }
}
```

Moving the clean-up logic to `TempFile` itself doesn't buy us much;
we've basically just moved all the clean-up work from the `finally` block into a method, and that's always been possible.
But having a well-known "name" for this method means that JavaScript can build other features on top of it.

That brings us to the first star of the feature: `using` declarations!
`using` is a new keyword that lets us declare new fixed bindings, kind of like `const`.
The key difference is that variables declared with `using` get their `Symbol.dispose` method called at the end of the scope!

So we could simply have written our code like this:

```ts
export function doSomeWork() {
    using file = new TempFile(".some_temp_file");

    // use file...

    if (someCondition()) {
        // do some more work...
        return;
    }
}
```

Check it out — no `try`/`finally` blocks!
At least, none that we see.
Functionally, that's exactly what `using` declarations will do for us, but we don't have to deal with that.

You might be familiar with [`using` declarations in C#](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/proposals/csharp-8.0/using), [`with` statements in Python](https://docs.python.org/3/reference/compound_stmts.html#the-with-statement), or [`try`-with-resource declarations in Java](https://docs.oracle.com/javase/tutorial/essential/exceptions/tryResourceClose.html).
These are all similar to JavaScript's new `using` keyword, and provide a similar explicit way to perform a "tear-down" of an object at the end of a scope.

`using` declarations do this clean-up at the very end of their containing scope or right before an "early return" like a `return` or a `throw`n error.
They also dispose in a first-in-last-out order like a stack.

```ts
function loggy(id: string): Disposable {
    console.log(`Creating ${id}`);

    return {
        [Symbol.dispose]() {
            console.log(`Disposing ${id}`);
        }
    }
}

function func() {
    using a = loggy("a");
    using b = loggy("b");
    {
        using c = loggy("c");
        using d = loggy("d");
    }
    using e = loggy("e");
    return;

    // Unreachable.
    // Never created, never disposed.
    using f = loggy("f");
}

func();
// Creating a
// Creating b
// Creating c
// Creating d
// Disposing d
// Disposing c
// Creating e
// Disposing e
// Disposing b
// Disposing a
```

`using` declarations are supposed to be resilient to exceptions;
if an error is thrown, it's rethrown after disposal.
On the other hand, the body of your function might execute as expected, but the `Symbol.dispose` might throw.
In that case, that exception is rethrown as well.

But what happens if both the logic before and during disposal throws an error?
For those cases, `SuppressedError` has been introduced as a new subtype of `Error`.
It features a `suppressed` property that holds the last-thrown error, and an `error` property for the most-recently thrown error.

```ts
class ErrorA extends Error {
    name = "ErrorA";
}
class ErrorB extends Error {
    name = "ErrorB";
}

function throwy(id: string) {
    return {
        [Symbol.dispose]() {
            throw new ErrorA(`Error from ${id}`);
        }
    };
}

function func() {
    using a = throwy("a");
    throw new ErrorB("oops!")
}

try {
    func();
}
catch (e: any) {
    console.log(e.name); // SuppressedError
    console.log(e.message); // An error was suppressed during disposal.

    console.log(e.error.name); // ErrorA
    console.log(e.error.message); // Error from a

    console.log(e.suppressed.name); // ErrorB
    console.log(e.suppressed.message); // oops!
}
```

You might have noticed that we're using synchronous methods in these examples.
However, lots of resource disposal involves *asynchronous* operations, and we need to wait for those to complete before we continue running any other code.

That's why there is also a new `Symbol.asyncDispose`, and it brings us to the next star of the show — `await using` declarations.
These are similar to `using` declarations, but the key is that they look up whose disposal must be `await`ed.
They use a different method named by `Symbol.asyncDispose`, though they can operate on anything with a `Symbol.dispose` as well.
For convenience, TypeScript also introduces a global type called `AsyncDisposable` that describes any object with an asynchronous dispose method.

```ts
async function doWork() {
    // Do fake work for half a second.
    await new Promise(resolve => setTimeout(resolve, 500));
}

function loggy(id: string): AsyncDisposable {
    console.log(`Constructing ${id}`);
    return {
        async [Symbol.asyncDispose]() {
            console.log(`Disposing (async) ${id}`);
            await doWork();
        },
    }
}

async function func() {
    await using a = loggy("a");
    await using b = loggy("b");
    {
        await using c = loggy("c");
        await using d = loggy("d");
    }
    await using e = loggy("e");
    return;

    // Unreachable.
    // Never created, never disposed.
    await using f = loggy("f");
}

func();
// Constructing a
// Constructing b
// Constructing c
// Constructing d
// Disposing (async) d
// Disposing (async) c
// Constructing e
// Disposing (async) e
// Disposing (async) b
// Disposing (async) a
```

Defining types in terms of `Disposable` and `AsyncDisposable` can make your code much easier to work with if you expect others to do tear-down logic consistently.
In fact, lots of existing types exist in the wild which have a `dispose()` or `close()` method.
For example, the Visual Studio Code APIs even define [their own `Disposable` interface](https://code.visualstudio.com/api/references/vscode-api#Disposable).
APIs in the browser and in runtimes like Node.js, Deno, and Bun might also choose to use `Symbol.dispose` and `Symbol.asyncDispose` for objects which already have clean-up methods, like file handles, connections, and more.

Now maybe this all sounds great for libraries, but a little bit heavy-weight for your scenarios.
If you're doing a lot of ad-hoc clean-up, creating a new type might introduce a lot of over-abstraction and questions about best-practices.
For example, take our `TempFile` example again.

```ts
class TempFile implements Disposable {
    #path: string;
    #handle: number;

    constructor(path: string) {
        this.#path = path;
        this.#handle = fs.openSync(path, "w+");
    }

    // other methods

    [Symbol.dispose]() {
        // Close the file and delete it.
        fs.closeSync(this.#handle);
        fs.unlinkSync(this.#path);
    }
}

export function doSomeWork() {
    using file = new TempFile(".some_temp_file");

    // use file...

    if (someCondition()) {
        // do some more work...
        return;
    }
}
```

All we wanted was to remember to call two functions — but was this the best way to write it?
Should we be calling `openSync` in the constructor, create an `open()` method, or pass in the handle ourselves?
Should we expose a method for every possible operation we need to perform, or should we just make the properties public?

That brings us to the final stars of the feature: `DisposableStack` and `AsyncDisposableStack`.
These objects are useful for doing both one-off clean-up, along with arbitrary amounts of cleanup.
A `DisposableStack` is an object that has several methods for keeping track of `Disposable` objects, and can be given functions for doing arbitrary clean-up work.
We can also assign them to `using` variables because — get this &mdash; *they're also `Disposable`*!
So here's how we could've written the original example.

```ts
function doSomeWork() {
    const path = ".some_temp_file";
    const file = fs.openSync(path, "w+");

    using cleanup = new DisposableStack();
    cleanup.defer(() => {
        fs.closeSync(file);
        fs.unlinkSync(path);
    });

    // use file...

    if (someCondition()) {
        // do some more work...
        return;
    }

    // ...
}
```

Here, the `defer()` method just takes a callback, and that callback will be run once `cleanup` is disposed of.
Typically, `defer` (and other `DisposableStack` methods like `use` and `adopt`) 
should be called immediately after creating a resource.
As the name suggests, `DisposableStack` disposes of everything it keeps track of like a stack, in a first-in-last-out order, so `defer`ing immediately after creating a value helps avoid odd dependency issues.
`AsyncDisposableStack` works similarly, but can keep track of `async` functions and `AsyncDisposable`s, and is itself an `AsyncDisposable.`

The `defer` method is similar in many ways to the `defer` keyword in [Go](https://go.dev/tour/flowcontrol/12), [Swift](https://docs.swift.org/swift-book/documentation/the-swift-programming-language/statements/#Defer-Statement), [Zig](https://ziglang.org/documentation/master/#defer), [Odin](https://odin-lang.org/docs/overview/#defer-statement), and others, where the conventions should be similar.

Because this feature is so recent, most runtimes will not support it natively.
To use it, you will need runtime polyfills for the following:

* `Symbol.dispose`
* `Symbol.asyncDispose`
* `DisposableStack`
* `AsyncDisposableStack`
* `SuppressedError`

However, if all you're interested in is `using` and `await using`, you should be able to get away with only polyfilling the built-in `symbol`s.
Something as simple as the following should work for most cases:

```ts
Symbol.dispose ??= Symbol("Symbol.dispose");
Symbol.asyncDispose ??= Symbol("Symbol.asyncDispose");
```

You will also need to set your compilation `target` to `es2022` or below, and configure your `lib` setting to either include `"esnext"` or `"esnext.disposable"`.

```json
{
    "compilerOptions": {
        "target": "es2022",
        "lib": ["es2022", "esnext.disposable", "dom"]
    }
}
```

For more information on this feature, [take a look at the work on GitHub](https://github.com/microsoft/TypeScript/pull/54505)!

## Decorator Metadata

TypeScript 5.2 implements [an upcoming ECMAScript feature called decorator metadata](https://github.com/tc39/proposal-decorator-metadata).

The key idea of this feature is to make it easy for decorators to create and consume metadata on any class they're used on or within.

Whenever decorator functions are used, they now have access to a new `metadata` property on their context object.
The `metadata` property just holds a simple object.
Since JavaScript lets us add properties arbitrarily, it can be used as a dictionary that is updated by each decorator.
Alternatively, since every `metadata` object will be identical for each decorated portion of a class, it can be used as a key into a `Map`.
After all decorators on or in a class get run, that object can be accessed on the class via `Symbol.metadata`.

```ts
interface Context {
    name: string;
    metadata: Record<PropertyKey, unknown>;
}

function setMetadata(_target: any, context: Context) {
    context.metadata[context.name] = true;
}

class SomeClass {
    @setMetadata
    foo = 123;

    @setMetadata
    accessor bar = "hello!";

    @setMetadata
    baz() { }
}

const ourMetadata = SomeClass[Symbol.metadata];

console.log(JSON.stringify(ourMetadata));
// { "bar": true, "baz": true, "foo": true }
```

This can be useful in a number of different scenarios.
Metadata could possibly be attached for lots of uses like debugging, serialization, or performing dependency injection with decorators.
Since metadata objects are created per decorated class, frameworks can either privately use them as keys into a `Map` or `WeakMap`, or tack properties on as necessary.

For example, let's say we wanted to use decorators to keep track of which properties and accessors are serializable when using `JSON.stringify` like so:

```ts
import { serialize, jsonify } from "./serializer";

class Person {
    firstName: string;
    lastName: string;

    @serialize
    age: number

    @serialize
    get fullName() {
        return `${this.firstName} ${this.lastName}`;
    }

    toJSON() {
        return jsonify(this)
    }

    constructor(firstName: string, lastName: string, age: number) {
        // ...
    }
}
```

Here, the intent is that only `age` and `fullName` should be serialized because they are marked with the `@serialize` decorator.
We define a `toJSON` method for this purpose, but it just calls out to `jsonify` which uses the metadata that `@serialize` created.

Here's an example of how the module `./serialize.ts` might be defined:

```ts
const serializables = Symbol();

type Context =
    | ClassAccessorDecoratorContext
    | ClassGetterDecoratorContext
    | ClassFieldDecoratorContext
    ;

export function serialize(_target: any, context: Context): void {
    if (context.static || context.private) {
        throw new Error("Can only serialize public instance members.")
    }
    if (typeof context.name === "symbol") {
        throw new Error("Cannot serialize symbol-named properties.");
    }

    const propNames =
        (context.metadata[serializables] as string[] | undefined) ??= [];
    propNames.push(context.name);
}

export function jsonify(instance: object): string {
    const metadata = instance.constructor[Symbol.metadata];
    const propNames = metadata?.[serializables] as string[] | undefined;
    if (!propNames) {
        throw new Error("No members marked with @serialize.");
    }

    const pairStrings = propNames.map(key => {
        const strKey = JSON.stringify(key);
        const strValue = JSON.stringify((instance as any)[key]);
        return `${strKey}: ${strValue}`;
    });

    return `{ ${pairStrings.join(", ")} }`;
}
```

This module has a local `symbol` called `serializables` to store and retrieve the names of properties marked `@serializable`.
It stores a list of these property names on the metadata on each invocation of `@serializable`.
When `jsonify` is called, the list of properties is fetched off of the metadata and used to retrieve the actual values from the instance, eventually serializing those names and values.

Using a `symbol` technically makes this data accessible to others.
An alternative might be to use a `WeakMap` using the metadata object as a key.
This keeps data private and happens to use fewer type assertions in this case, but is otherwise similar.

```ts
const serializables = new WeakMap<object, string[]>();

type Context =
    | ClassAccessorDecoratorContext
    | ClassGetterDecoratorContext
    | ClassFieldDecoratorContext
    ;

export function serialize(_target: any, context: Context): void {
    if (context.static || context.private) {
        throw new Error("Can only serialize public instance members.")
    }
    if (typeof context.name !== "string") {
        throw new Error("Can only serialize string properties.");
    }

    let propNames = serializables.get(context.metadata);
    if (propNames === undefined) {
        serializables.set(context.metadata, propNames = []);
    }
    propNames.push(context.name);
}

export function jsonify(instance: object): string {
    const metadata = instance.constructor[Symbol.metadata];
    const propNames = metadata && serializables.get(metadata);
    if (!propNames) {
        throw new Error("No members marked with @serialize.");
    }
    const pairStrings = propNames.map(key => {
        const strKey = JSON.stringify(key);
        const strValue = JSON.stringify((instance as any)[key]);
        return `${strKey}: ${strValue}`;
    });

    return `{ ${pairStrings.join(", ")} }`;
}
```

As a note, these implementations don't handle subclassing and inheritance.
That's left as an exercise to you (and you might find that it is easier in one version of the file than the other!).

Because this feature is still fresh, most runtimes will not support it natively.
To use it, you will need a polyfill for `Symbol.metadata`.
Something as simple as the following should work for most cases:

```ts
Symbol.metadata ??= Symbol("Symbol.metadata");
```

You will also need to set your compilation `target` to `es2022` or below, and configure your `lib` setting to either include `"esnext"` or `"esnext.decorators"`.

```json
{
    "compilerOptions": {
        "target": "es2022",
        "lib": ["es2022", "esnext.decorators", "dom"]
    }
}
```

We'd like to thank [Oleksandr Tarasiuk](https://github.com/a-tarasyuk) for contributing [the implementation of decorator metadata](https://github.com/microsoft/TypeScript/pull/54657) for TypeScript 5.2!

<!-- TODO: Why is there a conditional type around the existence of `Symbol.metadata`? -->

## Named and Anonymous Tuple Elements

Tuple types have supported optional labels or names for each element.

```ts
type Pair<T> = [first: T, second: T];
```

These labels don't change what you're allowed to do with them — they're solely to help with readability and tooling.

However, TypeScript previously had a rule that tuples could not mix and match between labeled and unlabeled elements.
In other words, either no element could have a label in a tuple, or all elements needed one.

```ts
// ✅ fine - no labels
type Pair1<T> = [T, T];

// ✅ fine - all fully labeled
type Pair2<T> = [first: T, second: T];

// ❌ previously an error
type Pair3<T> = [first: T, T];
//                         ~
// Tuple members must all have names
// or all not have names.
```

This could be annoying for rest elements where we'd be forced to just add a label like `rest` or `tail`.

```ts
// ❌ previously an error
type TwoOrMore_A<T> = [first: T, second: T, ...T[]];
//                                          ~~~~~~
// Tuple members must all have names
// or all not have names.

// ✅
type TwoOrMore_B<T> = [first: T, second: T, rest: ...T[]];
```

It also meant that this restriction had to be enforced internally in the type system, meaning TypeScript would lose labels.

```ts
type HasLabels = [a: string, b: string];
type HasNoLabels = [number, number];
type Merged = [...HasNoLabels, ...HasLabels];
//   ^ [number, number, string, string]
//
//     'a' and 'b' were lost in 'Merged'
```

In TypeScript 5.2, the all-or-nothing restriction on tuple labels has been lifted.
The language can now also preserve labels when spreading into an unlabeled tuple.

We'd like to extend our thanks to [Josh Goldberg](https://github.com/JoshuaKGoldberg) and [Mateusz Burzyński](https://github.com/Andarist) who [collaborated to lift this restriction](https://github.com/microsoft/TypeScript/pull/53356).

## Easier Method Usage for Unions of Arrays

In previous versions on TypeScript, calling a method on a union of arrays could end in pain.

```ts
declare let array: string[] | number[];

array.filter(x => !!x);
//    ~~~~~~ error!
// This expression is not callable.
//   Each member of the union type '...' has signatures,
//   but none of those signatures are compatible
//   with each other.
```

In this example, TypeScript would try to see if each version of `filter` is compatible across `string[]` and `number[]`.
Without a coherent strategy, TypeScript threw its hands in the air and said "I can't make it work".

In TypeScript 5.2, before giving up in these cases, unions of arrays are treated as a special case.
A new array type is constructed out of each member's element type, and then the method is invoked on that.

Taking the above example, `string[] | number[]` is transformed into `(string | number)[]` (or `Array<string | number>`), and `filter` is invoked on that type.
There is a slight caveat which is that `filter` will produce an `Array<string | number>` instead of a `string[] | number[]`;
but for a freshly produced value there is less risk of something "going wrong".

This means lots of methods like `filter`, `find`, `some`, `every`, and `reduce` should all be invokable on unions of arrays in cases where they were not previously.

You can [read up more details on the implementing pull request](https://github.com/microsoft/TypeScript/pull/53489).

## Type-Only Import Paths with TypeScript Implementation File Extensions

TypeScript now allows both declaration *and* implementation file extensions to be included in type-only import paths, regardless of whether `allowImportingTsExtensions` is enabled.

This means that you can now write `import type` statements that use `.ts`, `.mts`, `.cts`, and `.tsx` file extensions.

```ts
import type { JustAType } from "./justTypes.ts";

export function f(param: JustAType) {
    // ...
}
```

It also means that `import()` types, which can be used in both TypeScript and JavaScript with JSDoc, can use those file extensions.

```js
/**
 * @param {import("./justTypes.ts").JustAType} param
 */
export function f(param) {
    // ...
}
```

For more information, [see the change here](https://github.com/microsoft/TypeScript/pull/54746).

## Comma Completions for Object Members

It can be easy to forget to add a comma when adding a new property to an object.
Previously, if you forgot a comma and requested auto-completion, TypeScript would confusingly give poor unrelated completion results.

TypeScript 5.2 now gracefully provides object member completions when you're missing a comma.
But to just skip past hitting you with a syntax error, it will *also* auto-insert the missing comma.

![Properties in an object literal are completed despite missing a comma after a prior property. When the property name is completed, the missing comma is automatically inserted.](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2023/06/comma-completions-5-2-beta.gif)

For more information, [see the implementation here](https://github.com/microsoft/TypeScript/pull/52899).

## Inline Variable Refactoring

TypeScript 5.2 now has a refactoring to inline the contents of a variable to all usage sites.

![A variable called 'path' initialized to a string, having both of its usages replaced](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2023/06/inline-variable-5-2-beta.gif).

Using the "inline variable" refactoring will eliminate the variable and replace all the variable's usages with its initializer.
Note that this may cause that initializer's side-effects to run at a different time, and as many times as the variable has been used.

For more details, [see the implementing pull request](https://github.com/microsoft/TypeScript/pull/54281).

<!-- Inlay Parameter Hints -->

## Optimized Checks for Ongoing Type Compatibility

Because TypeScript is a structural type system, types occasionally need to be compared in a member-wise fashion;
however, recursive types add some issues here.
For example:

```ts
interface A {
    value: A;
    other: string;
}

interface B {
    value: B;
    other: number;
}
```

When checking whether the type `A` is compatible with the type `B`, TypeScript will end up checking whether the types of `value` in `A` and `B` are respectively compatible.
At this point, the type system needs to stop checking any further and proceed to check other members.
To do this, the type system has to track when any two types are already being related.

Previously TypeScript already kept a stack of type pairs, and iterated through that to determine whether those types are being related.
When this stack is shallow that's not a problem; but when the stack isn't shallow, that, uh, [is a problem](https://accidentallyquadratic.tumblr.com/).

In TypeScript 5.3, a simple `Set` helps tracks this information.
This reduced the time spent on a reported test case that used the [drizzle](https://github.com/drizzle-team/drizzle-orm) library by over 33%!

```
Benchmark 1: old
  Time (mean ± σ):      3.115 s ±  0.067 s    [User: 4.403 s, System: 0.124 s]
  Range (min … max):    3.018 s …  3.196 s    10 runs
 
Benchmark 2: new
  Time (mean ± σ):      2.072 s ±  0.050 s    [User: 3.355 s, System: 0.135 s]
  Range (min … max):    1.985 s …  2.150 s    10 runs
 
Summary
  'new' ran
    1.50 ± 0.05 times faster than 'old'
```

[Read more on the change here](https://github.com/microsoft/TypeScript/pull/55224).

## Breaking Changes and Correctness Fixes

TypeScript strives not to unnecessarily introduce breaks;
however, occasionally we must make corrections and improvements so that code can be better-analyzed.

### `lib.d.ts` Changes

Types generated for the DOM may have an impact on your codebase.
For more information, [see the DOM updates for TypeScript 5.2](https://github.com/microsoft/TypeScript/pull/54725).

### `labeledElementDeclarations` May Hold `undefined` Elements

In order [to support a mixture of labeled and unlabeled elements](https://github.com/microsoft/TypeScript/pull/53356), TypeScript's API has changed slightly.
The `labeledElementDeclarations` property of `TupleType` may hold `undefined` for at each position where an element is unlabeled.

```diff
  interface TupleType {
-     labeledElementDeclarations?: readonly (NamedTupleMember | ParameterDeclaration)[];
+     labeledElementDeclarations?: readonly (NamedTupleMember | ParameterDeclaration | undefined)[];
  }
```

### `module` and `moduleResolution` Must Match Under Recent Node.js settings

The `--module` and `--moduleResolution` options each support a `node16` and `nodenext` setting.
These are effectively "modern Node.js" settings that should be used on any recent Node.js project.
What we've found is that when these two options don't agree on whether they are using Node.js-related settings, projects are effectively misconfigured.

In TypeScript 5.2, when using `node16` or `nodenext` for either of the `--module` and `--moduleResolution` options, TypeScript now requires the other to have a similar Node.js-related setting.
In cases where the settings diverge, you'll likely get an error message like either

```
Option 'moduleResolution' must be set to 'NodeNext' (or left unspecified) when option 'module' is set to 'NodeNext'.
```

or

```
Option 'module' must be set to 'Node16' when option 'moduleResolution' is set to 'Node16'.
```

So for example `--module esnext --moduleResolution node16` will be rejected — but you may be better off just using `--module nodenext` alone, or `--module esnext --moduleResolution bundler`.

For more information, [see the change here](https://github.com/microsoft/TypeScript/pull/54567).

### Consistent Export Checking for Merged Symbols

When two declarations merge, they must agree in whether they are both exported.
Due to a bug, TypeScript missed specific cases in ambient contexts, like in declaration files or `declare module` blocks.
For example, it would not issue an error on a case like the following, where `replaceInFile` is declared once as an exported function, and one as an un-exported namespace.

```ts
declare module 'replace-in-file' {
    export function replaceInFile(config: unknown): Promise<unknown[]>;
    export {};

    namespace replaceInFile {
        export function sync(config: unknown): unknown[];
  }
}
```

In an ambient module, adding an `export { ... }` or a similar construct like `export default ...` implicitly changes whether all declarations are automatically exported.
TypeScript now recognizes these unfortunately confusing semantics more consistently, and issues an error on the fact that all declarations of `replaceInFile` need to agree in their modifiers, and will issue the following error:

```
Individual declarations in merged declaration 'replaceInFile' must be all exported or all local.
```

For more information, [see the change here](https://github.com/microsoft/TypeScript/pull/54659).
