---
display: "Allow JS"
oneline: "Izinkan TS menyertakan berkas .JS di impor"
---

Izinkan berkas JavaScript diimpor ke dalam proyek Anda, bukan hanya berkas `.ts` dan`.tsx`. Contoh, berkas JS ini:

```js twoslash
// @filename: card.js
export const defaultCardDeck = "Heart";
```

Ketika diimpor ke berkas TypeScript akan menimbulkan galat seperti berikut:

```ts twoslash
// @errors: 2307
// @filename: card.js
module.exports.defaultCardDeck = "Heart";
// ---cut---
// @filename: index.ts
import { defaultCardDeck } from "./card";

console.log(defaultCardDeck);
```

Impor berkas akan baik-baik saja saat `allowJs` diaktifkan:

```ts twoslash
// @filename: card.js
module.exports.defaultCardDeck = "Heart";
// ---cut---
// @allowJs
// @filename: index.ts
import { defaultCardDeck } from "./card";

console.log(defaultCardDeck);
```

Opsi ini dapat digunakan sebagai cara untuk menambahkan berkas TypeScript secara bertahap ke dalam proyek JS dengan mengizinkan berkas `.ts` dan`.tsx` untuk hidup berdampingan dengan berkas JavaScript yang ada.
