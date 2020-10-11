---
display: "Sumber Sebaris"
oneline: "Sertakan berkas peta sumber di dalam JavaScript yang tampilkan"
---

Jika dilihat, TypeScript akan menyertakan konten asli dari berkas `.ts` sebagai string yang disematkan di peta sumber.
Ini sering kali berguna dalam kasus yang sama seperti `inlineSourceMap`.

Membutuhkan `sourceMap` atau `inlineSourceMap` untuk disetel.

Misalnya, dengan TypeScript:

```ts twoslash
const helloWorld = "hi";
console.log(helloWorld);
```

Di ubah menjadi JavaScript:

```ts twoslash
// @showEmit
const helloWorld = "hi";
console.log(helloWorld);
```

Kemudian dengan `inlineSources` dan `inlineSourceMap` diaktifkan, ada komentar di bagian bawah berkas yang menyertakan peta sumber untuk berkas tersebut.
Perhatikan bahwa ada yang berbeda di akhir [`inlineSourceMap`] (# inlineSourceMap) karena peta sumber sekarang berisi kode sumber asli.

```ts twoslash
// @inlineSources
// @inlineSourceMap
// @showEmit
const helloWorld = "hi";
console.log(helloWorld);
```
