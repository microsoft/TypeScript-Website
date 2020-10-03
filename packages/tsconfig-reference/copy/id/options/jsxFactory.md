---
display: "JSX Factory"
oneline: "Mengatur fungsi yang dihasilkan oleh JSX"
---

Mengubah fungsi yang dipanggil pada file `.js` ketika melakukan kompilasi elemen-elemen JSX.
Perubahan yang paling umum adalah dengan menggunakan `"h"` atau `"preact.h"` dibandingkan penggunaan bawaan `"React.createElement"` jika menggunakan `preact`.

Opsi ini dapat digunakan pada basis per file juga seperti halnya [Babel's `/** @jsx h */` directive](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#custom).
