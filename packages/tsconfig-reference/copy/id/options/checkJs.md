---
display: "Check JS"
oneline: "Jalankan tulisan checker pada .js berkas dalam proyek Anda"
---

Bekerja sama dengan `allowJs`. Kapan `checkJs` diaktifkan kemudian kesalahan dilaporkan dalam berkas JavaScript. Ini termasuk `// @ts-check` di bagian atas semua berkas JavaScript yang disertakan dalam proyek Anda.

Misalnya, ini adalah JavaScript yang salah menurut definisi jenis `parseFloat` yang disertakan dengan TypeScript:

```js
// parseFloat only takes a string
module.exports.pi = parseFloat(3.124);
```

Saat diimpor ke modul TypeScript:

```ts twoslash
// @allowJs
// @filename: constants.js
module.exports.pi = parseFloat(3.124);

// @filename: index.ts
import { pi } from "./constants";
console.log(pi);
```

Anda tidak akan mendapatkan kesalahan apapun. Namun, jika Anda mengaktifkan `checkJs` maka Anda akan mendapatkan pesan kesalahan dari berkas JavaScript.

```ts twoslash
// @errors: 2345
// @allowjs: true
// @checkjs: true
// @filename: constants.js
module.exports.pi = parseFloat(3.124);

// @filename: index.ts
import { pi } from "./constants";
console.log(pi);
```
