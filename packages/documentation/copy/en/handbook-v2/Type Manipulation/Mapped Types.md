---
title: Mapped Types
layout: docs
permalink: /docs/handbook/2/mapped-types.html
oneline: "Generating types by re-using an existing type."
beta: true
---

When you don't want to repeat yourself, sometimes a type needs to be based on another type.

Mapped types build on the syntax for index signatures, which are used to declare the types of properties which has not been declared ahead of time:

```ts twoslash
type Horse = {};
// ---cut---
type OnlyBoolsAndHorses = {
  [key: string]: boolean | Horse;
};

const conforms: OnlyBoolsAndHorses = {
  del: true,
  rodney: false,
};
```

A mapped type is a generic type which uses a union created [via a `keyof`](/docs/handbook/2/indexed-access-types.html) to iterate through the keys of one type to create another:

```ts twoslash
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
```

In this example, `OptionFlags` will take all the properties from the type `Type` and change their values to be a boolean.

```ts twoslash
type OptionsFlags<Type> = {
  [Property in keyof Type]: boolean;
};
// ---cut---
type FeatureFlags = {
  darkMode: () => void;
  newUserProfile: () => void;
};

type FeatureOptions = OptionsFlags<FeatureFlags>;
//   ^?
```

### Mapping Modifiers

There are a two additional modifiers which can be applied during mapping: `readonly` and `?` which affect mutability and optionality respectively. Both of these modifiers support a prefix of `-` or `+` with `+` being the default.

```ts
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
type Concrete<T> = {
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
type RemoveKindField<T> = {
    [K in keyof T as Exclude<K, "kind">]: T[K]
};

interface Circle {
    kind: "circle";
    radius: number;
}

type KindlessCircle = RemoveKindField<Circle>;
//   ^?
```

### Further Exploration

Mapped types work well with other features in this type manipulation section, for example here is [a mapped type using a conditional type](/docs/handbook/2/conditional-types.html) which returns either a `true` or `false` depending on whether an object has the property `pii` set to the literal `true`:

```ts
type ExtractPII<Type> = {
  [Property in keyof Type]: Type[Property] extends { pii: true } ? true : false;
};

type DBFields = {
  id: { format: "incrementing" };
  name: { type: string; pii: true };
};

type ObjectsNeedingGDPRDeletion = CreateMutable<DBFields>;
```
