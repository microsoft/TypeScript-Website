//// { order: 3, isJavaScript: true }

// Node.js adalah sebuah _runtime_ JavaScript populer yang dibangun
// di atas v8, mesin JavaScript yang diberdayakan oleh Chrome.
// Anda dapat menggunakan Node.js untuk membangun peladen, klien
// _front-end_, dan apapun yang menengahi kedua hal tersebut. 

// https://nodejs.org/

// Node.js hadir dengan seperangkat pustaka utama yang memperluas
// _runtime_ JavaScript. Pustaka-pustaka tersebut memiliki
// kemampuan dari penanganan alur berkas:

import { join } from "path";
const alurBerkasku = join("~", "downloads", "todo_list.json");

// Sampai manipulasi berkas:

import { readFileSync } from "fs";
const teksToDo = readFileSync(alurBerkasku, "utf8");

// Anda dapat menambahkan tipe data pada proyek JavaScript Anda
// menggunakan gaya JSDoc secara bertahap. Kami akan membuat
// salah satu TODO berdasarkan struktur JSON di bawah ini:

/**
 * @typedef {Object} TODO Sebuah TODO
 * @property {string} judul Nama tampilan untuk sebuah TODO
 * @property {string} deskripsi Deskripsi untuk sebuah TODO
 * @property {boolean} selesai Menandakan apakah TODO sudah selesai atau belum
 */

// Sekarang, tetapkan komentar tersebut pada tipe kembalian
// dari JSON.parse. Anda dapat mempelajari hal ini lebih lanjut
// melalui: example:jsdoc-support

/** @type {TODO[]} sebuah daftar TODO */
const daftarTodo = JSON.parse(todoListText);

// Dan penanganan proses:
import { spawnSync } from "child_process";
daftarTodo
  .filter(todo => !todo.done)
  .forEach(todo => {
    // Gunakan klien ghi untuk membuat isu bagi setiap todo
    // yang belum selesai.

    // Sebagai catatan, Anda akan memperoleh _autocomplete_
    // yang tepat dan dokumentasi di JavaScript ketika Anda
    // menyorot `todo.judul` di bawah ini.
    spawnSync(`ghi open --message "${todo.judul}\n${todo.deskripsi}"`);
  });

// TypeScript memiliki definisi tipe data modul Node.js
// yang  mutakhir melalui DefinitelyTyped - sehingga Anda
// dapat menulis program berbasis Node.js dengan cakupan
// tipe data yang kuat.
