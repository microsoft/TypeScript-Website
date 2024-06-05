---
display: "Type System"
tags: typescript abstract
---

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
// @errors: 2561
let shop = {
  name: "Table Store",
  address: "Maplewood",
};

shop = {
  nme: "Chair Store",
  address: "Maplewood",
};
```
