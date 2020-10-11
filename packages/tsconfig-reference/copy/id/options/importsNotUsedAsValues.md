---
display: "Impor Tidak Digunakan Sebagai Nilai"
oneline: "Mengontrol sintaks yang Anda gunakan untuk mengimpor kata"
---

Kode ini mengontrol cara kerja `import`, ada 3 opsi berbeda:

- `remove`: Perilaku umum untuk menghapus pernyataan `import` yang hanya merupakan acuan dari kata.

- `preserve`: Mempertahankan semua pernyataan `import` yang nilai atau katanya tidak pernah digunakan. Hal ini dapat menyebabkan impor/efek samping yang tetap dipertahankan.

- `error`: Ini mempertahankan semua impor (sama seperti pilihan), tetapi akan mengalami galat jika impor nilai hanya digunakan sebagai tipe data. Ini mungkin berguna jika Anda ingin memastikan tidak ada nilai yang diimpor secara tidak sengaja, tetapi tetap membuat impor dengan jelas.

Kode ini berfungsi karena Anda dapat menggunakan `import type` secara jelas dengan pernyataan `import` yang tidak boleh dimasukkan ke JavaScript.
