---
display: "Exclude"
oneline: "Berkas-berkas atau pola-pola yang dilewati termasuk dari pilihan"
---

Menentukan sebuah array atau nama berkas atau pola yang seharusnya dilewati saat menyelesaikan `include`.

<!-- Specifies an array of filenames or patterns that should be skipped when resolving `include`. -->

**Penting**: `include`. _hanyalah_ merubah berkas yang mana termasuk ke dalam sebuah hasil dari pengatuan `include`.
Sebuah berkas yang ditentukan oleh `exclude` masih bisa menjadi bagian dari basis kode Anda dikarenakan pernyataan `import` di dalam kode Anda, penyertaan sebuah `types`, sebuah arahan `/// <reference`, atau ditentukan dalam daftar `files`.

<!-- **Important**: `include`. _only_ changes which files are included as a result of the `include` setting. -->
<!-- A file specified by `exclude` can still become part of your codebase due to an `import` statement in your code, a `types` inclusion, a `/// <reference` directive, or being specified in the `files` list. -->

Ini bukan sebuah mekanisme yang **mencegah** sebuah berkas yang disertakan dalam basis kode - ini semudah mengubah apa yang pengaturan `include` temukan.

<!-- It is not a mechanism that **prevents** a file from being included in the codebase - it simply changes what the `include` setting finds. -->
