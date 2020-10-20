---
title: JS Projects Utilizing TypeScript
layout: docs
permalink: /id/docs/handbook/intro-to-js-ts.html
oneline: Cara menambahkan pemeriksaan type ke file JavaScript menggunakan TypeScript
translatable: true
---

Sistem tipe di TypeScript memiliki tingkat keketatan yang berbeda saat bekerja dengan basis kode:

- Sistem tipe yang hanya berdasarkan pada inferensi dengan kode JavaScript
- Pengetikkan incremental di JavaScript [melalui JSDoc](/docs/handbook/jsdoc-supported-types.html)
- Menggunakan `// @ts-check` di file JavaScript
- Kode TypeScript
- TypeScript dengan [`strict`](/tsconfig#strict) diaktifkan

Setiap langkah mewakili gerakan menuju sistem tipe yang lebih aman, tetapi tidak setiap proyek membutuhkan tingkat verifikasi seperti itu.

## TypeScript dengan JavaScript

Ini ketika editor-mu yang menggunakan TypeScript untuk menyediakan tool, seperti auto-complete, jump to symbil, dan refactoring, misalnya penamaan ulang.
Di [Homepage](/) tersedia daftar editor yang memiliki plugin TypeScript.

## Menyediakan Type Hints di JS melalui JSDoc

Di file `.js`, type sering kali dapat diketahui. Namun ketika type tidak diketahui, mereka bisa ditentukan menggunakan sintaks JSDoc.

Anotasi JSDoc diletakkan sebelum mendeklarasikan suatu hal. Seperti contoh berikut:

```js twoslash
/** @type {number} */
var x;

x = 0; // OK
x = false; // OK?!
```

Anda dapat menemukan daftar lengkap mengenai dukungan pola JSDoc [di Tipe-tipe yang didukung JSDoc](/docs/handbook/jsdoc-supported-types.html)

## `@ts-check`

Baris terakhir dari contoh kode sebelumnya akan menimbulkan kesalahan dalam TypeScript, tetapi tidak secara default dalam proyek JS.
Untuk mengaktifkan error dalam file JavaScript-mu, tambahkan: `// @ ts-check` ke baris pertama dalam file`.js` Anda agar TypeScript dapat memeriksa kesalahan.

```js twoslash
// @ts-check
// @errors: 2322
/** @type {number} */
var x;

x = 0; // OK
x = false; // Not OK
```

Jika anda memiliki banyak file JavaScript yang ingin ditambahkan pemeriksaan error-nya, anda bisa beralhir menggunakan [`jsconfig.json`](/docs/handbook/tsconfig-json.html).
Dengan begitu, anda tidak perlu menambahkan `// @ts-nocheck` di tiap file-nya.

TypeScript mungkin memberikan error yang kamu tidak sepakati. Pada kasus tersebut, anda bisa membiarkan error itu spesifik dibaris manapun dengan menambahkan `// @ts-ignore` atau `// @ts-expect-error`.

```js twoslash
// @ts-check
/** @type {number} */
var x;

x = 0; // OK
// @ts-expect-error
x = false; // Not OK
```

Untuk mempelajari lebih lanjut bagaimana JavaScript diinterpretasi oleh TypeScript, anda dapat membaca [Bagaimana TS Type Memeriksa JS](/docs/handbook/type-checking-javascript-files.html)
