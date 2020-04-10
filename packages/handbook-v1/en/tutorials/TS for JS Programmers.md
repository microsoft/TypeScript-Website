---
title: TypeScript for JavaScript Programmers
layout: docs
permalink: /docs/handbook/typescript-in-5-minutes.html
oneline: Learn how TypeScript extends JavaScript
---

The relationship between TypeScript and JavaScript is rather unique among modern programming languages.
TypeScript sits as a layer on-top of JavaScript, offering the features of JavaScript and then adds it's own layer on top of that. This layer is the TypeScript type system.

JavaScript already has a set of language primitives like `string`, `number`, `object`, `undefined` etc, however there are no ahead-of-time checks that these are consistently assigned across your whole codebase. TypeScript acts as that layer.

This means that your existing working JavaScript code is also TypeScript code, however TypeScript's type-checker might highlight discrepancies between what you thought was happening and what the JavaScript language does.

This tutorial tries to give you a 5 minute overview of the type-system, with a focus on understanding the type-system language extensions which TypeScript adds.

## Types by Inference

TypeScript knows the JavaScript language and will generate types for you in many cases.
For example in creating a variable and assigning it to a particular value, TypeScript will use the value as its type.

```ts twoslash
let helloWorld = "Hello World";
//  ^?
```

By understanding how JavaScript works, TypeScript can build a type-system which accepts JavaScript code but has types. This offers a type-system without needing to add extra characters to make types explicit in your code. Which is how TypeScript knows that `helloWorld` is a `string` in the above example.

It's quite possible that you have used VS Code with JavaScript, and had editor auto-completion as you worked.
That is because the understanding of JavaScript baked into TypeScript has been used under-the-hood to improve working with JavaScript.

## Defining Types

JavaScript is a dynamic language which allows for a lot of design patterns. Some design patterns can be hard to automatically provide types for automatically (because they might use dynamic programming) in those cases TypeScript supports an extension of the JavaScript language which offers places for you to tell TypeScript what the types should be.

Here is an example of creating an object which has an inferred type which includes `name: string` and `id: number`:

```ts twoslash
const user = {
  name: "Hayes",
  id: 0,
};
```

An explicit way to describe this object's shape is via an `interface` declaration:

```ts twoslash
interface User {
  name: string;
  id: number;
}
```

You can then declare that a JavaScript object conforms to that shape of your new `interface` by using syntax like `: TypeName` after a variable declaration:

```ts twoslash
interface User {
  name: string;
  id: number;
}
// ---cut---
const user: User = {
  name: "Hayes",
  id: 0,
};
```

TypeScript will warn you if you provide an object which doesn't match the interface you have provided:

```ts twoslash
// @errors: 2322
interface User {
  name: string;
  id: number;
}

const user: User = {
  username: "Hayes",
  id: 0,
};
```

Because JavaScript supports classes and object-orient programming, so does TypeScript - an interface declaration can also be used with classes:

```ts twoslash
interface User {
  name: string;
  id: number;
}

class UserAccount {
  name: string;
  id: number;

  constructor(name: string, id: number) {
    this.name = name;
    this.id = id;
  }
}

const user: User = new UserAccount("Murphy", 1);
```

Interfaces can be used to annotate parameters and return values to functions:

```ts twoslash
// @noErrors
interface User {
  name: string;
  id: number;
}
// ---cut---
function getAdminUser(): User {
  //...
}

function deleteUser(user: User) {
  // ...
}
```

There are already a small set of primitive types available in JavaScript: `boolean`, `bigint`, `null`, `number`, `string`, `symbol`, `object` and `undefined`, which you can use in an interface. TypeScript extends this list with a few more. for example: `any` (allow anything), [`unknown`](/en/play#example/unknown-and-never) (ensure someone using this type declares what the type is), [`never`](/en/play#example/unknown-and-never) (it's not possible that this type could happen) `void` (a function which returns `undefined` or has no return value).

You'll see quite quickly that there are two syntaxes for building types: [Interfaces and Types](/play/?e=83#example/types-vs-interfaces) - you should prefer `interface`, and use `type` when you need specific features.

## Composing Types

Similar to how you would create larger complex objects by composing them together TypeScript has tools for doing this with types.
The two most popular techniques you would use in everyday code to create new types by working with many smaller types are Unions and Generics.

### Unions

A union is a way to declare that a type could be one of many types. For example, you could describe a `boolean` type as being either `true` or `false`:

```ts twoslash
type MyBool = true | false;
```

_Note:_ If you hover over `MyBool` above, you'll see that it is classed as `boolean` - that's an property of the Structural Type System, which we'll get to later.

One of the most popular use-cases for union types is to describe a set of `string`s or `number`s [literal](/handbook/literal-types.html) which a value is allowed to be:

```ts twoslash
type WindowStates = "open" | "closed" | "minimized";
type LockStates = "locked" | "unlocked";
type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
```

Unions provide a way to handle different types too, for example you may have a function which accepts an `array` or a `string`.

```ts twoslash
function getLength(obj: string | string[]) {
  return obj;
}
```

TypeScript understands how code changes what the variable could be with time, you can use these checks to narrow the type down.

| Type      | Predicate                          |
| --------- | ---------------------------------- |
| string    | `typeof s === "string"`            |
| number    | `typeof n === "number"`            |
| boolean   | `typeof b === "boolean"`           |
| undefined | `typeof undefined === "undefined"` |
| function  | `typeof f === "function"`          |
| array     | `Array.isArray(a)`                 |

For example, you could differentiate between a `string` and an `array`, using `typeof obj === "string"` and TypeScript will know what the object is down different code paths.

<!-- prettier-ignore -->
```ts twoslash
function wrapInArray(obj: string | string[]) {
  if (typeof obj === "string") {
    return [obj];
//          ^?
  } else {
    return obj;
  }
}
```

### Generics

You can get very deep into the TypeScript generic system, but at a 1 minute high-level explanation, generics are a way to provide variables to types.

A common example is an array, an array without generics could contain anything. An array with generics can describe what values are inside in the array.

```ts
type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;
```

You can declare your own types which use generics:

```ts twoslash
// @errors: 2345
interface Backpack<Type> {
  add: (obj: Type) => void;
  get: () => Type;
}

// This line is a shortcut to tell TypeScript there is a
// constant called `backpack`, and to not worry about where it came from
declare const backpack: Backpack<string>;

// object is a string, because we declared it above as the variable part of Backpack
const object = backpack.get();

// Due to backpack variable being a string, you cannot pass a number to the add function
backpack.add(23);
```

## Structural Type System

One of TypeScript's core principles is that type checking focuses on the _shape_ which values have.
This is sometimes called "duck typing" or "structural typing".

In a structural type system if two objects have the same shape, they are considered the same.

```ts twoslash
interface Point {
  x: number;
  y: number;
}

function printPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}

// prints "12, 26"
const point = { x: 12, y: 26 };
printPoint(point);
```

The `point` variable is never declared to be a `Point` type, but TypeScript compares the shape of `point` to the shape of `Point` in the type-check.
Because they both have the same shape, then it passes.

The shape matching only requires a subset of the object's fields to match.

```ts twoslash
// @errors: 2345
interface Point {
  x: number;
  y: number;
}

function printPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}
// ---cut---
const point3 = { x: 12, y: 26, z: 89 };
printPoint(point3); // prints "12, 26"

const rect = { x: 33, y: 3, width: 30, height: 80 };
printPoint(rect); // prints "33, 3"

const color = { hex: "#187ABF" };

printPoint(color);
```

Finally, to really nail this point down, structurally there is no difference between how classes and objects conform to shapes:

```ts twoslash
// @errors: 2345
interface Point {
  x: number;
  y: number;
}

function printPoint(p: Point) {
  console.log(`${p.x}, ${p.y}`);
}
// ---cut---
class VirtualPoint {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

const newVPoint = new VirtualPoint(13, 56);
printPoint(newVPoint); // prints "13, 56"
```

If the object or class has all the required properties, then TypeScript will say they match regardless of the implementation details.

## Next Steps

This doc is a high level 5 minute overview of the sort of syntax and tools you would use in everyday code. From here you should:

- Read the full Handbook [from start to finish](/docs/handbook/basic-types.html) (30m)
- Explore the [Playground examples](/play#show-examples).
