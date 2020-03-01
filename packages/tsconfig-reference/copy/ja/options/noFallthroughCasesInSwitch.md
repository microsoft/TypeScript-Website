---
display: "No Fallthrough Cases In Switch"
oneline: "Report errors for fallthrough cases in switch statements."
---

switch文において、次のcaseへ処理を持ち越した場合にエラーを報告します。
switch文内の空でないcase句が`break`または`return`を含むことを確約します。
これは、意図しないcaseへの処理持ち越しによるバグを流出させない、ということ意味しています。

```ts twoslash
// @noFallthroughCasesInSwitch
// @errors: 7029
const a: number = 6;

switch (a) {
  case 0:
    console.log("even");
  case 1:
    console.log("odd");
    break;
}
```
