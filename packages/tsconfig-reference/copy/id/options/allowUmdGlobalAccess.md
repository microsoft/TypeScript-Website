---
display: "Izinkan Akses Global Umd"
oneline: "Asumsikan impor UMD tersedia secara global"
---

Jika disetel ke _true_, `allowUmdGlobalAccess` memungkinkan Anda mengakses ekspor UMD sebagai global dari dalam berkas modul. Berkas modul adalah berkas yang telah diimpor dan/atau diekspor. Tanpa opsi ini, menggunakan ekspor dari modul UMD memerlukan deklarasi impor.

Contoh kasus penggunaan untuk opsi ini adalah proyek web yang anda tahu bahwa pustaka tertentu (seperti jQuery atau Lodash) akan selalu tersedia saat runtime, tetapi Anda tidak dapat mengaksesnya dengan impor.
