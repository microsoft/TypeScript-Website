---
display: "Declaration"
oneline: "Emit file d.ts untuk file referensi dalam proyek"
---

Buat file `.d.ts` untuk setiap file TypeScript atau JavaScript di dalam proyek Anda.
File `.d.ts` ini adalah file definisi tipe yang menjelaskan API eksternal modul Anda.
Dengan file `.d.ts`, alat seperti TypeScript dapat menyediakan tipe yang masuk akal dan akurat untuk kode yang tidak diketik.

ika `declaration` disetel ke` true`, jalankan compiler dengan kode TypeScript:

```ts twoslash
export let helloWorld = "hi";
```

Akan menghasilkan file `index.js` seperti ini:

```ts twoslash
// @showEmit
export let helloWorld = "hi";
```

Dengan `helloWorld.d.ts` yang sesuai:

```ts twoslash
// @showEmittedFile: index.d.ts
// @showEmit
// @declaration
export let helloWorld = "hi";
```

Saat bekerja dengan file `.d.ts` untuk file JavaScript, Anda mungkin ingin menggunakan [` emitDeclarationOnly`](#emitDeclarationOnly) atau menggunakan [`outDir`](#outDir) untuk memastikan bahwa file JavaScript tidak ditimpa.