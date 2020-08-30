---
display: "Izinkan Akses Global Umd"
oneline: "Asumsikan impor UMD tersedia secara global"
---

Jika disetel ke true, `allowUmdGlobalAccess` memungkinkan Anda mengakses ekspor UMD sebagai global dari dalam file modul. File modul adalah file yang telah diimpor dan / atau diekspor. Tanpa tanda ini, menggunakan ekspor dari modul UMD memerlukan deklarasi impor.

Contoh kasus penggunaan untuk tanda ini adalah proyek web yang Anda tahu bahwa pustaka tertentu (seperti jQuery atau Lodash) akan selalu tersedia saat runtime, tetapi Anda tidak dapat mengaksesnya dengan impor.
