---
display: "No Implicit Use Strict"
oneline: "Menonaktifkan 'use strict' dalam mengeluarkan JS"
---

Anda seharusnya tidak memerlukan ini. Secara bawaan, saat memancarkan sebuah berkas modul kepada sebuah target non-ES6, TypeScript memancarkan sebuah kata pengantar `"use strict";` di bagian atas berkas.
Ini dapat menonaktifkan setelan kata pengantar itu.

```ts twoslash
// @showEmit
// @target: ES3
// @module: AMD
// @noImplicitUseStrict
// @alwaysStrict: false
export function fn() {}
```

```ts twoslash
// @showEmit
// @target: ES3
// @module: AMD
export function fn() {}
```
