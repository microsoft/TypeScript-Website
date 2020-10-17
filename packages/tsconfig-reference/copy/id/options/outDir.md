---
display: "Out Dir"
oneline: "Mengatur direktori keluaran untuk semua berkas yang disertakan"
---

Jika ditentukan, berkas-berkas `.js` (maupun `.d.ts`, `.js.map`, dsb.) akan disertakan ke dalam direktori ini.
Struktur direktori dari sumber awal berkas-berkas juga dipertahankan; lihat [rootDir](#rootDir) jika akar yang di perhitungkan bukan yang anda inginkan.

Jika tidak ditentukan, berkas-berkas `.js` akan disertakan di direktori yang sama dengan berkas-berkas `.ts` dari mana mereka di hasilkan:

```sh
$ tsc

contoh
├── index.js
└── index.ts
```

Dengan suatu `tsconfig.json` seperti ini:

```json tsconfig
{
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

Menjalankan `tsc` dengan pengaturan ini dapat memindahkan berkas-berkas ke direktori `dist`:

```sh
$ tsc

contoh
├── dist
│   └── index.js
├── index.ts
└── tsconfig.json
```
