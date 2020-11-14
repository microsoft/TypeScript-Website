---
title: Mengkonfigurasi Watch
layout: docs
permalink: /id/docs/handbook/configuring-watch.html
oneline: Cara mengkonfigurasi mode watch TypeScript
translatable: true
---

Kompilator mendukung konfigurasi cara mengawasi berkas dan direktori menggunakan kompilator _flags_ di TypeScript 3.8+, dan variabel _environment_.

## Latar Belakang

Implementasi `--watch` dari _compiter_ bergantung pada penggunaan `fs.watch` dan `fs.watchFile` yang disediakan oleh _node_, kedua metode ini memiliki kelebihan dan kekurangan.

`fs.watch` menggunakan berkas _system event_ untuk memberi tahu perubahan dalam berkas/direktori. Tetapi ini bergantung pada OS dan notifikasi tidak sepenuhnya dapat diandalkan dan tidak berfungsi seperti yang diharapkan pada banyak OS. Juga mungkin ada batasan jumlah _watch_ yang dapat dibuat, misalnya linux dan kami dapat melakukannya dengan cukup cepat dengan program yang menyertakan banyak berkas. Tetapi karena ini menggunakan berkas _system event_, tidak banyak siklus CPU yang terlibat. Kompilator biasanya menggunakan `fs.watch` untuk melihat direktori (misalnya. Direktori sumber disertakan oleh berkas konfigurasi, direktori di mana resolusi modul gagal, dll.) Ini dapat menangani ketepatan yang hilang dalam memberi tahu tentang perubahan. Tetapi memantau secara rekursif hanya didukung pada Windows dan OSX. Artinya kita membutuhkan sesuatu untuk menggantikan sifat rekursif di OS lain.

`fs.watchFile` menggunakan polling dan karenanya melibatkan siklus CPU. Tetapi ini adalah mekanisme yang paling andal untuk mendapatkan pembaruan status berkas/direktori. Kompilator biasanya menggunakan `fs.watchFile` untuk melihat berkas sumber, berkas konfigurasi dan berkas yang hilang (referensi berkas hilang) yang berarti penggunaan CPU bergantung pada jumlah berkas dalam program.

## Konfigurasi berkas _watching_ menggunakan `tsconfig.json`

```json tsconfig
{
  // Beberapa opsi kompilator umumnya
  "compilerOptions": {
    "target": "es2020",
    "moduleResolution": "node"
    // ...
  },

  // BARU: Opsi untuk memantau berkas/direktori
  "watchOptions": {
    // Gunakan native berkas system events untuk berkas dan direktori
    "watchFile": "useFsEvents",
    "watchDirectory": "useFsEvents",

    // Dapatkan pembaruan berkas
    // ketika terdapat update yang besar.
    "fallbackPolling": "dynamicPriority"
  }
}
```

Anda dapat membacanya lebih lanjut di [catatan rilis](/docs/handbook/release-notes/typescript-3-8.html#better-directory-watching-on-linux-and-watchoptions).

## Konfigurasi berkas _watching_ menggunakan variabel environment `TSC_WATCHFILE`

<!-- prettier-ignore -->
Opsi                                         | Deskripsi
-----------------------------------------------|----------------------------------------------------------------------
`PriorityPollingInterval`                      | Gunakan `fs.watchFile` tetapi gunakan _interval polling_ yang berbeda untuk berkas sumber, berkas konfigurasi, dan berkas yang hilang
`DynamicPriorityPolling`                       | Gunakan antrian dinamis di mana dalam berkas yang sering dimodifikasi akan memiliki _interval_ yang lebih pendek dan berkas yang tidak diubah akan lebih jarang diperiksa
`UseFsEvents`                                  | Gunakan `fs.watch` untuk memanfaatkan _system event_ berkas (tetapi mungkin tidak akurat pada OS yang berbeda) untuk mendapatkan pemberitahuan terhadap perubahan/pembuatan/penghapusan berkas. Perhatikan bahwa beberapa OS misalnya. linux memiliki batasan jumlah pengamatan dan jika gagal melakukan pengamatan menggunakan `fs.watch`, maka pengamatan akan dilakukan dengan `fs.watchFile`
`UseFsEventsWithFallbackDynamicPolling`        | Opsi ini mirip dengan `UseFsEvents` kecuali jika gagal memantau menggunakan `fs.watch`, pengawasan dilakukan melalui antrean _polling_ dinamis (seperti dijelaskan dalam `DynamicPriorityPolling`)
`UseFsEventsOnParentDirectory`                 | Opsi ini mengawasi direktori induk dari berkas dengan `fs.watch` (menggunakan berkas _system event_) sehingga menjadi rendah pada CPU tetapi dengan keakuratan yang rendah.
standar (tanpa menspesifikkan nilainya)                   | Jika variabel environment `TSC_NONPOLLING_WATCHER` di-set ke true, maka akan mengawasi direktori induk dari berkas (seperti `UseFsEventsOnParentDirectory`). Jika tidak, akan menggunakan `fs.watchFile` dengan `250ms` sebagai waktu tunggu untuk berkas apa pun.

## Mengonfigurasi pengawasan direktori menggunakan variabel _environment_ `TSC_WATCHDIRECTORY`

Pemantauan direktori pada platform yang tidak mendukung pemantau direktori rekursif secara _native_ di _node_, maka akan menggunakan opsi yang berbeda, yang dipilih oleh`TSC_WATCHDIRECTORY`. Perlu dicatat bahwa, _platform_ yang mendukung pemantauan direktori secara rekursif (misalnya Windows), nilai dari variabel environment tersebut akan diabaikan.

<!-- prettier-ignore -->
Opsi                                         | Deskripsi
-----------------------------------------------|----------------------------------------------------------------------
`RecursiveDirectoryUsingFsWatchFile`           | Gunakan `fs.watchFile` untuk mengawasi direktori dan direktori anak yang merupakan _polling watch_ (menggunakan siklus CPU)
`RecursiveDirectoryUsingDynamicPriorityPolling`| Gunakan antrian polling dinamis untuk mengumpulkan perubahan pada direktori dan sub direktori.
_default_ (tidak ada nilai yang ditentukan)                   | Gunakan `fs.watch` untuk memantau direktoru dan sub direktorinya
