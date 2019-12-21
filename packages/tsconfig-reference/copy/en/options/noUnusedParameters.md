---
display: "No Unused Parameters"
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
