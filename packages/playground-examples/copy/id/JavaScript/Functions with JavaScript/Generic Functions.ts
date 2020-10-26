// Tipe data generik menyediakan sebuah cara untuk menggunakan tipe
// data sebagai sebuah variabel dalam tipe data lain, yaitu
// meta.

// Kami akan berusaha membuat contoh ini sesederhana mungkin,
// Anda dapat melakukan banyak hal dengan tipe data generik dan 
// kemungkinan suatu saat Anda akan melihat kode program yang
// sangat rumit yang memanfaatkan tipe data generik - namun hal
// tersebut tidak berarti bahwa tipe data generik merupakan sesuatu
// yang rumit.

// Mari kita mulai dengan sebuah contoh dimana kita akan
// membungkus sebuah objek input dalam sebuah _array_. Kita
// hanya akan mengamati satu variabel pada contoh ini,
// yaitu tipe data yang diteruskan:

function bungkusDalamArray<Tipe>(input: Tipe): Tipe[] {
  return [input];
}

// Catatan: biasanya kita melihat `Tipe` ditulis sebagai `T`.
// Hal  tersebut merupakan kebiasaan yang mirip dengan bagaimana
// orang menggunakan `i` dalam sebuah perulangan `for` untuk
// merepresentasikan indeks. `T` biasanya merepresentasikan `Tipe`,
// sehingga kami akan menuliskan dengan lengkap demi
// kejelasan kode program.

// Fungsi yang kita buat akan menggunakan fitur penyimpulan
// tipe data supaya dapat menjamin tipe data yang
// diteruskan pada fungsi akan selalu sama dengan tipe
// data yang dikembalikan oleh fungsi tersebut (walaupun
// tipe data tersebut akan dibungkus dalam sebuah _array_). 

const arrayString = bungkusDalamArray("hello generics");
const arrayBilangan = bungkusDalamArray(123);

// Kita dapat membuktikan bahwa jaminan tersebut
// bekerja sesuai keinginan dengan memeriksa apakah
// kita dapat menetapkan sebuah _array string_ pada sebuah
// fungsi yang seharusnya merupakan sebuah _array_ objek: 
const bukanArrayString: string[] = bungkusDalamArray({});

// Anda juga dapat melewati penyimpulan tipe data generik
// dengan menambahkan tipe data:
const arrayStringKedua = bungkusDalamArray<string>("");

// `bungkusDalamArray` memperbolehkan penggunaan semua
// tipe data, namun ada beberapa masalah dimana Anda ingin
// bahwa hanya beberapa tipe data dan turunannya yang diperbolehkan.
// Untuk mengatasi masalah tersebut, Anda dapat menetapkan
// bahwa tipe data generik harus merupakan turunan dari tipe
// data tertentu.

interface Drawable {
  gambar: () => void;
}

// Fungsi ini menerima sekumpulan objek yang memiliki
// fungsi untuk menggambar pada layar.
function gambarPadaLayar<Tipe extends Drawable>(input: Tipe[]) {
  input.forEach((i) => i.gambar());
}

const objekDenganGambar = [{ gambar: () => { } }, { gambar: () => { } }];
gambarPadaLayar(objekDenganGambar);

// Fungsi tersebut akan gagal dipanggil
// apabila salah satu objek tidak memiliki
// fungsi `gambar`:

gambarPadaLayar([{}, { gambar: () => { } }]);

// Tipe data generik akan mulai terlihat rumit ketika Anda
// memiliki banyak variabel. Berikut merupakan sebuah
// contoh sebuah fungsi _caching_ yang memperbolehkan
// Anda untuk memiliki sekumpulan tipe data input dan
// _cache_.

interface CacheHost {
  simpan: (a: any) => void;
}

function simpanObjekDalamCache<Tipe, Cache extends CacheHost>(obj: Tipe, cache: Cache): Cache {
  cache.simpan(obj);
  return cache;
}

// Contoh tersebut merupakan contoh yang sama seperti
// contoh sebelumnya, namun memiliki sebuah parameter tambahan.
// Catatan: supaya fungsi tersebut dapat dijalankan, kita harus
// menggunakan tipe data `any`. Hal tersebut dapat diatasi
// menggunakan antar muka generik.

interface CacheHostGenerik<TipeKonten> {
  simpan: (a: TipeKonten) => void;
}

// Sekarang ketika `CacheHostGeneric` digunakan, Anda
// harus menetapkan `TipeKonten`.

function simpanObjekBertipeDataPadaCache<Type, Cache extends CacheHostGenerik<Type>>(obj: Type, cache: Cache): Cache {
  cache.simpan(obj);
  return cache;
}

// Contoh-contoh di atas sudah menjelaskan sintaks tipe data generik
// secara sekilas. Namun, tipe data generik mampu memastikan bahwa
// kode program yang Anda buat lebih aman. Hal tersebut merupakan
// kompromi, bahwa Anda memiliki lebih banyak pengetahuan sekarang.
// Ketika Anda menyediakan API untuk orang lain, tipe data generik
// menyediakan sebuah cara yang fleksibel yang memperbolehkan
// orang lain untuk menggunakan tipe data mereka sendiri
// dengan dukungan fitur penyimpulan tipe data.

// Anda dapat melihat contoh-contoh lain tentang tipe data generik
// dengan kelas dan antar muka melalui: 
//
// example:advanced-classes
// example:typescript-with-react
// https://www.typescriptlang.org/docs/handbook/generics.html
