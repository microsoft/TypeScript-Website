//// { order: 3, isJavaScript: true }

// TypeScript secara bawaan tidak memeriksa galat
// yang ada dalam kode JavaScript. Sebaliknya, perkakas
// TypeScript difokuskan untuk memberikan banyak dukungan
// pada editor.

// Namun, mengaktifkan fitur pemeriksaan galat merupakan hal
// yang cukup mudah untuk dilakukan. Pada sebuah berkas
// JavaScript biasa, cukup tambahkan komentar berikut
// untuk mengaktifkan fitur pemeriksaan galat TypeScript:

// @ts-check

let stringku = "123";
stringku = {};

// Fitur tersebut mungkin akan menambahkan banyak coretan merah
// di dalam berkas JavaScript Anda. Ketika masih bekerja dalam
// JavaScript, Anda memiliki beberapa perkakas untuk memperbaiki
// galat-galat tersebut.

// Untuk beberapa galat yang rumit, dimana Anda menganggap
// bahwa perubahan kode program harus dilakukan, Anda dapat
// menggunakan anotasi JSDoc untuk menetapkan tipe data
// yang seharusnya pada TypeScript:

/** @type {string | {}} */
let stringAtauObjekku = "123";
stringAtauObjekku = {};

// Dimana hal tersebut dapat Anda pelajari lebih lanjut di:
// example:jsdoc-support

// Anda dapat mendeklarasikan kegagalan yang tidak penting dengan
// memerintahkan TypeScript untuk mengabaikan galat selanjutnya:

let galatkuYangDiabaikan = "123";
// @ts-ignore
galatkuYangDiabaikan = {};

// Anda dapat menggunakan fitur menyimpulkan tipe data
// melalui alur kode program untuk membuat perubahan
// pada kode JavaScript Anda: example:code-flow
