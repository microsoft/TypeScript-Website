//// { order: 1, target: "es5" }

// JavaScript modern menambahkan sebuah cara untuk menangani _callback_
// dengan cara yang elegan melalui API berbasis Promise yang memiliki
// sintaks khusus yang mengizinkan Anda untuk menganggap kode
// program yang bersifat asinkron seperti kode program biasa

// Seperti fitur lainnya, Promise memiliki kekurangan dalam
// hal kompleksitas kode program: membuat sebuah fungsi
// sebagai fungsi asinkron akan membuat nilai kembalian
// dibungkus dalam Promise. Apa yang sebelumnya mengembalikan
// sebuah string, sekarang akan mengembalikan Promise<string>. 

const fungsi = () => ":wave:";
const fungsiAsinkron = async () => ":wave:";

const string = fungsi();
const stringDalamPromise = fungsiAsinkron();

string.length;

// stringDalamPromise merupakan sebuah Promise, bukan string:

stringDalamPromise.length;

// Anda dapat menggunakan kata kunci `await` untuk mengubah
// sebuah Promise menjadi nilai yang ditampung oleh Promise
// tersebut. Untuk saat ini, kata kunci tersebut hanya dapat
// digunakan pada fungsi asinkron.

const fungsiPembungkus = async () => {
  const string = fungsi();
  const stringDalamPromise = await fungsiAsinkron();

  // Melalui kata kunci `await`, sekarang `stringDalamPromise`
  // merupakan sebuah string.
  string.length;
  stringDalamPromise.length;
};

// Kode program yang berjalan menggunakan kata kunci `await`
// dapat melempar galat, dan hal tersebut menjadi penting
// karena galat tersebut harus ditangani pada bagian manapun.

const fungsiYangMelemparGalat = async () => {
  throw new Error("Jangan panggil fungsi ini");
};

// Anda dapat membungkus pemanggilan fungsi asinkron pada sebuah
// blok try-catch untuk menangani kasus di mana fungsi yang
// dipanggil melakukan sesuatu yang tidak diharapkan.

const menangkapFungsiAsinkron = async () => {
  const nilaiKembalian = "Halo dunia!";
  try {
    await fungsiYangMelemparGalat();
  } catch (error) {
    console.error("fungsiYangMelemparGalat gagal dijalankan", error);
  }
  return nilaiKembalian;
};

// Karena ergonomi dari API ini yang mengharuskan Anda untuk
// mengembalikan satu nilai kembalian, atau melempar galat, Anda
// sebaiknya memberikan informasi mengenai nilai-nilai yang
// terdapat pada nilai yang dikembalikan dan melempat galat
// apabila sesuatu yang benar-benar spesial terjadi.

const contohFungsiAkarKuadrat = async (masukan: any) => {
  if (isNaN(masukan)) {
    throw new Error("Masukan hanya dapat berupa angka");
  }

  if (masukan < 0) {
    return { sukses: false, pesan: "Tidak bisa mencari akar bilangan negatif" };
  } else {
    return { sukses: true, nilai: Math.sqrt(masukan) };
  }
};

// Lalu pengguna fungsi tersebut dapat memeriksa respon
// dan mengetahui apa yang harus dilakukan dengan nilai kembalian
// tersebut. Walaupun contoh berikut merupakan contoh yang
// sederhana, ketika Anda mulai bekerja dengan kode
// yang berhubungan dengan jaringan, API sebaiknya didokumentasikan.

const periksaAkarKuadrat = async (nilai: number) => {
  const respon = await contohFungsiAkarKuadrat(nilai);
  if (respon.sukses) {
    respon.nilai;
  }
};

// Sintaks Async / Await mengubah kode yang seperti berikut:

// getResponse(url, (response) => {
//   getResponse(response.url, (secondResponse) => {
//     const responseData = secondResponse.data
//     getResponse(responseData.url, (thirdResponse) => {
//       ...
//     })
//   })
// })

// Menjadi linear seperti berikut:

// const response = await getResponse(url)
// const secondResponse = await getResponse(response.url)
// const responseData = secondResponse.data
// const thirdResponse = await getResponse(responseData.url)
// ...

// Sintaks Async / Await dapat membuat kode program lebih condong
// ke sisi kiri, dan dibaca pada ritme yang konsisten.
