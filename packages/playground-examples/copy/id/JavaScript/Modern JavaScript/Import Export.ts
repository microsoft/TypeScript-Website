//// { order: 1, target: "ES5" }

// JavaScript menambahkan sintaks impor dan ekspor pada tahun 2016
// dan TypeScript memiliki dukungan penuh untuk sintaks ini yang
// berfungsi untuk menghubungkan berkas dengan berkas lain dan
// pada modul eksternal lain. TypeScript memperluas sintaks
// impor dan ekspor dengan memperbolehkan tipe data untuk
// diimpor dan diekspor pada kode program.

// Berikut merupakan kode program untuk mengimpor sebuah modul.

import { danger, message, warn, DangerDSLType } from "danger";

// Kode di atas berusaha mengimpor beberapa impor bernama
// dari sebuah modul NodeJS bernama `danger`. Walaupun ada 
// lebih dari empat objek yang dapat diimpor, namun hanya
// empat objek tersebut yang akan diimpor.

// Dengan mengimpor objek secara spesifik, perkakas yang
// tersedia dapat menghapus kode-kode yang tidak dibutuhkan
// pada aplikasi Anda, dan membantu Anda untuk mengetahui
// impor apa yang digunakan pada sebuah berkas.

// Pada contoh di atas: `danger`, `message`. dan `warn`
// merupakan impor JavaScript - sedangkan `DangerDSLType`
// merupakan sebuah antarmuka.

// TypeScript mengizinkan pengembang untuk mendokumentasikan
// kode program yang mereka buat menggunakan JSDoc, sehingga
// dokumentasi juga dapat diimpor. Sebagai contoh, apabila
// Anda menyorot pada bagian-bagian kode di bawah, Anda
// dapat melihat penjelasan mengenai bagian tersebut.

danger.git.modified_files;

// Apabila Anda ingin mengetahui cara untuk menyediakan
// anotasi pada dokumentasi, silahkan baca pada 
// example:jsdoc-support

// Cara lain untuk mengimpor kode adalah dengan menggunakan
// ekspor bawaan milik modul. Berikut merupakan contoh
// dari penggunaan ekspor bawaan pada modul `debug`, yang
// mengekspos sebuah fungsi yang membuat sebuah fungsi pencatatan.

import debug from "debug";
const log = debug("playground");
log("Started running code");

// Karena sifat dari ekspor bawaan yang tidak memiliki
// nama yang tetap, ekspor-ekspor bawaan dapat membingungkan
// perkakas analisis seperti dukungan _refactoring_ pada
// TypeScript, namun ekspor bawaan tetap memiliki kegunaan.

// Karena ada sejarah panjang dari impor dan ekspor kode
// dalam JavaScript, terdapat sebuah bagian yang membingungkan
// dari ekspor bawaan: Beberapa ekspor memiliki dokumentasi
// yang menyatakan bahwa Anda dapat menulis sebuah impor sebagai
// berikut:

import req from "request";

// Namun, impor tersebut akan gagal, kemudian Anda menemukan
// sebuah pertanyaan pada StackOverflow yang menyarankan
// Anda untuk mengimpor seperti berikut:

import * as req from "request";

// Dan cara tersebut akan berhasil. Alasan mengenai keberhasilan
// tersebut akan dibahas pada bagian akhir dari dokumentasi ini.

// Supaya dapat diimpor, kode harus dapat diekspor. Cara modern
// untuk menyatakan ekspor adalah menggunakan kata kunci `export`.

/** Jumlah stiker yang tersedia */
export const jumlahStiker = 11;

// Ekspor tersebut dapat diimpor pada berkas lain dengan cara:
//
// import { jumlahStiker } from "./path/to/file"

// Anda dapat menulis `export` sebanyak mungkin pada sebuah 
// berkas sesuai keinginan Anda. Ekspor bawaan juga dapat
// dinyatakan dengan cara yang sama.

/** Menghasilkan stiker untuk Anda */
const pembuatStiker = () => { };
export default pembuatStiker;

// Ekspor tersebut dapat diimpor pada berkas lain dengan cara:
//
// import perolehStiker from "./path/to/file"
//
// Impor bawaan dapat dinamai sesuai keinginan pada berkas
// tempat bagian tersebut diimpor.

// Ada cara-cara lain untuk melakukan impor, namun contoh-contoh
// di atas merupakan cara-cara yang umum digunakan pada kode
// program modern. Membahas seluruh cara untuk mengimpor
// kode merupakan sebuah topik yang panjang pada buku pegangan berikut:
//
// https://www.typescriptlang.org/docs/handbook/modules.html

// Namun, untuk menjawab pertanyaan terakhir, apabila Anda
// melihat kode JavaScript pada contoh ini - Anda akan melihat:

// var pembuatStiker = function () { };
// exports.default = pembuatStiker;

// Kode di atas akan menetapkan properti bawaan dari objek `exports`
// menjadi `pembuatStiker`. Ada kode-kode lain yang menetapkan
// `exports` bawaan menjadi sebuah fungsi.
//
// TypeScript memilih untuk berpegang pada spesifikasi ECMAScript
// untuk menangani kasus-kasus tersebut, yaitu dengan melemparkan
// sebuah galat. Namun, terdapat opsi `esModuleInterop` pada kompilator
// untuk menangani kasus-kasus tersebut secara otomatis.
//
// Apabila Anda mengaktifkan opsi tersebut pada contoh ini, Anda
// akan melihat bahwa galat akan hilang.
