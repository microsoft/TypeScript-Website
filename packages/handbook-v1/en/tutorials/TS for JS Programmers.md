---
title: TypeScript for JavaScript Programmers
layout: docs
permalink: /docs/handbook/typescript-in-5-minutes.html
oneline: Learn how TypeScript extends JavaScript
---

The relationship between TypeScript and JavaScript is rather unique among modern programming languages.
TypeScript sits as a layer on-top of JavaScript, offering the features of JavaScript and then adds its own layer on top of that. This layer is the TypeScript type system.

JavaScript already has a set of language primitives like `string`, `number`, `object`, `undefined` etc.
However, there JS has no ahead-of-time checks that these are used consistently across your whole codebase: and this is where TypeScript comes in.

This means that your existing JavaScript code is also TypeScript code, except that TypeScript's type-checker might highlight discrepancies between what you _thought_ was happening and what JavaScript _does_.

This tutorial will give you a 5-minute overview of the type-system, with a focus on understanding the type-system language extension that TypeScript implements.

<!--
Should add a quick section on the `:` syntax extension, and specifically
how it's optional, otherwise the following section is very confusing.
-->

## Types by Inference

TypeScript "knows" the JavaScript language and will generate types for you in many cases.
For example, when you create a variable and assign it a particular value, TypeScript will use this value to infer a type (to see the type, hover over `helloWorld`).

```ts twoslash
let helloWorld = "Hello World";
//  ^?
```

By understanding how JavaScript works, TypeScript can build a type-system which accepts JavaScript code but has types. This offers basic type-checking functionality without a need to add extra text in the form of explicit types in your code. This is how TypeScript knows that `helloWorld` is a `string` in the above example.

It's quite possible that you have used VS Code with JavaScript, and had editor auto-completion as you worked.
That is because the understanding of JavaScript baked into TypeScript has been used under-the-hood to improve working with JavaScript.
<!--
Huh??  Should add some prefix to this paragraph that says that types are
also useful for dev tools like an editor, and that vscode is using TS to
provide good completions even when you write plain JS.
-->

## Defining Types
<!-- "Declaring"? -->

JavaScript is a dynamic language which allows for many design patterns.
Some of these patterns can be hard to automatically infer types for, and in these cases TypeScript supports an extension of the JavaScript language which offers places for you to tell TypeScript what the types should be.
<!--
I think that a quick mention of `:` should come above (see other
comment), and this should go into more detail.

Also, "can be hard" is misleading, since in many cases it's plain
impossible.  For example, if you use a "mode string" (such as with
files), there's no way to guess that it's not an arbitrary string but a
choice from a small set of options.
-->

Here is an example of creating an object which has an inferred type which includes `name: string` and `id: number`:

```ts twoslash
const user = {
  name: "Hayes",
  id: 0,
};
```

An explicit way to describe this object's shape is via an `interface` declaration:
<!--
This just made a huge jump from the very shallow end of the pool to way
closer to the other side...  Should really have some examples of using a
plain `:` before defining new types, and then maybe some simple types.
-->

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

<!-- Add a ---cut--- thing below to avoid repeating the interface again? -->

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

In addition to "plain objects", JavaScript supports classes and object-oriented programming, and therefore so does TypeScript - and an interface declaration can also be used with classes:

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

<!--
Maybe some function like `getParent` to demonstrate types on both I & O?
-->

There are already a small set of primitive types available in JavaScript: `boolean`, `bigint`, `null`, `number`, `string`, `symbol`, `object` and `undefined`, which you can use in an interface.
TypeScript extends this list with a few more.
For example: `any` (allow anything), [`unknown`](/en/play#example/unknown-and-never) (ensure someone using this type declares what the type is), [`never`](/en/play#example/unknown-and-never) (it's not possible that this type could happen) `void` (a function which returns `undefined` or has no return value).
<!--
I think that this is completely obscure in the context of an intro to
JS-ers --- all of these types need a proper (short) explanation...
The least that could be done is make it into some "further reading" kind
of a thing to avoid additional explanation on top of what's in the
playground pages, but having a short explanation here seems much better.
-->

You'll see quite quickly that there are two syntaxes for building types: [Interfaces and Types](/play/?e=83#example/types-vs-interfaces) - you should prefer `interface`, and use `type` when you need specific features.
<!-- Should explain the reason for this -->

## Composing Types

Similar to how you would create larger complex objects by composing them together TypeScript has tools for doing this with types.
The two most popular techniques you would use in everyday code to create new types by working with many smaller types are Unions and Generics.
<!--
IMO this intro paragraph is bad in two big ways: (a) union and generics
are not similar to composing objects (which, as a JS reader, is more
likely to sound like nesting objects); (b) it makes me think that union
and generics are similar in some way when they are extremely different
from each other...
-->

### Unions

A union is a way to declare that a type could be one of many types. For example, you could describe a `boolean` type as being either `true` or `false`:

```ts twoslash
type MyBool = true | false;
```

_Note:_ If you hover over `MyBool` above, you'll see that it is classed as `boolean` - that's a property of the Structural Type System, which we'll get to later.
<!--
Need to be a bit more explicit, to avoid people reading it as a
triviality and missing the fact that a type that they declare is
replaced by a builtin.  Even better, flip things so this is not the
first example --- which would make it much clearer *what* is the
structural thing is without a ton of verbiage.
-->

One of the most popular use-cases for union types is to describe a set of `string`s or `number`s [literal](/docs/handbook/literal-types.html) which a value is allowed to be:

```ts twoslash
type WindowStates = "open" | "closed" | "minimized";
type LockStates = "locked" | "unlocked";
type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
```

Unions provide a way to handle different types too, for example you may have a function which accepts an `array` or a `string`.
<!--
Would be good to add a *brief* note here, saying that this is something
that JS code often does, and that it's expressible using unions ---
unlike many statically typed languages that lack (proper) unions.
-->

```ts twoslash
function getLength(obj: string | string[]) {
  return obj.length;
}
```

TypeScript understands how code changes what the variable could be with time, you can use these checks to narrow the type down.
<!--
Need to have a longer whole-paragraph explanation here saying that once
you have an `A|B` variable, you need to have a way to distinguish them,
and that the following are ways of doing so with simple types.
Actually, even this text should be rewritten since "changes ... with
time" is extremely confusing and/or misleading.  In short, there is a
new concept here:
* In many statically typed language, a variable is associated with a
  type, and all references have that type.
* In contrast, TS can associate *different* types with the same
  variable, specifically, when you do such checks you get a narrower
  type.
-->

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
<!--
This is a cute example, but the problem with it is that it's very easy
to miss the `[]` at the end of the type-on-hover.  Instead, a first
example should do something like `number|string` or similar.
-->

### Generics

You can get very deep into the TypeScript generic system, but at a one minute high-level explanation, generics are a way to provide _type variables_.
<!--
This should be phrased better, and not apologize for itself :)
-->

A common example is an array, an array without generics could contain anything. An array with generics can describe what values are inside in the array.
<!--
I think that a perfect example here is to discuss an "identity"
function:

    function id(x: ___) { return x; }
    id(x)/2;

* Using `any` works, but it's turning off the typechecker so it's not
  what you want!  For example, this compiles too: `id(1).length`!

* Using `unknown` is much better if you want the type safety, but
  `unknown` really says that you know nothing so the division fails.

* The *only* way to do this properly therefore requires a way to say
  "the type of `f` is a function that takes some type `T` and returns
  that same type" --- and generics are the way to say just that.

This explanation could be added after the `Array<___>` example that
probably appeals more to C++/etc people since it goes a bit deeper.
-->

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
<!--
This is bad: it introduces a new concept in a comment in a sample,
instead of describing it explicitly.

Sidenote: a // ---continued--- feature would work well here, no need to
have the main text continued in an in-code comment.

Also: the first line in this comment is good, but the second one is long
enough to get scrolled out on my display.  Would be good to have a
meta-pass for all long lines (which I can do if needed).  The next two
comments are also waaaay too long.
-->
declare const backpack: Backpack<string>;

// object is a string, because we declared it above as the variable part of Backpack
const object = backpack.get();

// Due to backpack variable being a string, you cannot pass a number to the add function
backpack.add(23);
```

## Structural Type System

One of TypeScript's core principles is that type-checking focuses on the _shape_ which values have.
<!--
There's a problem here: this sentence implies a missing "in contrast
to", and that missing part requires a bit more explaining that is needed
about the "identity" of a type definition (or rather the lack of such an
identity in TS).
-->
This is sometimes called "duck typing" or "structural typing".
<!--
I had a comment here about "duck typing" being used in a confusing way,
but then I saw that wikipedia says exactly that:

| Duck typing is similar to, but distinct from structural typing.

So I think that "duck typing" should be dropped.  (Or at most be
mentioned in a parenthetical, possibly with a [WP
link](https://wikipedia.org/wiki/Duck_typing#Structural_type_systems).)
-->

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
<!--
This is obscure enough to easily miss it completely.  Could be much
improved by adding another quick example showing that you can define
some `Location` type with the same fields and show that it works.  (I
know that there's a `point3` later, but it's important to show that the
type *name* is not part of its identity -- that both `Point` and
`Location` are both just aliases to the *single *"an object with an `x`
and a `y` properties" type.  This is roughly getting the `VirtualPoint`
example up over here, except that the class vs object thing makes it
have extra baggage, so it's better to leave that where it is.)
-->

TypeScript's shape matching requires only a subset of the object's fields to match.

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

We have covered just a few of the basic highlights of TypeScript that you need to know in everyday code. From here you should:

- Read the full Handbook [from start to finish](/docs/handbook/intro.html) (30m)
- Explore the [Playground examples](/play#show-examples).
<!--
Maybe flip these?  I think that people are more likely to want to play
with things before comitting to reading a longer piece of text.
-->
