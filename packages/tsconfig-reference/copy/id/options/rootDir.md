---
display: "Root Dir"
oneline: "Menyetel folder root di dalam file sumber Anda"
---

**Default**: Jalur umum terpanjang dari semua file masukan non-deklarasi. jika `composite` disetel, defaultnya adalah direktori yang berisi file `tsconfig.json`.

Ketika TypeScript mengkompilasi file, ia mempertahankan struktur direktori yang sama pada direktori keluaran seperti struktur di direktori masukan.

Misalnya, Anda memiliki beberapa file input:

```
MyProj
├── tsconfig.json
├── core
│   ├── a.ts
│   ├── b.ts
│   ├── sub
│   │   ├── c.ts
├── types.d.ts
```

Kasimpulan untuk `rootDir` adalah jalur umum terpanjang dari semua file input non-deklarasi, yang dalam hal ini adalah`core/`.

Jika nilai `outDir` anda adalah `dist`, maka TypeScript akan membuat struktur folder seperti ini:

```
MyProj
├── dist
│   ├── a.ts
│   ├── b.ts
│   ├── sub
│   │   ├── c.ts
```

Namun, kamu mungkin mengharapkan `core` menjadi bagian dari struktur direktori keluaran.
Dengan mensetel `rootDir: "."` pada `tsconfig.json`, TypeScript akan menghasilkan struktur direktori seperti ini:

```
MyProj
├── dist
│   ├── core
│   │   ├── a.js
│   │   ├── b.js
│   │   ├── sub
│   │   │   ├── c.js
```

Yang terpenting, `rootDir` **tidak mempengaruhi file mana yang menjadi bagian dari kompilasi**.
`rootDir` tidak memiliki hubungan dengan pengaturan `include`, `exclude`, atau `files` pada `tsconfig.json`

Perhatikan bahwa TypeScript tidak akan pernah menulis file keluaran ke direktori di luar dari `outDir`, dan tidak akan pernah melewatkan pengeluaran file.
Karena alasan ini, `rootDir` menetapkan bahwa semua file yang perlu dikeluarkan berada dibawah jalur `rootDir`.

Misalnya, Anda memiliki struktur folder seperti ini:

```
MyProj
├── tsconfig.json
├── core
│   ├── a.ts
│   ├── b.ts
├── helpers.ts
```

Ini akan menimbulkan error ketika menentukan `rootDir` sebagai `core` _dan_ `include` sebagai `*` karena ini membuat file (`helpers.ts`) yang perlu diletakkan _diluar_ dari `outDir` (yaitu `../helpers.js`)
