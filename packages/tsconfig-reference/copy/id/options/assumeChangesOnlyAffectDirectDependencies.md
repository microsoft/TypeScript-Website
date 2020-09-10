---
display: "Menganggap Perubahan Hanya Mempengaruhi Dependensi Langsung"
oneline: "Opsi mode yang lebih cepat secara drastis, tetapi terkadang tidak akurat."
---

Ketika opsi ini diaktifkan, TypeScript akan menghindari pemeriksaan ulang/membangun kembali semua berkas yang benar-benar mungkin terpengaruh dan hanya memeriksa ulang/membangun kembali berkas yang telah berubah serta berkas yang langsung mengimpornya.

Ini dapat dianggap sebagai implementasi 'fast & loose' dari algoritma pengawas, yang mana bisa secara drastis dapat mengurangi waktu _rebuild_ dengan sesekali harus menjalankan _build_ lengkap untuk mendapatkan semua pesan penyusun kesalahan.
