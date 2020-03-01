---
display: "No Unused Locals"
oneline: "Error when a local variable isn't read"
---

利用されていないローカル変数について、エラーを報告します。

```ts twoslash
// @noUnusedLocals
// @errors: 6133
const createKeyboard = (modelID: number) => {
  const defaultModelID = 23;
  return { type: "keyboard", modelID };
};
```
