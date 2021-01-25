//// { order: 3, isJavaScript: true }

// TypeScript memiliki banyak dukungan untuk JSDoc. Bahkan
// Anda dapat membuat berkas JavaScript biasa dan menggunakan
// anotasi JSDoc untuk membuat lingkungan pengembangan yang
// kaya dukungan.
//
// Sebuah komentar JSDoc merupakan sebuah komentar lebih dari
// satu baris yang dimulai dengan dua buah bintang, kontras
// dengan komentar biasa yang dimulai dengan satu bintang. 

/* Ini adalah komentar biasa */
/** Ini adalah komentar JSDoc */

// Komentar JSDoc akan terhubung dengan kode JavaScript
// terdekat yang ada di bawah komentar tersebut.

const contohVariabel = "Hai";

// Apabila Anda menyorot `contohVariabel`, Anda dapat melihat
// bahwa teks yang ada dalam JSDoc diikutsertakan.

// Komentar JSDoc merupakan sebuah cara untuk memberikan informasi
// mengenai tipe data pada TypeScript dan editor Anda. Mari kita
// mulai dengan menyetel sebuah tipe data dari variabel menjadi
// tipe data bawaan.

// Pada seluruh contoh di bawah ini, Anda dapat menyorot nama
// variabel dan pada baris selanjutnya, coba ketik [example].
// untuk melihat opsi penyelesaian otomatis.

/** @type {number} */
var bilanganKu;

// Anda dapat melihat seluruh _tag_ yang didukung pada buku
// pegangan berikut:
//
// https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html#supported-jsdoc

// Namun, kita akan mencoba beberapa contoh umum berikut ini. Anda
// juga dapat menyalin dan menempel setiap contoh dari buku panduan
// kesini.

// Mengimpor tipe data dari berkas konfigurasi JavaScript:

/** @type { import("webpack").Config } */
const config = {};

// Membuat tipe data yang kompleks yang dapat digunakan
// kembali di banyak tempat:

/**
 * @typedef {Object} Pengguna - Akun pengguna
 * @property {string} nama - nama yang digunakan untuk menunjukkan pengguna
 * @property {number} id - sebuah ID yang unik
 */

// Kemudian, Anda dapat menggunakannya sebagai nama pada `typedef`:

/** @type { Pengguna } */
const pengguna = {};

// Berikut merupakan cara untuk menyingkat definisi
// tipe data pada TypeScript, yang kemudian dapat Anda
// gunakan pada `type` dan `typedef`:

/** @type {{ owner: Pengguna, nama: string }} */
const sumberDaya;

/** @typedef {{owner: Pengguna, nama: string}} SumberDaya */

/** @type {SumberDaya} */
const sumberDayaLain;

// Mendeklarasikan fungsi yang memiliki tipe data:

/**
 * Menjumlahkan dua buah bilangan
 * @param {number} a Bilangan pertama
 * @param {number} b Bilangan kedua
 * @returns {number}
 */
function jumlahDuaBilangan(a, b) {
  return a + b;
}

// Anda dapat menggunakan perkakas tipe data TypeScript,
// seperti `union`:

/** @type {(string | boolean)} */
let stringAtauBoolean = "";
stringAtauBoolean = false;

// Menambahkan dokumentasi pada objek global menggunakan JSDoc
// merupakan proses yang lebih melibatkan VS Code, yang dapat 
// Anda lihat melalui dokumentasi VS Code berikut:
//
// https://code.visualstudio.com/docs/nodejs/working-with-javascript#_global-variables-and-type-checking

// Menambahkan komentaar JSDoc pada fungsi yang Anda buat
// merupakan solusi yang menguntungkan; Anda mendapat
// dukungan perkakas yang lebih baik dan pengguna API
// Anda juga dapat menikmatinya. 
