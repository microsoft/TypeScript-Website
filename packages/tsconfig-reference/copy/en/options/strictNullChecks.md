---
display: "Strict Null Checks"
---

**Default**: `false`, unless `strict` is set

When `strictNullChecks` is `false`, `null` and `undefined` are considered to be valid values of all types.
This can lead to unexpected errors at runtime.

When `strictNullChecks` is `true`, `null` and `undefined` have their own distinct types and you'll get a type error if you try to use them where a concrete value is expected.
