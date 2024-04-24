---
display: "No Unused Parameters"
oneline: "Raise an error when a function parameter isn't read."
---

Report errors on unused parameters in functions.

```ts twoslash
// @noUnusedParameters
// @errors: 6133
const createDefaultKeyboard = (modelID: number) => {
  const defaultModelID = 23;
  return { type: "keyboard", modelID: defaultModelID };
};
```
