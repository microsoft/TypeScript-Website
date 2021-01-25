---
display: "fallbackPolling"
oneline: "Apa yang harus digunakan pengawas jika sistem kehabisan pengamat berkas asli"
---

Saat menggunakan peristiwa sistem berkas, opsi ini menetapkan strategi _polling_ yang akan digunakan saat sistem kehabisan pengamat berkas asli dan / atau tidak mendukung pengamat berkas asli.

- `fixedPollingInterval`: Periksa setiap berkas apakah ada perubahan beberapa kali dalam satu detik pada interval tetap.
- `priorityPollingInterval`: Periksa setiap berkas apakah ada perubahan beberapa kali dalam satu detik, tetapi gunakan heuristik untuk memeriksa jenis berkas tertentu lebih jarang daripada yang lain.
- `dynamicPriorityPolling`: Gunakan antrian dinamis di mana berkas yang lebih jarang diubah akan lebih jarang diperiksa.
- `synchronousWatchDirectory`: Menonaktifkan pengawas yang ditunda pada direktori. Menonton yang ditunda berguna ketika banyak perubahan berkas mungkin terjadi sekaligus (misal. Perubahan dalam `node_modules` dari menjalankan `npm install`), tetapi Anda mungkin ingin menonaktifkannya dengan tanda ini untuk beberapa penyiapan yang kurang umum.
