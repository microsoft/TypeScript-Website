---
display: "Melewati pengecekan pustaka"
oneline: "Melewati pengecekan jenis berkas deklarasi"
---

Melewati pemeriksaan jenis berkas deklarasi.

Ini dapat menghemat waktu selama kompilasi dengan mengorbankan akurasi dari sistem type. Misalnya, dua pustaka bisa mendefinisikan dua salinan dari `type` (tipe) yang sama dengan cara yang tidak konsisten. Dibandingkan melakukan pengecekan menyeluruh pada semua berkas `d.ts`, TypeScript akan mengecek tipe data dari kode yang Anda acu secara spesifik di dalam kode sumber aplikasi.

Kasus umum dimana Anda mungkin berpikir untuk menggunakan `skipLibCheck` adalah ketika ada dua salinan pustaka di `node_modules` Anda. Dalam kasus ini, Anda harus mempertimbangkan untuk menggunakan fitur seperti [yarn's resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/) untuk memastikan hanya ada satu salinan dependency di root Anda atau menyelidiki bagaimana cara memastikan hanya ada satu resolusi dependency untuk memperbaiki masalah tanpa ada alat tambahan.
