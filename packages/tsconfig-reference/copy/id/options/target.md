---
display: "Target"
oneline: "Menyetel versi bahasa JavaScript untuk JavaScript yang dideklarasikan dan menyertakan deklarasi pustaka yang kompatibel."
---

Beberapa _browser_ modern mendukung semua fitur ES6, jadi `ES6` merupakan pilihan yang baik.
Anda dapat memilih untuk menyetel sasaran yang lebih rendah apabila kode Anda diluncurkan untuk lingkungan yang lebih lama, atau sebuah sasaran yang lebih tinggi apabila kode Anda dijamin untuk dapat berjalan di lingkungan yang lebih baru.

Pengaturan `target` mengubah fitur JS mana yang diturunkan levelnya dan mana yang dibiarkan utuh.
Sebagai contoh, sebuah _arrow_function_ `() => this` akan berubah menjadi sebuah ekspresi yang ekuivalen dengan `function` apabila `target` merupakan ES5 atau versi yang lebih rendah.

Mengubah `target` berarti juga mengubah nilai default dari [`lib`](#lib).
Anda dapat mengatur `target` dan` lib` sesuai keinginan, tetapi Anda dapat menyetel `target` untuk alasan kenyamanan.

Jika Anda hanya bekerja dengan Node.js, berikut adalah beberapa `target` yang direkomendasikan berdasarkan versi Node:

| Nama    | Target yang didukung |
| ------- | -------------------- |
| Node 8  | `ES2017`             |
| Node 10 | `ES2018`             |
| Node 12 | `ES2019`             |

Ini didasarkan pada database dukungan [node.green](https://node.green).

Nilai khusus `ESNext` merujuk pada versi tertinggi yang didukung oleh versi TypeScript Anda.
Pengaturan ini harus dilakukan secara hati-hati, karena ini tidak berarti hal yang sama pada versi TypeScript yang berbeda dan dapat membuat peningkatan kurang dapat diprediksi.
