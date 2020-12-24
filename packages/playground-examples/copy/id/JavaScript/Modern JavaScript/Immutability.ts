// JavaScript adalah bahasa pemrograman yang memiliki
// beberapa cara untuk mendeklarasikan objek-objek yang tidak
// berubah. Cara yang paling menonjol adalah dengan menggunakan
// kata kunci `const` - yang menandakan bahwa nilai tidak akan
// berubah.

const haloDunia = "Halo Dunia";

// Sekarang, Anda tidak dapat mengubah nilai haloDunia, TypeScript
// akan melempar sebuah galat mengenai hal tersebut, untuk
// mencegah Anda mendapatkan galat saat program dieksekusi.

// You cannot change helloWorld now, TypeScript will give
// you an error about this, because you would get one at
// runtime instead.

haloDunia = "Hai Dunia";

// Mengapa Anda harus peduli pada nilai yang tidak dapat berubah?
// Alasan utamanya adalah untuk mengurangi kompleksitas pada kode
// program Anda. Apabila Anda dapat mengurangi hal-hal yang nilainya
// dapat berubah, Anda akan mengurangi hal yang harus Anda pantau.

// Menggunakan kata kunci `const` merupakan langkah awal yang baik,
// namun cara tersebut tidak akan sepenuhnya berhasil apabila
// digunakan untuk objek.

const objekKonstanta = {
  pesan: "Halo Dunia",
};

// objekKonstanta tidak sepenuhnya konstan, karena Anda masih
// dapat mengubah beberapa bagian dari objek tersebut, sebagai
// contoh Anda dapat mengubah nilai dari `pesan`:

objekKonstanta.pesan = "Hai Dunia";

// Kata kunci `const` menandakan objek yang ditunjuk memiliki
// nilai yang tidak akan berubah, namun bagian internal
// dari objek tersebut tetap dapat diubah. Perilaku tersebut
// dapat diubah menggunakan `Object.freeze`.

const objekKonstantaPasti = Object.freeze({
  pesan: "Halo Dunia",
});

// Ketika sebuah objek dibekukan, maka Anda tidak dapat
// mengubah bagian internal dari objek tersebut. TypeScript
// akan meleparkan sebuah galat pada kasus ini:

objekKonstantaPasti.pesan = "Hai Dunia";

// Cara tersebut juga dapat digunakan pada _array_:

const arrayYangDibekukan = Object.freeze(["Hai"]);
arrayYangDibekukan.push("Dunia");

// Menggunakan kata kunci `Object.freeze` menjamin
// bahwa nilai objek tidak akan berubah, termasuk
// internal dari objek tersebut.

// TypeScript memiliki beberapa _hook_ sintaks tambahan untuk
// meningkatkan kemampuan Anda ketika bekerja dengan data
// yang tidak berubah yang dapat Anda temukan pada bagian
// contoh TypeScript berikut:
//
// example:literals
// example:type-widening-and-narrowing
