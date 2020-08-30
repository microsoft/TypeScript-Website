---
display: "Izinkan js"
oneline: "Biarkan TS menyertakan file .JS dalam impor"
---

Izinkan file JavaScript diimpor di dalam proyek Anda, bukan hanya file `.ts` dan`.tsx`. Misalnya, file JS ini:

```js twoslash
// @filename: card.js
export const defaultCardDeck = "Heart";
```

Ketika diimpor ke file TypeScript akan menimbulkan kesalahan:

```ts twoslash
// @errors: 2307
// @filename: card.js
module.exports.defaultCardDeck = "Heart";
// ---cut---
// @filename: index.ts
import { defaultCardDeck } from "./card";

console.log(defaultCardDeck);
```

Impor baik-baik saja dengan `allowJs` diaktifkan:

```ts twoslash
// @filename: card.js
module.exports.defaultCardDeck = "Heart";
// ---cut---
// @allowJs
// @filename: index.ts
import { defaultCardDeck } from "./card";

console.log(defaultCardDeck);
```

Bendera ini dapat digunakan sebagai cara untuk menambahkan file TypeScript secara bertahap ke dalam proyek JS dengan mengizinkan file `.ts` dan`.tsx` untuk hidup berdampingan dengan file JavaScript yang ada.
