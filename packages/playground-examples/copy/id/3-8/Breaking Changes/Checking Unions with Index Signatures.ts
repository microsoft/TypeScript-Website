//// { compiler: { ts: "3.8.3" } }

// Pada TypeScript versi sebelumnya, fitur pemeriksaan kode tidak akan
// memastikan _field_ yang tidak dideklarasikan dalam sebuah _union_
// sesuai dengan tipe apapun yang terindeks pada _union_.

// Anda dapat mempelajari lebih lanjut tentang tipe yang
// terindeks melalui: example:indexed-types

// Sebagai contoh, tipe IdentifierCache dibawah ini menyatakan bahwa
// setiap _key_ pada objek tersebut merupakan sebuah angka:

type IdentifierCache = { [key: string]: number };

// Hal tersebut menyebabkan ekspresi dibawah ini menjadi tidak valid,
// karena 'file_a' memiliki nilai sebuah _string_.

const cacheDenganString: IdentifierCache = { file_a: "12343" };

// Namun, ketika Anda menyatakan hal tersebut dalam sebuah _union_,
// maka pemeriksaan kode tidak akan dijalankan:

let cachePengguna: IdentifierCache | { index: number };
cachePengguna = { file_pertama: 5, file_kedua: "abc" };

// Masalah tersebut sudah diperbaiki, dan akan ada
// sebuah pesan kesalahan mengenai 'file_kedua' dari kompilator.

// Perbaikan tersebut juga sudah mampu mengangani kasus dimana _key_
// memiliki tipe yang berbeda, contohnya ([key: string] dan [key: number])

type IdentifierResponseCache = { [key: number]: number };

let cacheHasil: IdentifierCache | IdentifierResponseCache;
cacheHasil = { file_pertama: "abc" };
