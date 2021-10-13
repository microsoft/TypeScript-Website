---
title: Template Literal Types
layout: docs
permalink: /docs/handbook/2/template-literal-types.html
oneline: "Generating mapping types which change properties via template literal strings."
---

Template literal types build on [string literal types](/docs/handbook/2/everyday-types.html#literal-types), and have the ability to expand into many strings via unions.

They have the same syntax as [template literal strings in JavaScript](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals), but are used in type positions.
When used with concrete literal types, a template literal produces a new string literal type by concatenating the contents.

```ts twoslash
type World = "world";

type Greeting = `hello ${World}`;
//   ^?
```

When a union is used in the interpolated position, the type is the set of every possible string literal that could be represented by each union member:

```ts twoslash
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";

type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
//   ^?
```

For each interpolated position in the template literal, the unions are cross multiplied:

```ts twoslash
type EmailLocaleIDs = "welcome_email" | "email_heading";
type FooterLocaleIDs = "footer_title" | "footer_sendoff";
// ---cut---
type AllLocaleIDs = `${EmailLocaleIDs | FooterLocaleIDs}_id`;
type Lang = "en" | "ja" | "pt";

type LocaleMessageIDs = `${Lang}_${AllLocaleIDs}`;
//   ^?
```

We generally recommend that people use ahead-of-time generation for large string unions, but this is useful in smaller cases.

### String Unions in Types

The power in template literals comes when defining a new string based off an existing string inside a type.

For example, a common pattern in JavaScript is to extend an object based on the fields that it currently has. We'll provide a type definition for a function which adds support for an `on` function which lets you know when a value has changed:

```ts twoslash
// @noErrors
declare function makeWatchedObject(obj: any): any;
// ---cut---
const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26,
});

person.on("firstNameChanged", (newValue) => {
  console.log(`firstName was changed to ${newValue}!`);
});
```

Notice that `on` listens on the event `"firstNameChanged"`, not just `"firstName"`, template literals provide a way to handle this sort of string manipulation inside the type system:

```ts twoslash
type PropEventSource<Type> = {
    on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
};

/// Create a "watched object" with an 'on' method
/// so that you can watch for changes to properties.
declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;
```

With this, we can build something that errors when given the wrong property:

```ts twoslash
// @errors: 2345
type PropEventSource<Type> = {
    on(eventName: `${string & keyof Type}Changed`, callback: (newValue: any) => void): void;
};

declare function makeWatchedObject<T>(obj: T): T & PropEventSource<T>;
// ---cut---
const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26
});

person.on("firstNameChanged", () => {});

// It's typo-resistant
person.on("firstName", () => {});

person.on("frstNameChanged", () => {});
```

### Inference with Template Literals

Note how the last examples did not re-use the type of the original value. The callback used an `any`. Template literal types can infer from substitution positions.

We can make our last example generic to infer from parts of the `eventName` string to figure out the associated property.

```ts twoslash
type PropEventSource<Type> = {
    on<Key extends string & keyof Type>
        (eventName: `${Key}Changed`, callback: (newValue: Type[Key]) => void ): void;
};

declare function makeWatchedObject<Type>(obj: Type): Type & PropEventSource<Type>;

const person = makeWatchedObject({
  firstName: "Saoirse",
  lastName: "Ronan",
  age: 26
});

person.on("firstNameChanged", newName => {
    //                        ^?
    console.log(`new name is ${newName.toUpperCase()}`);
});

person.on("ageChanged", newAge => {
    //                  ^?
    if (newAge < 0) {
        console.warn("warning! negative age");
    }
})
```

Here we made `on` into a generic method.

When a user calls with the string `"firstNameChanged'`, TypeScript will try to infer the right type for `Key`.
To do that, it will match `Key` against the content prior to `"Changed"` and infer the string `"firstName"`.
Once TypeScript figures that out, the `on` method can fetch the type of `firstName` on the original object, which is `string` in this case.
Similarly, when called with `"ageChanged"`, TypeScript finds the type for the property `age` which is `number`.

Inference can be combined in different ways, often to deconstruct strings, and reconstruct them in different ways.

## Intrinsic String Manipulation Types

To help with string manipulation, TypeScript includes a set of types which can be used in string manipulation. These types come built-in to the compiler for performance and can't be found in the `.d.ts` files included with TypeScript.

### `Uppercase<StringType>`

Converts each character in the string to the uppercase version.

##### Example

```ts twoslash
type Greeting = "Hello, world"
type ShoutyGreeting = Uppercase<Greeting>
//   ^?

type ASCIICacheKey<Str extends string> = `ID-${Uppercase<Str>}`
type MainID = ASCIICacheKey<"my_app">
//   ^?
```

### `Lowercase<StringType>`

Converts each character in the string to the lowercase equivalent.

##### Example

```ts twoslash
type Greeting = "Hello, world"
type QuietGreeting = Lowercase<Greeting>
//   ^?

type ASCIICacheKey<Str extends string> = `id-${Lowercase<Str>}`
type MainID = ASCIICacheKey<"MY_APP">
//   ^?
```

### `Capitalize<StringType>`

Converts the first character in the string to an uppercase equivalent.

##### Example

```ts twoslash
type LowercaseGreeting = "hello, world";
type Greeting = Capitalize<LowercaseGreeting>;
//   ^?
```

### `Uncapitalize<StringType>`

Converts the first character in the string to a lowercase equivalent.

##### Example

```ts twoslash
type UppercaseGreeting = "HELLO WORLD";
type UncomfortableGreeting = Uncapitalize<UppercaseGreeting>;
//   ^?
```

<details>
    <summary>Technical details on the intrinsic string manipulation types</summary>
    <p>The code, as of TypeScript 4.1, for these intrinsic functions uses the JavaScript string runtime functions directly for manipulation and are not locale aware.</p>
    <code><pre>
function applyStringMapping(symbol: Symbol, str: string) {
    switch (intrinsicTypeKinds.get(symbol.escapedName as string)) {
        case IntrinsicTypeKind.Uppercase: return str.toUpperCase();
        case IntrinsicTypeKind.Lowercase: return str.toLowerCase();
        case IntrinsicTypeKind.Capitalize: return str.charAt(0).toUpperCase() + str.slice(1);
        case IntrinsicTypeKind.Uncapitalize: return str.charAt(0).toLowerCase() + str.slice(1);
    }
    return str;
}</pre></code>
</details>
