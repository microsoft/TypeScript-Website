---
display: "Paksa Casing Konsisten Dalam Nama berkas"
oneline: "Pastikan casing sudah benar dalam impor"
---

TypeScript mengikuti aturan sensitivitas huruf besar dari sistem berkas yang menjalankannya.
Ini bisa menjadi masalah jika beberapa pengembang bekerja dalam sistem berkas case-sensitive dan yang lainnya tidak.
Jika sebuah berkas mencoba mengimpor `fileManager.ts` dengan menetapkan `./FileManager.ts`, berkas tersebut akan ditemukan dalam sistem berkas yang tidak peka huruf besar/kecil, tetapi tidak pada sistem berkas yang peka huruf besar kecil.

Ketika opsi ini disetel, TypeScript akan mengeluarkan kesalahan jika program mencoba memasukkan berkas dengan casing yang berbeda dari casing pada disk.
