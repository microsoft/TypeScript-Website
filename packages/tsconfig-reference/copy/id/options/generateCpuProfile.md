---
display: "Hasilkan Profil CPU"
oneline: "Keluarkan profil CPU v8 dari penyusun yang dijalankan untuk di analisa"
---

Opsi ini memberi Anda kesempatan untuk meminta TypeScript mengeluarkan profil CPU v8 selama penyusun dijalankan. Profil CPU dapat memberikan wawasan tentang mengapa proyek Anda bisa lambat.

Opsi ini hanya dapat digunakan dari CLI melalui: `--generateCpuProfile tsc-output.cpuprofile`.

```sh
npm run tsc --generateCpuProfile tsc-output.cpuprofile
```

Berkas ini dapat dibuka di peramban berbasis chromium seperti Chrome atau Edge Developer di bagian [Riwayat CPU](https://developers.google.com/web/tools/chrome-devtools/rendering-tools/js-execution).
Anda dapat mempelajari lebih lanjut tentang memahami kinerja penyusun di [Bagian wiki TypeScript tentang kinerja](https://github.com/microsoft/TypeScript/wiki/Performance).
