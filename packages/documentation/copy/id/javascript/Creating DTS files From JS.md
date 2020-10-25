---
title: Membuat Berkas .d.ts dari berkas .js
layout: docs
permalink: /id/docs/handbook/declaration-files/dts-from-js.html
oneline: "Bagaimana cara menambahkan hasil d.ts ke proyek JavaScript"
translatable: true
---

[Dengan TypeScript 3.7](/docs/handbook/release-notes/typescript-3-7.html#--declaration-and---allowjs), TypeScript menambahkan dukungan untuk menghasilkan file .d.ts dari JavaScript menggunakan sintaks JSDoc.

Pengaturan ini berarti Anda memiliki editor yang mendukung TypeScript tanpa memindahkan proyek anda ke TypeScript, atau harus memelihara file .d.ts di basis kodemu.
TypeScript mendukung sebagian besar tag JSDoc, Anda bisa menemukannya [di referensi ini](/docs/handbook/type-checking-javascript-files.html#supported-jsdoc).

## Menyiapkan proyekmu untuk menggunakan file .d.ts

Untuk menambahkan pembuatan file .d.ts di proyekmu, Anda perlu melakukan hingga empat langkah:

- Tambahkan TypeScript ke dependensi _dev_ Anda
- Tambahkan `tsconfig.json` untuk mengkonfigurasi TypeScript
- Jalankan kompilator TypeScript untuk menghasilkan file d.ts yang sesuai untuk file JS
- (opsional) Edit package.json Anda untuk mereferensikan tipe

### Menambahkan TypeScript

Anda bisa mempelajari cara melakukan ini di [halaman instalasi](/download) kami.

### TSConfig

TSConfig adalah file jsonc yang mengkonfigurasi kedua _flag_ kompilator Anda, dan menyatakan di mana mencari file.
Dalam kasus ini, Anda menginginkan berkas seperti berikut:

```json5
{
  // Ubah ini agar sesuai dengan proyek Anda
  include: ["src/**/*"],

  compilerOptions: {
    // Memberi tahu TypeScript untuk membaca file JS,
    // karena biasanya file tersebut diabaikan sebagai file sumber
    allowJs: true,
    // Hasilkan berkas d.ts
    declaration: true,
    // Proses kompilator ini seharusnya
    // hanya mengeluarkan berkas d.ts
    emitDeclarationOnly: true,
    // Tipe harus masuk ke direktori ini.
    // Menghapus ini akan menempatkan berkas .d.ts
    // di sebelah file .js
    outDir: "dist",
  },
}
```

Anda dapat mempelajari lebih lanjut tentang opsi di [referensi tsconfig](/reference).
Alternatif untuk menggunakan file TSConfig adalah CLI, ini adalah perilaku yang sama seperti perintah CLI.

```sh
npx typescript src/**/*.js --declaration --allowJs --emitDeclarationOnly --outDir types
```

## Menjalankan kompilator

Anda bisa mempelajari bagaimana melakukan ini di [halaman pemasangan](/download) TypeScript kami.
Anda perlu memastikan file-file ini disertakan dalam package Anda jika Anda memiliki file dalam `gitignore` proyek Anda.

## Menyunting file package.json

TypeScript mereplikasi resolusi node untuk modul di `package.json`, dengan langkah tambahan untuk menemukan file .d.ts.
Secara garis besar, Pertama-tama resolusi akan memeriksa bagian `"types"` yang opsional, kemudian bidang `"main"`, dan terakhir akan mencoba `index.d.ts` di root.

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

Jika kamu suka menulis tes untuk file .d.ts, coba [tsd](https://github.com/SamVerschueren/tsd).
