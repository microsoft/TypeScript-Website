---
display: "No Implicit Returns"
oneline: "Ensure that all codepaths return in a function"
---

有効化すると、TypeScriptは関数内のすべてのコードパスについて、値を返却していることをチェックします。

```ts twoslash
// @errors: 2366 2322
function lookupHeadphonesManufacturer(color: "blue" | "black"): string {
  if (color === "blue") {
    return "beats";
  } else {
    "bose";
  }
}
```
