---
title: Basic Types
layout: docs
permalink: /docs/handbook/basic-types.html
oneline: "Step one in learning TypeScript: The basics types."
---

# Introduction

For programs to be useful, we need to be able to work with some of the simplest units of data: numbers, strings, structures, boolean values, and the like.
In TypeScript, we support much the same types as you would expect in JavaScript, with a convenient enumeration type thrown in to help things along.

# Boolean

The most basic datatype is the simple true/false value, which JavaScript and TypeScript call a `boolean` value.

```ts  twoslash
let isDone: boolean = false;
```

# Number

As in JavaScript, all numbers in TypeScript are either floating point values or BigIntegers.
These floating point numbers get the type `number`, while BigIntegers get the type `bigint`.
In addition to hexadecimal and decimal literals, TypeScript also supports binary and octal literals introduced in ECMAScript 2015.

```ts twoslash
// @target: ES2020
let decimal: number = 6;
let hex: number = 0xf00d;
let binary: number = 0b1010;
let octal: number = 0o744;
let big: bigint = 100n;
```

# String

Another fundamental part of creating programs in JavaScript for webpages and servers alike is working with textual data.
As in other languages, we use the type `string` to refer to these textual datatypes.
Just like JavaScript, TypeScript also uses double quotes (`"`) or single quotes (`'`) to surround string data.

```ts twoslash
let color: string = "blue";
color = "red";
```

You can also use _template strings_, which can span multiple lines and have embedded expressions.
These strings are surrounded by the backtick/backquote (`` ` ``) character, and embedded expressions are of the form `${ expr }`.

```ts twoslash
let fullName: string = `Bob Bobbington`;
let age: number = 37;
let sentence: string = `Hello, my name is ${fullName}.

I'll be ${age + 1} years old next month.`;
```

This is equivalent to declaring `sentence` like so:

```ts twoslash
let fullName: string = `Bob Bobbington`;
let age: number = 37;
// ---cut---
let sentence: string =
  "Hello, my name is " +
  fullName +
  ".\n\n" +
  "I'll be " +
  (age + 1) +
  " years old next month.";
```

# Array

TypeScript, like JavaScript, allows you to work with arrays of values.
Array types can be written in one of two ways.
In the first, you use the type of the elements followed by `[]` to denote an array of that element type:

```ts twoslash
let list: number[] = [1, 2, 3];
```

The second way uses a generic array type, `Array<elemType>`:

```ts twoslash
let list: Array<number> = [1, 2, 3];
```

# Tuple

Tuple types allow you to express an array with a fixed number of elements whose types are known, but need not be the same. For example, you may want to represent a value as a pair of a `string` and a `number`:

```ts twoslash
// @errors: 2322
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ["hello", 10]; // OK
// Initialize it incorrectly
x = [10, "hello"]; // Error
```

When accessing an element with a known index, the correct type is retrieved:

```ts twoslash
// @errors: 2339
let x: [string, number];
x = ["hello", 10]; // OK
/// ---cut---
console.log(x[0].substring(1)); // OK
console.log(x[1].substring(1)); // Error, 'number' does not have 'substring'
```

Accessing an element outside the set of known indices fails with an error:

```ts twoslash
// @errors: 2493 2532 2322
let x: [string, number];
x = ["hello", 10]; // OK
/// ---cut---
x[3] = "world"; // Error, Property '3' does not exist on type '[string, number]'.

console.log(x[5].toString()); // Error, Property '5' does not exist on type '[string, number]'.
```

# Enum

A helpful addition to the standard set of datatypes from JavaScript is the `enum`.
As in languages like C#, an enum is a way of giving more friendly names to sets of numeric values.

```ts twoslash
enum Color {
  Red,
  Green,
  Blue,
}
let c: Color = Color.Green;
```

By default, enums begin numbering their members starting at `0`.
You can change this by manually setting the value of one of its members.
For example, we can start the previous example at `1` instead of `0`:

```ts twoslash
enum Color {
  Red = 1,
  Green,
  Blue,
}
let c: Color = Color.Green;
```

Or, even manually set all the values in the enum:

```ts twoslash
enum Color {
  Red = 1,
  Green = 2,
  Blue = 4,
}
let c: Color = Color.Green;
```

A handy feature of enums is that you can also go from a numeric value to the name of that value in the enum.
For example, if we had the value `2` but weren't sure what that mapped to in the `Color` enum above, we could look up the corresponding name:

```ts twoslash
enum Color {
  Red = 1,
  Green,
  Blue,
}
let colorName: string = Color[2];

console.log(colorName); // Displays 'Green' as its value is 2 above
```

# Unknown

We may need to describe the type of variables that we do not know when we are writing an application.
These values may come from dynamic content, e.g. from the user or a 3rd party library.
In these cases, we want to provide a type that tells the compiler and future readers that this variable could be anything so we give it the `unknown` type.

```ts twoslash
let notSure: unknown = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```

If you have a variable with an unknown type, you can narrow it to something more specific by doing `typeof` checks, comparison checks, or more advanced type guards that will be discussed in a later chapter:

```ts twoslash
// @errors: 2322 2322 2322
declare const maybe: unknown
const aNumber: number = maybe // error, 'maybe' could be a string, object, boolean, undefined, or an array
if (maybe === true) {
  const aBoolean: boolean = maybe // ok
  const aString: string = maybe // error, 'maybe' is definitely a boolean, so definitely NOT a string
}
if (typeof maybe === 'string') {
  const aString: string = maybe // ok
  const aBoolean: boolean = maybe // error, 'maybe' is definitely a string, so definitely NOT a boolean
}
```

# Void

`void` is the absence of having any type at all.
You may commonly see this as the return type of functions that do not return a value:

```ts twoslash
function warnUser(): void {
  console.log("This is my warning message");
}
```

Declaring variables of type `void` is not useful because you can only assign `null` (only if `--strictNullChecks` is not specified, see next section) or `undefined` to them:

```ts twoslash
// @strict: false
let unusable: void = undefined;
unusable = null; // OK if `--strictNullChecks` is not given
```

# Null and Undefined

In TypeScript, both `undefined` and `null` actually have their own types named `undefined` and `null` respectively.
Much like `void`, they're not extremely useful on their own:

```ts twoslash
// Not much else we can assign to these variables!
let u: undefined = undefined;
let n: null = null;
```

By default `null` and `undefined` are subtypes of all other types.
That means you can assign `null` and `undefined` to something like `number`.

However, when using the `--strictNullChecks` flag, `null` and `undefined` are only assignable to `unknown`, `any` and their respective types (the one exception being that `undefined` is also assignable to `void`).
This helps avoid _many_ common errors.
In cases where you want to pass in either a `string` or `null` or `undefined`, you can use the union type `string | null | undefined`.

Union types are an advanced topic that we'll cover in a later chapter.

> As a note: we encourage the use of `--strictNullChecks` when possible, but for the purposes of this handbook, we will assume it is turned off.

# Never

The `never` type represents the type of values that never occur.
For instance, `never` is the return type for a function expression or an arrow function expression that always throws an exception or one that never returns.
Variables also acquire the type `never` when narrowed by any type guards that can never be true.

The `never` type is a subtype of, and assignable to, every type; however, _no_ type is a subtype of, or assignable to, `never` (except `never` itself).
Even `any` isn't assignable to `never`.

Some examples of functions returning `never`:

```ts twoslash
// Function returning never must not have any reachable end point
function error(message: string): never {
  throw new Error(message);
}

// Inferred return type is never
function fail() {
  return error("Something failed");
}

// Function returning never must not have a reachable end point
function infiniteLoop(): never {
  while (true) {}
}
```

# Object

`object` is a type that represents the non-primitive type, i.e. anything that is not `number`, `string`, `boolean`, `symbol`, `null`, or `undefined`.

With `object` type, APIs like `Object.create` can be better represented. For example:

```ts twoslash
// @errors: 2345
declare function create(o: object | null): void;

create({ prop: 0 }); // OK
create(null); // OK

create(42); // Error
create("string"); // Error
create(false); // Error
create(undefined); // Error
```

# Any

In some situations, you may want to tell the TypeScript compiler to turn off type checking for a variable entirely.  Normally, this is a bad idea because you will lose all type safety, but sometimes it can make sense such as when converting a JavaScript application into TypeScript and you need to get things compiling while you slowly work on improving type safety of your application over time.
You might expect `Object` to play a similar role, as it does in other languages.
However, variables of type `Object` only allow you to assign any value to them. You can't call arbitrary methods on them, even ones that actually exist:

```ts twoslash
// @errors: 2339
let notSure: any = 4;
notSure.ifItExists(); // okay, ifItExists might exist at runtime
notSure.toFixed(); // okay, toFixed exists (but the compiler doesn't check)

let prettySure: Object = 4;
prettySure.toFixed(); // Error: Property 'toFixed' doesn't exist on type 'Object'.
```

In general, you should try to avoid the `any` type if you can and instead use `unknown` for variables that you don't know the type of at compile time, or the more advanced Mapped Types and Index Types which will be discussed in a later chapter.


# Type assertions

Sometimes you'll end up in a situation where you'll know more about a value than TypeScript does.
Usually this will happen when you know the type of some entity could be more specific than its current type.

_Type assertions_ are a way to tell the compiler "trust me, I know what I'm doing."
A type assertion is like a type cast in other languages, but performs no special checking or restructuring of data.
It has no runtime impact, and is used purely by the compiler.
TypeScript assumes that you, the programmer, have performed any special checks that you need.

Type assertions have two forms.
One is the "angle-bracket" syntax:

```ts twoslash
let someValue: any = "this is a string";

let strLength: number = (<string>someValue).length;
```

And the other is the `as`-syntax:

```ts twoslash
let someValue: any = "this is a string";

let strLength: number = (someValue as string).length;
```

The two samples are equivalent.
Using one over the other is mostly a choice of preference; however, when using TypeScript with JSX, only `as`-style assertions are allowed.

# A note about `let`

You may have noticed that so far, we've been using the `let` keyword instead of JavaScript's `var` keyword which you might be more familiar with.
The `let` keyword is actually a newer JavaScript construct that TypeScript makes available.
We'll discuss the details later, but many common problems in JavaScript are alleviated by using `let`, so you should use it instead of `var` whenever possible.
