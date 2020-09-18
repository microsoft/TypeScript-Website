//// { compiler: {  target: 99 }, order: 1 }

// Apakah anda tahu bahwa ada batas untuk seberapa besar bilangan
// yang dapat direpresentasikan dalam JavaScript ketika menulis kode program?

const nilaiTertinggiMaksimum = 9007199254740991;
const nilaiTerendahMaksimum = -9007199254740991;

// Apabila bilangan anda lebih besar atau lebih kecil dari angka tersebut
// Anda mulai memasuki zona yang berbahaya

const lebihSatuDariMaksimal = 9007199254740992;
const kurangSatuDariMinimal = -9007199254740992;

// Solusi untuk menangani masalah angka sebesar ini
// adalah dengan mengonversikan bilangan-bilangan tersebut ke BigInts
// dibandingkan dengan sebuah bilangan biasa
//
// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/BigInt

// TypeScript kini menawarkan sebuah _fixit_ untuk angka
// literal yang memiliki nilai diatas 2^52 (positif / negatif).
// Fixit tersebut menambahkan sufiks "n" yang menginformasikan pada JavaScript
// bahwa tipe untuk bilangan tersebut adalah BigInts.

// Bilangan literal
9007199254740993;
-9007199254740993;
9007199254740994;
-9007199254740994;

// Bilangan heksadesimal
0x19999999999999;
-0x19999999999999;
0x20000000000000;
-0x20000000000000;
0x20000000000001;
-0x20000000000001;
