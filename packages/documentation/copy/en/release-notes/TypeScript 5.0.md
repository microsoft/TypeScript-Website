---
title: TypeScript 5.0
layout: docs
permalink: /docs/handbook/release-notes/typescript-5-0.html
oneline: TypeScript 5.0 Release Notes
---

## Decorators

Decorators are an upcoming ECMAScript feature that allow us to customize classes and their members in a reusable way.

Let's consider the following code:

```ts
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    greet() {
        console.log(`Hello, my name is ${this.name}.`);
    }
}

const p = new Person("Ray");
p.greet();
```

`greet` is pretty simple here, but let's imagine it's something way more complicated - maybe it does some async logic, it's recursive, it has side effects, etc.
Regardless of what kind of ball-of-mud you're imagining, let's say you throw in some `console.log` calls to help debug `greet`.

```ts
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    greet() {
        console.log("LOG: Entering method.");

        console.log(`Hello, my name is ${this.name}.`);

        console.log("LOG: Exiting method.")
    }
}
```

This pattern is fairly common.
It sure would be nice if there was a way we could do this for every method!

This is where decorators come in.
We can write a function called `loggedMethod` that looks like the following:

```ts
function loggedMethod(originalMethod: any, _context: any) {

    function replacementMethod(this: any, ...args: any[]) {
        console.log("LOG: Entering method.")
        const result = originalMethod.call(this, ...args);
        console.log("LOG: Exiting method.")
        return result;
    }

    return replacementMethod;
}
```

"What's the deal with all of these `any`s?
What is this, `any`Script!?"

Just be patient - we're keeping things simple for now so that we can focus on what this function is doing.
Notice that `loggedMethod` takes the original method (`originalMethod`) and returns a function that

1. logs an "Entering..." message
2. passes along `this` and all of its arguments to the original method
3. logs an "Exiting..." message, and
4. returns whatever the original method returned.

Now we can use `loggedMethod` to *decorate* the method `greet`:

```ts
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    @loggedMethod
    greet() {
        console.log(`Hello, my name is ${this.name}.`);
    }
}

const p = new Person("Ray");
p.greet();

// Output:
//
//   LOG: Entering method.
//   Hello, my name is Ray.
//   LOG: Exiting method.
```

We just used `loggedMethod` as a decorator above `greet` - and notice that we wrote it as `@loggedMethod`.
When we did that, it got called with the method *target* and a *context object*.
Because `loggedMethod` returned a new function, that function replaced the original definition of `greet`.

We didn't mention it yet, but `loggedMethod` was defined with a second parameter.
It's called a "context object", and it has some useful information about how the decorated method was declared - like whether it was a `#private` member, or `static`, or what the name of the method was.
Let's rewrite `loggedMethod` to take advantage of that and print out the name of the method that was decorated.

```ts
function loggedMethod(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = String(context.name);

    function replacementMethod(this: any, ...args: any[]) {
        console.log(`LOG: Entering method '${methodName}'.`)
        const result = originalMethod.call(this, ...args);
        console.log(`LOG: Exiting method '${methodName}'.`)
        return result;
    }

    return replacementMethod;
}
```

We're now using the context parameter - and that it's the first thing in `loggedMethod` that has a type stricter than `any` and `any[]`.
TypeScript provides a type called `ClassMethodDecoratorContext` that models the context object that method decorators take.

Apart from metadata, the context object for methods also has a useful function called `addInitializer`.
It's a way to hook into the beginning of the constructor (or the initialization of the class itself if we're working with `static`s).

As an example - in JavaScript, it's common to write something like the following pattern:

```ts
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;

        this.greet = this.greet.bind(this);
    }

    greet() {
        console.log(`Hello, my name is ${this.name}.`);
    }
}
```

Alternatively, `greet` might be declared as a property initialized to an arrow function.

```ts
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    greet = () => {
        console.log(`Hello, my name is ${this.name}.`);
    };
}
```

This code is written to ensure that `this` isn't re-bound if `greet` is called as a stand-alone function or passed as a callback.

```ts
const greet = new Person("Ray").greet;

// We don't want this to fail!
greet();
```

We can write a decorator that uses `addInitializer` to call `bind` in the constructor for us.

```ts
function bound(originalMethod: any, context: ClassMethodDecoratorContext) {
    const methodName = context.name;
    if (context.private) {
        throw new Error(`'bound' cannot decorate private properties like ${methodName as string}.`);
    }
    context.addInitializer(function () {
        this[methodName] = this[methodName].bind(this);
    });
}
```

`bound` isn't returning anything - so when it decorates a method, it leaves the original alone.
Instead, it will add logic before any other fields are initialized.

```ts
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    @bound
    @loggedMethod
    greet() {
        console.log(`Hello, my name is ${this.name}.`);
    }
}

const p = new Person("Ray");
const greet = p.greet;

// Works!
greet();
```

Notice that we stacked two decorators - `@bound` and `@loggedMethod`.
These decorations run in "reverse order".
That is, `@loggedMethod` decorates the original method `greet`, and `@bound` decorates the result of `@loggedMethod`.
In this example, it doesn't matter - but it could if your decorators have side-effects or expect a certain order.

Also worth noting - if you'd prefer stylistically, you can put these decorators on the same line.

```ts
    @bound @loggedMethod greet() {
        console.log(`Hello, my name is ${this.name}.`);
    }
```

Something that might not be obvious is that we can even make functions that *return* decorator functions.
That makes it possible to customize the final decorator just a little.
If we wanted, we could have made `loggedMethod` return a decorator and customize how it logs its messages.

```ts
function loggedMethod(headMessage = "LOG:") {
    return function actualDecorator(originalMethod: any, context: ClassMethodDecoratorContext) {
        const methodName = String(context.name);

        function replacementMethod(this: any, ...args: any[]) {
            console.log(`${headMessage} Entering method '${methodName}'.`)
            const result = originalMethod.call(this, ...args);
            console.log(`${headMessage} Exiting method '${methodName}'.`)
            return result;
        }

        return replacementMethod;
    }
}
```

If we did that, we'd have to call `loggedMethod` before using it as a decorator.
We could then pass in any string as the prefix for messages that get logged to the console.

```ts
class Person {
    name: string;
    constructor(name: string) {
        this.name = name;
    }

    @loggedMethod("⚠️")
    greet() {
        console.log(`Hello, my name is ${this.name}.`);
    }
}

const p = new Person("Ray");
p.greet();

// Output:
//
//   ⚠️ Entering method 'greet'.
//   Hello, my name is Ray.
//   ⚠️ Exiting method 'greet'.
```

Decorators can be used on more than just methods!
They can be used on properties/fields, getters, setters, and auto-accessors.
Even classes themselves can be decorated for things like subclassing and registration.

To learn more about decorators in-depth, you can read up on [Axel Rauschmayer's extensive summary](https://2ality.com/2022/10/javascript-decorators.html).

For more information about the changes involved, you can [view the original pull request](https://github.com/microsoft/TypeScript/pull/50820).

### Differences with Experimental Legacy Decorators

If you've been using TypeScript for a while, you might be aware of the fact that it's had support for "experimental" decorators for years.
While these experimental decorators have been incredibly useful, they modeled a much older version of the decorators proposal, and always required an opt-in compiler flag called `--experimentalDecorators`.
Any attempt to use decorators in TypeScript without this flag used to prompt an error message.

`--experimentalDecorators` will continue to exist for the foreseeable future;
however, without the flag, decorators will now be valid syntax for all new code.
Outside of `--experimentalDecorators`, they will be type-checked and emitted differently.
The type-checking rules and emit are sufficiently different that while decorators *can* be written to support both the old and new decorators behavior, any existing decorator functions are not likely to do so.

This new decorators proposal is not compatible with `--emitDecoratorMetadata`, and it does not allow decorating parameters.
Future ECMAScript proposals may be able to help bridge that gap.

On a final note: in addition to allowing decorators to be placed before the `export` keyword, the proposal for decorators now provides the option of placing decorators after `export` or `export default`.
The only exception is that mixing the two styles is not allowed.

```js
// ✅ allowed
@register export default class Foo {
    // ...
}

// ✅ also allowed
export default @register class Bar {
    // ...
}

// ❌ error - before *and* after is not allowed
@before export @after class Bar {
    // ...
}
```

### Writing Well-Typed Decorators

The `loggedMethod` and `bound` decorator examples above are intentionally simple and omit lots of details about types.

Typing decorators can be fairly complex.
For example, a well-typed version of `loggedMethod` from above might look something like this:

```ts
function loggedMethod<This, Args extends any[], Return>(
    target: (this: This, ...args: Args) => Return,
    context: ClassMethodDecoratorContext<This, (this: This, ...args: Args) => Return>
) {
    const methodName = String(context.name);

    function replacementMethod(this: This, ...args: Args): Return {
        console.log(`LOG: Entering method '${methodName}'.`)
        const result = target.call(this, ...args);
        console.log(`LOG: Exiting method '${methodName}'.`)
        return result;
    }

    return replacementMethod;
}
```

We had to separately model out the type of `this`, the parameters, and the return type of the original method, using the type parameters `This`, `Args`, and `Return`.

Exactly how complex your decorators functions are defined depends on what you want to guarantee.
Just keep in mind, your decorators will be used more than they're written, so a well-typed version will usually be preferable - but there's clearly a trade-off with readability, so try to keep things simple.

More documentation on writing decorators will be available in the future - but [this post](https://2ality.com/2022/10/javascript-decorators.html) should have a good amount of detail for the mechanics of decorators.

## `const` Type Parameters

When inferring the type of an object, TypeScript will usually choose a type that's meant to be general.
For example, in this case, the inferred type of `names` is `string[]`:

```ts
type HasNames = { names: readonly string[] };
function getNamesExactly<T extends HasNames>(arg: T): T["names"] {
    return arg.names;
}

// Inferred type: string[]
const names = getNamesExactly({ names: ["Alice", "Bob", "Eve"]});
```

Usually the intent of this is to enable mutation down the line.

However, depending on what exactly `getNamesExactly` does and how it's intended to be used, it can often be the case that a more-specific type is desired.

Up until now, API authors have typically had to recommend adding `as const` in certain places to achieve the desired inference:

```ts
// The type we wanted:
//    readonly ["Alice", "Bob", "Eve"]
// The type we got:
//    string[]
const names1 = getNamesExactly({ names: ["Alice", "Bob", "Eve"]});

// Correctly gets what we wanted:
//    readonly ["Alice", "Bob", "Eve"]
const names2 = getNamesExactly({ names: ["Alice", "Bob", "Eve"]} as const);
```

This can be cumbersome and easy to forget.
In TypeScript 5.0, you can now add a `const` modifier to a type parameter declaration to cause `const`-like inference to be the default:

```ts
type HasNames = { names: readonly string[] };
function getNamesExactly<const T extends HasNames>(arg: T): T["names"] {
//                       ^^^^^
    return arg.names;
}

// Inferred type: readonly ["Alice", "Bob", "Eve"]
// Note: Didn't need to write 'as const' here
const names = getNamesExactly({ names: ["Alice", "Bob", "Eve"] });
```

Note that the `const` modifier doesn't *reject* mutable values, and doesn't require immutable constraints.
Using a mutable type constraint might give surprising results.
For example:

```ts
declare function fnBad<const T extends string[]>(args: T): void;

// 'T' is still 'string[]' since 'readonly ["a", "b", "c"]' is not assignable to 'string[]'
fnBad(["a", "b" ,"c"]);
```

Here, the inferred candidate for `T` is `readonly ["a", "b", "c"]`, and a `readonly` array can't be used where a mutable one is needed.
In this case, inference falls back to the constraint, the array is treated as `string[]`, and the call still proceeds successfully.

A better definition of this function should use `readonly string[]`:

```ts
declare function fnGood<const T extends readonly string[]>(args: T): void;

// T is readonly ["a", "b", "c"]
fnGood(["a", "b" ,"c"]);
```

Similarly, remember to keep in mind that the `const` modifier only affects inference of object, array and primitive expressions that were written within the call, so arguments which wouldn't (or couldn't) be modified with `as const` won't see any change in behavior:

```ts
declare function fnGood<const T extends readonly string[]>(args: T): void;
const arr = ["a", "b" ,"c"];

// 'T' is still 'string[]'-- the 'const' modifier has no effect here
fnGood(arr);
```

[See the pull request](https://github.com/microsoft/TypeScript/pull/51865) and the ([first](https://github.com/microsoft/TypeScript/issues/30680) and second [second](https://github.com/microsoft/TypeScript/issues/41114)) motivating issues for more details.

## Supporting Multiple Configuration Files in `extends`

When managing multiple projects, it can be helpful to have a "base" configuration file that other `tsconfig.json` files can extend from.
That's why TypeScript supports an `extends` field for copying over fields from `compilerOptions`.

```jsonc
// packages/front-end/src/tsconfig.json
{
    "extends": "../../../tsconfig.base.json",
    "compilerOptions": {
        "outDir": "../lib",
        // ...
    }
}
```

However, there are scenarios where you might want to extend from multiple configuration files.
For example, imagine using [a TypeScript base configuration file shipped to npm](https://github.com/tsconfig/bases).
If you want all your projects to also use the options from the `@tsconfig/strictest` package on npm, then there's a simple solution: have `tsconfig.base.json` extend from `@tsconfig/strictest`:

```jsonc
// tsconfig.base.json
{
    "extends": "@tsconfig/strictest/tsconfig.json",
    "compilerOptions": {
        // ...
    }
}
```

This works to a point.
If you have any projects that *don't* want to use `@tsconfig/strictest`, they have to either manually disable the options, or create a separate version of `tsconfig.base.json` that *doesn't* extend from `@tsconfig/strictest`.

To give some more flexibility here, Typescript 5.0 now allows the `extends` field to take multiple entries.
For example, in this configuration file:

```jsonc
{
    "extends": ["a", "b", "c"],
    "compilerOptions": {
        // ...
    }
}
```

Writing this is kind of like extending `c` directly, where `c` extends `b`, and `b` extends `a`.
If any fields "conflict", the latter entry wins.

So in the following example, both `strictNullChecks` and `noImplicitAny` are enabled in the final `tsconfig.json`.

```jsonc
// tsconfig1.json
{
    "compilerOptions": {
        "strictNullChecks": true
    }
}

// tsconfig2.json
{
    "compilerOptions": {
        "noImplicitAny": true
    }
}

// tsconfig.json
{
    "extends": ["./tsconfig1.json", "./tsconfig2.json"],
    "files": ["./index.ts"]
}
```

As another example, we can rewrite our original example in the following way.

```jsonc
// packages/front-end/src/tsconfig.json
{
    "extends": ["@tsconfig/strictest/tsconfig.json", "../../../tsconfig.base.json"],
    "compilerOptions": {
        "outDir": "../lib",
        // ...
    }
}
```

For more details, [read more on the original pull request](https://github.com/microsoft/TypeScript/pull/50403).

<!--

## Improved Type Argument Inference

TODO

## Improved `in` Checks Under `--noUncheckedIndexedAccess`

TODO

-->

## All `enum`s Are Union `enum`s

When TypeScript originally introduced enums, they were nothing more than a set of numeric constants with the same type.

```ts
enum E {
    Foo = 10,
    Bar = 20,
}
```

The only thing special about `E.Foo` and `E.Bar` was that they were assignable to anything expecting the type `E`.
Other than that, they were pretty much just `number`s.

```ts
function takeValue(e: E) {}

takeValue(E.Foo); // works
takeValue(123); // error!
```

It wasn't until TypeScript 2.0 introduced enum literal types that enums got a bit more special.
Enum literal types gave each enum member its own type, and turned the enum itself into a *union* of each member type.
They also allowed us to refer to only a subset of the types of an enum, and to narrow away those types.

```ts
// Color is like a union of Red | Orange | Yellow | Green | Blue | Violet
enum Color {
    Red, Orange, Yellow, Green, Blue, /* Indigo, */ Violet
}

// Each enum member has its own type that we can refer to!
type PrimaryColor = Color.Red | Color.Green | Color.Blue;

function isPrimaryColor(c: Color): c is PrimaryColor {
    // Narrowing literal types can catch bugs.
    // TypeScript will error here because
    // we'll end up comparing 'Color.Red' to 'Color.Green'.
    // We meant to use ||, but accidentally wrote &&.
    return c === Color.Red && c === Color.Green && c === Color.Blue;
}
```

One issue with giving each enum member its own type was that those types were in some part associated with the actual value of the member.
In some cases it's not possible to compute that value - for instance, an enum member could be initialized by a function call.

```ts
enum E {
    Blah = Math.random()
}
```

Whenever TypeScript ran into these issues, it would quietly back out and use the old enum strategy.
That meant giving up all the advantages of unions and literal types.

TypeScript 5.0 manages to make all enums into union enums by creating a unique type for each computed member.
That means that all enums can now be narrowed and have their members referenced as types as well.

For more details on this change, you can [read the specifics on GitHub](https://github.com/microsoft/TypeScript/pull/50528).

## `--moduleResolution bundler`

TypeScript 4.7 introduced the `node16` and `nodenext` options for its `--module` and `--moduleResolution` settings.
The intent of these options was to better model the precise lookup rules for ECMAScript modules in Node.js;
however, this mode has many restrictions that other tools don't really enforce.

For example, in an ECMAScript module in Node.js, any relative import needs to include a file extension.

```js
// entry.mjs
import * as utils from "./utils";     // ❌ wrong - we need to include the file extension.

import * as utils from "./utils.mjs"; // ✅ works
```

There are certain reasons for this in Node.js and the browser - it makes file lookups faster and works better for naive file servers.
But for many developers using tools like bundlers, the `node16`/`nodenext` settings were cumbersome because bundlers don't have most of these restrictions.
In some ways, the `node` resolution mode was better for anyone using a bundler.

But in some ways, the original `node` resolution mode was already out of date.
Most modern bundlers use a fusion of the ECMAScript module and CommonJS lookup rules in Node.js.
For example, extensionless imports work just fine just like in CommonJS, but when looking through the [`export` conditions](https://nodejs.org/api/packages.html#nested-conditions) of a package, they'll prefer an `import` condition just like in an ECMAScript file.

To model how bundlers work, TypeScript now introduces a new strategy: `--moduleResolution bundler`.

```jsonc
{
    "compilerOptions": {
        "target": "esnext",
        "moduleResolution": "bundler"
    }
}
```

If you are using a modern bundler like Vite, esbuild, swc, Webpack, Parcel, and others that implement a hybrid lookup strategy, the new `bundler` option should be a good fit for you.

On the other hand, if you're writing a library that's meant to be published on npm, using the `bundler` option can hide compatibility issues that may arise for your users who *aren't* using a bundler.
So in these cases, using the `node16` or `nodenext` resolution options is likely to be a better path.

To read more on `--moduleResolution bundler`, [take a look at the implementing pull request](https://github.com/microsoft/TypeScript/pull/51669).

## Resolution Customization Flags

JavaScript tooling may now model "hybrid" resolution rules, like in the `bundler` mode we described above.
Because tools may differ in their support slightly, TypeScript 5.0 provides ways to enable or disable a few features that may or may not work with your configuration.

### `allowImportingTsExtensions`

`--allowImportingTsExtensions` allows TypeScript files to import each other with a TypeScript-specific extension like `.ts`, `.mts`, or `.tsx`.

This flag is only allowed when `--noEmit` or `--emitDeclarationOnly` is enabled, since these import paths would not be resolvable at runtime in JavaScript output files.
The expectation here is that your resolver (e.g. your bundler, a runtime, or some other tool) is going to make these imports between `.ts` files work.

### `resolvePackageJsonExports`

`--resolvePackageJsonExports` forces TypeScript to consult [the `exports` field of `package.json` files](https://nodejs.org/api/packages.html#exports) if it ever reads from a package in `node_modules`.

This option defaults to `true` under the `node16`, `nodenext`, and `bundler` options for `--moduleResolution`.

### `resolvePackageJsonImports`

`--resolvePackageJsonImports` forces TypeScript to consult [the `imports` field of `package.json` files](https://nodejs.org/api/packages.html#imports) when performing a lookup that starts with `#` from a file whose ancestor directory contains a `package.json`.

This option defaults to `true` under the `node16`, `nodenext`, and `bundler` options for `--moduleResolution`.

### `allowArbitraryExtensions`

In TypeScript 5.0, when an import path ends in an extension that isn't a known JavaScript or TypeScript file extension, the compiler will look for a declaration file for that path in the form of `{file basename}.d.{extension}.ts`.
For example, if you are using a CSS loader in a bundler project, you might want to write (or generate) declaration files for those stylesheets:

```css
/* app.css */
.cookie-banner {
  display: none;
}
```

```ts
// app.d.css.ts
declare const css: {
  cookieBanner: string;
};
export default css;
```

```ts
// App.tsx
import styles from "./app.css";

styles.cookieBanner; // string
```

By default, this import will raise an error to let you know that TypeScript doesn't understand this file type and your runtime might not support importing it.
But if you've configured your runtime or bundler to handle it, you can suppress the error with the new `--allowArbitraryExtensions` compiler option.

Note that historically, a similar effect has often been achievable by adding a declaration file named `app.css.d.ts` instead of `app.d.css.ts` - however, this just worked through Node's `require` resolution rules for CommonJS.
Strictly speaking, the former is interpreted as a declaration file for a JavaScript file named `app.css.js`.
Because relative files imports need to include extensions in Node's ESM support, TypeScript would error on our example in an ESM file under `--moduleResolution node16` or `nodenext`.

For more information, read up [the proposalfor this feature](https://github.com/microsoft/TypeScript/issues/50133) and [its corresponding pull request](https://github.com/microsoft/TypeScript/pull/51435).

### `customConditions`

`--customConditions` takes a list of additional [conditions](https://nodejs.org/api/packages.html#nested-conditions) that should succeed when TypeScript resolves from an [`exports`](https://nodejs.org/api/packages.html#exports) or [`imports`](https://nodejs.org/api/packages.html#imports) field of a `package.json`.
These conditions are added to whatever existing conditions a resolver will use by default.

For example, when this field is set in a `tsconfig.json` as so:

```jsonc
{
    "compilerOptions": {
        "target": "es2022",
        "moduleResolution": "bundler",
        "customConditions": ["my-condition"]
    }
}
```

Any time an `exports` or `imports` field is referenced in `package.json`, TypeScript will consider conditions called `my-condition`.

So when importing from a package with the following `package.json`

```jsonc
{
    // ...
    "exports": {
        ".": {
            "my-condition": "./foo.mjs",
            "node": "./bar.mjs",
            "import": "./baz.mjs",
            "require": "./biz.mjs"
        }
    }
}
```

TypeScript will try to look for files corresponding to `foo.mjs`.

This field is only valid under the `node16`, `nodenext`, and `bundler` options for `--moduleResolution`

## `--verbatimModuleSyntax`

By default, TypeScript does something called *import elision*.
Basically, if you write something like

```ts
import { Car } from "./car";

export function drive(car: Car) {
    // ...
}
```

TypeScript detects that you're only using an import for types and drops the import entirely.
Your output JavaScript might look something like this:

```js
export function drive(car) {
    // ...
}
```

Most of the time this is good, because if `Car` isn't a value that's exported from `./car`, we'll get a runtime error.

But it does add a layer of complexity for certain edge cases.
For example, notice there's no statement like `import "./car";` - the import was dropped entirely.
That actually makes a difference for modules that have side-effects or not.

TypeScript's emit strategy for JavaScript also has another few layers of complexity - import elision isn't always just driven by how an import is used - it often consults how a value is declared as well.
So it's not always clear whether code like the following

```ts
export { Car } from "./car";
```

should be preserved or dropped.
If `Car` is declared with something like a `class`, then it can be preserved in the resulting JavaScript file.
But if `Car` is only declared as a `type` alias or `interface`, then the JavaScript file shouldn't export `Car` at all.

While TypeScript might be able to make these emit decisions based on information from across files, not every compiler can.

The `type` modifier on imports and exports helps with these situations a bit.
We can make it explicit whether an import or export is only being used for type analysis, and can be dropped entirely in JavaScript files by using the `type` modifier.

```ts
// This statement can be dropped entirely in JS output
import type * as car from "./car";

// The named import/export 'Car' can be dropped in JS output
import { type Car } from "./car";
export { type Car } from "./car";
```

`type` modifiers are not quite useful on their own - by default, module elision will still drop imports, and nothing forces you to make the distinction between `type` and plain imports and exports.
So TypeScript has the flag `--importsNotUsedAsValues` to make sure you use the `type` modifier, `--preserveValueImports` to prevent *some* module elision behavior, and `--isolatedModules` to make sure that your TypeScript code works across different compilers.
Unfortunately, understanding the fine details of those 3 flags is hard, and there are still some edge cases with unexpected behavior.

TypeScript 5.0 introduces a new option called `--verbatimModuleSyntax` to simplify the situation.
The rules are much simpler - any imports or exports without a `type` modifier are left around.
Anything that uses the `type` modifier is dropped entirely.

```ts
// Erased away entirely.
import type { A } from "a";

// Rewritten to 'import { b } from "bcd";'
import { b, type c, type d } from "bcd";

// Rewritten to 'import {} from "xyz";'
import { type xyz } from "xyz";
```

With this new option, what you see is what you get.

That does have some implications when it comes to module interop though.
Under this flag, ECMAScript `import`s and `export`s won't be rewritten to `require` calls when your settings or file extension implied a different module system.
Instead, you'll get an error.
If you need to emit code that uses `require` and `module.exports`, you'll have to use TypeScript's module syntax that predates ES2015:

<table>
<thead>
    <tr>
        <th>Input TypeScript</th>
        <th>Output JavaScript</th>
    </tr>
</thead>

<tr>
<td>

```ts
import foo = require("foo");
```

</td>
<td>

```js
const foo = require("foo");
```

</td>
</tr>
<tr>
<td>

```ts
function foo() {}
function bar() {}
function baz() {}

export = {
    foo,
    bar,
    baz
};
```

</td>
<td>

```js
function foo() {}
function bar() {}
function baz() {}

module.exports = {
    foo,
    bar,
    baz
};
```

</td>
</tr>
</table>

While this is a limitation, it does help make some issues more obvious.
For example, it's very common to forget to set the [`type` field in `package.json`](https://nodejs.org/api/packages.html#type) under `--module node16`.
As a result, developers would start writing CommonJS modules instead of an ES modules without realizing it, giving surprising lookup rules and JavaScript output.
This new flag ensures that you're intentional about the file type you're using because the syntax is intentionally different.

Because `--verbatimModuleSyntax` provides a more consistent story than `--importsNotUsedAsValues` and `--preserveValueImports`, those two existing flags are being deprecated in its favor.

For more details, read up on [the original pull request]https://github.com/microsoft/TypeScript/pull/52203 and [its proposal issue](https://github.com/microsoft/TypeScript/issues/51479).

## Support for `export type *`

When TypeScript 3.8 introduced type-only imports, the new syntax wasn't allowed on `export * from "module"` or `export * as ns from "module"` re-exports. TypeScript 5.0 adds support for both of these forms:

```ts
// models/vehicles.ts
export class Spaceship {
  // ...
}

// models/index.ts
export type * as vehicles from "./vehicles";

// main.ts
import { vehicles } from "./models";

function takeASpaceship(s: vehicles.Spaceship) {
  // ✅ ok - `vehicles` only used in a type position
}

function makeASpaceship() {
  return new vehicles.Spaceship();
  //         ^^^^^^^^
  // 'vehicles' cannot be used as a value because it was exported using 'export type'.
}
```

You can [read more about the implementation here](https://github.com/microsoft/TypeScript/pull/52217).

## `@satisfies` Support in JSDoc

TypeScript 4.9 introduced the `satisfies` operator.
It made sure that the type of an expression was compatible, without affecting the type itself.
For example, let's take the following code:

```ts
interface CompilerOptions {
    strict?: boolean;
    outDir?: string;
    // ...
}

interface ConfigSettings {
    compilerOptions?: CompilerOptions;
    extends?: string | string[];
    // ...
}

let myConfigSettings = {
    compilerOptions: {
        strict: true,
        outDir: "../lib",
        // ...
    },

    extends: [
        "@tsconfig/strictest/tsconfig.json",
        "../../../tsconfig.base.json"
    ],

} satisfies ConfigSettings;
```

Here, TypeScript knows that `myCompilerOptions.extends` was declared with an array - because while `satisfies` validated the type of our object, it didn't bluntly change it to `CompilerOptions` and lose information.
So if we want to map over `extends`, that's fine.

```ts
declare function resolveConfig(configPath: string): CompilerOptions;

let inheritedConfigs = myConfigSettings.extends.map(resolveConfig);
```

This was helpful for TypeScript users, but plenty of people use TypeScript to type-check their JavaScript code using JSDoc annotations.
That's why TypeScript 5.0 is supporting a new JSDoc tag called `@satisfies` that does exactly the same thing.

`/** @satisfies */` can catch type mismatches:

```js
// @ts-check

/**
 * @typedef CompilerOptions
 * @prop {boolean} [strict]
 * @prop {string} [outDir]
 */

/**
 * @satisfies {CompilerOptions}
 */
let myCompilerOptions = {
    outdir: "../lib",
//  ~~~~~~ oops! we meant outDir
};
```

But it will preserve the original type of our expressions, allowing us to use our values more precisely later on in our code.

```js
// @ts-check

/**
 * @typedef CompilerOptions
 * @prop {boolean} [strict]
 * @prop {string} [outDir]
 */

/**
 * @typedef ConfigSettings
 * @prop {CompilerOptions} [compilerOptions]
 * @prop {string | string[]} [extends]
 */


/**
 * @satisfies {ConfigSettings}
 */
let myConfigSettings = {
    compilerOptions: {
        strict: true,
        outDir: "../lib",
    },
    extends: [
        "@tsconfig/strictest/tsconfig.json",
        "../../../tsconfig.base.json"
    ],
};

let inheritedConfigs = myConfigSettings.extends.map(resolveConfig);
```

`/** @satisfies */` can also be used inline on any parenthesized expression.
We could have written `myCompilerOptions` like this:

```ts
let myConfigSettings = /** @satisfies {ConfigSettings} */ ({
    compilerOptions: {
        strict: true,
        outDir: "../lib",
    },
    extends: [
        "@tsconfig/strictest/tsconfig.json",
        "../../../tsconfig.base.json"
    ],
});
```

Why?
Well, it usually makes more sense when you're deeper in some other code, like a function call.

```js
compileCode(/** @satisfies {CompilerOptions} */ ({
    // ...
}));
```

[This feature](https://github.com/microsoft/TypeScript/pull/51753) was provided thanks to [Oleksandr Tarasiuk](https://github.com/a-tarasyuk)!

## `@overload` Support in JSDoc

In TypeScript, you can specify overloads for a function.
Overloads give us a way to say that a function can be called with different arguments, and possibly return different results.
They can restrict how callers can actually use our functions, and refine what results they'll get back.

```ts
// Our overloads:
function printValue(str: string): void;
function printValue(num: number, maxFractionDigits?: number): void;

// Our implementation:
function printValue(value: string | number, maximumFractionDigits?: number) {
    if (typeof value === "number") {
        const formatter = Intl.NumberFormat("en-US", {
            maximumFractionDigits,
        });
        value = formatter.format(value);
    }

    console.log(value);
}
```

Here, we've said that `printValue` takes either a `string` or a `number` as its first argument.
If it takes a `number`, it can take a second argument to determine how many fractional digits we can print.

TypeScript 5.0 now allows JSDoc to declare overloads with a new `@overload` tag.
Each JSDoc comment with an `@overload` tag is treated as a distinct overload for the following function declaration.

```js
// @ts-check

/**
 * @overload
 * @param {string} value
 * @return {void}
 */

/**
 * @overload
 * @param {number} value
 * @param {number} [maximumFractionDigits]
 * @return {void}
 */

/**
 * @param {string | number} value
 * @param {number} [maximumFractionDigits]
 */
function printValue(value, maximumFractionDigits) {
    if (typeof value === "number") {
        const formatter = Intl.NumberFormat("en-US", {
            maximumFractionDigits,
        });
        value = formatter.format(value);
    }

    console.log(value);
}
```

Now regardless of whether we're writing in a TypeScript or JavaScript file, TypeScript can let us know if we've called our functions incorrectly.

```ts
// all allowed
printValue("hello!");
printValue(123.45);
printValue(123.45, 2);

printValue("hello!", 123); // error!
```

This new tag [was implemented](https://github.com/microsoft/TypeScript/pull/51234) thanks to [Tomasz Lenarcik](https://github.com/apendua).

## Passing Emit-Specific Flags Under `--build`

TypeScript now allows the following flags to be passed under `--build` mode

* `--declaration`
* `--emitDeclarationOnly`
* `--declarationMap`
* `--sourceMap`
* `--inlineSourceMap`

This makes it way easier to customize certain parts of a build where you might have different development and production builds.

For example, a development build of a library might not need to produce declaration files, but a production build would.
A project can configure declaration emit to be off by default and simply be built with

```sh
tsc --build -p ./my-project-dir
```

Once you're done iterating in the inner loop, a "production" build can just pass the `--declaration` flag.

```sh
tsc --build -p ./my-project-dir --declaration
```

[More information on this change is available here](https://github.com/microsoft/TypeScript/pull/51241).

## Case-Insensitive Import Sorting in Editors

In editors like Visual Studio and VS Code, TypeScript powers the experience for organizing and sorting imports and exports.
Often though, there can be different interpretations of when a list is "sorted".

For example, is the following import list sorted?

```ts
import {
    Toggle,
    freeze,
    toBoolean,
} from "./utils";
```

The answer might surprisingly be "it depends".
If we *don't* care about case-sensitivity, then this list is clearly not sorted.
The letter `f` comes before both `t` and `T`.

But in most programming languages, sorting defaults to comparing the byte values of strings.
The way JavaScript compares strings means that `"Toggle"` always comes before `"freeze"` because according to the [ASCII character encoding](https://en.wikipedia.org/wiki/ASCII), uppercase letters come before lowercase.
So from that perspective, the import list is sorted.

TypeScript previously considered the import list to be sorted because it was doing a basic case-sensitive sort.
This could be a point of frustration for developers who preferred a case-*insensitive* ordering, or who used tools like ESLint which require to case-insensitive ordering by default.

TypeScript now detects case sensitivity by default.
This means that TypeScript and tools like ESLint typically won't "fight" each other over how to best sort imports.

Our team has also been experimenting [with further sorting strategies which you can read about here](https://github.com/microsoft/TypeScript/pull/52115).
These options may eventually be configurable by editors.
For now, they are still unstable and experimental, and you can opt into them in VS Code today by using the `typescript.unstable` entry in your JSON options.
Below are all of the options you can try out (set to their defaults):

```jsonc
{
    "typescript.unstable": {
        // Should sorting be case-sensitive? Can be:
        // - true
        // - false
        // - "auto" (auto-detect)
        "organizeImportsIgnoreCase": "auto",

        // Should sorting be "ordinal" and use code points or consider Unicode rules? Can be:
        // - "ordinal"
        // - "unicode"
        "organizeImportsCollation": "ordinal",

        // Under `"organizeImportsCollation": "unicode"`,
        // what is the current locale? Can be:
        // - [any other locale code]
        // - "auto" (use the editor's locale)
        "organizeImportsLocale": "en",

        // Under `"organizeImportsCollation": "unicode"`,
        // should upper-case letters or lower-case letters come first? Can be:
        // - false (locale-specific)
        // - "upper"
        // - "lower"
        "organizeImportsCaseFirst": false,

        // Under `"organizeImportsCollation": "unicode"`,
        // do runs of numbers get compared numerically (i.e. "a1" < "a2" < "a100")? Can be:
        // - true
        // - false
        "organizeImportsNumericCollation": true,

        // Under `"organizeImportsCollation": "unicode"`,
        // do letters with accent marks/diacritics get sorted distinctly
        // from their "base" letter (i.e. is é different from e)? Can be
        // - true
        // - false
        "organizeImportsAccentCollation": true
    },
    "javascript.unstable": {
        // same options valid here...
    },
}
```

You can read more details on [the original work for auto-detecting and specifying case-insensitivity](https://github.com/microsoft/TypeScript/pull/51733), followed by the [the broader set of options](https://github.com/microsoft/TypeScript/pull/52115).

## Exhaustive `switch`/`case` Completions

When writing a `switch` statement, TypeScript now detects when the value being checked has a literal type.
If so, it will offer a completion that scaffolds out each uncovered `case`.

![A set of `case` statements generated through auto-completion based on literal types.](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2023/01/switchCaseSnippets-5-0_1.gif)

You can [see specifics of the implementation on GitHub](https://github.com/microsoft/TypeScript/pull/50996).

## Speed, Memory, and Package Size Optimizations

TypeScript 5.0 contains lots of powerful changes across our code structure, our data structures, and algorithmic implementations.
What these all mean is that your entire experience should be faster - not just running TypeScript, but even installing it.

Here are a few interesting wins in speed and size that we've been able to capture relative to TypeScript 4.9.

Scenario | Time or Size Relative to TS 4.9
---------|--------------------
material-ui build time | 89%
TypeScript Compiler startup time | 89%
Playwright build time | 88%
TypeScript Compiler self-build time | 87%
Outlook Web build time | 82%
VS Code build time | 80%
typescript npm Package Size | 59%

![Chart of build/run times and package size of TypeScript 5.0 relative to TypeScript 4.9: material-ui docs build time: 89%; Playwright build time: 88%; tsc startup time: 87%; tsc build time: 87%; Outlook Web build time: 82%; VS Code build time: 80%; typescript Package Size: 59%](https://devblogs.microsoft.com/typescript/wp-content/uploads/sites/11/2023/03/speed-and-size-5-0-rc.png?1)

How?
There are a few notable improvements we'd like give more details on in the future.
But we won't make you wait for that blog post.

First off, we recently migrated TypeScript from namespaces to modules, allowing us to leverage modern build tooling that can perform optimizations like scope hoisting.
Using this tooling, revisiting our packaging strategy, and removing some deprecated code has shaved off about 26.4 MB from TypeScript 4.9's 63.8 MB package size.
It also brought us a notable speed-up through direct function calls.

TypeScript also added more uniformity to internal object types within the compiler, and also slimmed the data stored on some of these object types as well.
This reduced polymorphic and megamorphic use sites, while offsetting most of the necessary memory consumption that was necessary for uniform shapes.

We've also performed some caching when serializing information to strings.
Type display, which can happen as part of error reporting, declaration emit, code completions, and more, can end up being fairly expensive.
TypeScript now caches some commonly used machinery to reuse across these operations.

Another notable change we made that improved our parser was leveraging `var` to occasionally side-step the cost of using `let` and `const` across closures.
This improved some of our parsing performance.

Overall, we expect most codebases should see speed improvements from TypeScript 5.0, and have consistently been able to reproduce wins between 10% to 20%.
Of course this will depend on hardware and codebase characteristics, but we encourage you to try it out on your codebase today!

For more information, see some of our notable optimizations:

* [Migrate to Modules](https://github.com/microsoft/TypeScript/pull/51387)
* [`Node` Monomorphization](https://github.com/microsoft/TypeScript/pull/51682)
* [`Symbol` Monomorphization](https://github.com/microsoft/TypeScript/pull/51880)
* [`Identifier` Size Reduction](https://github.com/microsoft/TypeScript/pull/52170)
* [`Printer` Caching](https://github.com/microsoft/TypeScript/pull/52382)
* [Limited Usage of `var`](https://github.com/microsoft/TypeScript/issues/52924)

## Breaking Changes and Deprecations

### Runtime Requirements

TypeScript now targets ECMAScript 2018.
For Node users, that means a minimum version requirement of at least Node.js 10 and later.

### `lib.d.ts` Changes

Changes to how types for the DOM are generated might have an impact on existing code.
Notably, certain properties have been converted from `number` to numeric literal types, and properties and methods for cut, copy, and paste event handling have been moved across interfaces.

### API Breaking Changes

In TypeScript 5.0, we moved to modules, removed some unnecessary interfaces, and made some correctness improvements.
For more details on what's changed, see our [API Breaking Changes](https://github.com/microsoft/TypeScript/wiki/API-Breaking-Changes) page.

### Forbidden Implicit Coercions in Relational Operators

Certain operations in TypeScript will already warn you if you write code which may cause an implicit string-to-number coercion:

```ts
function func(ns: number | string) {
  return ns * 4; // Error, possible implicit coercion
}
```

In 5.0, this will also be applied to the relational operators `>`, `<`, `<=`, and `>=`:

```ts
function func(ns: number | string) {
  return ns > 4; // Now also an error
}
```

To allow this if desired, you can explicitly coerce the operand to a `number` using `+`:

```ts
function func(ns: number | string) {
  return +ns > 4; // OK
}
```

This [correctness improvement](https://github.com/microsoft/TypeScript/pull/52048) was contributed courtesy of [Mateusz Burzyński](https://github.com/Andarist).

### Enum Overhaul

TypeScript has had some long-standing oddities around `enum`s ever since its first release.
In 5.0, we're cleaning up some of these problems, as well as reducing the concept count needed to understand the various kinds of `enum`s you can declare.

There are two main new errors you might see as part of this.
The first is that assigning an out-of-domain literal to an `enum` type will now error as one might expect:

```ts
enum SomeEvenDigit {
    Zero = 0,
    Two = 2,
    Four = 4
}

// Now correctly an error
let m: SomeEvenDigit = 1;
```

The other is that declaration of certain kinds of indirected mixed string/number `enum` forms would, incorrectly, create an all-number `enum`:

```ts
enum Letters {
    A = "a"
}
enum Numbers {
    one = 1,
    two = Letters.A
}

// Now correctly an error
const t: number = Numbers.two;
```

You can [see more details in relevant change](https://github.com/microsoft/TypeScript/pull/50528).

### More Accurate Type-Checking for Parameter Decorators in Constructors Under `--experimentalDecorators`

TypeScript 5.0 makes type-checking more accurate for decorators under `--experimentalDecorators`.
One place where this becomes apparent is when using a decorator on a constructor parameter.

```ts
export declare const inject:
  (entity: any) =>
    (target: object, key: string | symbol, index?: number) => void;

export class Foo {}

export class C {
    constructor(@inject(Foo) private x: any) {
    }
}
```

This call will fail because `key` expects a `string | symbol`, but constructor parameters receive a key of `undefined`.
The correct fix is to change the type of `key` within `inject`.
A reasonable workaround if you're using a library that can't be upgraded is is to wrap `inject` in a more type-safe decorator function, and use a type-assertion on `key`.

For more details, [see this issue](https://github.com/microsoft/TypeScript/issues/52435).

### Deprecations and Default Changes

In TypeScript 5.0, we've deprecated the following settings and setting values:

* `--target: ES3`
* `--out`
* `--noImplicitUseStrict`
* `--keyofStringsOnly`
* `--suppressExcessPropertyErrors`
* `--suppressImplicitAnyIndexErrors`
* `--noStrictGenericChecks`
* `--charset`
* `--importsNotUsedAsValues`
* `--preserveValueImports`
* `prepend` in project references

These configurations will continue to be allowed until TypeScript 5.5, at which point they will be removed entirely, however, you will receive a warning if you are using these settings.
In TypeScript 5.0, as well as future releases 5.1, 5.2, 5.3, and 5.4, you can specify `"ignoreDeprecations": "5.0"` to silence those warnings.
We'll also shortly be releasing a 4.9 patch to allow specifying `ignoreDeprecations` to allow for smoother upgrades.
Aside from deprecations, we've changed some settings to better improve cross-platform behavior in TypeScript.

`--newLine`, which controls the line endings emitted in JavaScript files, used to be inferred based on the current operating system if not specified.
We think builds should be as deterministic as possible, and Windows Notepad supports line-feed line endings now, so the new default setting is `LF`.
The old OS-specific inference behavior is no longer available.

`--forceConsistentCasingInFileNames`, which ensured that all references to the same file name in a project agreed in casing, now defaults to `true`.
This can help catch differences issues with code written on case-insensitive file systems.

You can leave feedback and view more information on the [tracking issue for 5.0 deprecations](https://github.com/microsoft/TypeScript/issues/51909)
