---
display: "Declare"
tags: typescript types keyword
---

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
