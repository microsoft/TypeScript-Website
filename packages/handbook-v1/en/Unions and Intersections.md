---
title: Unions and Intersection Types
layout: docs
permalink: /docs/handbook/unions-and-intersections.html
---

So far, the handbook has covered types which are atomic objects.
However, as you model more types you find yourself looking for tools which let you compose or combine existing types instead of creating them from scratch.

Intersection and Union types are one of the ways in which you can compose types.

# Union Types

Occasionally, you'll run into a library that expects a parameter to be either a `number` or a `string`.
For instance, take the following function:

```ts
/**
 * Takes a string and adds "padding" to the left.
 * If 'padding' is a string, then 'padding' is appended to the left side.
 * If 'padding' is a number, then that number of spaces is added to the left side.
 */
function padLeft(value: string, padding: any) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}

padLeft("Hello world", 4); // returns "    Hello world"
```

The problem with `padLeft` is that its `padding` parameter is typed as `any`.
That means that we can call it with an argument that's neither a `number` nor a `string`, but TypeScript will be okay with it.

```ts
let indentedString = padLeft("Hello world", true); // passes at compile time, fails at runtime.
```

In traditional object-oriented code, we might abstract over the two types by creating a hierarchy of types.
While this is much more explicit, it's also a little bit overkill.
One of the nice things about the original version of `padLeft` was that we were able to just pass in primitives.
That meant that usage was simple and concise.
This new approach also wouldn't help if we were just trying to use a function that already exists elsewhere.

Instead of `any`, we can use a _union type_ for the `padding` parameter:

```ts
/**
 * Takes a string and adds "padding" to the left.
 * If 'padding' is a string, then 'padding' is appended to the left side.
 * If 'padding' is a number, then that number of spaces is added to the left side.
 */
function padLeft(value: string, padding: string | number) {
  // ...
}

let indentedString = padLeft("Hello world", true); // errors during compilation
```

A union type describes a value that can be one of several types.
We use the vertical bar (`|`) to separate each type, so `number | string | boolean` is the type of a value that can be a `number`, a `string`, or a `boolean`.

If we have a value that has a union type, we can only access members that are common to all types in the union.

```ts
interface Bird {
  fly();
  layEggs();
}

interface Fish {
  swim();
  layEggs();
}

function getSmallPet(): Fish | Bird {
  // ...
}

let pet = getSmallPet();
pet.layEggs(); // okay
pet.swim(); // errors
```

Union types can be a bit tricky here, but it just takes a bit of intuition to get used to.
If a value has the type `A | B`, we only know for _certain_ that it has members that both `A` _and_ `B` have.
In this example, `Bird` has a member named `fly`.
We can't be sure whether a variable typed as `Bird | Fish` has a `fly` method.
If the variable is really a `Fish` at runtime, then calling `pet.fly()` will fail.

# Intersection Types

Intersection types are closely related to union types, but they are used very differently.
An intersection type combines multiple types into one.
This allows you to add together existing types to get a single type that has all the features you need.
For example, `Person & Serializable & Loggable` is a type which is all of `Person` _and_ `Serializable` _and_ `Loggable`.
That means an object of this type will have all members of all three types.

Here's a simple example that shows how to create a mixin:

```ts
function extend<First, Second>(first: First, second: Second): First & Second {
  const result: Partial<First & Second> = {};
  for (const prop in first) {
    if (first.hasOwnProperty(prop)) {
      (result as First)[prop] = first[prop];
    }
  }
  for (const prop in second) {
    if (second.hasOwnProperty(prop)) {
      (result as Second)[prop] = second[prop];
    }
  }
  return result as First & Second;
}

class Person {
  constructor(public name: string) {}
}

interface Loggable {
  log(name: string): void;
}

class ConsoleLogger implements Loggable {
  log(name) {
    console.log(`Hello, I'm ${name}.`);
  }
}

const jim = extend(new Person("Jim"), ConsoleLogger.prototype);
jim.log(jim.name);
```
