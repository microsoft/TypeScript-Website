//// { order: 3, compiler: { strictNullChecks: true } }

//// {order: 3, compiler: {strictNullChecks: true}}

// Bagaimana kode mengalir di dalam file JavaScript dapat mempengaruhi
// tipe data di seluruh program kita.

const users = [{ name: "Ahmed" }, { name: "Gemma" }, { name: "Jon" }];

// Kita akan melihat apakah kita dapat menemukan pengguna bernama "jon".
const jon = users.find(u => u.name === "jon");

// Dalam kasus di atas, 'find' bisa gagal. Dalam hal ini kita
// tidak memiliki objek. Ini menghasilkan sebuah tipe data:
//
// {name: string} | undefined
//
// Jika Anda mengarahkan mouse ke tiga penggunaan 'jon' berikut,
// Anda akan melihat bagaimana tipe berubah tergantung di mana kata tersebut berada:

if (jon) {
  jon;
} else {
  jon;
}

// Tipe '{name: string} | undefined' menggunakan fitur TypeScript
// yang disebut tipe data gabungan (_union types_). Tipe data gabungan 
// adalah cara untuk nyatakan bahwa sebuah objek bisa 
// menjadi salah satu dari banyak hal.
// 
// Tanda pipa (|) bertindak sebagai pemisah antara tipe data yang berbeda.
// Sifat dinamis JavaScript berarti bahwa banyak fungsi
// menerima dan dan mengembalikan objek dari tipe data yang tidak terkait 
// dan kita perlu untuk dapat mengungkapkan tipe data mana yang mungkin 
// kita hadapi.

// Kita bisa menggunakan ini dalam beberapa cara. Mari kita mulai dengan melihat
// himpunan (_array_) yang nilainya memiliki tipe berbeda.

const identifiers = ["Hello", "World", 24, 19];

// Kita bisa menggunakan sintaks javascript 'type x === y' untuk
// memeriksa jenis elemen pertama. Anda dapat mengarahkan kursor ke atas
// 'randomIdentifier' di bawah untuk melihat perubahannya
// lokasi berbeda

const randomIdentifier = identifiers[0];
if (typeof randomIdentifier === "number") {
  randomIdentifier;
} else {
  randomIdentifier;
}

// Analisis aliran kontrol ini berarti kita dapat menulis
// JavaScript polos, dan TypeScript akan mencoba memahami bagaimana file
// jenis kode akan berubah di lokasi berbeda.

// Untuk mempelajari lebih lanjut tentang analisis aliran kode:
// - example:type-guards

// Untuk melanjutkan membaca contoh-contoh lain, Anda dapat melompat ke
// beberapa tempat lain sekarang:
//
// - Modern JavaScript: example:immutability
// - Type Guards: example:type-guards
// - Functional Programming with JavaScript example:function-chaining
