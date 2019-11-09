---
display: "Keyof Strings Only"
---

> ❌ **Discouraged:** This flag was provided for backward compatibility reasons and should not be enabled in new or maintained codebases.

This flag changes the `keyof` type operator to return `string` instead of `string | number` when applied to a type with a string index signature.

