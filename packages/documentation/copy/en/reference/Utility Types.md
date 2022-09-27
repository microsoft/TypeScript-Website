---
title: Utility Types
layout: docs
permalink: /docs/handbook/utility-types.html
oneline: Types which are globally included in TypeScript
translatable: true
---

TypeScript provides several utility types to facilitate common type transformations. These utilities are available globally.

## `Awaited<Type>`

<blockquote class=bg-reading>

Released:
[4.5](/docs/handbook/release-notes/typescript-4-5.html#the-awaited-type-and-promise-improvements)

</blockquote>

This type is meant to model operations like `await` in `async` functions, or the
`.then()` method on `Promise`s - specifically, the way that they recursively
unwrap `Promise`s.

##### Example

```ts twoslash
type A = Awaited<Promise<string>>;
//   ^?

type B = Awaited<Promise<Promise<number>>>;
//   ^?

type C = Awaited<boolean | Promise<number>>;
//   ^?
```

## `Partial<Type>`

<blockquote class=bg-reading>

Released:  
[2.1](/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)

</blockquote>

Constructs a type with all properties of `Type` set to optional. This utility will return a type that represents all subsets of a given type.

##### Example

```ts twoslash
interface Todo {
  title: string;
  description: string;
}

function updateTodo(todo: Todo, fieldsToUpdate: Partial<Todo>) {
  return { ...todo, ...fieldsToUpdate };
}

const todo1 = {
  title: "organize desk",
  description: "clear clutter",
};

const todo2 = updateTodo(todo1, {
  description: "throw out trash",
});
```

## `Required<Type>`

<blockquote class=bg-reading>

Released:  
[2.8](/docs/handbook/release-notes/typescript-2-8.html#improved-control-over-mapped-type-modifiers)

</blockquote>

Constructs a type consisting of all properties of `Type` set to required. The opposite of [`Partial`](#partialtype).

##### Example

```ts twoslash
// @errors: 2741
interface Props {
  a?: number;
  b?: string;
}

const obj: Props = { a: 5 };

const obj2: Required<Props> = { a: 5 };
```

## `Readonly<Type>`

<blockquote class=bg-reading>

Released:  
[2.1](/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)

</blockquote>

Constructs a type with all properties of `Type` set to `readonly`, meaning the properties of the constructed type cannot be reassigned.

##### Example

```ts twoslash
// @errors: 2540
interface Todo {
  title: string;
}

const todo: Readonly<Todo> = {
  title: "Delete inactive users",
};

todo.title = "Hello";
```

This utility is useful for representing assignment expressions that will fail at runtime (i.e. when attempting to reassign properties of a [frozen object](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze)).

##### `Object.freeze`

```ts
function freeze<Type>(obj: Type): Readonly<Type>;
```

## `Record<Keys, Type>`

<blockquote class=bg-reading>

Released:  
[2.1](/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)

</blockquote>

Constructs an object type whose property keys are `Keys` and whose property values are `Type`. This utility can be used to map the properties of a type to another type.

##### Example

```ts twoslash
interface CatInfo {
  age: number;
  breed: string;
}

type CatName = "miffy" | "boris" | "mordred";

const cats: Record<CatName, CatInfo> = {
  miffy: { age: 10, breed: "Persian" },
  boris: { age: 5, breed: "Maine Coon" },
  mordred: { age: 16, breed: "British Shorthair" },
};

cats.boris;
// ^?
```

## `Pick<Type, Keys>`

<blockquote class=bg-reading>

Released:  
[2.1](/docs/handbook/release-notes/typescript-2-1.html#partial-readonly-record-and-pick)

</blockquote>

Constructs a type by picking the set of properties `Keys` (string literal or union of string literals) from `Type`.

##### Example

```ts twoslash
interface Todo {
  title: string;
  description: string;
  completed: boolean;
}

type TodoPreview = Pick<Todo, "title" | "completed">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
};

todo;
// ^?
```

## `Omit<Type, Keys>`

<blockquote class=bg-reading>

Released:  
[3.5](/docs/handbook/release-notes/typescript-3-5.html#the-omit-helper-type)

</blockquote>

Constructs a type by picking all properties from `Type` and then removing `Keys` (string literal or union of string literals).

##### Example

```ts twoslash
interface Todo {
  title: string;
  description: string;
  completed: boolean;
  createdAt: number;
}

type TodoPreview = Omit<Todo, "description">;

const todo: TodoPreview = {
  title: "Clean room",
  completed: false,
  createdAt: 1615544252770,
};

todo;
// ^?

type TodoInfo = Omit<Todo, "completed" | "createdAt">;

const todoInfo: TodoInfo = {
  title: "Pick up kids",
  description: "Kindergarten closes at 5pm",
};

todoInfo;
// ^?
```

## `Exclude<UnionType, ExcludedMembers>`

<blockquote class=bg-reading>

Released:  
[2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

</blockquote>

Constructs a type by excluding from `UnionType` all union members that are assignable to `ExcludedMembers`.

##### Example

```ts twoslash
type T0 = Exclude<"a" | "b" | "c", "a">;
//    ^?
type T1 = Exclude<"a" | "b" | "c", "a" | "b">;
//    ^?
type T2 = Exclude<string | number | (() => void), Function>;
//    ^?
```

## `Extract<Type, Union>`

<blockquote class=bg-reading>

Released:  
[2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

</blockquote>

Constructs a type by extracting from `Type` all union members that are assignable to `Union`.

##### Example

```ts twoslash
type T0 = Extract<"a" | "b" | "c", "a" | "f">;
//    ^?
type T1 = Extract<string | number | (() => void), Function>;
//    ^?
```

## `NonNullable<Type>`

<blockquote class=bg-reading>

Released:  
[2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

</blockquote>

Constructs a type by excluding `null` and `undefined` from `Type`.

##### Example

```ts twoslash
type T0 = NonNullable<string | number | undefined>;
//    ^?
type T1 = NonNullable<string[] | null | undefined>;
//    ^?
```

## `Parameters<Type>`

<blockquote class=bg-reading>

Released:  
[3.1](https://github.com/microsoft/TypeScript/pull/26243)

</blockquote>

Constructs a tuple type from the types used in the parameters of a function type `Type`.

##### Example

```ts twoslash
// @errors: 2344
declare function f1(arg: { a: number; b: string }): void;

type T0 = Parameters<() => string>;
//    ^?
type T1 = Parameters<(s: string) => void>;
//    ^?
type T2 = Parameters<<T>(arg: T) => T>;
//    ^?
type T3 = Parameters<typeof f1>;
//    ^?
type T4 = Parameters<any>;
//    ^?
type T5 = Parameters<never>;
//    ^?
type T6 = Parameters<string>;
//    ^?
type T7 = Parameters<Function>;
//    ^?
```

## `ConstructorParameters<Type>`

<blockquote class=bg-reading>

Released:  
[3.1](https://github.com/microsoft/TypeScript/pull/26243)

</blockquote>

Constructs a tuple or array type from the types of a constructor function type. It produces a tuple type with all the parameter types (or the type `never` if `Type` is not a function).

##### Example

```ts twoslash
// @errors: 2344
// @strict: false
type T0 = ConstructorParameters<ErrorConstructor>;
//    ^?
type T1 = ConstructorParameters<FunctionConstructor>;
//    ^?
type T2 = ConstructorParameters<RegExpConstructor>;
//    ^?
type T3 = ConstructorParameters<any>;
//    ^?

type T4 = ConstructorParameters<Function>;
//    ^?
```

## `ReturnType<Type>`

<blockquote class=bg-reading>

Released:  
[2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

</blockquote>

Constructs a type consisting of the return type of function `Type`.

##### Example

```ts twoslash
// @errors: 2344 2344
declare function f1(): { a: number; b: string };

type T0 = ReturnType<() => string>;
//    ^?
type T1 = ReturnType<(s: string) => void>;
//    ^?
type T2 = ReturnType<<T>() => T>;
//    ^?
type T3 = ReturnType<<T extends U, U extends number[]>() => T>;
//    ^?
type T4 = ReturnType<typeof f1>;
//    ^?
type T5 = ReturnType<any>;
//    ^?
type T6 = ReturnType<never>;
//    ^?
type T7 = ReturnType<string>;
//    ^?
type T8 = ReturnType<Function>;
//    ^?
```

## `InstanceType<Type>`

<blockquote class=bg-reading>

Released:  
[2.8](/docs/handbook/release-notes/typescript-2-8.html#predefined-conditional-types)

</blockquote>

Constructs a type consisting of the instance type of a constructor function in `Type`.

##### Example

```ts twoslash
// @errors: 2344 2344
// @strict: false
class C {
  x = 0;
  y = 0;
}

type T0 = InstanceType<typeof C>;
//    ^?
type T1 = InstanceType<any>;
//    ^?
type T2 = InstanceType<never>;
//    ^?
type T3 = InstanceType<string>;
//    ^?
type T4 = InstanceType<Function>;
//    ^?
```

## `ThisParameterType<Type>`

<blockquote class=bg-reading>

Released:  
[3.3](https://github.com/microsoft/TypeScript/pull/28920)

</blockquote>

Extracts the type of the [this](/docs/handbook/functions.html#this-parameters) parameter for a function type, or [unknown](/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type) if the function type has no `this` parameter.

##### Example

```ts twoslash
function toHex(this: Number) {
  return this.toString(16);
}

function numberToString(n: ThisParameterType<typeof toHex>) {
  return toHex.apply(n);
}
```

## `OmitThisParameter<Type>`

<blockquote class=bg-reading>

Released:  
[3.3](https://github.com/microsoft/TypeScript/pull/28920)

</blockquote>

Removes the [`this`](/docs/handbook/functions.html#this-parameters) parameter from `Type`. If `Type` has no explicitly declared `this` parameter, the result is simply `Type`. Otherwise, a new function type with no `this` parameter is created from `Type`. Generics are erased and only the last overload signature is propagated into the new function type.

##### Example

```ts twoslash
function toHex(this: Number) {
  return this.toString(16);
}

const fiveToHex: OmitThisParameter<typeof toHex> = toHex.bind(5);

console.log(fiveToHex());
```

## `ThisType<Type>`

<blockquote class=bg-reading>

Released:  
[2.3](https://github.com/microsoft/TypeScript/pull/14141)

</blockquote>

This utility does not return a transformed type. Instead, it serves as a marker for a contextual [`this`](/docs/handbook/functions.html#this) type. Note that the [`noImplicitThis`](/tsconfig#noImplicitThis) flag must be enabled to use this utility.

##### Example

```ts twoslash
// @noImplicitThis: false
type ObjectDescriptor<D, M> = {
  data?: D;
  methods?: M & ThisType<D & M>; // Type of 'this' in methods is D & M
};

function makeObject<D, M>(desc: ObjectDescriptor<D, M>): D & M {
  let data: object = desc.data || {};
  let methods: object = desc.methods || {};
  return { ...data, ...methods } as D & M;
}

let obj = makeObject({
  data: { x: 0, y: 0 },
  methods: {
    moveBy(dx: number, dy: number) {
      this.x += dx; // Strongly typed this
      this.y += dy; // Strongly typed this
    },
  },
});

obj.x = 10;
obj.y = 20;
obj.moveBy(5, 5);
```

In the example above, the `methods` object in the argument to `makeObject` has a contextual type that includes `ThisType<D & M>` and therefore the type of [this](/docs/handbook/functions.html#this) in methods within the `methods` object is `{ x: number, y: number } & { moveBy(dx: number, dy: number): number }`. Notice how the type of the `methods` property simultaneously is an inference target and a source for the `this` type in methods.

The `ThisType<T>` marker interface is simply an empty interface declared in `lib.d.ts`. Beyond being recognized in the contextual type of an object literal, the interface acts like any empty interface.

## Intrinsic String Manipulation Types

### `Uppercase<StringType>`

### `Lowercase<StringType>`

### `Capitalize<StringType>`

### `Uncapitalize<StringType>`

To help with string manipulation around template string literals, TypeScript includes a set of types which can be used in string manipulation within the type system. You can find those in the [Template Literal Types](/docs/handbook/2/template-literal-types.html#uppercasestringtype) documentation.
