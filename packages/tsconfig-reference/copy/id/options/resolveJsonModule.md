---
display: "Menyelesaikan Module JSON"
oneline: "Memperbolehkan mengimpor berkas .json"
---

Memperbolehkan mengimpor modul dengan ekstensi '.json' merupakan praktik umum pada proyek node.
Ini termasuk membuat jenis untuk `import` berdasarkan bentuk JSON statis.

TypeScript tidak mendukung penyelesaian berkas JSON secara bawaan:

```ts twoslash
// @errors: 2732
// @filename: settings.json
{
    "repo": "TypeScript",
    "dry": false,
    "debug": false
}
// @filename: index.ts
import settings from "./settings.json";

settings.debug === true;
settings.dry === 2;
```

Mengaktifkan opsi memungkinkan impor JSON, dan memvalidasi jenis dalam berkas JSON tersebut.

```ts twoslash
// @errors: 2367
// @resolveJsonModule
// @module: commonjs
// @moduleResolution: node
// @filename: settings.json
{
    "repo": "TypeScript",
    "dry": false,
    "debug": false
}
// @filename: index.ts
import settings from "./settings.json";

settings.debug === true;
settings.dry === 2;
```
