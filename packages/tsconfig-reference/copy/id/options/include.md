---
display: "Disertakan (_Include_)"
oneline: "Berkas atau pola untuk disertakan dalam proyek ini"
---

Menentukan sebuah susunan nama berkas atau contoh berkas untuk dimasukkan ke dalam program.
Nama berkas ini diselesaikan dengan direktori yang berisi berkas `tsconfig.json`.

```json
{
  "include": ["src/**/*", "tests/**/*"]
}
```

Yang akan mencakup:

<!-- TODO: #135
```diff
  .
- ├── scripts
- │   ├── lint.ts
- │   ├── update_deps.ts
- │   └── utils.ts
+ ├── src
+ │   ├── client
+ │   │    ├── index.ts
+ │   │    └── utils.ts
+ │   ├── server
+ │   │    └── index.ts
+ ├── tests
+ │   ├── app.test.ts
+ │   ├── utils.ts
+ │   └── tests.d.ts
- ├── package.json
- ├── tsconfig.json
- └── yarn.lock
``` -->

```
.
├── scripts                ⨯
│   ├── lint.ts            ⨯
│   ├── update_deps.ts     ⨯
│   └── utils.ts           ⨯
├── src                    ✓
│   ├── client             ✓
│   │    ├── index.ts      ✓
│   │    └── utils.ts      ✓
│   ├── server             ✓
│   │    └── index.ts      ✓
├── tests                  ✓
│   ├── app.test.ts        ✓
│   ├── utils.ts           ✓
│   └── tests.d.ts         ✓
├── package.json
├── tsconfig.json
└── yarn.lock
```

`include` dan `exclude` mendukung karakter untuk membuat pola _global_:

- `*` cocok dengan nol atau lebih karakter (tidak termasuk pemisah direktori)
- `?` cocok dengan salah satu karakter (tidak termasuk pemisah direktori)
- `**/` cocok dengan direktori apa pun yang bertingkat.

Jika contoh umum tidak menyertakan ekstensi berkas, maka hanya berkas dengan ekstensi yang didukung yang disertakan (misalnya `.ts`,`.tsx`, dan `.d.ts` secara default, dengan`.js` dan `. jsx` jika `allowJs` disetel ke true).
