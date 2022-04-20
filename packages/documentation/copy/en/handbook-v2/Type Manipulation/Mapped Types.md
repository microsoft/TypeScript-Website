---
title: Mapped Types
layout: docs
permalink: /docs/handbook/2/mapped-types.html
oneline: "Generating types by re-using an existing type."
---

When you don't want to repeat yourself, sometimes a type needs to be based on another type: that is, a new type with the same JavaScript object properties as another type, but modified in some way.

For example, supposing you have a mutable `Person` type and also want a separate type for an immutable Person, and another for a partially-built Person, and another separate type to represent per-property change-flags, and a fourth type representing a an object loaded from a database with its database-generated primary key (e.g. `IDENTITY`/`AUTO_INCREMENT`), then you would need to repeat the property list every time, with modifications:

```ts twoslash
type Person = {
    age: number;
    name: string;
    alive: boolean
};

/** Immutable person */
type ReadOnlyPerson = {
    readonly age: number;
    readonly name: string;
    readonly alive: boolean
};

/** Incomplete Person: all properties are optional (i.e. undefined) */
type IncompletePerson = {
    age?: number;
    name?: string;
    alive?: boolean
};

/** Person property is-changed flags (e.g. for generating minimal SQL UPDATE statements)  */
type PersonChangeFlags = {
    age: boolean;
    name: boolean;
    alive: boolean
};

/** Already-saved Person loaded from a database, with its immutable SQL IDENTITY primary key property  */
type PersistedPerson = {
    readonly primaryKey: number;
    age: boolean;
    name: boolean;
    alive: boolean
};
```

However if we define `ReadOnlyPerson`, `IncompletePerson`, `PersonChangeFlags`, and `PersistedPerson` as types _mapped to_ `type Person` then the amount of code we need to write is drastically reduced, as well as eliminating the maintenance burden of keeping all the types' properties lists in-sync. Doing this, the above types become just this:

```ts twoslash
type Person = { age: number; name: string; alive: boolean };
/// ---cut---
// Use `+readonly` to add the `readonly` modifier to all properties in Person:
type ReadOnlyPerson = { +readonly [PersonPropertyName in keyof Person]: Person[PersonPropertyName] };
//   ^?

// Use  `+?` to add `?` to all properties in Person, making them optional (i.e. maybe-undefined):
type IncompletePerson  = { [PersonPropertyName in keyof Person]+?: Person[PersonPropertyName] };
//   ^?

// Use `: boolean` to change the type of every property in Person to boolean:
type PersonChangeFlags = { [PersonPropertyName in keyof Person]: boolean };
//   ^?

// Additional properties can be defined in a mapped type, just like any other type:
type PersistedPerson = {
    [PersonPropertyName in keyof Person]: boolean,
    readonly primaryKey: number;
};
//   ^?
```

Taking this a step further: supposing in addition to `type Person` we also have `type Order`, `type Product`, `type OrderItem`, and we want immutable, partial, and flags copies of all of those types, then we don't need to manually define mapped-types for those either: we can make our mapped-types generic:

```ts twoslash
type Person = { age: number; name: string; alive: boolean };
/// ---cut---
type ReadOnly<T> = { +readonly [PropertyName in keyof T]: T[PropertyName] };

type Incomplete<T> = { [PropertyName in keyof T]+?: T[PropertyName] };

type ChangeFlags<T> = { [PropertyName in keyof T]: boolean };

type Persisted<T> = { [PropertyName in keyof T]: boolean, readonly primaryKey: number };

// So now you can, for example, pass-around `ReadOnly<Person>` without needing to define `type ReadOnlyPerson`.
// But if you still wanted to, you could define ReadOnlyPerson like so:
type ReadOnlyPerson = ReadOnly<Person>;
//   ^?

// These types can also be composed, so if you want an immutable incomplete Person you can do this:
type ReadOnlyIncompletePerson = ReadOnly<Incomplete<Person>>;
//   ^?
// ...or:
type IncompleteReadOnlyPerson = Incomplete<ReadOnly<Person>>;
//   ^?

// Note that in this particular case `ReadOnlyIncompletePerson` and `IncompleteReadOnlyPerson` are equivalent, but this is not universally true.
// For example, `ReadOnly<Persisted<Person>>` is distinct from `Persisted<ReadOnly<Person>`.

type ReadOnlyPersistedPerson = ReadOnly<Persisted<Person>>;
//   ^?
// ...or:
type PersistedReadOnlyPerson = Persisted<ReadOnly<Person>>;
//   ^?
```

### Mapping Modifiers

There are two modifiers which can be applied during mapping: `readonly` and `?` which affect mutability and optionality respectively.

You can remove or add these modifiers by prefixing with `-` or `+`. If you don't add a prefix, then `+` is assumed.

```ts twoslash
// Removes 'readonly' attributes from a type's properties
type CreateMutable<Type> = {
  -readonly [Property in keyof Type]: Type[Property];
};

type LockedAccount = {
  readonly id: string;
  readonly name: string;
};

type UnlockedAccount = CreateMutable<LockedAccount>;
//   ^?
```

```ts twoslash
// Removes 'optional' attributes from a type's properties
type Concrete<Type> = {
  [Property in keyof Type]-?: Type[Property];
};

type MaybeUser = {
  id: string;
  name?: string;
  age?: number;
};

type User = Concrete<MaybeUser>;
//   ^?
```

## Key Remapping via `as`

In TypeScript 4.1 and onwards, you can re-map keys in mapped types with an `as` clause in a mapped type:

```ts
type MappedTypeWithNewProperties<Type> = {
    [Properties in keyof Type as NewKeyType]: Type[Properties]
}
```

You can leverage features like [template literal types](/docs/handbook/2/template-literal-types.html) to create new property names from prior ones:

```ts twoslash
type Getters<Type> = {
    [Property in keyof Type as `get${Capitalize<string & Property>}`]: () => Type[Property]
};

interface Person {
    name: string;
    age: number;
    location: string;
}

type LazyPerson = Getters<Person>;
//   ^?
```

You can filter out keys by producing `never` via a conditional type:

```ts twoslash
// Remove the 'kind' property
type RemoveKindField<Type> = {
    [Property in keyof Type as Exclude<Property, "kind">]: Type[Property]
};

interface Circle {
    kind: "circle";
    radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;
//   ^?
```

You can map over arbitrary unions, not just unions of `string | number | symbol`, but unions of any type:

```ts twoslash
type EventConfig<Events extends { kind: string }> = {
    [E in Events as E["kind"]]: (event: E) => void;
}

type SquareEvent = { kind: "square", x: number, y: number };
type CircleEvent = { kind: "circle", radius: number };

type Config = EventConfig<SquareEvent | CircleEvent>
//   ^?
```

### Further Exploration

Mapped types work well with other features in this type manipulation section, for example here is [a mapped type using a conditional type](/docs/handbook/2/conditional-types.html) which returns either a `true` or `false` depending on whether an object has the property `pii` set to the literal `true`:

```ts twoslash
type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};

type DBFields = {
  id: { format: "incrementing" };
  name: { type: string; pii: true };
};

type ObjectsNeedingGDPRDeletion = ExtractPII<DBFields>;
//   ^?
```
