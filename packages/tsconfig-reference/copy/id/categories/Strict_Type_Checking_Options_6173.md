---
display: "Pemeriksaan Ketat"
---

Kami merekomendasikan (untuk) menggunakan [opsi kompiler `strict`](#strict) untuk mengikutsertakan semua kemungkinan penyempurnaan saat berkas `.ts` dikompilasi.

TypeScript mendukung jangkauan pola JavaScript yang luas dan secara standar memperbolehkan cukup banyak fleksibilitas untuk mengakomodasi gaya ini.
Seringnya keamanaan dan potensi skalabilitas basis kode dapat berada pada posisi aneh dengan beberapa teknis berikut.

Karena banyaknya jenis JavaScript yang didukung, pemutakhiran ke TypeScript versi terbaru dapat menghasilkan dua jenis kesalahan:

- Kesalahan yang telah ada pada basis kode Anda, yang TypeScript telah temukan karena telah menyempurnakan pemahaman terhadap JavaScript.
- Serangkaian kesalahan baru yang mengatasi domain permasalahan baru.

TypeScript biasanya akan menambahkan opsi kompiler untuk kesalahan yang kedua, dan biasanya (opsi tersebut) tidak dinyalakan.
