---
title: Nightly Builds
layout: docs
permalink: /id/docs/handbook/nightly-builds.html
oneline: Cara menggunakan nightly build TypeScript
translatable: true
---

Nightly build dari branch [master TypeScript](https://github.com/Microsoft/TypeScript/tree/master) diterbitkan pada tengah malam, di zona waktu PST ke npm.
Berikut adalah cara untuk mendapatkan versi ini dan cara menggunakannya.

## Menggunakan npm

```shell
npm install -g typescript@next
```

## Memperbarui IDE-mu untuk menggunakan nightly builds

Anda juga dapat memperbarui IDE-mu untuk menggunakan nightly drop.
Pertama, anda akan perlu untuk memasang package melalui npm.
Anda juga dapat memasang npm package secara global atau pada folder `node_modules` di dalam proyek-mu.

Pada tahap ini diasumsikan bahwa `typescript@next` sudah di-install.

### Visual Studio Code

Perbarui `.vscode/settings.json` dengan cara berikut:

```json
"typescript.tsdk": "<path ke folder-mu>/node_modules/typescript/lib"
```

Informasi lebih lanjut ada di [VSCode documentation](https://code.visualstudio.com/Docs/languages/typescript#_using-newer-typescript-versions).

### Sublime Text

Perbarui file `Settings - User` dengan cara berikut:

```json
"typescript_tsdk": "<path ke folder-mu>/node_modules/typescript/lib"
```

Informasi lebih lanjut ada di [TypeScript Plugin for Sublime Text installation documentation](https://github.com/Microsoft/TypeScript-Sublime-Plugin#installation).

### Visual Studio 2013 dan 2015

> Catatan: Sebagian besar perubahan tidak mengharuskan anda untuk memasang versi terbaru dari plugin VS TypeScript.

Saat ini, Nightly build tidak menyertakan plugin secara lengkap, tapi kami sedang mengupayakan untuk menerbitkan sebuah installer di nightly.

1. Unduh skrip [VSDevMode.ps1](https://github.com/Microsoft/TypeScript/blob/master/scripts/VSDevMode.ps1) script.

   > Lihat juga halaman wiki kami di [menggunakan custom language service file](https://github.com/Microsoft/TypeScript/wiki/Dev-Mode-in-Visual-Studio#using-a-custom-language-service-file).

2. Melalui perintah PowerShell, jalankan:

Untuk VS 2015:

```posh
VSDevMode.ps1 14 -tsScript <path ke folder-mu>/node_modules/typescript/lib
```

Untuk VS 2013:

```posh
VSDevMode.ps1 12 -tsScript <path ke folder-mu>/node_modules/typescript/lib
```

### IntelliJ IDEA (Mac)

Masuk ke `Preferences` > `Languages & Frameworks` > `TypeScript`:

> TypeScript Version: Jika anda memasangnya dengan npm, maka akan ada di `/usr/local/lib/node_modules/typescript/lib`

### IntelliJ IDEA (Windows)

Masuk ke `File` > `Settings` > `Languages & Frameworks` > `TypeScript`:

> TypeScript Version: Jika anda memasangnya dengan npm, maka akan ada di `C:\Users\USERNAME\AppData\Roaming\npm\node_modules\typescript\lib`
