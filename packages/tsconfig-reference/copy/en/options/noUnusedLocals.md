---
display: "No Unused Locals"
oneline: "Raise an error when a local variable isn't read."
---

Report errors on unused local variables.

```ts twoslash
// @noUnusedLocals
// @errors: 6133
const createKeyboard = (modelID: number) => {
  const defaultModelID = 23;
  return { type: "keyboard", modelID };
};
```
