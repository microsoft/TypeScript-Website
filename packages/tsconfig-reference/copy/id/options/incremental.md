---
display: "Incremental"
oneline: "Simpan berkas .tsbuildinfo untuk kompilasi proyek secara bertahap"
---

Memberi tahu TypeScript untuk menyimpan informasi tentang grafik proyek dari kompilasi terakhir ke berkas yang disimpan di penyimpanan. Ini membuat serangkaian berkas `.tsbuildinfo` di folder yang sama dengan keluaran kompilasi Anda. Mereka tidak menggunakan JavaScript saat runtime dan dapat dihapus dengan aman. Anda dapat membaca lebih lanjut di [3.4 release notes](/docs/handbook/release-notes/typescript-3-4.html#faster-subsequent-builds-with-the---incremental-flag).

Anda dapat mengontrol nama folder dengan menggunakan pilihan [`tsBuildInfoFile`](#tsBuildInfoFile).
