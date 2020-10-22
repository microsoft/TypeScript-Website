---
display: "No Unused Parameters"
oneline: "Error when a parameter isn't used"
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
