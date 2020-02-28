---
title: TypeScript for JavaScript Programmers
layout: docs
permalink: /docs/handbook/typescript-in-5-minutes.html
---

The relationship between TypeScript and JavaScript is rather unique among modern programming languages, though of all programmers JavaScript Programmers are the most used to the idea of a language which expands .

What you will not know are the extensions to TypeScript in the type-system.
This tutorial is a 5 minute overview of the type-system.

## Defining Types

You can define a type either through inference, or by explicitly using a `type`.

Here is an example of creating an object which has an inferred type which includes `name: string` and `id: number`:

```ts twoslash
const user = {
  name: "Hayes",
  id: 0
};
```

An explicit way to describe this object's shape is via a `type` declaration:

```ts twoslash
type User = {
  name: string;
  id: number;
};
```

You can then declare that a JavaScript object conforms to that shape of your new `type` by using syntax like `: TypeName` after a variable declaration:

```ts twoslash
type User = {
  name: string;
  id: number;
};
// ---cut---
const user: User = {
  name: "Hayes",
  id: 0
};
```

TypeScript will warn you if you provide an object which doesn't match the type you have provided:

```ts twoslash
// @errors: 2322
type User = {
  name: string;
  id: number;
};

const user: User = {
  username: "Hayes",
  id: 0
};
```

Because JavaScript supports classes and object-orient programming, so does TypeScript - a type declaration can also be used with classes:

```ts twoslash
type User = {
  name: string;
  id: number;
};

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

A type can be used to annotate functions in a few ways:

```ts twoslash
// @noErrors
type User = {
  name: string;
  id: number;
};
// ---cut---
function getAdminUser(): User {
  //...
}

function deleteUser(user: User) {
  // ...
}
```

There are already a small set of primitive types available in JavaScript: `boolean`, `bigint`, `null`, `number`, `string`, `symbol`, `object` and `undefined`, which you can use in an interface. TypeScript extends this list with a few more. for example: `any` (allow anything), [`unknown`](/en/play#example/unknown-and-never) (ensure someone using this type declares what the type is), [`never`](/en/play#example/unknown-and-never) (it's not possible that this type could happen) `void` (a function which returns `undefined` or has no return value).

## Composing Types

TypeScript has three ways in which you can build complex types by working with many smaller types.

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

### Intersections

If a union type is an or ( `x || y` ), then an intersection type is an and `( x && y )`.
TypeScript has intersection types to merge types together:

```ts twoslash
type APIResponse = {
  success: boolean;
  error?: { message: string };
};

type ArtworksData = {
  artworks: { title: string }[];
};

type ArtistsData = {
  artists: { name: string }[];
};

type ArtistResponse = APIResponse & ArtistsData;
type ArtworkResponse = APIResponse & ArtworksData;
```

### Generics

You can get very deep into the TypeScript generic system, but at a 1 minute high-level explanation, generics are a way to provide variables to types.

A common example is an array, an array without generics could contain anything. An array with generics can describe what it holds in the array.

```ts
type StringArray = Array<string>;
type NumberArray = Array<number>;
type ObjectWithNameArray = Array<{ name: string }>;
```

You can declare your own types which use generics:

```ts twoslash
// @errors: 2345
type Backpack<Type> = {
  add: (obj: Type) => void;
  get: () => Type;
};

// This line is a shortcut to tell TypeScript there is a
// constant called `backpack`, and to not worry about where it came from
declare const backpack: Backpack<string>;

// object is a string, because we declared it above as the variable part of Backpack
const object = backpack.get();

// Due to this variable, you cannot pass a number to add
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

The `point` variable is never declared to be a `Point` type, but because TypeScript compares the shape of `point` to the shape of `Point` in the type-check.
Because they both have the same shape, then it passes.

The shape matching only requires a subset

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
// Errors: Argument of type '{ hex: string; }' is not assignable to parameter of type 'Point'.
printPoint(color);
```
