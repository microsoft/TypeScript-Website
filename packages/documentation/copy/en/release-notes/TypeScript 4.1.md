---
title: TypeScript 4.1
layout: docs
permalink: /docs/handbook/release-notes/typescript-4-1.html
oneline: TypeScript 4.1 Release Notes
---

## Template Literal Types

String literal types in TypeScript allow us to model functions and APIs that expect a set of specific strings.

```ts twoslash
// @errors: 2345
function setVerticalAlignment(location: "top" | "middle" | "bottom") {
  // ...
}

setVerticalAlignment("middel");
```

This is pretty nice because string literal types can basically spell-check our string values.

We also like that string literals can be used as property names in mapped types.
In this sense, they're also usable as building blocks:

```ts
type Options = {
  [K in "noImplicitAny" | "strictNullChecks" | "strictFunctionTypes"]?: boolean;
};
// same as
//   type Options = {
//       noImplicitAny?: boolean,
//       strictNullChecks?: boolean,
//       strictFunctionTypes?: boolean
//   };
```

But there's another place that that string literal types could be used as building blocks: building other string literal types.

That's why TypeScript 4.1 brings the template literal string type.
It has the same syntax as [template literal strings in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), but is used in type positions.
When you use it with concrete literal types, it produces a new string literal type by concatenating the contents.

```ts twoslash
type World = "world";

type Greeting = `hello ${World}`;
//   ^?
```

What happens when you have unions in substitution positions?
It produces the set of every possible string literal that could be represented by each union member.

```ts twoslash
type Color = "red" | "blue";
type Quantity = "one" | "two";

type SeussFish = `${Quantity | Color} fish`;
//   ^?
```

This can be used beyond cute examples in release notes.
For example, several libraries for UI components have a way to specify both vertical and horizontal alignment in their APIs, often with both at once using a single string like `"bottom-right"`.
Between vertically aligning with `"top"`, `"middle"`, and `"bottom"`, and horizontally aligning with `"left"`, `"center"`, and `"right"`, there are 9 possible strings where each of the former strings is connected with each of the latter strings using a dash.

```ts twoslash
// @errors: 2345
type VerticalAlignment = "top" | "middle" | "bottom";
type HorizontalAlignment = "left" | "center" | "right";

// Takes
//   | "top-left"    | "top-center"    | "top-right"
//   | "middle-left" | "middle-center" | "middle-right"
//   | "bottom-left" | "bottom-center" | "bottom-right"

declare function setAlignment(value: `${VerticalAlignment}-${HorizontalAlignment}`): void;

setAlignment("top-left");   // works!
setAlignment("top-middel"); // error!
setAlignment("top-pot");    // error! but good doughnuts if you're ever in Seattle
```

While there are **lots** of examples of this sort of API in the wild, this is still a bit of a toy example since we could write these out manually.
In fact, for 9 strings, this is likely fine; but when you need a ton of strings, you should consider automatically generating them ahead of time to save work on every type-check (or just use `string`, which will be much simpler to comprehend).

Some of the real value comes from dynamically creating new string literals.
For example, imagine a `makeWatchedObject` API that takes an object and produces a mostly identical object, but with a new `on` method to detect for changes to the properties.

```ts
let person = makeWatchedObject({
  firstName: "Homer",
  age: 42, // give-or-take
  location: "Springfield",
});

person.on("firstNameChanged", () => {
  console.log(`firstName was changed!`);
});
```

Notice that `on` listens on the event `"firstNameChanged"`, not just `"firstName"`.
How would we type this?

```ts twslash
type PropEventSource<T> = {
    on(eventName: `${string & keyof T}Changed`, callback: () => void): void;
};

/// Create a "watched object" with an 'on' method
/// so that you can watch for changes to properties.
declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;
```

With this, we can build something that errors when we give the wrong property!

```ts twoslash
// @errors: 2345
type PropEventSource<T> = {
    on(eventName: `${string & keyof T}Changed`, callback: () => void): void;
};
declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;
let person = makeWatchedObject({
  firstName: "Homer",
  age: 42, // give-or-take
  location: "Springfield",
});

// ---cut---
// error!
person.on("firstName", () => {});

// error!
person.on("frstNameChanged", () => {});
```

We can also do something special in template literal types: we can _infer_ from substitution positions.
We can make our last example generic to infer from parts of the `eventName` string to figure out the associated property.

```ts twoslash
type PropEventSource<T> = {
    on<K extends string & keyof T>
        (eventName: `${K}Changed`, callback: (newValue: T[K]) => void ): void;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;

let person = makeWatchedObject({
    firstName: "Homer",
    age: 42,
    location: "Springfield",
});

// works! 'newName' is typed as 'string'
person.on("firstNameChanged", newName => {
    // 'newName' has the type of 'firstName'
    console.log(`new name is ${newName.toUpperCase()}`);
});

// works! 'newAge' is typed as 'number'
person.on("ageChanged", newAge => {
    if (newAge < 0) {
        console.log("warning! negative age");
    }
})
```

Here we made `on` into a generic method.
When a user calls with the string `"firstNameChanged'`, TypeScript will try to infer the right type for `K`.
To do that, it will match `K` against the content prior to `"Changed"` and infer the string `"firstName"`.
Once TypeScript figures that out, the `on` method can fetch the type of `firstName` on the original object, which is `string` in this case.
Similarly, when we call with `"ageChanged"`, it finds the type for the property `age` which is `number`).

Inference can be combined in different ways, often to deconstruct strings, and reconstruct them in different ways.
In fact, to help with modifying these string literal types, we've added a few new utility type aliases for modifying casing in letters (i.e. converting to lowercase and uppercase characters).

```ts twoslash
type EnthusiasticGreeting<T extends string> = `${Uppercase<T>}`

type HELLO = EnthusiasticGreeting<"hello">;
//   ^?
```

The new type aliases are `Uppercase`, `Lowercase`, `Capitalize` and `Uncapitalize`.
The first two transform every character in a string, and the latter two transform only the first character in a string.

For more details, [see the original pull request](https://github.com/microsoft/TypeScript/pull/40336) and [the in-progress pull request to switch to type alias helpers](https://github.com/microsoft/TypeScript/pull/40580).

## Key Remapping in Mapped Types

Just as a refresher, a mapped type can create new object types based on arbitrary keys

```ts
type Options = {
  [K in "noImplicitAny" | "strictNullChecks" | "strictFunctionTypes"]?: boolean;
};
// same as
//   type Options = {
//       noImplicitAny?: boolean,
//       strictNullChecks?: boolean,
//       strictFunctionTypes?: boolean
//   };
```

or new object types based on other object types.

```ts
/// 'Partial<T>' is the same as 'T', but with each property marked optional.
type Partial<T> = {
  [K in keyof T]?: T[K];
};
```

Until now, mapped types could only produce new object types with keys that you provided them; however, lots of the time you want to be able to create new keys, or filter out keys, based on the inputs.

That's why TypeScript 4.1 allows you to re-map keys in mapped types with a new `as` clause.

```ts
type MappedTypeWithNewKeys<T> = {
    [K in keyof T as NewKeyType]: T[K]
    //            ^^^^^^^^^^^^^
    //            This is the new syntax!
}
```

With this new `as` clause, you can leverage features like template literal types to easily create property names based off of old ones.

```ts twoslash
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
};

interface Person {
    name: string;
    age: number;
    location: string;
}

type LazyPerson = Getters<Person>;
//   ^?
```

and you can even filter out keys by producing `never`.
That means you don't have to use an extra `Omit` helper type in some cases.

```ts twoslash
// Remove the 'kind' property
type RemoveKindField<T> = {
    [K in keyof T as Exclude<K, "kind">]: T[K]
};

interface Circle {
    kind: "circle";
    radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;
//   ^?
```

For more information, take a look at [the original pull request over on GitHub](https://github.com/microsoft/TypeScript/pull/40336).

## Recursive Conditional Types

In JavaScript it's fairly common to see functions that can flatten and build up container types at arbitrary levels.
For example, consider the `.then()` method on instances of `Promise`.
`.then(...)` unwraps each promise until it finds a value that's not "promise-like", and passes that value to a callback.
There's also a relatively new `flat` method on `Array`s that can take a depth of how deep to flatten.

Expressing this in TypeScript's type system was, for all practical intents and purposes, not possible.
While there were hacks to achieve this, the types ended up looking very unreasonable.

That's why TypeScript 4.1 eases some restrictions on conditional types - so that they can model these patterns.
In TypeScript 4.1, conditional types can now immediately reference themselves within their branches, making it easier to write recursive type aliases.

For example, if we wanted to write a type to get the element types of nested arrays, we could write the following `deepFlatten` type.

```ts
type ElementType<T> = T extends ReadonlyArray<infer U> ? ElementType<U> : T;

function deepFlatten<T extends readonly unknown[]>(x: T): ElementType<T>[] {
  throw "not implemented";
}

// All of these return the type 'number[]':
deepFlatten([1, 2, 3]);
deepFlatten([[1], [2, 3]]);
deepFlatten([[1], [[2]], [[[3]]]]);
```

Similarly, in TypeScript 4.1 we can write an `Awaited` type to deeply unwrap `Promise`s.

```ts
type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;

/// Like `promise.then(...)`, but more accurate in types.
declare function customThen<T, U>(
  p: Promise<T>,
  onFulfilled: (value: Awaited<T>) => U
): Promise<Awaited<U>>;
```

Keep in mind that while these recursive types are powerful, but they should be used responsibly and sparingly.

First off, these types can do a lot of work which means that they can increase type-checking time.
Trying to model numbers in the Collatz conjecture or Fibonacci sequence might be fun, but don't ship that in `.d.ts` files on npm.

But apart from being computationally intensive, these types can hit an internal recursion depth limit on sufficiently-complex inputs.
When that recursion limit is hit, that results in a compile-time error.
In general, it's better not to use these types at all than to write something that fails on more realistic examples.

See more [at the implementation](https://github.com/microsoft/TypeScript/pull/40002).

## Checked Indexed Accesses (`--noUncheckedIndexedAccess`)

TypeScript has a feature called _index signatures_.
These signatures are a way to signal to the type system that users can access arbitrarily-named properties.

```ts twoslash
interface Options {
  path: string;
  permissions: number;

  // Extra properties are caught by this index signature.
  [propName: string]: string | number;
}

function checkOptions(opts: Options) {
  opts.path; // string
  opts.permissions; // number

  // These are all allowed too!
  // They have the type 'string | number'.
  opts.yadda.toString();
  opts["foo bar baz"].toString();
  opts[Math.random()].toString();
}
```

In the above example, `Options` has an index signature that says any accessed property that's not already listed should have the type `string | number`.
This is often convenient for optimistic code that assumes you know what you're doing, but the truth is that most values in JavaScript do not support every potential property name.
Most types will not, for example, have a value for a property key created by `Math.random()` like in the previous example.
For many users, this behavior was undesirable, and felt like it wasn't leveraging the full strict-checking of [`strictNullChecks`](/tsconfig#strictNullChecks).

That's why TypeScript 4.1 ships with a new flag called [`noUncheckedIndexedAccess`](/tsconfig#noUncheckedIndexedAccess).
Under this new mode, every property access (like `foo.bar`) or indexed access (like `foo["bar"]`) is considered potentially undefined.
That means that in our last example, `opts.yadda` will have the type `string | number | undefined` as opposed to just `string | number`.
If you need to access that property, you'll either have to check for its existence first or use a non-null assertion operator (the postfix `!` character).

```ts twoslash
// @errors: 2532 18048
// @noUncheckedIndexedAccess
interface Options {
  path: string;
  permissions: number;

  // Extra properties are caught by this index signature.
  [propName: string]: string | number;
}
// ---cut---
function checkOptions(opts: Options) {
  opts.path; // string
  opts.permissions; // number

  // These are not allowed with noUncheckedIndexedAccess
  opts.yadda.toString();
  opts["foo bar baz"].toString();
  opts[Math.random()].toString();

  // Checking if it's really there first.
  if (opts.yadda) {
    console.log(opts.yadda.toString());
  }

  // Basically saying "trust me I know what I'm doing"
  // with the '!' non-null assertion operator.
  opts.yadda!.toString();
}
```

One consequence of using [`noUncheckedIndexedAccess`](/tsconfig#noUncheckedIndexedAccess) is that indexing into an array is also more strictly checked, even in a bounds-checked loop.

```ts twoslash
// @errors: 2532 18048
// @noUncheckedIndexedAccess
function screamLines(strs: string[]) {
  // This will have issues
  for (let i = 0; i < strs.length; i++) {
    console.log(strs[i].toUpperCase());
  }
}
```

If you don't need the indexes, you can iterate over individual elements by using a `for`-`of` loop or a `forEach` call.

```ts twoslash
// @noUncheckedIndexedAccess
function screamLines(strs: string[]) {
  // This works fine
  for (const str of strs) {
    console.log(str.toUpperCase());
  }

  // This works fine
  strs.forEach((str) => {
    console.log(str.toUpperCase());
  });
}
```

This flag can be handy for catching out-of-bounds errors, but it might be noisy for a lot of code, so it is not automatically enabled by the [`strict`](/tsconfig#strict) flag; however, if this feature is interesting to you, you should feel free to try it and determine whether it makes sense for your team's codebase!

You can learn more [at the implementing pull request](https://github.com/microsoft/TypeScript/pull/39560).

## `paths` without `baseUrl`

Using path-mapping is fairly common - often it's to have nicer imports, often it's to simulate monorepo linking behavior.

Unfortunately, specifying [`paths`](/tsconfig#paths) to enable path-mapping required also specifying an option called [`baseUrl`](/tsconfig#baseUrl), which allows bare specifier paths to be reached relative to the [`baseUrl`](/tsconfig#baseUrl) too.
This also often caused poor paths to be used by auto-imports.

In TypeScript 4.1, the [`paths`](/tsconfig#paths) option can be used without [`baseUrl`](/tsconfig#baseUrl).
This helps avoid some of these issues.

## `checkJs` Implies `allowJs`

Previously if you were starting a checked JavaScript project, you had to set both [`allowJs`](/tsconfig#allowJs) and [`checkJs`](/tsconfig#checkJs).
This was a slightly annoying bit of friction in the experience, so [`checkJs`](/tsconfig#checkJs) now implies [`allowJs`](/tsconfig#allowJs) by default.

[See more details at the pull request](https://github.com/microsoft/TypeScript/pull/40275).

## React 17 JSX Factories

TypeScript 4.1 supports React 17's upcoming `jsx` and `jsxs` factory functions through two new options for the [`jsx`](/tsconfig#jsx) compiler option:

- `react-jsx`
- `react-jsxdev`

These options are intended for production and development compiles respectively.
Often, the options from one can extend from the other.
For example, a `tsconfig.json` for production builds might look like the following:

```json tsconfig
// ./src/tsconfig.json
{
  "compilerOptions": {
    "module": "esnext",
    "target": "es2015",
    "jsx": "react-jsx",
    "strict": true
  },
  "include": ["./**/*"]
}
```

and one for development builds might look like the following:

```json tsconfig
// ./src/tsconfig.dev.json
{
  "extends": "./tsconfig.json",
  "compilerOptions": {
    "jsx": "react-jsxdev"
  }
}
```

For more information, [check out the corresponding PR](https://github.com/microsoft/TypeScript/pull/39199).

## Editor Support for the JSDoc `@see` Tag

The JSDoc tag `@see` tag now has better support in editors for TypeScript and JavaScript.
This allows you to use functionality like go-to-definition in a dotted name following the tag.
For example, going to definition on `first` or `C` in the JSDoc comment just works in the following example:

```ts
// @filename: first.ts
export class C {}

// @filename: main.ts
import * as first from "./first";

/**
 * @see first.C
 */
function related() {}
```

Thanks to frequent contributor [Wenlu Wang](https://github.com/Kingwl) [for implementing this](https://github.com/microsoft/TypeScript/pull/39760)!

## Breaking Changes

### `lib.d.ts` Changes

`lib.d.ts` may have a set of changed APIs, potentially in part due to how the DOM types are automatically generated.
One specific change is that `Reflect.enumerate` has been removed, as it was removed from ES2016.

### `abstract` Members Can't Be Marked `async`

Members marked as `abstract` can no longer be marked as `async`.
The fix here is to remove the `async` keyword, since callers are only concerned with the return type.

### `any`/`unknown` Are Propagated in Falsy Positions

Previously, for an expression like `foo && somethingElse`, the type of `foo` was `any` or `unknown`, the type of the whole that expression would be the type of `somethingElse`.

For example, previously the type for `x` here was `{ someProp: string }`.

```ts
declare let foo: unknown;
declare let somethingElse: { someProp: string };

let x = foo && somethingElse;
```

However, in TypeScript 4.1, we are more careful about how we determine this type.
Since nothing is known about the type on the left side of the `&&`, we propagate `any` and `unknown` outward instead of the type on the right side.

The most common pattern we saw of this tended to be when checking compatibility with `boolean`s, especially in predicate functions.

```ts
function isThing(x: any): boolean {
  return x && typeof x === "object" && x.blah === "foo";
}
```

Often the appropriate fix is to switch from `foo && someExpression` to `!!foo && someExpression`.

### `resolve`'s Parameters Are No Longer Optional in `Promise`s

When writing code like the following

```ts
new Promise((resolve) => {
  doSomethingAsync(() => {
    doSomething();
    resolve();
  });
});
```

You may get an error like the following:

```
  resolve()
  ~~~~~~~~~
error TS2554: Expected 1 arguments, but got 0.
  An argument for 'value' was not provided.
```

This is because `resolve` no longer has an optional parameter, so by default, it must now be passed a value.
Often this catches legitimate bugs with using `Promise`s.
The typical fix is to pass it the correct argument, and sometimes to add an explicit type argument.

```ts
new Promise<number>((resolve) => {
  //     ^^^^^^^^
  doSomethingAsync((value) => {
    doSomething();
    resolve(value);
    //      ^^^^^
  });
});
```

However, sometimes `resolve()` really does need to be called without an argument.
In these cases, we can give `Promise` an explicit `void` generic type argument (i.e. write it out as `Promise<void>`).
This leverages new functionality in TypeScript 4.1 where a potentially-`void` trailing parameter can become optional.

```ts
new Promise<void>((resolve) => {
  //     ^^^^^^
  doSomethingAsync(() => {
    doSomething();
    resolve();
  });
});
```

TypeScript 4.1 ships with a quick fix to help fix this break.

### Conditional Spreads Create Optional Properties

In JavaScript, object spreads (like `{ ...foo }`) don't operate over falsy values.
So in code like `{ ...foo }`, `foo` will be skipped over if it's `null` or `undefined`.

Many users take advantage of this to spread in properties "conditionally".

```ts
interface Person {
  name: string;
  age: number;
  location: string;
}

interface Animal {
  name: string;
  owner: Person;
}

function copyOwner(pet?: Animal) {
  return {
    ...(pet && pet.owner),
    otherStuff: 123,
  };
}

// We could also use optional chaining here:

function copyOwner(pet?: Animal) {
  return {
    ...pet?.owner,
    otherStuff: 123,
  };
}
```

Here, if `pet` is defined, the properties of `pet.owner` will be spread in - otherwise, no properties will be spread into the returned object.

The return type of `copyOwner` was previously a union type based on each spread:

```
{ x: number } | { x: number, name: string, age: number, location: string }
```

This modeled exactly how the operation would occur: if `pet` was defined, all the properties from `Person` would be present; otherwise, none of them would be defined on the result.
It was an all-or-nothing operation.

However, we've seen this pattern taken to the extreme, with hundreds of spreads in a single object, each spread potentially adding in hundreds or thousands of properties.
It turns out that for various reasons, this ends up being extremely expensive, and usually for not much benefit.

In TypeScript 4.1, the returned type sometimes uses all-optional properties.

```
{
    x: number;
    name?: string;
    age?: number;
    location?: string;
}
```

This ends up performing better and generally displaying better too.

For more details, [see the original change](https://github.com/microsoft/TypeScript/pull/40778).
While this behavior is not entirely consistent right now, we expect a future release will produce cleaner and more predictable results.

### Unmatched parameters are no longer related

TypeScript would previously relate parameters that didn't correspond to each other by relating them to the type `any`.
With [changes in TypeScript 4.1](https://github.com/microsoft/TypeScript/pull/41308), the language now skips this process entirely.
This means that some cases of assignability will now fail, but it also means that some cases of overload resolution can fail as well.
For example, overload resolution on `util.promisify` in Node.js may select a different overload in TypeScript 4.1, sometimes causing new or different errors downstream.

As a workaround, you may be best using a type assertion to squelch errors.
