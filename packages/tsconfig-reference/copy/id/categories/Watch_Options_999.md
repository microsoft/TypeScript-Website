---
display: "Opsi Pengawasan"
---

TypeScript 3.8 dilengkapi dengan strategi baru untuk mengawasi direktori, yang krusial menentukan perubahan secara efisien terhadap `node_modules`.

Pada sistem operasi seperti Linux, TypeScript memasang direktori pengawas (daripada pengawas berkas) pada `node_modules` dan banyak direktori di dalamnya untuk mendeteksi perubahan pada dependensi.
Hal ini dikarenakan banyaknya pengawas berkas sering melebihi berkas-berkas yang terdapat pada `node_modules`, sedangkan ada lebih sedikit direktori untuk diawasi.

Karena setiap proyek mungkin bekerja dengan strategi yang berbeda, dan pendekatan baru ini mungkin tidak bekerja dengan baik dengan alur kerja anda, TypeScript 3.8 memperkenalkan opsi `watchOptions` yang memungkinkan pengguna untuk memberitahu kompiler/layanan bahasa strategi pengawasan yang mana yang harus digunakan untuk mengawasi berkas dan direktori.
