---
title: Memanfaatkan Typescript pada Proyek JS
layout: docs
permalink: /id/docs/handbook/intro-to-js-ts.html
oneline: Cara menambahkan pemeriksaan tipe data pada berkas JavaScript menggunakan TypeScript
translatable: true
---

Sistem tipe data di TypeScript memiliki tingkat keketatan yang berbeda saat bekerja dengan basis kode:

- Sistem tipe data yang hanya berdasarkan pada inferensi dengan kode JavaScript
- Pengetikkan secara bertahap di JavaScript [melalui JSDoc](/docs/handbook/jsdoc-supported-types.html)
- Menggunakan `// @ts-check` di berkas JavaScript
- Kode TypeScript
- TypeScript dengan [`strict`](/tsconfig#strict) diaktifkan

Setiap langkah mewakili tahapan sistem tipe yang lebih aman, tetapi tidak setiap proyek membutuhkan tingkat verifikasi seperti itu.

## TypeScript dengan JavaScript

Ini ketika _editor_-mu yang menggunakan TypeScript untuk menyediakan _tool_, seperti _auto-complete_, _jump to symbol_, dan _refactoring_, misalnya penamaan ulang.
Di [Homepage](/) tersedia daftar _editor_ yang memiliki plugin TypeScript.

## Menyediakan Type Hints di JS melalui JSDoc

Di berkas `.js`, tipe sering kali dapat diketahui. Namun ketika tipe tidak diketahui, mereka bisa ditentukan menggunakan sintaks JSDoc.

Anotasi JSDoc diletakkan sebelum mendeklarasikan suatu hal. Seperti contoh berikut:

```js twoslash
/** @type {number} */
var x;

x = 0; // OK
x = false; // OK?!
```

Anda dapat menemukan daftar lengkap mengenai dukungan pola JSDoc [di Tipe-tipe yang didukung JSDoc](/docs/handbook/jsdoc-supported-types.html)

## `@ts-check`

Baris terakhir dari contoh kode sebelumnya akan menimbulkan kesalahan dalam TypeScript, tetapi tidak secara bawaan dalam proyek JS.
Untuk mengaktifkan galat dalam berkas JavaScript-mu, tambahkan: `// @ ts-check` ke baris pertama dalam berkas`.js` Anda agar TypeScript dapat memeriksa kesalahan.

```js twoslash
// @ts-check
// @errors: 2322
/** @type {number} */
var x;

x = 0; // OK
x = false; // Not OK
```

Jika anda memiliki banyak berkas JavaScript yang ingin ditambahkan pemeriksaan galatnya, Anda bisa beralhir menggunakan [`jsconfig.json`](/docs/handbook/tsconfig-json.html).
Dengan begitu, Anda tidak perlu menambahkan `// @ts-nocheck` di tiap berkasnya.

TypeScript mungkin memberikan galat yang Anda tidak sepakati. Pada kasus tersebut, Anda bisa membiarkan galat itu spesifik dibaris manapun dengan menambahkan `// @ts-ignore` atau `// @ts-expect-error`.

```js twoslash
// @ts-check
/** @type {number} */
var x;

x = 0; // OK
// @ts-expect-error
x = false; // Not OK
```

Untuk mempelajari lebih lanjut bagaimana JavaScript diinterpretasi oleh TypeScript, Anda dapat membaca [Bagaimana TS Type Memeriksa JS](/docs/handbook/type-checking-javascript-files.html)
