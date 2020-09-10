---
display: "Composite"
oneline: "Digunakan untuk membuat banyak proyek pembangunan"
---

Opsi `composite` memberlakukan batasan tertentu yang memungkinkan untuk membangun (termasuk TypeScript
sendiri, di bawah mode `--build`) untuk menentukan dengan cepat apakah proyek telah dibangun.

Saat pengaturan ini aktif:

- Setelan `rootDir`, jika tidak disetel secara eksplisit, lokasi penyimpanan akan berisi berkas `tsconfig.json`.

- Semua berkas implementasi harus cocok dengan sebuah `include` contoh atau terdaftar dalam aturan `files`. Jika batasan ini dilanggar, `tsc` akan memberi tahu Anda berkas mana yang tidak ditentukan.

- `declaration` defaults ke `true`

Anda dapat menemukan dokumentasi tentang proyek TypeScript di [the handbook](https://www.typescriptlang.org/docs/handbook/project-references.html).
