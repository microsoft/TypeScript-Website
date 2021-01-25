---
display: "Exclude"
oneline: "Berkas atau pola yang akan dilewati dari opsi sertakan"
---

Menentukan _array_ nama berkas atau pola yang harus dilewati saat menyelesaikan `include`.

**Penting**: `exclude` _hanya_ mengubah berkas mana yang disertakan sebagai hasil dari pengaturan `include`.
Berkas yang ditentukan oleh `exclude` masih bisa menjadi bagian dari basis kode Anda karena pernyataan `import` dalam kode Anda, penyertaan `types`, perintah `/// <reference`, atau ditentukan dalam daftar `files`.

Ini bukan mekanisme yang **mencegah** berkas untuk disertakan dalam basis kode - ini hanya mengubah apa yang ditemukan oleh setelan `include`.
