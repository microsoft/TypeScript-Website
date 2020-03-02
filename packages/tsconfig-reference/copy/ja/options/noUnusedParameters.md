---
display: "No Unused Parameters"
oneline: "Error when a parameter isn't used"
---

利用されていない関数のパラメータについて、エラーを報告します。

```ts twoslash
// @noUnusedParameters
// @errors: 6133
const createDefaultKeyboard = (modelID: number) => {
  const defaultModelID = 23;
  return { type: "keyboard", modelID: defaultModelID };
};
```
