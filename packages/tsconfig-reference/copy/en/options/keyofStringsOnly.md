---
display: "Keyof Strings Only"
oneline: "Make keyof only return strings instead of string, numbers or symbols. Legacy option."
---

This flag changes the `keyof` type operator to return `string` instead of `string | number` when applied to a type with a string index signature.

This flag is used to help people keep this behavior from [before TypeScript 2.9's release](/docs/handbook/release-notes/typescript-2-9.html#support-number-and-symbol-named-properties-with-keyof-and-mapped-types).
