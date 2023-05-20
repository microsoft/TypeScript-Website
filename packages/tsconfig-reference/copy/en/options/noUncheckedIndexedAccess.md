---
display: "No Unchecked Indexed Access"
oneline: "Add `undefined` to a type when accessed using an index."
---

TypeScript has a way to describe objects which have unknown keys but known values on an object, via index signatures.

```ts twoslash
interface EnvironmentVars {
  NAME: string;
  OS: string;

  // Unknown properties are covered by this index signature.
  [propName: string]: string;
}

declare const env: EnvironmentVars;

// Declared as existing
const sysName = env.NAME;
const os = env.OS;
//    ^?

// Not declared, but because of the index
// signature, then it is considered a string
const nodeEnv = env.NODE_ENV;
//    ^?
```

Turning on `noUncheckedIndexedAccess` will add `undefined` to any un-declared field in the type.

```ts twoslash
interface EnvironmentVars {
  NAME: string;
  OS: string;

  // Unknown properties are covered by this index signature.
  [propName: string]: string;
}
// @noUncheckedIndexedAccess
// ---cut---
declare const env: EnvironmentVars;

// Declared as existing
const sysName = env.NAME;
const os = env.OS;
//    ^?

// Not declared, but because of the index
// signature, then it is considered a string
const nodeEnv = env.NODE_ENV;
//    ^?
```
