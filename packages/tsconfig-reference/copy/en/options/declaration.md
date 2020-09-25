---
display: "Declaration"
oneline: "Emit file d.ts untuk file referensi dalam proyek"
---

Buat file `.d.ts` untuk setiap file TypeScript atau JavaScript di dalam proyek Anda.
File `.d.ts` ini adalah file definisi tipe yang menjelaskan API eksternal modul Anda.
Dengan file `.d.ts`, alat seperti TypeScript dapat menyediakan tipe yang masuk akal dan akurat untuk kode yang tidak diketik.

Jika `declaration` disetel ke` true`, jalankan compiler dengan kode TypeScript:

```ts twoslash
export let helloWorld = "hi";
```

Akan menghasilkan file `index.js` seperti ini:

```ts twoslash
// @showEmit
export let helloWorld = "hi";
```

<<<<<<< HEAD
Dengan `helloWorld.d.ts` yang sesuai:

=======
Dengan korespondensi`helloWorld.d.ts`:
>>>>>>> 7f10138c6b6b7d45bbe86702761b30e182294a5e

```ts twoslash
// @showEmittedFile: index.d.ts
// @showEmit
// @declaration
export let helloWorld = "hi";
```

<<<<<<< HEAD
Saat bekerja dengan file `.d.ts` untuk file JavaScript, Anda mungkin ingin menggunakan [`emitDeclarationOnly`](#emitDeclarationOnly) atau menggunakan [`outDir`](#outDir) untuk memastikan bahwa file JavaScript tidak ditimpa.
=======
Saat bekerja dengan file `.d.ts` untuk file JavaScript, Anda mungkin ingin menggunakan [`emitDeclarationOnly`](#emitDeclarationOnly) atau menggunakan [`outDir`](# outDir) untuk memastikan bahwa file JavaScript tidak ditimpa.
>>>>>>> 7f10138c6b6b7d45bbe86702761b30e182294a5e
