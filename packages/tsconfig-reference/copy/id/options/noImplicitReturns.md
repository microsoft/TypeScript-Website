---
display: "No Implicit Returns"
oneline: "Memastikan semua jalur kode mengembalikan nilai di suatu fungsi"
---

Saat diaktifkaan, TypeScript akan melakukan pengecekan semua jalur kode di suatu fungsi untuk memastikan mereka mengembalikan suatu nilai.

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
