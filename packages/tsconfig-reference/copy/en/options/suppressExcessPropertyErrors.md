---
display: "Suppress Excess Property Errors"
---

> ❌ **Discouraged:** This flag is provided for backward compatibility. Consider using `@ts-ignore` instead.

This disables reporting of excess property errors, such as the one shown in the following example

```ts
type Point = { x: number, y: number };
const p: Point = { x: 1, y: 3, m: 10 };
```
