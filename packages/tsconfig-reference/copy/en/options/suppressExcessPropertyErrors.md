---
display: "Suppress Excess Property Errors"
oneline: "Disable reporting of excess property errors during the creation of object literals."
---

This disables reporting of excess property errors, such as the one shown in the following example:

```ts twoslash
// @errors: 2322
type Point = { x: number; y: number };
const p: Point = { x: 1, y: 3, m: 10 };
```

This flag was added to help people migrate to the stricter checking of new object literals in [TypeScript 1.6](/docs/handbook/release-notes/typescript-1-6.html#stricter-object-literal-assignment-checks).

We don't recommend using this flag in a modern codebase, you can suppress one-off cases where you need it using `// @ts-ignore`.
