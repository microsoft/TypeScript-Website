---
title: Conditional Types
layout: docs
permalink: /docs/handbook/2/conditional-types.html
oneline: "Create types which act like if statements in the type system."
---

At the heart of most useful programs, we have to make decisions based on input.
JavaScript programs are no different, but given the fact that values can be easily introspected, those decisions are also based on the types of the inputs.
_Conditional types_ help describe the relation between the types of inputs and outputs.

```ts twoslash
interface Animal {
  live(): void;
}
interface Dog extends Animal {
  woof(): void;
}

type Example1 = Dog extends Animal ? number : string;
//   ^?

type Example2 = RegExp extends Animal ? number : string;
//   ^?
```

Conditional types take a form that looks a little like conditional expressions (`condition ? trueExpression : falseExpression`) in JavaScript:

```ts twoslash
type SomeType = any;
type OtherType = any;
type TrueType = any;
type FalseType = any;
type Stuff =
  // ---cut---
  SomeType extends OtherType ? TrueType : FalseType;
```

When the type on the left of the `extends` is assignable to the one on the right, then you'll get the type in the first branch (the "true" branch); otherwise you'll get the type in the latter branch (the "false" branch).

From the examples above, conditional types might not immediately seem useful - we can tell ourselves whether or not `Dog extends Animal` and pick `number` or `string`!
But the power of conditional types comes from using them with generics.

For example, let's take the following `createLabel` function:

```ts twoslash
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}

function createLabel(id: number): IdLabel;
function createLabel(name: string): NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel;
function createLabel(nameOrId: string | number): IdLabel | NameLabel {
  throw "unimplemented";
}
```

These overloads for createLabel describe a single JavaScript function that makes a choice based on the types of its inputs. Note a few things:

1. If a library has to make the same sort of choice over and over throughout its API, this becomes cumbersome.
2. We have to create three overloads: one for each case when we're _sure_ of the type (one for `string` and one for `number`), and one for the most general case (taking a `string | number`). For every new type `createLabel` can handle, the number of overloads grows exponentially.

Instead, we can encode that logic in a conditional type:

```ts twoslash
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}
// ---cut---
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
```

We can then use that conditional type to simplify our overloads down to a single function with no overloads.

```ts twoslash
interface IdLabel {
  id: number /* some fields */;
}
interface NameLabel {
  name: string /* other fields */;
}
type NameOrId<T extends number | string> = T extends number
  ? IdLabel
  : NameLabel;
// ---cut---
function createLabel<T extends number | string>(idOrName: T): NameOrId<T> {
  throw "unimplemented";
}

let a = createLabel("typescript");
//  ^?

let b = createLabel(2.8);
//  ^?

let c = createLabel(Math.random() ? "hello" : 42);
//  ^?
```

### Conditional Type Constraints

Often, the checks in a conditional type will provide us with some new information.
Just like narrowing with type guards can give us a more specific type, the true branch of a conditional type will further constrain generics by the type we check against.

For example, let's take the following:

```ts twoslash
// @errors: 2536
type MessageOf<T> = T["message"];
```

In this example, TypeScript errors because `T` isn't known to have a property called `message`.
We could constrain `T`, and TypeScript would no longer complain:

```ts twoslash
type MessageOf<T extends { message: unknown }> = T["message"];

interface Email {
  message: string;
}

type EmailMessageContents = MessageOf<Email>;
//   ^?
```

However, what if we wanted `MessageOf` to take any type, and default to something like `never` if a `message` property isn't available?
We can do this by moving the constraint out and introducing a conditional type:

```ts twoslash
type MessageOf<T> = T extends { message: unknown } ? T["message"] : never;

interface Email {
  message: string;
}

interface Dog {
  bark(): void;
}

type EmailMessageContents = MessageOf<Email>;
//   ^?

type DogMessageContents = MessageOf<Dog>;
//   ^?
```

Within the true branch, TypeScript knows that `T` _will_ have a `message` property.

As another example, we could also write a type called `Flatten` that flattens array types to their element types, but leaves them alone otherwise:

```ts twoslash
type Flatten<T> = T extends any[] ? T[number] : T;

// Extracts out the element type.
type Str = Flatten<string[]>;
//   ^?

// Leaves the type alone.
type Num = Flatten<number>;
//   ^?
```

When `Flatten` is given an array type, it uses an indexed access with `number` to fetch out `string[]`'s element type.
Otherwise, it just returns the type it was given.

### Inferring Within Conditional Types

We just found ourselves using conditional types to apply constraints and then extract out types.
This ends up being such a common operation that conditional types make it easier.

Conditional types provide us with a way to infer from types we compare against in the true branch using the `infer` keyword.
For example, we could have inferred the element type in `Flatten` instead of fetching it out "manually" with an indexed access type:

```ts twoslash
type Flatten<Type> = Type extends Array<infer Item> ? Item : Type;
```

Here, we used the `infer` keyword to declaratively introduce a new generic type variable named `Item` instead of specifying how to retrieve the element type of `Type` within the true branch.
This frees us from having to think about how to dig through and probing apart the structure of the types we're interested in.

We can write some useful helper type aliases using the `infer` keyword.
For example, for simple cases, we can extract the return type out from function types:

```ts twoslash
type GetReturnType<Type> = Type extends (...args: never[]) => infer Return
  ? Return
  : never;

type Num = GetReturnType<() => number>;
//   ^?

type Str = GetReturnType<(x: string) => string>;
//   ^?

type Bools = GetReturnType<(a: boolean, b: boolean) => boolean[]>;
//   ^?
```

When inferring from a type with multiple call signatures (such as the type of an overloaded function), inferences are made from the _last_ signature (which, presumably, is the most permissive catch-all case). It is not possible to perform overload resolution based on a list of argument types.

```ts twoslash
declare function stringOrNum(x: string): number;
declare function stringOrNum(x: number): string;
declare function stringOrNum(x: string | number): string | number;

type T1 = ReturnType<typeof stringOrNum>;
//   ^?
```

## Distributive Conditional Types

When conditional types act on a generic type, they become _distributive_ when given a union type.
For example, take the following:

```ts twoslash
type ToArray<Type> = Type extends any ? Type[] : never;
```

If we plug a union type into `ToArray`, then the conditional type will be applied to each member of that union.

```ts twoslash
type ToArray<Type> = Type extends any ? Type[] : never;

type StrArrOrNumArr = ToArray<string | number>;
//   ^?
```

What happens here is that `StrArrOrNumArr` distributes on:

```ts twoslash
type StrArrOrNumArr =
  // ---cut---
  string | number;
```

and maps over each member type of the union, to what is effectively:

```ts twoslash
type ToArray<Type> = Type extends any ? Type[] : never;
type StrArrOrNumArr =
  // ---cut---
  ToArray<string> | ToArray<number>;
```

which leaves us with:

```ts twoslash
type StrArrOrNumArr =
  // ---cut---
  string[] | number[];
```

Typically, distributivity is the desired behavior.
To avoid that behavior, you can surround each side of the `extends` keyword with square brackets.

```ts twoslash
type ToArrayNonDist<Type> = [Type] extends [any] ? Type[] : never;

// 'StrArrOrNumArr' is no longer a union.
type StrArrOrNumArr = ToArrayNonDist<string | number>;
//   ^?
```
