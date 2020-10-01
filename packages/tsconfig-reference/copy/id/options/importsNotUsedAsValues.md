---
display: "Impor Tidak Digunakan Sebagai Nilai"
oneline: "Mengontrol sintaks yang Anda gunakan untuk mengimpor kata"
---

Kode ini mengontrol cara kerja `import`, ada 3 opsi berbeda:

- `remove`: Perilaku umum menghapus pernyataan `import` yang hanya acuan kata.

- `preserve`: Mempertahankan semua pernyataan `import` yang nilai atau kata tidak pernah digunakan. Hal ini dapat menyebabkan impor/efek samping yang dipertahankan.

- `error`: Ini mempertahankan semua impor (sama seperti pilihan), tetapi akan mengalami galat saat impor nilai hanya digunakan sebagai kata. Ini mungkin berguna jika Anda ingin memastikan tidak ada nilai yang diimpor secara tidak sengaja, tetapi tetap membuat impor dengan jelas.

Kode ini berfungsi karena Anda dapat menggunakan `import type` secara jelas dengan pernyataan `import` yang tidak boleh dimasukkan ke JavaScript.
