---
display: "Declaration"
oneline: "Emit berkas d.ts untuk berkas referensi dalam proyek"
---

Buat berkas `.d.ts` untuk setiap berkas TypeScript atau JavaScript di dalam proyek Anda.
Berkas `.d.ts` ini adalah berkas definisi tipe yang menjelaskan API eksternal modul Anda.
Dengan berkas `.d.ts`, alat seperti TypeScript dapat menyediakan tipe yang masuk akal di dalam sumber kode tanpa definisi tipe data.

Jika `declaration` disetel ke`true`, jalankan compiler dengan kode TypeScript:

```ts twoslash
export let helloWorld = "hi";
```

Akan menghasilkan berkas `index.js` seperti ini:

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

Saat bekerja dengan berkas `.d.ts` untuk file JavaScript, Anda mungkin ingin menggunakan [`emitDeclarationOnly`](#emitDeclarationOnly) atau menggunakan [`outDir`](#outDir) untuk memastikan bahwa berkas JavaScript tidak ditimpa.