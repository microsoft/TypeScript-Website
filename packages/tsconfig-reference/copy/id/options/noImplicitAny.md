---
display: "No Implicit Any"
oneline: "Mencegah memperkenalkan `any` didalam basis kode milikmu saat sebuah tipe bisa di tentukan"
---

Di beberapa kasus, dimana tidak ada anotasi tipe yang ada, TypeScript akan kembali ke suatu tipe dari `any` untuk suatu variabel yang saat itu tidakbisa simpulkan tipenya.

Ini dapat menyebabkan beberapa kesalahan untuk dilewatkan, sebagai contoh:

```ts twoslash
// @noImplicitAny: false
function fn(s) {
  // Bukan kesalahan?
  console.log(s.subtr(3));
}
fn(42);
```

Menyalakan opsi `noImplicitAny` namun TypeScript akan mengeluarkan kesalahan setiap kali `any` yang ia simpulkan:

```ts twoslash
// @errors: 7006
function fn(s) {
  console.log(s.subtr(3));
}
```
