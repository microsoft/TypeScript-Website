---
display: "Interop Modul ES"
oneline: "Menghasilkan JS tambahan untuk memudahkan dukungan untuk mengimpor modul commonjs"
---

Secara bawaan (dengan `esModuleInterop` _false_ atau tidak disetel) TypeScript memperlakukan modul CommonJS/AMD/UMD mirip dengan modul ES6. Dalam melakukan ini, ada dua bagian tertentu yang ternyata merupakan asumsi yang salah:

- Impor namespace seperti `import * as moment from "moment"` bertindak sama seperti `const moment = require("moment")`

- Impor bawaan seperti `import moment from "moment"` berfungsi sama seperti `const moment = require("moment").default`

Ketidakcocokan ini menyebabkan dua masalah berikut:

- Spesifikasi modul ES6 menyatakan bahwa impor namespace (`import * as x`) hanya dapat menjadi objek, dengan memiliki TypeScript
  memperlakukannya sama dengan `= require ("x")` maka TypeScript diizinkan untuk impor diperlakukan sebagai fungsi dan dapat dipanggil. Ini melanggar rekomendasi spesifikasi.

- Meskipun akurat untuk spesifikasi modul ES6, sebagian besar pustaka dengan modul CommonJS/AMD/UMD tidak seketat implementasi TypeScript.

Mengaktifkan `esModuleInterop` akan memperbaiki kedua masalah ini dalam kode yang ditranspilasi oleh TypeScript. Perubahan pertama perilaku di kompilator, yang kedua diperbaiki oleh dua fungsi pembantu baru yang menyediakan _shim_ untuk memastikan kompatibilitas dalam JavaScript yang dihasilkan:

```ts
import * as fs from "fs";
import _ from "lodash";

fs.readFileSync("file.txt", "utf8");
_.chunk(["a", "b", "c", "d"], 2);
```

Dengan menonaktifkan `esModuleInterop`:

```ts twoslash
// @noErrors
// @showEmit
// @esModuleInterop: false
// @module: commonjs
import * as fs from "fs";
import _ from "lodash";

fs.readFileSync("file.txt", "utf8");
_.chunk(["a", "b", "c", "d"], 2);
```

Dengan `esModuleInterop` disetel ke `true`:

```ts twoslash
// @noErrors
// @showEmit
// @esModuleInterop
// @module: commonjs
import * as fs from "fs";
import _ from "lodash";

fs.readFileSync("file.txt", "utf8");
_.chunk(["a", "b", "c", "d"], 2);
```

_Catatan_: Anda dapat meminimalisir ukuran keluaran dengan mengaktifkan [`importHelpers`](#importHelpers):

```ts twoslash
// @noErrors
// @showEmit
// @esModuleInterop
// @importHelpers
// @module: commonjs
import * as fs from "fs";
import _ from "lodash";

fs.readFileSync("file.txt", "utf8");
_.chunk(["a", "b", "c", "d"], 2);
```

Mengaktifkan `esModuleInterop` juga akan mengaktifkan [`allowSyntheticDefaultImports`](#allowSyntheticDefaultImports).
