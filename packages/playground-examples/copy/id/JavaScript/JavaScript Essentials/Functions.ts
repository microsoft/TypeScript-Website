//// { order: 2, compiler: { noImplicitAny: false } }

// Ada beberapa cara untuk mendeklarasikan fungsi di
// JavaScript. Mari kita lihat fungsi yang menambahkan dua
// angka bersama:

// Membuat fungsi dalam lingkup global yang disebut addOldSchool
function addOldSchool(x, y) {
  return x + y;
}

// Anda dapat memindahkan nama fungsi ke variabel
// nama juga
const anonymousOldSchoolFunction = function (x, y) {
  return x + y;
};

// Anda juga dapat menggunakan singkatan panah-gemuk (_fat-arrow_) 
// untuk suatu fungsi
const addFunction = (x, y) => {
  return x + y;
};

// Kita akan fokus pada cara terakhir, tapi semuanya
// berlaku untuk ketiga format termasuk dua yang sebelumnya.

// TypeScript menyediakan sintaks tambahan yang ditambahkan ke
// definisi fungsi dan menawarkan petunjuk tentang tipe data apa
// diharapkan oleh fungsi ini.
//
// Selanjutnya adalah versi paling terbuka dari fungsi add, versi ini
// mengatakan bahwa add mengambil dua masukan dari jenis 
// apa pun: dimana masukan ini bisa berupa _string_, angka atau objek 
// yang telah Anda buat.

const add1 = (x: any, y: any) => {
  return x + y;
};
add1("Hello", 23);

// Ini adalah JavaScript yang sah (_string_ dapat ditambahkan
// seperti ini misalnya) tetapi tidak optimal untuk fungsi kita
// yang kita tahu adalah angka, jadi kita akan mengonversi x dan
// y hanya menjadi angka.

const add2 = (x: number, y: number) => {
  return x + y;
};
add2(16, 23);
add2("Hello", 23);

// Bagus. Kita mendapatkan kesalahan ketika ada selain angka
// yang diteruskan ke dalam fungsi. Jika Anda mengarahkan kursor 
// ke kata add2 di atas, Anda akan melihat bahwa TypeScript 
// mendeskripsikannya sebagai:
//
// const add2: (x: number, y: number) => number
//
// Di mana ia menyimpulkan bahwa ketika dua input merupakan
// nomor, maka satu-satunya jenis pengembalian yang mungkin adalah nomor.
// Ini bagus, Anda tidak perlu menulis sintaks tambahan.
// Mari kita lihat apa yang diperlukan untuk melakukan itu:

const add3 = (x: number, y: number): string => {
  return x + y;
};

// Fungsi ini gagal karena kita memberi tahu TypeScript bahwa TypeScipt
// seharusnya menerima nilai kembali dalam bentuk _string_, tetapi 
// ternyata fungsinya tidak memenuhi janji itu.

const add4 = (x: number, y: number): number => {
  return x + y;
};

// Ini adalah versi yang sangat eksplisit dari add2 - ada
// kasus ketika Anda ingin menggunakan sintaks tipe pengembalian eksplisit
// untuk memberi diri Anda ruang untuk bekerja sebelumnya
// Anda memulai. Agak mirip seperti bagaimana test-driven development
// merekomendasikan memulai dengan tes yang gagal, tetapi dalam kasus ini
// ini dengan bentuk fungsi yang gagal.

// Contoh ini hanyalah dasar, Anda dapat mempelajari lebih banyak lagi
// tentang bagaimana fungsi bekerja di TypeScript di buku pegangan 
// (handbook) dan di dalam bagian JavaScript Fungsional dari contoh:
//
// https://www.typescriptlang.org/docs/handbook/functions.html
// example:function-chaining

// Dan untuk melanjutkan tur dasar-dasar JavaScript,
// kita akan melihat bagaimana aliran kode memengaruhi tipe data TypeScript:
// example:code-flow
