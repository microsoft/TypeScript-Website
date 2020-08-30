---
display: "Izinkan Impor Default Sintetis"
oneline: "Izinkan 'impor x dari y' jika modul tidak memiliki ekspor default"
---

Jika disetel ke true `allowSyntheticDefaultImports` memungkinkan Anda untuk menulis impor seperti:

```ts
import React from "react";
```

dari pada:

```ts
import * as React from "react";
```

Jika modul ** tidak ** secara eksplisit menentukan ekspor default.

Misalnya, tanpa`allowSyntheticDefaultImports` karena true:

```ts twoslash
// @errors: 1259
// @checkJs
// @allowJs
// @esModuleInterop: false
// @filename: utilFunctions.js
// @noImplicitAny: false
const getStringLength = (str) => str.length;

module.exports = {
  getStringLength,
};

// @filename: index.ts
import utils from "./utilFunctions";

const count = utils.getStringLength("Check JS");
```

Kode ini menimbulkan kesalahan karena tidak ada objek `default` yang dapat Anda impor. Meski rasanya seperti itu seharusnya.
Untuk kenyamanan, transpiler seperti Babel akan secara otomatis membuat default jika tidak dibuat. Membuat modul terlihat lebih seperti:

```js
// @filename: utilFunctions.js
const getStringLength = (str) => str.length;
const allFunctions = {
  getStringLength,
};

module.exports = allFunctions;
module.exports.default = allFunctions;
```

Bendera ini tidak memengaruhi JavaScript yang dipancarkan oleh TypeScript, ini hanya untuk pemeriksaan jenis.
Opsi ini membawa perilaku TypeScript sejalan dengan Babel, di mana kode tambahan dikeluarkan untuk membuat ekspor default modul menjadi lebih ergonomis.
