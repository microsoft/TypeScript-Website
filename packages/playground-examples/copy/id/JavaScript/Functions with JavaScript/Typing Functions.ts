// Fitur penyimpulan tipe data yang dimiliki TypeScript
// dapat meningkatkan kemampuan Anda secara drastis, namun
// terdapat banyak cara lain untuk mendokumentasikan
// fungsi Anda dengan lebih rinci. 

// Salah satu titik awal yang baik adalah parameter opsional,
// yang merupakan sebuah cara untuk memberitahu orang lain
// bahwa Anda tidak wajib untuk meneruskan parameter.

let i = 0;
const tambahkanIndeks = (nilai?: number) => {
  i += nilai === undefined ? 1 : nilai;
};

// Fungsi tersebut dapat dipanggil dengan cara:

tambahkanIndeks();
tambahkanIndeks(0);
tambahkanIndeks(3);

// Anda dapat menjadikan fungsi sebagai parameter, dimana
// hal tersebut menyediakan fitur penyimpulan tipe data
// ketika Anda menulis fungsi tersebut.

const callbackDenganIndeks = (callback: (i: number) => void) => {
  callback(i);
};

// Menyisipkan antar muka fungsi dapat menyebabkan kode program
// sulit dibaca. Menggunakan fitur alias pada tipe data akan
// memperbolehkan Anda memberi nama pada parameter fungsi yang diteruskan.

type callbackBilangan = (i: number) => void;
const callbackDenganIndeks2 = (callback: callbackBilangan) => {
  callback(i);
};

// Fungsi tersebut dapat dipanggil seperti berikut:

callbackDenganIndeks(index => {
  console.log(index);
});

// Dengan menyorot indeks di atas, Anda dapat melihat bagaimana
// TypeScript telah menyimpulkan indeks sebagai angka dengan tepat.

// Penyimpulan tipe data TypeScript juga dapat dijalankan ketika
// meneruskan sebuah fungsi sebagai sebuah _reference_. Untuk
// menunjukkan hal tersebut, kita akan menggunakan sebuah fungsi
// yang mengubah sebuah angka menjadi sebuah _string_:

const angkaKeString = (n: number) => {
  return n.toString();
};

// Fungsi tersebut dapat digunakan pada `map` dalam sebuah
// _array_ untuk mengubah seluruh angka menjadi sebuah sebuah
// _string_. Jika Anda menyorot `angkaSebagaiString` di bawah ini,
// Anda dapat melihat tipe data yang diharapkan.
const angkaSebagaiString = [1, 4, 6, 10].map(i => angkaKeString(i));

// Kita dapat menyingkat penulisan kode program dengan
// langsung meneruskan fungsi dan mendapatkan hasil yang sama
// namun dengan kode program yang lebih terfokus:
const angkaSebagaiStringTerse = [1, 4, 6, 10].map(angkaKeString);

// Anda bisa saja memiliki fungsi yang mampu menerima banyak
// tipe data sekaligus, namun Anda hanya tertarik pada beberapa
// atribut. Kasus tersebut merupakan contoh kasus yang berguna
// untuk _indexed signatures_ pada tipe data. Tipe data di bawah
// ini mendeklarasikan bahwa fungsi ini dapat dipanggil
// menggunakan objek apapun selama objek tersebut memiliki
// atribut `nama`:

interface SeluruhObjekBernama {
  nama: string;
  [key: string]: any;
}

const cetakNama = (input: SeluruhObjekBernama) => { };

cetakNama({ nama: "joey" });
cetakNama({ nama: "joey", umur: 23 });

// Apabila Anda ingin mempelajari mengenai _index-signatures_
// kami merekomendasikan:
//
// https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks
// https://basarat.gitbooks.io/typescript/docs/types/index-signatures.html

// Anda juga dapat memperbolehkan perilaku TypeScript
// seperti ini dimanapun dengan menyetel `suppressExcessPropertyError`
// pada `tsconfig` - namun, orang lain tidak dapat mengetahui
// hal tersebut apabila API ini dimatikan.

// Fungsi dalam JavaScript dapat menerima berbagai parameter.
// Terdapat dua cara yang umum digunakan untuk mendeskripsikan
// hal tersebut: tipe data gabungan untuk kembalian / masukan, dan
// _function overload_.

// Menggunakan tipe data gabungan pada parameter Anda merupakan
// pilihan yang masuk akal apabila hanya ada satu atau dua perubahan
// dan dokumentasi kode program tidak perlu diubah apabila fungsi
// berubah.

const fungsiBooleanAtauAngka = (input: boolean | number) => { };

fungsiBooleanAtauAngka(true);
fungsiBooleanAtauAngka(23);

// Namun, _function overload_ menyediakan sintaks
// yang lebih luas untuk parameter dan tipe data kembalian.
interface fungsiBooleanAtauAngkaAtauString {
  /** Menerima sebuah boolean, mengembalikan sebuah boolean */
  (input: boolean): boolean;
  /** Menerima sebuah angka, mengembalikan sebuah angka */
  (input: number): number;
  /** Menerima sebuah _string_, mengembalikan sebuah _string_ */
  (input: string): boolean;
}

// Apabila ini merupakan kali pertama Anda melihat `declare`,
// `declare` memperbolehkan Anda untuk memberi tahu TypeScript
// bahwa sesuatu memang ada walaupun benda tersebut tidak
// ada pada waktu eksekusi berkas ini. Hal tersebut berguna
// untuk memetakan kode program yang memiliki efek samping
// namun sangat berguna pada saat demonstrasi program
// yang membutuhkan banyak kode program untuk mengimplementasikannya.

declare const fungsiBooleanAtauAngkaAtauString: fungsiBooleanAtauAngkaAtauString;

const nilaiBoolean = fungsiBooleanAtauAngkaAtauString(true);
const nilaiAngka = fungsiBooleanAtauAngkaAtauString(12);
const nilaiBoolean2 = fungsiBooleanAtauAngkaAtauString("string");

// Apabila Anda menyorot nilai-nilai di atas dan fungsinya, Anda
// dapat melihat dokumentasi yang tepat beserta dengan 
// tipe data kembaliannya.

// Menggunakan _function overload_ dapat meningkatkan kemampuan
// Anda secara drastis, namun ada perkakas lain yang dapat
// digunakan untuk tipe data masukan dan kembalian yang berbeda,
// yaitu tipe data generik.

// Contoh ini menyediakan sebuah cara bagi Anda untuk
// menetapkan tipe data sebagai variabel sementara
// pada deklarasi tipe data. 

// example:generic-functions
// example:function-chaining
