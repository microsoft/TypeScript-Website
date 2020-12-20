---
display: "No Implicit Returns"
oneline: "Enable error reporting for codepaths that do not explicitly return in a function."
---

When enabled, TypeScript will check all code paths in a function to ensure they return a value.

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
