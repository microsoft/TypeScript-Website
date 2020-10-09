//// { compiler: { ts: "4.0.2" } }

// # _Nullish Coalescing_
//
// _Nullish Coalescing_ merupakan sebuah operator baru
// yang dinyatakan dengan `??` yang bertujuan untuk menambah
// kemampuan umum dari `||` dengan cara yang sama seperti `===`
// menambah kemampuan `==` sebagai sebuah bentuk persamaan yang
// lebih ketat.
//
// Untuk memahami _nullish coalescing_, mari kita lihat bagaimana
// cara kerja `||` melalui kode di bawah ini:

const respon = {
  nilaiKosong: null,
  teksPembuka: "",
  durasiAnimasi: 0,
  tinggi: 400,
  tunjukkanSplashScreen: false,
} as const;

const nilaiTakTerdefinisi = respon.nilaiTakTerdefinisi || "nilai anggapan lainnya";
// Baris kode di atas akan menghasilkan "nilai anggapan lainnya"

const nilaiKosong = respon.nilaiKosong || "nilai anggapan lainnya";

// Dua contoh di atas akan berjalan mirip dengan bahasa pemrograman lainnya.
// Sebagai sebuah perkakas `||` cukup baik dalam menetapkan nilai anggapan,
// namun pemeriksaan _falsy_ dari JavaScript dapat mengejutkan Anda
// pada nilai-nilai yang umum:

// Berpotensi untuk tidak sesuai harapan. '' merupakan nilai _falsy_,
// namun hasilnya adalah 'Halo dunia!'.
const teksPembuka = respon.teksPembuka || "Halo dunia!";

// Berpotensi untuk tidak sesuai harapan. 0 merupakan nilai _falsy_,
// namun hasilnya adalah 300.
const durasiAnimasi = respon.durasiAnimasi || 300;

// Berpotensi untuk tidak sesuai harapan. false merupakan nilai _falsy_,
// namun hasilnya adalah true.
const tunjukkanSplashScreen = respon.tunjukkanSplashScreen || true;

// Ketika operator `||` diganti menjadi `??`, maka persamaan ===
// akan digunakan untuk membandingkan kedua sisi dalam operator
// tersebut:

const teksPembukaKosong = respon.teksPembuka ?? "Halo dunia!";
const durasiAnimasiNol = respon.durasiAnimasi ?? 300;
const janganTunjukkanSplashScreen = respon.tunjukkanSplashScreen ?? true;
