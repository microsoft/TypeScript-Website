<article>
<div class='whitespace raised content main-content-block'>

### Declare

The `declare` keyword is used to inform the TypeScript [Type System](#type-system) that a variable exists even if it cannot be found in the current source code.

```ts twoslash
// Declare that a ghost exists, and that it has a function called "boo"
declare const ghost: { boo: () => void };

ghost.boo();
```

TypeScript would [emit](#emit) JavaScript code like:

```ts twoslash
// @showEmit
// Declare that a ghost exists, and that it has a function called "boo"
declare const ghost: { boo: () => void };

ghost.boo();
```

This code could crash if there isn't other code setting up the `ghost` object elsewhere.

</div>
</article>
<article>
<div class='whitespace raised content main-content-block'>

### Emit

</div>
</article>
<article>
<div class='whitespace raised content main-content-block'>

### Index Signature

A type in TypeScript usually describes an exact set of fields to match on an object.
An index signature is a way to define the [Shape](#shape) of fields which are not known ahead of time.

```ts twoslash
type MathConstants = {
  pi: 3.14159;
  phi: 1.61803;

  [key: string]: number;
};

interface ModernConstants {
  taniguchi: 0.6782344919;
  raabe: 0.9189385332;

  [key: string]: number;
}
```

The `[key: string]: number;` is the index signature, which indicates to TypeScript that any fields on the object which are not mentioned will be a particular types.

For example, with a [Declared](#declare) instance of `ModernConstants`:

```ts twoslash
interface ModernConstants {
  taniguchi: 0.6782344919;
  raabe: 0.9189385332;

  [key: string]: number;
}
// ---cut---
declare const modernConstants: ModernConstants;

// This was defined earlier
modernConstants.raabe;
//              ^?

// This field was not defined above, so it is just `number`
modernConstants.lebesgue;
//              ^?
```

In TypeScript 4.1 you can use the TSConfig flag [`noPropertyAccessFromIndexSignature`](/tsconfig#noPropertyAccessFromIndexSignature) to enforce using quote notation (`modernConstants["lebesgue"]`) instead of dot notation (`modernConstants.lebesgue`) to make using an index signature explicit in the calling code.

</div>
</article>
<article>
<div class='whitespace raised content main-content-block'>

### Interface

An interface is a way to describe the [Shape](#shape) of a JavaScript object. For example, a dog could be described in the following format:

```ts twoslash
interface Dog {
  name: string;
  dateOfBirth: Date;
  markings: string[];
}
```

This means that only an object with a `name`, `dateOfBirth` and `markings` could be classed as a "Dog" in the [Type System](#type-system).

</div>
</article>
<article>
<div class='whitespace raised content main-content-block'>

### Parser

The parser is a part of the TypeScript compiler which takes the text from a [Source File](#source-file) and converts it into an [Abstract Syntax Tree](#abstract-syntax-tree).

</div>
</article>
<article>
<div class='whitespace raised content main-content-block'>

### JavaScript Runtime

</div>
</article>
<article>
<div class='whitespace raised content main-content-block'>

### Shape

The term "shape" is used to describe the fields and values on a JavaScript object. For example, you could say that this JavaScript object:

```ts
const house = {
  name: "Shibden hall",
  road: "Lister's Road",
  town: "Halifax",
  county: "West Yorkshire",
};
```

has the shape:

- `name`: `string`
- `road`: `string`
- `town`: `string`
- `country`: `string`

TypeScript can describe this shape using two different syntaxes: [Interfaces](#interface) and [Types](#type-literal)

```ts
interface House {
  name: string;
  road: string;
  town: string;
  country: string;
}

// or

type House = {
  name: string;
  road: string;
  town: string;
  country: string;
};
```

</div>
</article>
<article>
<div class='whitespace raised content main-content-block'>

### Source File

The representation of text which TypeScript would recognize as JavaScript or TypeScript source code.

</div>
</article>
<article>
<div class='whitespace raised content main-content-block'>

### Type System

The JavaScript language has types like `string`, `object`, `symbol`, `boolean` etc, but it does not have a static type system.

Often when the term "type system" is used, it is referring to a _static_ type system like TypeScript provides.
A static type system does not need to run your code in order to understand what the [Shape](#shape) of code at a particular location of a [Source File](#source-file) looks like.

TypeScript uses a static type system to offer editing tools:

```ts twoslash
// @noErrors
const shop = {
  name: "Table Store",
  address: "Maplewood",
};

shop.a;
//    ^|
```

As well as to provide a rich set of error messages when the types inside the type system don't match up:

```ts twoslash
// @errors: 2322
let shop = {
  name: "Table Store",
  address: "Maplewood",
};

shop = {
  nme: "Chair Store",
  address: "Maplewood",
};
```

</div>
</article>
<article>
<div class='whitespace raised content main-content-block'>

### Types vs Runtime

TypeScript adds a "type layer" on top of JavaScript code. TypeScript does this by adding additional syntax to JavaScript which needs to be removed in order to run inside a JavaScript [runtime](#runtime).

For example, this is JavaScript code which would run in a JavaScript runtime:

```ts
const hello = "Hello world";
```

This is not:

```ts
const hello: string = "Hello world";
```

The `: string` could be thought of as code which only exists in the "type layer" of TypeScript and not in the "runtime" / "expression" layer of JavaScript code which runs.

The type layer is

</div>
</article>
