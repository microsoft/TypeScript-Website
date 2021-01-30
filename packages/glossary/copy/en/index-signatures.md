---
display: "Index Signature"
tags: typescript types
---

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
