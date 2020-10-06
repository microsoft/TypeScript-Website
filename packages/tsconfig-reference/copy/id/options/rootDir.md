---
display: "Root Dir"
oneline: "Menyetel direktori root di dalam berkas sumber Anda"
---

**Bawaan**: Jalur umum terpanjang dari semua berkas masukan non-deklarasi. Jika `composite` disetel, bawaannya adalah direktori yang berisi berkas `tsconfig.json`.

Ketika TypeScript mengkompilasi berkas, ia mempertahankan struktur direktori yang sama pada direktori keluaran seperti struktur di direktori masukan.

Misalnya, Anda memiliki beberapa berkas masukan:

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

Kesimpulan untuk `rootDir` adalah jalur umum terpanjang dari semua berkas masukan non-deklarasi, yang dalam hal ini adalah`core/`.

Jika nilai `outDir` anda adalah `dist`, maka TypeScript akan membuat struktur direktori seperti ini:

```
MyProj
├── dist
│   ├── a.ts
│   ├── b.ts
│   ├── sub
│   │   ├── c.ts
```

Namun, anda mungkin mengharapkan `core` menjadi bagian dari struktur direktori keluaran.
Dengan menyetel `rootDir: "."` pada `tsconfig.json`, TypeScript akan menghasilkan struktur direktori seperti ini:

```
MyProj
├── dist
│   ├── core
│   │   ├── a.js
│   │   ├── b.js
│   │   ├── sub
│   │   │   ├── c.js
```

Yang terpenting, `rootDir` **tidak memengaruhi berkas mana yang menjadi bagian dari kompilasi**.
`rootDir` tidak memiliki hubungan dengan pengaturan `include`, `exclude`, atau `files` pada `tsconfig.json`

Perhatikan bahwa TypeScript tidak akan pernah menulis berkas keluaran (_file output_) ke direktori di luar dari `outDir`, dan tidak akan pernah melewatkan pengeluaran berkas.
Karena alasan ini, `rootDir` mengharuskan semua berkas yang perlu dikeluarkan berada dibawah jalur `rootDir`.

Misalnya, Anda memiliki struktur direktori seperti ini:

```
MyProj
├── tsconfig.json
├── core
│   ├── a.ts
│   ├── b.ts
├── helpers.ts
```

Ini akan menimbulkan galat ketika menentukan `rootDir` sebagai `core` dan `include` sebagai `*` karena ini membuat berkas (`helpers.ts`) yang perlu diletakkan di luar dari `outDir` (yaitu `../helpers.js`)
