---
title: Advanced Types
layout: docs
permalink: /docs/handbook/advanced-types.html
oneline: Advanced concepts around types in TypeScript
deprecated_by: /docs/handbook/2/types-from-types.html

# prettier-ignore
deprecation_redirects: [
  type-guards-and-differentiating-types, /docs/handbook/2/narrowing.html,
  user-defined-type-guards, /docs/handbook/2/narrowing.html#using-type-predicates,
  typeof-type-guards, "/docs/handbook/2/narrowing.html#typeof-type-guards",
  instanceof-type-guards, /docs/handbook/2/narrowing.html#instanceof-narrowing,
  nullable-types, /docs/handbook/2/everyday-types.html#null-and-undefined,
  type-aliases, /docs/handbook/2/everyday-types.html#type-aliases,
  interfaces-vs-type-aliases, /docs/handbook/2/everyday-types.html#differences-between-type-aliases-and-interfaces,
  enum-member-types, /docs/handbook/enums.html,
  polymorphic-this-types, /docs/handbook/2/classes.html,
  index-types, /docs/handbook/2/objects.html#index-signatures,
  index-types-and-index-signatures, /docs/handbook/2/indexed-access-types.html,
  mapped-types, /docs/handbook/2/mapped-types.html,
  inference-from-mapped-types, /docs/handbook/2/mapped-types.html,
  conditional-types, /docs/handbook/2/conditional-types.html,
  distributive-conditional-types, /docs/handbook/2/conditional-types.html#distributive-conditional-types,
  type-inference-in-conditional-types, /docs/handbook/2/conditional-types.html#inferring-within-conditional-types,
  predefined-conditional-types, /docs/handbook/utility-types.html,
  using-the-in-operator, "/docs/handbook/2/narrowing.html#the-in-operator-narrowing",
  using-type-predicates, "/docs/handbook/2/narrowing.html#using-type-predicates"
]
---

This page lists some of the more advanced ways in which you can model types, it works in tandem with the [Utility Types](/docs/handbook/utility-types.html) doc which includes types which are included in TypeScript and available globally.

## Type Guards and Differentiating Types

Union types are useful for modeling situations when values can overlap in the types they can take on.
What happens when we need to know specifically whether we have a `Fish`?
A common idiom in JavaScript to differentiate between two possible values is to check for the presence of a member.
As we mentioned, you can only access members that are guaranteed to be in all the constituents of a union type.

```ts twoslash
// @errors: 2339
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
// ---cut---
let pet = getSmallPet();

// You can use the 'in' operator to check
if ("swim" in pet) {
  pet.swim();
}
// However, you cannot use property access
if (pet.fly) {
  pet.fly();
}
```

To get the same code working via property accessors, we'll need to use a type assertion:

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
// ---cut---
let pet = getSmallPet();
let fishPet = pet as Fish;
let birdPet = pet as Bird;

if (fishPet.swim) {
  fishPet.swim();
} else if (birdPet.fly) {
  birdPet.fly();
}
```

This isn't the sort of code you would want in your codebase however.

## User-Defined Type Guards

It would be much better if once we performed the check, we could know the type of `pet` within each branch.

It just so happens that TypeScript has something called a _type guard_.
A type guard is some expression that performs a runtime check that guarantees the type in some scope.

### Using type predicates

To define a type guard, we simply need to define a function whose return type is a _type predicate_:

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
// ---cut---
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
```

`pet is Fish` is our type predicate in this example.
A predicate takes the form `parameterName is Type`, where `parameterName` must be the name of a parameter from the current function signature.

Any time `isFish` is called with some variable, TypeScript will _narrow_ that variable to that specific type if the original type is compatible.

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
// ---cut---
// Both calls to 'swim' and 'fly' are now okay.
let pet = getSmallPet();

if (isFish(pet)) {
  pet.swim();
} else {
  pet.fly();
}
```

Notice that TypeScript not only knows that `pet` is a `Fish` in the `if` branch;
it also knows that in the `else` branch, you _don't_ have a `Fish`, so you must have a `Bird`.

You may use the type guard `isFish` to filter an array of `Fish | Bird` and obtain an array of `Fish`:

```ts twoslash
// @errors: 2345
type Fish = { swim: () => void };
type Bird = { fly: () => void };
declare function getSmallPet(): Fish | Bird;
function isFish(pet: Fish | Bird): pet is Fish {
  return (pet as Fish).swim !== undefined;
}
// ---cut---
const zoo: (Fish | Bird)[] = [getSmallPet(), getSmallPet(), getSmallPet()];
const underWater1: Fish[] = zoo.filter(isFish);
// or, equivalently
const underWater2: Fish[] = zoo.filter<Fish>(isFish);
const underWater3: Fish[] = zoo.filter<Fish>((pet) => isFish(pet));
```

### Using the `in` operator

The `in` operator also acts as a narrowing expression for types.

For a `n in x` expression, where `n` is a string literal or string literal type and `x` is a union type, the "true" branch narrows to types which have an optional or required property `n`, and the "false" branch narrows to types which have an optional or missing property `n`.

```ts twoslash
type Fish = { swim: () => void };
type Bird = { fly: () => void };
// ---cut---
function move(pet: Fish | Bird) {
  if ("swim" in pet) {
    return pet.swim();
  }
  return pet.fly();
}
```

## `typeof` type guards

Let's go back and write the code for a version of `padLeft` which uses union types.
We could write it with type predicates as follows:

```ts twoslash
function isNumber(x: any): x is number {
  return typeof x === "number";
}

function isString(x: any): x is string {
  return typeof x === "string";
}

function padLeft(value: string, padding: string | number) {
  if (isNumber(padding)) {
    return Array(padding + 1).join(" ") + value;
  }
  if (isString(padding)) {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

However, having to define a function to figure out if a type is a primitive is kind of a pain.
Luckily, you don't need to abstract `typeof x === "number"` into its own function because TypeScript will recognize it as a type guard on its own.
That means we could just write these checks inline.

```ts twoslash
function padLeft(value: string, padding: string | number) {
  if (typeof padding === "number") {
    return Array(padding + 1).join(" ") + value;
  }
  if (typeof padding === "string") {
    return padding + value;
  }
  throw new Error(`Expected string or number, got '${padding}'.`);
}
```

These _`typeof` type guards_ are recognized in two different forms: `typeof v === "typename"` and `typeof v !== "typename"`, where `"typename"` can be one of [`typeof` operator's return values](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof#Description) (`"undefined"`, `"number"`, `"string"`, `"boolean"`, `"bigint"`, `"symbol"`, `"object"`, or `"function"`).
While TypeScript won't stop you from comparing to other strings, the language won't recognize those expressions as type guards.

## `instanceof` type guards

If you've read about `typeof` type guards and are familiar with the `instanceof` operator in JavaScript, you probably have some idea of what this section is about.

_`instanceof` type guards_ are a way of narrowing types using their constructor function.
For instance, let's borrow our industrial strength string-padder example from earlier:

```ts twoslash
interface Padder {
  getPaddingString(): string;
}

class SpaceRepeatingPadder implements Padder {
  constructor(private numSpaces: number) {}
  getPaddingString() {
    return Array(this.numSpaces + 1).join(" ");
  }
}

class StringPadder implements Padder {
  constructor(private value: string) {}
  getPaddingString() {
    return this.value;
  }
}

function getRandomPadder() {
  return Math.random() < 0.5
    ? new SpaceRepeatingPadder(4)
    : new StringPadder("  ");
}

let padder: Padder = getRandomPadder();
//       ^?

if (padder instanceof SpaceRepeatingPadder) {
  padder;
  //   ^?
}
if (padder instanceof StringPadder) {
  padder;
  //   ^?
}
```

The right side of the `instanceof` needs to be a constructor function, and TypeScript will narrow down to:

1. the type of the function's `prototype` property if its type is not `any`
2. the union of types returned by that type's construct signatures

in that order.

## Nullable types

TypeScript has two special types, `null` and `undefined`, that have the values null and undefined respectively.
We mentioned these briefly in [the Basic Types section](/docs/handbook/basic-types.html).

By default, the type checker considers `null` and `undefined` assignable to anything.
Effectively, `null` and `undefined` are valid values of every type.
That means it's not possible to _stop_ them from being assigned to any type, even when you would like to prevent it.
The inventor of `null`, Tony Hoare, calls this his ["billion dollar mistake"](https://wikipedia.org/wiki/Null_pointer#History).

The [`strictNullChecks`](/tsconfig#strictNullChecks) flag fixes this: when you declare a variable, it doesn't automatically include `null` or `undefined`.
You can include them explicitly using a union type:

```ts twoslash
// @errors: 2322
let exampleString = "foo";
exampleString = null;

let stringOrNull: string | null = "bar";
stringOrNull = null;

stringOrNull = undefined;
```

Note that TypeScript treats `null` and `undefined` differently in order to match JavaScript semantics.
`string | null` is a different type than `string | undefined` and `string | undefined | null`.

From TypeScript 3.7 and onwards, you can use [optional chaining](/docs/handbook/release-notes/typescript-3-7.html#optional-chaining) to simplify working with nullable types.

### Optional parameters and properties

With [`strictNullChecks`](/tsconfig#strictNullChecks), an optional parameter automatically adds `| undefined`:

```ts twoslash
// @errors: 2345
function f(x: number, y?: number) {
  return x + (y ?? 0);
}

f(1, 2);
f(1);
f(1, undefined);
f(1, null);
```

The same is true for optional properties:

```ts twoslash
// @strict: false
// @strictNullChecks: true
// @errors: 2322
class C {
  a: number;
  b?: number;
}

let c = new C();

c.a = 12;
c.a = undefined;
c.b = 13;
c.b = undefined;
c.b = null;
```

### Type guards and type assertions

Since nullable types are implemented with a union, you need to use a type guard to get rid of the `null`.
Fortunately, this is the same code you'd write in JavaScript:

```ts twoslash
function f(stringOrNull: string | null): string {
  if (stringOrNull === null) {
    return "default";
  } else {
    return stringOrNull;
  }
}
```

The `null` elimination is pretty obvious here, but you can use terser operators too:

```ts twoslash
function f(stringOrNull: string | null): string {
  return stringOrNull ?? "default";
}
```

In cases where the compiler can't eliminate `null` or `undefined`, you can use the type assertion operator to manually remove them.
The syntax is postfix `!`: `identifier!` removes `null` and `undefined` from the type of `identifier`:

```ts twoslash
// @errors: 2532
function getUser(id: string): UserAccount | undefined {
  return {} as any;
}
// ---cut---
interface UserAccount {
  id: number;
  email?: string;
}

const user = getUser("admin");
user.id;

if (user) {
  user.email.length;
}

// Instead if you are sure that these objects or fields exist, the
// postfix ! lets you short circuit the nullability
user!.email!.length;
```

## Type Aliases

Type aliases create a new name for a type.
Type aliases are sometimes similar to interfaces, but can name primitives, unions, tuples, and any other types that you'd otherwise have to write by hand.

```ts twoslash
type Second = number;

let timeInSecond: number = 10;
let time: Second = 10;
```

Aliasing doesn't actually create a new type - it creates a new _name_ to refer to that type.
Aliasing a primitive is not terribly useful, though it can be used as a form of documentation.

Just like interfaces, type aliases can also be generic - we can just add type parameters and use them on the right side of the alias declaration:

```ts
type Container<T> = { value: T };
```

We can also have a type alias refer to itself in a property:

```ts
type Tree<T> = {
  value: T;
  left?: Tree<T>;
  right?: Tree<T>;
};
```

Together with [intersection](/docs/handbook/unions-and-intersections.html) types, we can make some pretty mind-bending types:

```ts twoslash
declare function getDriversLicenseQueue(): LinkedList<Person>;
// ---cut---
type LinkedList<Type> = Type & { next: LinkedList<Type> };

interface Person {
  name: string;
}

let people = getDriversLicenseQueue();
people.name;
people.next.name;
people.next.next.name;
people.next.next.next.name;
//                  ^?
```

## Interfaces vs. Type Aliases

As we mentioned, type aliases can act sort of like interfaces; however, there are some subtle differences.

Almost all features of an `interface` are available in `type`, the key distinction is that a type cannot be re-opened to add new properties vs an interface which is always extendable.

<table class='full-width-table'>
  <tbody>
    <tr>
      <th><code>Interface</code></th>
      <th><code>Type</code></th>
    </tr>
    <tr>
      <td>
        <p>Extending an interface</p>
        <code><pre>
interface Animal {
  name: string
}<br/>
interface Bear extends Animal {
  honey: boolean
}<br/>
const bear = getBear() 
bear.name
bear.honey
        </pre></code>
      </td>
      <td>
        <p>Extending a type via intersections</p>
        <code><pre>
type Animal = {
  name: string
}<br/>
type Bear = Animal & { 
  honey: Boolean 
}<br/>
const bear = getBear();
bear.name;
bear.honey;
        </pre></code>
      </td>
    </tr>
    <tr>
      <td>
        <p>Adding new fields to an existing interface</p>
        <code><pre>
interface Window {
  title: string
}<br/>
interface Window {
  ts: import("typescript")
}<br/>
const src = 'const a = "Hello World"';
window.ts.transpileModule(src, {});
        </pre></code>
      </td>
      <td>
        <p>A type cannot be changed after being created</p>
        <code><pre>
type Window = {
  title: string
}<br/>
type Window = {
  ts: import("typescript")
}<br/>
// Error: Duplicate identifier 'Window'.<br/>
        </pre></code>
      </td>
    </tr>
    </tbody>
</table>

Because an interface more closely maps how JavaScript objects work [by being open to extension](https://wikipedia.org/wiki/Open/closed_principle), we recommend using an interface over a type alias when possible.

On the other hand, if you can't express some shape with an interface and you need to use a union or tuple type, type aliases are usually the way to go.

## Enum Member Types

As mentioned in [our section on enums](./enums.html#union-enums-and-enum-member-types), enum members have types when every member is literal-initialized.

Much of the time when we talk about "singleton types", we're referring to both enum member types as well as numeric/string literal types, though many users will use "singleton types" and "literal types" interchangeably.

## Polymorphic `this` types

A polymorphic `this` type represents a type that is the _subtype_ of the containing class or interface.
This is called _F_-bounded polymorphism, a lot of people know it as the [fluent API](https://en.wikipedia.org/wiki/Fluent_interface) pattern.
This makes hierarchical fluent interfaces much easier to express, for example.
Take a simple calculator that returns `this` after each operation:

```ts twoslash
class BasicCalculator {
  public constructor(protected value: number = 0) {}
  public currentValue(): number {
    return this.value;
  }
  public add(operand: number): this {
    this.value += operand;
    return this;
  }
  public multiply(operand: number): this {
    this.value *= operand;
    return this;
  }
  // ... other operations go here ...
}

let v = new BasicCalculator(2).multiply(5).add(1).currentValue();
```

Since the class uses `this` types, you can extend it and the new class can use the old methods with no changes.

```ts twoslash
class BasicCalculator {
  public constructor(protected value: number = 0) {}
  public currentValue(): number {
    return this.value;
  }
  public add(operand: number): this {
    this.value += operand;
    return this;
  }
  public multiply(operand: number): this {
    this.value *= operand;
    return this;
  }
  // ... other operations go here ...
}
// ---cut---
class ScientificCalculator extends BasicCalculator {
  public constructor(value = 0) {
    super(value);
  }
  public sin() {
    this.value = Math.sin(this.value);
    return this;
  }
  // ... other operations go here ...
}

let v = new ScientificCalculator(2).multiply(5).sin().add(1).currentValue();
```

Without `this` types, `ScientificCalculator` would not have been able to extend `BasicCalculator` and keep the fluent interface.
`multiply` would have returned `BasicCalculator`, which doesn't have the `sin` method.
However, with `this` types, `multiply` returns `this`, which is `ScientificCalculator` here.

## Index types

With index types, you can get the compiler to check code that uses dynamic property names.
For example, a common JavaScript pattern is to pick a subset of properties from an object:

```js
function pluck(o, propertyNames) {
  return propertyNames.map((n) => o[n]);
}
```

Here's how you would write and use this function in TypeScript, using the **index type query** and **indexed access** operators:

```ts twoslash
function pluck<T, K extends keyof T>(o: T, propertyNames: K[]): T[K][] {
  return propertyNames.map((n) => o[n]);
}

interface Car {
  manufacturer: string;
  model: string;
  year: number;
}

let taxi: Car = {
  manufacturer: "Toyota",
  model: "Camry",
  year: 2014,
};

// Manufacturer and model are both of type string,
// so we can pluck them both into a typed string array
let makeAndModel: string[] = pluck(taxi, ["manufacturer", "model"]);

// If we try to pluck model and year, we get an
// array of a union type: (string | number)[]
let modelYear = pluck(taxi, ["model", "year"]);
```

The compiler checks that `manufacturer` and `model` are actually properties on `Car`.
The example introduces a couple of new type operators.
First is `keyof T`, the **index type query operator**.
For any type `T`, `keyof T` is the union of known, public property names of `T`.
For example:

```ts twoslash
interface Car {
  manufacturer: string;
  model: string;
  year: number;
}
// ---cut---
let carProps: keyof Car;
//         ^?
```

`keyof Car` is completely interchangeable with `"manufacturer" | "model" | "year"`.
The difference is that if you add another property to `Car`, say `ownersAddress: string`, then `keyof Car` will automatically update to be `"manufacturer" | "model" | "year" | "ownersAddress"`.
And you can use `keyof` in generic contexts like `pluck`, where you can't possibly know the property names ahead of time.
That means the compiler will check that you pass the right set of property names to `pluck`:

```ts
// error, Type '"unknown"' is not assignable to type '"manufacturer" | "model" | "year"'
pluck(taxi, ["year", "unknown"]);
```

The second operator is `T[K]`, the **indexed access operator**.
Here, the type syntax reflects the expression syntax.
That means that `taxi["manufacturer"]` has the type `Car["manufacturer"]` &mdash; which in our example is just `string`.
However, just like index type queries, you can use `T[K]` in a generic context, which is where its real power comes to life.
You just have to make sure that the type variable `K extends keyof T`.
Here's another example with a function named `getProperty`.

```ts
function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
  return o[propertyName]; // o[propertyName] is of type T[K]
}
```

In `getProperty`, `o: T` and `propertyName: K`, so that means `o[propertyName]: T[K]`.
Once you return the `T[K]` result, the compiler will instantiate the actual type of the key, so the return type of `getProperty` will vary according to which property you request.

```ts twoslash
// @errors: 2345
function getProperty<T, K extends keyof T>(o: T, propertyName: K): T[K] {
  return o[propertyName]; // o[propertyName] is of type T[K]
}
interface Car {
  manufacturer: string;
  model: string;
  year: number;
}
let taxi: Car = {
  manufacturer: "Toyota",
  model: "Camry",
  year: 2014,
};
// ---cut---
let manufacturer: string = getProperty(taxi, "manufacturer");
let year: number = getProperty(taxi, "year");

let unknown = getProperty(taxi, "unknown");
```

## Index types and index signatures

`keyof` and `T[K]` interact with index signatures. An index signature parameter type must be 'string' or 'number'.
If you have a type with a string index signature, `keyof T` will be `string | number`
(and not just `string`, since in JavaScript you can access an object property either
by using strings (`object["42"]`) or numbers (`object[42]`)).
And `T[string]` is just the type of the index signature:

```ts twoslash
interface Dictionary<T> {
  [key: string]: T;
}
let keys: keyof Dictionary<number>;
//     ^?
let value: Dictionary<number>["foo"];
//      ^?
```

If you have a type with a number index signature, `keyof T` will just be `number`.

```ts twoslash
// @errors: 2339
interface Dictionary<T> {
  [key: number]: T;
}

let keys: keyof Dictionary<number>;
//     ^?
let numberValue: Dictionary<number>[42];
//     ^?
let value: Dictionary<number>["foo"];
```

## Mapped types

A common task is to take an existing type and make each of its properties optional:

```ts
interface PersonSubset {
  name?: string;
  age?: number;
}
```

Or we might want a readonly version:

```ts
interface PersonReadonly {
  readonly name: string;
  readonly age: number;
}
```

This happens often enough in JavaScript that TypeScript provides a way to create new types based on old types &mdash; **mapped types**.
In a mapped type, the new type transforms each property in the old type in the same way.
For example, you can make all properties optional or of a type `readonly`.
Here are a couple of examples:

```ts twoslash
type Partial<T> = {
  [P in keyof T]?: T[P];
};

// @noErrors
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};
```

And to use it:

```ts twoslash
type Person = {
  name: string;
  age: number;
};
// ---cut---
type PersonPartial = Partial<Person>;
//   ^?
type ReadonlyPerson = Readonly<Person>;
//   ^?
```

Note that this syntax describes a type rather than a member.
If you want to add members, you can use an intersection type:

```ts twoslash
// @errors: 2693 1005 1128
// Use this:
type PartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
} & { newMember: boolean }

// This is an error!
type WrongPartialWithNewMember<T> = {
  [P in keyof T]?: T[P];
  newMember: boolean;
}
```

Let's take a look at the simplest mapped type and its parts:

```ts twoslash
type Keys = "option1" | "option2";
type Flags = { [K in Keys]: boolean };
```

The syntax resembles the syntax for index signatures with a `for .. in` inside.
There are three parts:

1. The type variable `K`, which gets bound to each property in turn.
2. The string literal union `Keys`, which contains the names of properties to iterate over.
3. The resulting type of the property.

In this simple example, `Keys` is a hard-coded list of property names and the property type is always `boolean`, so this mapped type is equivalent to writing:

```ts twoslash
type Flags = {
  option1: boolean;
  option2: boolean;
};
```

Real applications, however, look like `Readonly` or `Partial` above.
They're based on some existing type, and they transform the properties in some way.
That's where `keyof` and indexed access types come in:

```ts twoslash
type Person = {
  name: string;
  age: number;
};
// ---cut---
type NullablePerson = { [P in keyof Person]: Person[P] | null };
//   ^?
type PartialPerson = { [P in keyof Person]?: Person[P] };
//   ^?
```

But it's more useful to have a general version.

```ts
type Nullable<T> = { [P in keyof T]: T[P] | null };
type Partial<T> = { [P in keyof T]?: T[P] };
```

In these examples, the properties list is `keyof T` and the resulting type is some variant of `T[P]`.
This is a good template for any general use of mapped types.
That's because this kind of transformation is [homomorphic](https://wikipedia.org/wiki/Homomorphism), which means that the mapping applies only to properties of `T` and no others.
The compiler knows that it can copy all the existing property modifiers before adding any new ones.
For example, if `Person.name` was readonly, `Partial<Person>.name` would be readonly and optional.

Here's one more example, in which `T[P]` is wrapped in a `Proxy<T>` class:

```ts twoslash
// @noErrors
type Proxy<T> = {
  get(): T;
  set(value: T): void;
};

type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>;
};

function proxify<T>(o: T): Proxify<T> {
  // ... wrap proxies ...
}

let props = { rooms: 4 };
let proxyProps = proxify(props);
//  ^?
```

Note that `Readonly<T>` and `Partial<T>` are so useful, they are included in TypeScript's standard library along with `Pick` and `Record`:

```ts
type Pick<T, K extends keyof T> = {
  [P in K]: T[P];
};

type Record<K extends keyof any, T> = {
  [P in K]: T;
};
```

`Readonly`, `Partial` and `Pick` are homomorphic whereas `Record` is not.
One clue that `Record` is not homomorphic is that it doesn't take an input type to copy properties from:

```ts twoslash
type ThreeStringProps = Record<"prop1" | "prop2" | "prop3", string>;
```

Non-homomorphic types are essentially creating new properties, so they can't copy property modifiers from anywhere.

Note that `keyof any` represents the type of any value that can be used as an index to an object. In otherwords, `keyof any` is currently equal to `string | number | symbol`.

## Inference from mapped types

Now that you know how to wrap the properties of a type, the next thing you'll want to do is unwrap them.
Fortunately, that's pretty easy:

```ts twoslash
type Proxy<T> = {
  get(): T;
  set(value: T): void;
};

type Proxify<T> = {
  [P in keyof T]: Proxy<T[P]>;
};

function proxify<T>(o: T): Proxify<T> {
  return {} as any;
}

let props = { rooms: 4 };
let proxyProps = proxify(props);
// ---cut---
function unproxify<T>(t: Proxify<T>): T {
  let result = {} as T;
  for (const k in t) {
    result[k] = t[k].get();
  }
  return result;
}

let originalProps = unproxify(proxyProps);
//  ^?
```

Note that this unwrapping inference only works on homomorphic mapped types.
If the mapped type is not homomorphic you'll have to give an explicit type parameter to your unwrapping function.

## Conditional Types

A conditional type selects one of two possible types based on a condition expressed as a type relationship test:

```ts
T extends U ? X : Y
```

The type above means when `T` is assignable to `U` the type is `X`, otherwise the type is `Y`.

A conditional type `T extends U ? X : Y` is either _resolved_ to `X` or `Y`, or _deferred_ because the condition depends on one or more type variables.
When `T` or `U` contains type variables, whether to resolve to `X` or `Y`, or to defer, is determined by whether or not the type system has enough information to conclude that `T` is always assignable to `U`.

As an example of some types that are immediately resolved, we can take a look at the following example:

```ts twoslash
declare function f<T extends boolean>(x: T): T extends true ? string : number;

// Type is 'string | number'
let x = f(Math.random() < 0.5);
//  ^?
```

Another example would be the `TypeName` type alias, which uses nested conditional types:

```ts twoslash
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : "object";

type T0 = TypeName<string>;
//   ^?
type T1 = TypeName<"a">;
//   ^?
type T2 = TypeName<true>;
//   ^?
type T3 = TypeName<() => void>;
//   ^?
type T4 = TypeName<string[]>;
//   ^?
```

But as an example of a place where conditional types are deferred - where they stick around instead of picking a branch - would be in the following:

```ts twoslash
interface Foo {
  propA: boolean;
  propB: boolean;
}

declare function f<T>(x: T): T extends Foo ? string : number;

function foo<U>(x: U) {
  // Has type 'U extends Foo ? string : number'
  let a = f(x);

  // This assignment is allowed though!
  let b: string | number = a;
}
```

In the above, the variable `a` has a conditional type that hasn't yet chosen a branch.
When another piece of code ends up calling `foo`, it will substitute in `U` with some other type, and TypeScript will re-evaluate the conditional type, deciding whether it can actually pick a branch.

In the meantime, we can assign a conditional type to any other target type as long as each branch of the conditional is assignable to that target.
So in our example above we were able to assign `U extends Foo ? string : number` to `string | number` since no matter what the conditional evaluates to, it's known to be either `string` or `number`.

## Distributive conditional types

Conditional types in which the checked type is a naked type parameter are called _distributive conditional types_.
Distributive conditional types are automatically distributed over union types during instantiation.
For example, an instantiation of `T extends U ? X : Y` with the type argument `A | B | C` for `T` is resolved as `(A extends U ? X : Y) | (B extends U ? X : Y) | (C extends U ? X : Y)`.

#### Example

```ts twoslash
type TypeName<T> = T extends string
  ? "string"
  : T extends number
  ? "number"
  : T extends boolean
  ? "boolean"
  : T extends undefined
  ? "undefined"
  : T extends Function
  ? "function"
  : "object";
// ---cut---
type T5 = TypeName<string | (() => void)>;
//   ^?
type T6 = TypeName<string | string[] | undefined>;
//   ^?
type T7 = TypeName<string[] | number[]>;
//   ^?
```

In instantiations of a distributive conditional type `T extends U ? X : Y`, references to `T` within the conditional type are resolved to individual constituents of the union type (i.e. `T` refers to the individual constituents _after_ the conditional type is distributed over the union type).
Furthermore, references to `T` within `X` have an additional type parameter constraint `U` (i.e. `T` is considered assignable to `U` within `X`).

#### Example

```ts twoslash
type BoxedValue<T> = { value: T };
type BoxedArray<T> = { array: T[] };
type Boxed<T> = T extends any[] ? BoxedArray<T[number]> : BoxedValue<T>;

type T1 = Boxed<string>;
//   ^?
type T2 = Boxed<number[]>;
//   ^?
type T3 = Boxed<string | number[]>;
//   ^?
```

Notice that `T` has the additional constraint `any[]` within the true branch of `Boxed<T>` and it is therefore possible to refer to the element type of the array as `T[number]`. Also, notice how the conditional type is distributed over the union type in the last example.

The distributive property of conditional types can conveniently be used to _filter_ union types:

```ts twoslash
// @errors: 2300 2322
// Remove types from T that are assignable to U
type Diff<T, U> = T extends U ? never : T;
// Remove types from T that are not assignable to U
type Filter<T, U> = T extends U ? T : never;

type T1 = Diff<"a" | "b" | "c" | "d", "a" | "c" | "f">;
//   ^?
type T2 = Filter<"a" | "b" | "c" | "d", "a" | "c" | "f">; // "a" | "c"
//   ^?
type T3 = Diff<string | number | (() => void), Function>; // string | number
//   ^?
type T4 = Filter<string | number | (() => void), Function>; // () => void
//   ^?

// Remove null and undefined from T
type NotNullable<T> = Diff<T, null | undefined>;

type T5 = NotNullable<string | number | undefined>;
//   ^?
type T6 = NotNullable<string | string[] | null | undefined>;
//   ^?

function f1<T>(x: T, y: NotNullable<T>) {
  x = y;
  y = x;
}

function f2<T extends string | undefined>(x: T, y: NotNullable<T>) {
  x = y;
  y = x;
  let s1: string = x;
  let s2: string = y;
}
```

Conditional types are particularly useful when combined with mapped types:

```ts twoslash
type FunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? K : never;
}[keyof T];
type FunctionProperties<T> = Pick<T, FunctionPropertyNames<T>>;

type NonFunctionPropertyNames<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
}[keyof T];
type NonFunctionProperties<T> = Pick<T, NonFunctionPropertyNames<T>>;

interface Part {
  id: number;
  name: string;
  subparts: Part[];
  updatePart(newName: string): void;
}

type T1 = FunctionPropertyNames<Part>;
//   ^?
type T2 = NonFunctionPropertyNames<Part>;
//   ^?
type T3 = FunctionProperties<Part>;
//   ^?
type T4 = NonFunctionProperties<Part>;
//   ^?
```

Note, conditional types are not permitted to reference themselves recursively. For example the following is an error.

#### Example

```ts twoslash
// @errors: 2456 2315
type ElementType<T> = T extends any[] ? ElementType<T[number]> : T; // Error
```

## Type inference in conditional types

Within the `extends` clause of a conditional type, it is now possible to have `infer` declarations that introduce a type variable to be inferred.
Such inferred type variables may be referenced in the true branch of the conditional type.
It is possible to have multiple `infer` locations for the same type variable.

For example, the following extracts the return type of a function type:

```ts twoslash
// @noErrors
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;
```

Conditional types can be nested to form a sequence of pattern matches that are evaluated in order:

```ts twoslash
type Unpacked<T> = T extends (infer U)[]
  ? U
  : T extends (...args: any[]) => infer U
  ? U
  : T extends Promise<infer U>
  ? U
  : T;

type T0 = Unpacked<string>;
//   ^?
type T1 = Unpacked<string[]>;
//   ^?
type T2 = Unpacked<() => string>;
//   ^?
type T3 = Unpacked<Promise<string>>;
//   ^?
type T4 = Unpacked<Promise<string>[]>;
//   ^?
type T5 = Unpacked<Unpacked<Promise<string>[]>>;
//   ^?
```

The following example demonstrates how multiple candidates for the same type variable in co-variant positions causes a union type to be inferred:

```ts twoslash
type Foo<T> = T extends { a: infer U; b: infer U } ? U : never;

type T1 = Foo<{ a: string; b: string }>;
//   ^?
type T2 = Foo<{ a: string; b: number }>;
//   ^?
```

Likewise, multiple candidates for the same type variable in contra-variant positions causes an intersection type to be inferred:

```ts twoslash
type Bar<T> = T extends { a: (x: infer U) => void; b: (x: infer U) => void }
  ? U
  : never;

type T1 = Bar<{ a: (x: string) => void; b: (x: string) => void }>;
//   ^?
type T2 = Bar<{ a: (x: string) => void; b: (x: number) => void }>;
//   ^?
```

When inferring from a type with multiple call signatures (such as the type of an overloaded function), inferences are made from the _last_ signature (which, presumably, is the most permissive catch-all case).
It is not possible to perform overload resolution based on a list of argument types.

```ts twoslash
declare function foo(x: string): number;
declare function foo(x: number): string;
declare function foo(x: string | number): string | number;

type T1 = ReturnType<typeof foo>;
//   ^?
```

It is not possible to use `infer` declarations in constraint clauses for regular type parameters:

```ts twoslash
// @errors: 1338 2304
type ReturnedType<T extends (...args: any[]) => infer R> = R;
```

However, much the same effect can be obtained by erasing the type variables in the constraint and instead specifying a conditional type:

```ts twoslash
// @noErrors
type AnyFunction = (...args: any[]) => any;
type ReturnType<T extends AnyFunction> = T extends (...args: any[]) => infer R
  ? R
  : any;
```

## Predefined conditional types

TypeScript adds several predefined conditional types, you can find the full list and examples in [Utility Types](/docs/handbook/utility-types.html).
