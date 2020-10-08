---
display: "disableReferencedProjectLoad"
oneline: "Mengurangi jumlah proyek yang dimuat secara otomatis oleh TypeScript"
---

Dalam program TypeScript multi-proyek, TypeScript akan memuat semua proyek yang tersedia ke dalam memori untuk memberikan hasil yang akurat untuk tanggapan editor yang memerlukan grafik pengetahuan lengkap seperti 'Temukan Semua Referensi'.

Jika proyek Anda besar, Anda dapat menggunakan saran `disableReferencedProjectLoad` untuk menonaktifkan pemuatan otomatis semua proyek. Sebaliknya, proyek dimuat secara dinamis saat Anda membuka file melalui editor Anda.