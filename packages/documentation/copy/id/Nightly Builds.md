---
title: Nightly Builds
layout: docs
permalink: /id/docs/handbook/nightly-builds.html
oneline: Cara menggunakan nightly build TypeScript
translatable: true
---

_Nightly build_ dari _branch_ [master TypeScript](https://github.com/Microsoft/TypeScript/tree/master) diterbitkan pada tengah malam, di zona waktu PST ke npm.
Berikut adalah cara untuk mendapatkan versi ini dan cara menggunakannya.

## Menggunakan npm

```shell
npm install -g typescript@next
```

## Memperbarui IDE-mu untuk menggunakan _nightly builds_

Anda juga dapat memperbarui IDE-mu untuk menggunakan _nightly_ drop.
Pertama, Anda akan perlu untuk memasang package melalui npm.
Anda juga dapat memasang npm _package_ secara global atau pada direktori `node_modules` di dalam proyekmu.

Pada tahap ini diasumsikan bahwa `typescript@next` sudah dipasang.

### Visual Studio Code

Perbarui `.vscode/settings.json` dengan cara berikut:

```json
"typescript.tsdk": "<path ke folder-mu>/node_modules/typescript/lib"
```

Informasi lebih lanjut ada di [Dokumentasi VSCode](https://code.visualstudio.com/Docs/languages/typescript#_using-newer-typescript-versions).

### Sublime Text

Perbarui berkas `Settings - User` dengan cara berikut:

```json
"typescript_tsdk": "<path ke direktorimu>/node_modules/typescript/lib"
```

Informasi lebih lanjut ada di [Dokumentasi pemasangan _Plugin_ TypeScript untuk Sublime Text](https://github.com/Microsoft/TypeScript-Sublime-Plugin#installation).

### Visual Studio 2013 dan 2015

> Catatan: Sebagian besar perubahan tidak mengharuskan anda untuk memasang versi terbaru dari _plugin_ VS TypeScript.

Saat ini, _Nightly build_ tidak menyertakan _plugin_ secara lengkap, tapi kami sedang mengupayakan untuk menerbitkan sebuah _installer_ di _nightly_.

1. Unduh kode [VSDevMode.ps1](https://github.com/Microsoft/TypeScript/blob/master/scripts/VSDevMode.ps1) kode.

   > Lihat juga halaman wiki kami di [menggunakan berkas custom language service](https://github.com/Microsoft/TypeScript/wiki/Dev-Mode-in-Visual-Studio#using-a-custom-language-service-file).

2. Melalui perintah PowerShell, jalankan:

Untuk VS 2015:

```posh
VSDevMode.ps1 14 -tsScript <path ke direktorimu>/node_modules/typescript/lib
```

Untuk VS 2013:

```posh
VSDevMode.ps1 12 -tsScript <path ke folder-mu>/node_modules/typescript/lib
```

### IntelliJ IDEA (Mac)

Masuk ke `Preferences` > `Languages & Frameworks` > `TypeScript`:

> Versi TypeScript: Jika anda memasangnya dengan npm, maka akan ada di `/usr/local/lib/node_modules/typescript/lib`

### IntelliJ IDEA (Windows)

Masuk ke `File` > `Settings` > `Languages & Frameworks` > `TypeScript`:

> Versi TypeScript: Jika anda memasangnya dengan npm, maka akan ada di `C:\Users\USERNAME\AppData\Roaming\npm\node_modules\typescript\lib`
