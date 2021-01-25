---
title: Menggunakan Babel dengan TypeScript
layout: docs
permalink: /id/docs/handbook/babel-with-typescript.html
oneline: Cara membuat proyek hybrid Babel + TypeScript
translatable: true
---

## Babel vs `tsc` untuk TypeScript

Ketika membuat proyek JavaScript modern, anda mungkin bertanya pada dirimu sendiri, apa cara yang benar untuk mengkonversi berkas-berkas dari TypeScript ke JavaScript.

Sering kali jawabannya adalah _"tergantung"_, atau _"seseorang mungkin telah memutuskan untukmu"_ bergantung pada proyeknya. Jika anda membangun proyekmu dengan _framework_ yang sudah ada, seperti [tsdx](https://tsdx.io), [Angular](https://angular.io/), [NestJS](https://nestjs.com/) atau _framework_ apapun yang disebutkan di [_Getting Started_](/docs/home).

Namun, _heuristic_ yang berguna bisa jadi:

- Apakah keluaran dari _build_-mu sebagian besar sama seperti berkas-berkas yang di-_input_-kan? Jika iya, maka gunakan `tsc`
- Apakah anda butuh build pipeline dengan output yang memiliki beberapa potensi? Jika iya, maka gunakan `babel` untuk _transpiling_ dan `tsc` untuk pemeriksaan tipe

## Babel untuk transpiling, `tsc` untuk tipe

Ini adalah pola umum untuk proyek dengan infrastruktur build yang ada, yang mungkin telah ditransfer dari kode JavaScript ke TypeScript.

Teknik ini adalah pendekatan _hybrid_, menggunakan [preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript) Babel untuk menghasilkan berkas-berkas JS mu, dan kemudian menggunakan TypeScript untuk pemeriksaan tipe dan pembuatan berkas `.d.ts`

Dengan menggunakan dukungan Babel untuk TypeScript, anda mendapatkan kemampuan untuk bekerja pada _pipeline build_ yang sudah ada dan lebih seperti memiliki JS yang lebih cepat, karena Babel tidak melakukan pemeriksaan tipe pada kodemu

#### Pemeriksaan Tipe dan menghasilkan berkas d.ts

Kelemahan menggunakan Babel adalah Anda tidak mendapatkan pemeriksaan tipe selama transisi dari TS ke JS. Ini berarti bahwa kesalahan tipe yang Anda lewatkan di editor-mu dapat menyusup ke dalam kode saat fase produksi.

Selain itu, Babel tidak dapat membuat berkas `.d.ts` untuk TypeScript-mu yang dapat mempersulit pengerjaan proyekmu jika itu adalah sebuah pustaka.

Untuk mengatasi hal tersebut, Anda perlu melakukan set up perintah untuk memeriksa tipe pada proyekmu menggunakan TSC. Ini seperti menduplikasi beberapa konfigurasi babel menjadi sesuai dengan `tsconfig.json`](/tconfig) dan memastikan bahwa _flags_ ini aktif:

```json tsconfig
"compilerOptions": {
  // Memastikan bahwa berkas-berkas .d.ts dibuat oleh tsc, bukan berkas .js
  "declaration": true,
  "emitDeclarationOnly": true,
  // Memastikan bahwa Babel secara aman dapat men-transpile berkas-berkas di proyek TypeScript
  "isolatedModules": true
}
```

Informasi lebih lanjut mengenai _flags_ tersebut:

- [`isolatedModules`](/tsconfig#isolatedModules)
- [`declaration`](/tsconfig#declaration), [`emitDeclarationOnly`](/tsconfig#emitDeclarationOnly)
