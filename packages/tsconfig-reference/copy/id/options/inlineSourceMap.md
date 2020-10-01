---
display: "Peta Sumber Sebaris"
oneline: "Sertakan berkas peta sumber di dalam JavaScript"
---

Jika disetel, ketika menulis berkas `.js.map` untuk menyediakan peta sumber, TypeScript akan menyematkan konten peta sumber di berkas `.js`.
Meskipun ini menghasilkan berkas JS yang lebih besar, tapi dapat memudahkan dalam beberapa tahap.
Misalnya anda mungkin ingin mencoba berkas JS pada server web, tapi tidak mengizinkan berkas `.map` untuk ditampilkan.

Saling terpisah dengan [`sourceMap`](#sourceMap).

Misalnya, dengan TypeScript:

```ts
const helloWorld = "hi";
console.log(helloWorld);
```

Di ubah menjadi JavaScript:

```ts twoslash
// @showEmit
const helloWorld = "hi";
console.log(helloWorld);
```

Kemudian aktifkan pembuatannya dengan `inlineSourceMap`, ada komentar di bagian bawah berkas yang menyertakan peta sumber untuk berkas tersebut.

```ts twoslash
// @inlineSourceMap
// @showEmit
const helloWorld = "hi";
console.log(helloWorld);
```
