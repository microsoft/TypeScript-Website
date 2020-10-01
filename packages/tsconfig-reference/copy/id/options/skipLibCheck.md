---
display: "Melewati pengecekan pustaka"
oneline: "Melewati pengecekan jenis berkas deklarasi"
---

Melewati pemeriksaan jenis berkas deklarasi.

Ini dapat menghemat waktu selama kompilasi dengan mengorbankan akurasi dari sistem type. Misalnya, dua pustaka bisa mendefinisikan dua salinan dari `type` (tipe) yang sama dengan cara yang tidak konsisten daripada melakukan pemeriksaan penuh pada semua berkas `d.ts`, Typescript akan mengecek kode tipe secara spesifik pada kode sumber aplikasi anda.

Kasus umum dimana anda mungkin berfikir untuk menggunakan `skipLibCheck` adalah ketika ada dua salinan pustaka di `node_modules` anda. Dalam kasus ini, anda harus mempertimbangkan untuk menggunakan fitur seperti [yarn's resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) untuk memastikan hanya ada satu salinan dependency di root anda atau menyelidiki bagaimana cara memastikan hanya ada satu resolusi dependency untuk memperbaiki masalah tanpa ada alat tambahan.
