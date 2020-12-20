---
title: Membuat Berkas .d.ts dari berkas .js
layout: docs
permalink: /id/docs/handbook/declaration-files/dts-from-js.html
oneline: "Bagaimana cara menambahkan hasil d.ts ke proyek JavaScript"
translatable: true
---

[Dengan TypeScript 3.7](/docs/handbook/release-notes/typescript-3-7.html#--declaration-and---allowjs), TypeScript menambahkan dukungan untuk menghasilkan berkas .d.ts dari JavaScript menggunakan sintaks JSDoc.

Pengaturan ini berarti Anda memiliki _editor_ yang mendukung TypeScript tanpa memindahkan proyek anda ke TypeScript, atau harus memelihara berkas .d.ts di basis kodemu.
TypeScript mendukung sebagian besar tag JSDoc, Anda bisa menemukannya [di referensi ini](/docs/handbook/type-checking-javascript-files.html#supported-jsdoc).

## Menyiapkan proyekmu untuk menggunakan berkas .d.ts

Untuk menambahkan pembuatan berkas .d.ts di proyekmu, Anda perlu melakukan empat langkah berikut:

- Tambahkan TypeScript ke dependensi _dev_ Anda
- Tambahkan `tsconfig.json` untuk mengkonfigurasi TypeScript
- Jalankan kompilator TypeScript untuk menghasilkan berkas d.ts yang sesuai untuk berkas JS
- (_opsional_) Sunting package.json Anda untuk mereferensikan tipe

### Menambahkan TypeScript

Anda bisa mempelajari cara melakukan ini di [halaman instalasi](/download) kami.

### TSConfig

TSConfig adalah berkas jsonc yang mengkonfigurasi kedua _flag_ kompilator Anda, dan menyatakan di mana mencari berkas.
Dalam kasus ini, Anda menginginkan berkas seperti berikut:

```json5
{
  // Ubah ini agar sesuai dengan proyek Anda
  include: ["src/**/*"],

  compilerOptions: {
    // Memberi tahu TypeScript untuk membaca berkas JS,
    // karena biasanya berkas tersebut diabaikan sebagai berkas sumber
    allowJs: true,
    // Hasilkan berkas d.ts
    declaration: true,
    // Proses kompilator ini seharusnya
    // hanya mengeluarkan berkas d.ts
    emitDeclarationOnly: true,
    // Tipe harus masuk ke direktori ini.
    // Menghapus ini akan menempatkan berkas .d.ts
    // di sebelah berkas .js
    outDir: "dist",
  },
}
```

Anda dapat mempelajari lebih lanjut tentang opsi di [referensi tsconfig](/reference).
Alternatif untuk menggunakan berkas TSConfig adalah CLI, ini adalah perilaku yang sama seperti perintah CLI.

```sh
npx typescript src/**/*.js --declaration --allowJs --emitDeclarationOnly --outDir types
```

## Menjalankan kompilator

Anda bisa mempelajari bagaimana melakukan ini di [halaman pemasangan](/download) TypeScript kami.
Anda perlu memastikan berkas-berkas ini disertakan dalam package Anda jika Anda memiliki berkas dalam `gitignore` proyek Anda.

## Menyunting berkas package.json

TypeScript mereplikasi resolusi _node_ untuk modul di `package.json`, dengan langkah tambahan untuk menemukan berkas .d.ts.
Secara garis besar, Pertama-tama resolusi akan memeriksa bagian `"types"` yang opsional, kemudian bidang `"main"`, dan terakhir akan mencoba `index.d.ts` di _root_.

| Package.json              | Location of default .d.ts      |
| :------------------------ | :----------------------------- |
| No "types" field          | checks "main", then index.d.ts |
| "types": "main.d.ts"      | main.d.ts                      |
| "types": "./dist/main.js" | ./main/main.d.ts               |

Jika tidak ada, maka "main" akan digunakan

| Package.json             | Location of default .d.ts |
| :----------------------- | :------------------------ |
| No "main" field          | index.d.ts                |
| "main":"index.js"        | index.d.ts                |
| "main":"./dist/index.js" | ./dist/index.d.ts         |

## Tips

Jika kamu suka menulis tes untuk berkas .d.ts, coba [tsd](https://github.com/SamVerschueren/tsd).
