---
display: "Izinkan Setelan Standar Impor Sintetis"
oneline: "Izinkan 'impor x dari y' jika modul tidak memiliki setelan standar ekspor"
---

Jika disetel ke true `allowSyntheticDefaultImports` memungkinkan Anda untuk menulis impor seperti:

```ts
import React from "react";
```

daripada:

```ts
import * as React from "react";
```

Jika modul **tidak** secara eksplisit menentukan ekspor default.

Misalnya, tanpa`allowSyntheticDefaultImports` disetel ke _true_:

```ts twoslash
// @errors: 1259 1192
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

Kode ini menimbulkan galat karena tidak ada objek `default` yang dapat Anda impor. Meski rasanya seperti itu seharusnya.
Untuk kenyamanan, _transpiler_ seperti Babel akan secara otomatis membuat setelan standar jika tidak dibuat. Membuat modul terlihat lebih seperti:

```js
// @filename: utilFunctions.js
const getStringLength = (str) => str.length;
const allFunctions = {
  getStringLength,
};

module.exports = allFunctions;
module.exports.default = allFunctions;
```

Opsi ini tidak memengaruhi JavaScript yang dihasilkan oleh TypeScript, ini hanya untuk _type checking_.
Opsi ini membuat perilaku TypeScript sejalan dengan Babel, di mana kode ekstra akan ditambahkan kedalam setelan standar ekspor untuk membuat sebuah modul lebih ergonomis.
