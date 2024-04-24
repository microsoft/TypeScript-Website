---
title: Typeof Type Operator
layout: docs
permalink: /docs/handbook/2/typeof-types.html
oneline: "Using the typeof operator in type contexts."
---

## The `typeof` type operator

JavaScript already has a `typeof` operator you can use in an _expression_ context:

```ts twoslash
// Prints "string"
console.log(typeof "Hello world");
```

TypeScript adds a `typeof` operator you can use in a _type_ context to refer to the _type_ of a variable or property:

```ts twoslash
let s = "hello";
let n: typeof s;
//  ^?
```

This isn't very useful for basic types, but combined with other type operators, you can use `typeof` to conveniently express many patterns.
For an example, let's start by looking at the predefined type `ReturnType<T>`.
It takes a _function type_ and produces its return type:

```ts twoslash
type Predicate = (x: unknown) => boolean;
type K = ReturnType<Predicate>;
//   ^?
```

If we try to use `ReturnType` on a function name, we see an instructive error:

```ts twoslash
// @errors: 2749
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<f>;
```

Remember that _values_ and _types_ aren't the same thing.
To refer to the _type_ that the _value `f`_ has, we use `typeof`:

```ts twoslash
function f() {
  return { x: 10, y: 3 };
}
type P = ReturnType<typeof f>;
//   ^?
```

### Limitations

TypeScript intentionally limits the sorts of expressions you can use `typeof` on.

Specifically, it's only legal to use `typeof` on identifiers (i.e. variable names) or their properties.
This helps avoid the confusing trap of writing code you think is executing, but isn't:

```ts twoslash
// @errors: 1005
declare const msgbox: (prompt: string) => boolean;
// type msgbox = any;
// ---cut---
// Meant to use = ReturnType<typeof msgbox>
let shouldContinue: typeof msgbox("Are you sure you want to continue?");
```
