---
display: "Izinkan Label yang Tidak Digunakan"
oneline: "Kesalahan saat tidak sengaja membuat label"
---

Setel ke false untuk menonaktifkan peringatan tentang label yang tidak digunakan.

Label sangat jarang di JavaScript dan biasanya menunjukkan upaya untuk menulis objek dengan tepat:

```ts twoslash
// @errors: 7028
// @allowUnusedLabels: false
function verifyAge(age: number) {
  // Forgot 'return' statement
  if (age > 18) {
    verified: true;
  }
}
```
