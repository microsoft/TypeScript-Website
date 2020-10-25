---
title: Mengkonfigurasi Watch
layout: docs
permalink: /id/docs/handbook/configuring-watch.html
oneline: Cara mengkonfigurasi mode watch TypeScript
translatable: true
---

Kompilator mendukung konfigurasi cara mengawasi file dan direktori menggunakan kompilator flags di TypeScript 3.8+, dan variabel environment.

## Latar Belakang

Implementasi `--watch` dari compiter bergantung pada penggunaan `fs.watch` dan `fs.watchFile` yang disediakan oleh node, kedua metode ini memiliki kelebihan dan kekurangan.

`fs.watch` menggunakan berkas _system event_ untuk memberi tahu perubahan dalam file/direktori. Tetapi ini bergantung pada OS dan notifikasi tidak sepenuhnya dapat diandalkan dan tidak berfungsi seperti yang diharapkan pada banyak OS. Juga mungkin ada batasan jumlah watch yang dapat dibuat, misalnya linux dan kami dapat melakukannya dengan cukup cepat dengan program yang menyertakan banyak file. Tetapi karena ini menggunakan berkas _system event_, tidak banyak siklus CPU yang terlibat. Kompilator biasanya menggunakan `fs.watch` untuk melihat direktori (misalnya. Direktori sumber disertakan oleh file konfigurasi, direktori di mana resolusi modul gagal, dll.) Ini dapat menangani ketepatan yang hilang dalam memberi tahu tentang perubahan. Tetapi memantau secara rekursif hanya didukung pada Windows dan OSX. Artinya kita membutuhkan sesuatu untuk menggantikan sifat rekursif di OS lain.

`fs.watchFile` menggunakan polling dan karenanya melibatkan siklus CPU. Tetapi ini adalah mekanisme yang paling andal untuk mendapatkan pembaruan status file/direktori. Kompilator biasanya menggunakan `fs.watchFile` untuk melihat file sumber, file konfigurasi dan file yang hilang (referensi file hilang) yang berarti penggunaan CPU bergantung pada jumlah file dalam program.

## Konfigurasi file watching menggunakan `tsconfig.json`

```json tsconfig
{
  // Beberapa opsi kompilator umumnya
  "compilerOptions": {
    "target": "es2020",
    "moduleResolution": "node"
    // ...
  },

  // BARU: Opsi untuk memantau file/direktori
  "watchOptions": {
    // Gunakan native file system events untuk file dan direktori
    "watchFile": "useFsEvents",
    "watchDirectory": "useFsEvents",

    // Dapatkan pembaruan file
    // ketika terdapat update yang besar.
    "fallbackPolling": "dynamicPriority"
  }
}
```

Anda dapat membacanya lebih lanjut di [catatan rilis](/docs/handbook/release-notes/typescript-3-8.html#better-directory-watching-on-linux-and-watchoptions).

## Konfigurasi file watching menggunakan variabel environment `TSC_WATCHFILE`

<!-- prettier-ignore -->
Opsi                                         | Deskripsi
-----------------------------------------------|----------------------------------------------------------------------
`PriorityPollingInterval`                      | Gunakan `fs.watchFile` tetapi gunakan interval polling yang berbeda untuk file sumber, file konfigurasi, dan file yang hilang
`DynamicPriorityPolling`                       | Gunakan antrian dinamis di mana dalam file yang sering dimodifikasi akan memiliki interval yang lebih pendek dan file yang tidak diubah akan lebih jarang diperiksa
`UseFsEvents`                                  | Gunakan `fs.watch` untuk memanfaatkan system event file (tetapi mungkin tidak akurat pada OS yang berbeda) untuk mendapatkan pemberitahuan terhadap perubahan/pembuatan/penghapusan file. Perhatikan bahwa beberapa OS misalnya. linux memiliki batasan jumlah pengamatan dan jika gagal melakukan pengamatan menggunakan `fs.watch`, maka pengamatan akan dilakukan dengan `fs.watchFile`
`UseFsEventsWithFallbackDynamicPolling`        | Opsi ini mirip dengan `UseFsEvents` kecuali jika gagal memantau menggunakan `fs.watch`, pengawasan dilakukan melalui antrean polling dinamis (seperti dijelaskan dalam `DynamicPriorityPolling`)
`UseFsEventsOnParentDirectory`                 | Opsi ini mengawasi direktori induk dari file dengan `fs.watch` (menggunakan berkas _system event_) sehingga menjadi rendah pada CPU tetapi dengan keakuratan yang rendah.
standar (tanpa menspesifikkan nilainya)                   | Jika variabel environment `TSC_NONPOLLING_WATCHER` di-set ke true, maka akan mengawasi direktori induk dari file (seperti `UseFsEventsOnParentDirectory`). Jika tidak, akan menggunakan `fs.watchFile` dengan `250ms` sebagai waktu tunggu untuk file apa pun.

## Mengonfigurasi pengawasan direktori menggunakan variabel environment `TSC_WATCHDIRECTORY`

Pemantauan direktori pada platform yang tidak mendukung pemantau direktori rekursif secara native di node, maka akan menggunakan opsi yang berbeda, yang dipilih oleh`TSC_WATCHDIRECTORY`. Perlu dicatat bahwa, platform yang mendukung pemantauan direktori secara rekursif (misalnya Windows), nilai dari variabel environment tersebut akan diabaikan.

<!-- prettier-ignore -->
Opsi                                         | Deskripsi
-----------------------------------------------|----------------------------------------------------------------------
`RecursiveDirectoryUsingFsWatchFile`           | Gunakan `fs.watchFile` untuk mengawasi direktori dan direktori anak yang merupakan polling watch (menggunakan siklus CPU)
`RecursiveDirectoryUsingDynamicPriorityPolling`| Gunakan antrian polling dinamis untuk mengumpulkan perubahan pada direktori dan sub direktori.
default (tidak ada nilai yang ditentukan)                   | Gunakan `fs.watch` untuk memantau direktoru dan sub direktorinya
