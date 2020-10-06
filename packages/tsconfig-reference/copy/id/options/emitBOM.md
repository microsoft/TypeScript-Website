---
display: "_Emit BOM_"
oneline: "Sertakan tanda urutan byte ke berkas keluaran"
---

Mengontrol apakah TypeScript akan menghasilkan [tanda urutan byte (_byte order mark_ - BOM)](https://wikipedia.org/wiki/Byte_order_mark) saat menulis berkas output.
Beberapa lingkungan _runtime_ memerlukan _BOM_ untuk menafsirkan berkas JavaScript dengan benar; yang lain mengharuskan itu tidak ada.
Nilai bawaan dari `false` umumnya paling baik kecuali Anda memiliki alasan untuk mengubahnya.
