---
title: Enums
layout: docs
permalink: /docs/handbook/enums.html
oneline: How TypeScript enums work
handbook: "true"
---

Enums are one of the few features TypeScript has which is not a type-level extension of JavaScript.

Enums allow a developer to define a set of named constants.
Using enums can make it easier to document intent, or create a set of distinct cases.
TypeScript provides both numeric and string-based enums.

## Numeric enums

We'll first start off with numeric enums, which are probably more familiar if you're coming from other languages.
An enum can be defined using the `enum` keyword.

```ts twoslash
enum Direction {
  Up = 1,
  Down,
  Left,
  Right,
}
```

Above, we have a numeric enum where `Up` is initialized with `1`.
All of the following members are auto-incremented from that point on.
In other words, `Direction.Up` has the value `1`, `Down` has `2`, `Left` has `3`, and `Right` has `4`.

If we wanted, we could leave off the initializers entirely:

```ts twoslash
enum Direction {
  Up,
  Down,
  Left,
  Right,
}
```

Here, `Up` would have the value `0`, `Down` would have `1`, etc.
This auto-incrementing behavior is useful for cases where we might not care about the member values themselves, but do care that each value is distinct from other values in the same enum.

Using an enum is simple: just access any member as a property off of the enum itself, and declare types using the name of the enum:

```ts twoslash
enum UserResponse {
  No = 0,
  Yes = 1,
}

function respond(recipient: string, message: UserResponse): void {
  // ...
}

respond("Princess Caroline", UserResponse.Yes);
```

Numeric enums can be mixed in [computed and constant members (see below)](#computed-and-constant-members).
The short story is, enums without initializers either need to be first, or have to come after numeric enums initialized with numeric constants or other constant enum members.
In other words, the following isn't allowed:

```ts twoslash
// @errors: 1061
const getSomeValue = () => 23;
// ---cut---
enum E {
  A = getSomeValue(),
  B,
}
```

## String enums

String enums are a similar concept, but have some subtle [runtime differences](#enums-at-runtime) as documented below.
In a string enum, each member has to be constant-initialized with a string literal, or with another string enum member.

```ts twoslash
enum Direction {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}
```

While string enums don't have auto-incrementing behavior, string enums have the benefit that they "serialize" well.
In other words, if you were debugging and had to read the runtime value of a numeric enum, the value is often opaque - it doesn't convey any useful meaning on its own (though [reverse mapping](#reverse-mappings) can often help). String enums allow you to give a meaningful and readable value when your code runs, independent of the name of the enum member itself.

## Heterogeneous enums

Technically enums can be mixed with string and numeric members, but it's not clear why you would ever want to do so:

```ts twoslash
enum BooleanLikeHeterogeneousEnum {
  No = 0,
  Yes = "YES",
}
```

Unless you're really trying to take advantage of JavaScript's runtime behavior in a clever way, it's advised that you don't do this.

## Computed and constant members

Each enum member has a value associated with it which can be either _constant_ or _computed_.
An enum member is considered constant if:

- It is the first member in the enum and it has no initializer, in which case it's assigned the value `0`:

  ```ts twoslash
  // E.X is constant:
  enum E {
    X,
  }
  ```

- It does not have an initializer and the preceding enum member was a _numeric_ constant.
  In this case the value of the current enum member will be the value of the preceding enum member plus one.

  ```ts twoslash
  // All enum members in 'E1' and 'E2' are constant.

  enum E1 {
    X,
    Y,
    Z,
  }

  enum E2 {
    A = 1,
    B,
    C,
  }
  ```

- The enum member is initialized with a constant enum expression.
  A constant enum expression is a subset of TypeScript expressions that can be fully evaluated at compile time.
  An expression is a constant enum expression if it is:

  1. a literal enum expression (basically a string literal or a numeric literal)
  2. a reference to previously defined constant enum member (which can originate from a different enum)
  3. a parenthesized constant enum expression
  4. one of the `+`, `-`, `~` unary operators applied to constant enum expression
  5. `+`, `-`, `*`, `/`, `%`, `<<`, `>>`, `>>>`, `&`, `|`, `^` binary operators with constant enum expressions as operands

  It is a compile time error for constant enum expressions to be evaluated to `NaN` or `Infinity`.

In all other cases enum member is considered computed.

```ts twoslash
enum FileAccess {
  // constant members
  None,
  Read = 1 << 1,
  Write = 1 << 2,
  ReadWrite = Read | Write,
  // computed member
  G = "123".length,
}
```

## Union enums and enum member types

There is a special subset of constant enum members that aren't calculated: literal enum members.
A literal enum member is a constant enum member with no initialized value, or with values that are initialized to

- any string literal (e.g. `"foo"`, `"bar`, `"baz"`)
- any numeric literal (e.g. `1`, `100`)
- a unary minus applied to any numeric literal (e.g. `-1`, `-100`)

When all members in an enum have literal enum values, some special semantics come into play.

The first is that enum members also become types as well!
For example, we can say that certain members can _only_ have the value of an enum member:

```ts twoslash
// @errors: 2322
enum ShapeKind {
  Circle,
  Square,
}

interface Circle {
  kind: ShapeKind.Circle;
  radius: number;
}

interface Square {
  kind: ShapeKind.Square;
  sideLength: number;
}

let c: Circle = {
  kind: ShapeKind.Square,
  radius: 100,
};
```

The other change is that enum types themselves effectively become a _union_ of each enum member.
With union enums, the type system is able to leverage the fact that it knows the exact set of values that exist in the enum itself.
Because of that, TypeScript can catch bugs where we might be comparing values incorrectly.
For example:

```ts twoslash
// @errors: 2367
enum E {
  Foo,
  Bar,
}

function f(x: E) {
  if (x !== E.Foo || x !== E.Bar) {
    //
  }
}
```

In that example, we first checked whether `x` was _not_ `E.Foo`.
If that check succeeds, then our `||` will short-circuit, and the body of the 'if' will run.
However, if the check didn't succeed, then `x` can _only_ be `E.Foo`, so it doesn't make sense to see whether it's equal to `E.Bar`.

## Enums at runtime

Enums are real objects that exist at runtime.
For example, the following enum

```ts twoslash
enum E {
  X,
  Y,
  Z,
}
```

can actually be passed around to functions

```ts twoslash
enum E {
  X,
  Y,
  Z,
}

function f(obj: { X: number }) {
  return obj.X;
}

// Works, since 'E' has a property named 'X' which is a number.
f(E);
```

## Enums at compile time

Even though Enums are real objects that exist at runtime, the `keyof` keyword works differently than you might expect for typical objects. Instead, use `keyof typeof` to get a Type that represents all Enum keys as strings.

```ts twoslash
enum LogLevel {
  ERROR,
  WARN,
  INFO,
  DEBUG,
}

/**
 * This is equivalent to:
 * type LogLevelStrings = 'ERROR' | 'WARN' | 'INFO' | 'DEBUG';
 */
type LogLevelStrings = keyof typeof LogLevel;

function printImportant(key: LogLevelStrings, message: string) {
  const num = LogLevel[key];
  if (num <= LogLevel.WARN) {
    console.log("Log level key is:", key);
    console.log("Log level value is:", num);
    console.log("Log level message is:", message);
  }
}
printImportant("ERROR", "This is a message");
```

### Reverse mappings

In addition to creating an object with property names for members, numeric enums members also get a _reverse mapping_ from enum values to enum names.
For example, in this example:

```ts twoslash
enum Enum {
  A,
}

let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

TypeScript compiles this down to the following JavaScript:

```ts twoslash
// @showEmit
enum Enum {
  A,
}

let a = Enum.A;
let nameOfA = Enum[a]; // "A"
```

In this generated code, an enum is compiled into an object that stores both forward (`name` -> `value`) and reverse (`value` -> `name`) mappings.
References to other enum members are always emitted as property accesses and never inlined.

Keep in mind that string enum members _do not_ get a reverse mapping generated at all.

### `const` enums

In most cases, enums are a perfectly valid solution.
However sometimes requirements are tighter.
To avoid paying the cost of extra generated code and additional indirection when accessing enum values, it's possible to use `const` enums.
Const enums are defined using the `const` modifier on our enums:

```ts twoslash
const enum Enum {
  A = 1,
  B = A * 2,
}
```

Const enums can only use constant enum expressions and unlike regular enums they are completely removed during compilation.
Const enum members are inlined at use sites.
This is possible since const enums cannot have computed members.

```ts twoslash
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

let directions = [
  Direction.Up,
  Direction.Down,
  Direction.Left,
  Direction.Right,
];
```

in generated code will become

```ts twoslash
// @showEmit
const enum Direction {
  Up,
  Down,
  Left,
  Right,
}

let directions = [
  Direction.Up,
  Direction.Down,
  Direction.Left,
  Direction.Right,
];
```

#### Const enum pitfalls

Inlining enum values is straightforward in concept, but comes with subtle implications.
These pitfalls only affect _ambient_ const enums (basically const enums in `.d.ts` files) and sharing them between projects --- but because `tsc --declaration` transforms `.ts` files into `.d.ts` files, if you are publishing or consuming `.d.ts` files, they likely apply to you.

1. They cannot be used by [JavaScript consumers](/docs/handbook/intro-to-js-ts.html).
2. You face a choice, which impacts your consumers, between inlining enum values and single-file transpilation (i.e. [`isolatedModules`](/tsconfig#references-to-const-enum-members)).
   That makes sense because the values and the target sites are not in a single file, so a single-file transpiler does not know and can not inline them.
   If you publish ambient const enums, consumers will either not be able to use them, or will not be able to use [`isolatedModules`](/tsconfig#references-to-const-enum-members).
   If you are consuming ambient const enums, there is a chance you can disregard the relevant errors or suppress them with [`// @ts-expect-error` comments](/docs/handbook/release-notes/typescript-3-9.html#-ts-expect-error-comments), and proceed without inlining, but this risks incurring errors at runtime if the enums are not preserved.

   Single-file transpilation [may become less important](https://github.com/evanw/esbuild/issues/128) in the future, but for now it is a common environment.
3. There are issues with [`importsNotUsedAsValues: "preserve"`](/tsconfig#importsNotUsedAsValues) and with [`preserveValueImports`](/tsconfig#preserveValueImports).
   Const enums cross the otherwise crisp boundary between compile time (types) and runtime (values), and the compiler [currently](https://github.com/microsoft/TypeScript/issues/40344) raises errors if you inline values and explicitly elide their imports [with type modifiers](/docs/handbook/modules.html#importing-types).
   You _can_ safely disregard or suppress these errors, however.
4. It is easy to inline values from version A of a dependency at compile time, but import version B at runtime, leading to surprising bugs if the values changed between A and B.
   It is perhaps not a common issue, but it is easy to happen and [has happened in the past](https://github.com/microsoft/TypeScript/issues/5219#issue-110947903).
   When it does happen it is pernicious, because you commonly build projects and run automated tests at roughly the same time, with the same dependency versions.

Here are two approaches to avoiding these pitfalls:

A. Do not use const enums at all.
   You can easily [ban const enums](https://typescript-eslint.io/docs/linting/troubleshooting#how-can-i-ban-specific-language-feature) with the help of a linter.
   This avoids any and all issues with them, but prevents you from inlining your project's own enums, which, unlike consuming those of other projects, is not problematic and may impact performance.
B. Do not publish ambient const enums, by deconstifying them with the help of [`preserveConstEnums`](/tsconfig#preserveConstEnums).
   This is the approach taken internally by the [TypeScript project itself](https://github.com/microsoft/TypeScript/pull/5422).
   [`preserveConstEnums`](/tsconfig#preserveConstEnums) emits the same JavaScript for const enums as plain enums, and you can then safely strip the `const` modifier from `.d.ts` files [in a build step](https://github.com/microsoft/TypeScript/blob/1a981d1df1810c868a66b3828497f049a944951c/Gulpfile.js#L144).
   Your project will inline its own const enums but your consumers will not.

## Ambient enums

Ambient enums are used to describe the shape of already existing enum types.

```ts twoslash
declare enum Enum {
  A = 1,
  B,
  C = 2,
}
```

One important difference between ambient and non-ambient enums is that, in regular enums, members that don't have an initializer will be considered constant if its preceding enum member is considered constant.
By contrast, an ambient (and non-const) enum member that does not have an initializer is _always_ considered computed.

## Objects vs Enums

In modern TypeScript, you may not need an enum when an object with `as const` could suffice:

```ts twoslash
const enum EDirection {
  Up,
  Down,
  Left,
  Right,
}

const ODirection = {
  Up: 0,
  Down: 1,
  Left: 2,
  Right: 3,
} as const;

EDirection.Up;
//         ^?

ODirection.Up;
//         ^?

// Using the enum as a parameter
function walk(dir: EDirection) {}

// It requires an extra line to pull out the values
type Direction = typeof ODirection[keyof typeof ODirection];
function run(dir: Direction) {}

walk(EDirection.Left);
run(ODirection.Right);
```

The biggest argument in favour of this format over TypeScript's `enum` is that it keeps your codebase aligned with the state of JavaScript, and [when/if](https://github.com/rbuckton/proposal-enum) enums are added to JavaScript then you can move to the additional syntax.
