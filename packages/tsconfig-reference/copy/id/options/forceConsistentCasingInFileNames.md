---
display: "Paksa Jenis Huruf Konsisten Dalam Nama berkas"
oneline: "Pastikan jenis huruf sudah benar dalam impor"
---

TypeScript mengikuti aturan sensitifitas huruf besar dari sistem berkas yang menjalankannya.
Ini bisa menjadi masalah jika beberapa pengembang bekerja dalam sistem berkas sensitifitas huruf besar dan kecil dan yang lainnya tidak.
Jika sebuah berkas mencoba mengimpor `fileManager.ts` dengan menetapkan `./FileManager.ts`, berkas tersebut akan ditemukan dalam sistem berkas yang tidak peka huruf besar/kecil, tetapi tidak pada sistem berkas yang peka huruf besar kecil.

Ketika opsi ini disetel, TypeScript akan mengeluarkan galat jika program mencoba memasukkan berkas dengan jenis huruf yang berbeda dari jenis huruf pada disk.
