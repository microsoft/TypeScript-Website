---
display: "disableReferencedProjectLoad"
# oneline: "Reduces the number of projects loaded automatically by TypeScript"
oneline: "Mengurangi jumlah proyek yang dimuat secara otomatis oleh TypeScript"
---

<!-- In multi-project TypeScript programs, TypeScript will load all of the available projects into memory in order to provide accurate results for editor responses which require a full knowledge graph like 'Find All References'. -->
Dalam program TypeScript multi-proyek, TypeScript akan memuat semua proyek yang tersedia ke dalam memori untuk memberikan hasil yang akurat untuk tanggapan editor yang memerlukan grafik pengetahuan lengkap seperti 'Temukan Semua Referensi'.

<!-- If your project is large, you can use the flag `disableReferencedProjectLoad` to disable the automatic loading of all projects. Instead, projects are loaded dynamically as you open files through your editor. -->
Jika project Anda besar, Anda dapat menggunakan flag `disableReferencedProjectLoad` untuk menonaktifkan pemuatan otomatis semua project. Sebaliknya, proyek dimuat secara dinamis saat Anda membuka file melalui editor Anda.
