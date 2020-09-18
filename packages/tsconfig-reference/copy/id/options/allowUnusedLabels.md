---
display: "Izinkan Label yang Tidak Digunakan"
oneline: "Galat saat tidak sengaja membuat label"
---

Setel ke _false_ untuk menonaktifkan peringatan tentang label yang tidak digunakan.

Label sangat jarang di JavaScript dan biasanya menunjukkan upaya untuk menulis objek dengan tepat:

```ts twoslash
// @errors: 7028
// @allowUnusedLabels: false
function verifikasiUmur(umur: number) {
  // Lupa menulis pernyataan 'return'
  if (umur > 18) {
    terverifikasi: true;
  }
}
```
