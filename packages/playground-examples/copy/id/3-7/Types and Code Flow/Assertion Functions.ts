//// { compiler: {  }, order: 1 }

// Karena sifat JavaScript yang fleksibel, menambahkan pemeriksaan
// tipe data merupakan ide yang bagus untuk memastikan asumsi Anda

// Hal-hal ini biasanya disebut _assertions_ (atau _invariants_)
// _Assertions_ merupakan sebuah fungsi kecil yang mengeluarkan pesan
// kesalahan dini ketika variabel yang diberikan tidak sesuai
// dengan apa yang Anda harapkan.

// Node menyediakan fungsi bawaan untuk menyelesaikan masalah ini.
// Fungsi tersebut bernama `assert` dan fungsi tersebut tersedia
// tanpa harus melakukan `import` terlebih dahulu.

// Sekarang, kita akan membuat fungsi `assert` kita sendiri.
// Kode program di bawah ini akan mendeklarasikan fungsi yang
// menegaskan bahwa ekspresi yang bernama `value` bernilai
// `true`.
declare function assert(value: unknown): asserts value;

// Sekarang, kita akan menggunakan fungsi tersebut untuk
// memeriksa tipe dari sebuah `enum`
declare const mungkinAngkaAtauString: string | number;
assert(typeof mungkinAngkaAtauString === "string");

// Dengan TypeScript versi 3.7, fitur analisis alur kode dapat
// menggunakan fungsi-fungsi semacam ini untuk mengetahui
// maksud dari kode program. Jadi, ketika Anda menyorot
// variabel di bawah ini - Anda dapat melihat bahwa variabel
// tersebut telah dipersempit dari sebuah _string_ atau bilangan
// menjadi hanya sebuah _string_

mungkinAngkaAtauString;

// Anda dapat menggunakan fungsi _assertion_ untuk menjamin
// tipe di seluruh kode program Anda, contohnya TypeScript
// mengetahui bahwa fungsi ini akan mengembalikan sebuah
// bilangan tanpa perlu penambahan tipe pada parameter
// melalui deklarasi _assert_ pada baris sebelumnya

function perkalian(x: any, y: any) {
    assert(typeof x === "number");
    assert(typeof y === "number");

    return x * y;
}

// Fungsi _assertion_ merupakan saudara dari _Type Guards_
// Hal yang membedakan adalah _type-guards_ mempengaruhi alur
// kode seiring berjalannya fungsi.

// Contohnya, kita dapat menggunakan fungsi _assertion_ untuk
// mempersempit tipe dari sebuah _enum_ seiring berjalannya
// waktu.

declare const salahSatuDariLimaBilanganPertama: 1 | 2 | 3 | 4 | 5;

declare function adalahGanjil(param: unknown): asserts param is 1 | 3 | 5;
declare function adalahDibawahEmpat(param: unknown): asserts param is 1 | 2 | 3 | 4;

// Hal ini seharusnya mempersempit _enum_ menjadi: 1 | 3 | 5

adalahGanjil(salahSatuDariLimaBilanganPertama);
salahSatuDariLimaBilanganPertama;

// Hal ini akan memotong nilai _enum_ yang mungkin menjadi: 1 | 3

adalahDibawahEmpat(salahSatuDariLimaBilanganPertama);
salahSatuDariLimaBilanganPertama;

// Hal-hal diatas adalah dasar dari beberapa fitur yang dimiliki
// oleh fungsi _assertion_ pada TypeScript versi 3.7 - Anda dapat
// mengetahui lebih lanjut dengan membaca catatan rilis TypeScript
// versi 3.7:
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
