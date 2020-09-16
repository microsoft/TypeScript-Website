//// { compiler: {  noImplicitAny: false }, order: 2 }

// Dengan fitur 'infer from usage' yang terdapat pada TypeScript 3.7
// perbaikan kode program menjadi lebih pintar. Sekarang, fitur perbaikan
// perbaikan kode program akan menggunakan daftar tipe penting yang diketahui (string, number, array, Promise)
// dan menyimpulkan apakah penggunaan sebuah tipe cocok dengan
// API dari objek-objek tersebut.

// Untuk beberapa contoh selanjutnya, pilih parameter dari sebuah fungsi
// tekan lampu bohlam yang muncul dan pilih
// 'Infer Parameter types...'

// Menyimpulkan sebuah array bilangan:

function pushNumber(arr) {
    arr.push(12);
}

// Menyimpulkan sebuah Promise:

function awaitPromise(promise) {
    promise.then((value) => console.log(value));
}

// Menyimpulkan fungsi dan tipe kembaliannya:

function inferAny(app) {
    const result = app.use("hi");
    return result;
}

// Menyimpulkan sebuah array string, karena sebuah string
// ditambahkan pada parameter tersebut:

function insertString(names) {
    names[1] = "hello";
}
