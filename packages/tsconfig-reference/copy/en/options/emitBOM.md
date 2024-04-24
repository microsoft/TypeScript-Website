---
display: "Emit BOM"
oneline: "Emit a UTF-8 Byte Order Mark (BOM) in the beginning of output files."
---

Controls whether TypeScript will emit a [byte order mark (BOM)](https://wikipedia.org/wiki/Byte_order_mark) when writing output files.
Some runtime environments require a BOM to correctly interpret a JavaScript files; others require that it is not present.
The default value of `false` is generally best unless you have a reason to change it.
