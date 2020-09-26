---
display: "Emit BOM"
oneline: "Sertakan tanda urutan byte ke file keluaran"
---

Mengontrol apakah TypeScript akan mengeluarkan [byte order mark (BOM)](https://wikipedia.org/wiki/Byte_order_mark) saat menulis file output.
Beberapa lingkungan runtime memerlukan BOM untuk menafsirkan file JavaScript dengan benar; yang lain mengharuskan itu tidak ada.
Nilai default `false` biasanya paling baik kecuali Anda punya alasan untuk mengubahnya.
