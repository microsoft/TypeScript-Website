---
display: "Out File"
oneline: "Mengeluarkan satu berkas dari semua berkas JS yang di gabungkan"
---

Jika ditentukan, semua berkas _global_ (non-module) akan digabung menjadi satu berkas keluaran tertentu.

Jika `module` adalah `system` atau `amd`, semua berkas modul juga akan digabungkan menjadi berkas ini setelah semua konten global.

Catatan: `outFile` tidak dapat digunakan kecuali `module` adalah `None`, `System`, atau `AMD`.
Opsi ini _tidak bisa_ digunakan untuk membundel modul CommonJS atau ES6.
