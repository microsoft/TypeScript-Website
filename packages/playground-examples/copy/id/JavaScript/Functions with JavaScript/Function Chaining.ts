//// { order: 2, compiler: { esModuleInterop: true } }

// Fungsi berantai merupakan sebuah pola pemrograman 
// yang umum digunakan di JavaScript, yang dapat membuat
// kode program Anda lebih terfokus karena nilai penengah
// yang lebih sedikit dan lebih mudah dibaca karena kualitas
// penyarangan yang dimiliki fungsi berantai.

// Sebuah API yang sangat umum yang bekerja menggunakan
// fungsi berantai adalah jQuery. Di bawah ini merupakan
// sebuah contoh penggunaan jQuery dengan tipe data
// dari DefinitelyTyped:

import $ from "jquery";

// Berikut merupakan sebuah contoh penggunaan API jQuery:

$("#navigasi").css("background", "red").height(300).fadeIn(200);

// Jika Anda menambahkan sebuah titik pada baris kode di atas,
// Anda akan melihat daftar fungsi yang panjang. Pola pemrograman ini
// mudah diimplementasikan di JavaScript. Kuncinya adalah
// memastikan bahwa Anda selalu mengembalikan objek yang sama.

// Berikut merupakan contoh sebuah API yang membentuk
// sebuah rantai API. Kuncinya adalah mempunya sebuah
// fungsi luar yang menyimpan keadaan internal, dan
// sebuah objek yang mengekspos API yang selalu dikembalikan.

const jumlahkanDuaBilangan = (mulai = 1) => {
  let n = mulai;

  const api = {
    // Implementasikan seluruh fungsi pada API Anda.
    tambah(inc: number = 1) {
      n += inc;
      return api;
    },

    cetak() {
      console.log(n);
      return api;
    },
  };
  return api;
};

// Penulisan tersebut memiliki gaya API yang sama
// seperti yang sudah kita lihat pada jQuery:

jumlahkanDuaBilangan(1).tambah(3).tambah().cetak().tambah(1);

// Berikut merupakan sebuah contoh implementasi fungsi berantai]
// menggunakan kelas:

class TambahBilangan {
  private n: number;

  constructor(mulai = 0) {
    this.n = mulai;
  }

  public tambah(inc = 1) {
    this.n = this.n + inc;
    return this;
  }

  public cetak() {
    console.log(this.n);
    return this;
  }
}

// Berikut merupakan cara penggunaan kelas tersebut:

new TambahBilangan(2).tambah(3).tambah().cetak().tambah(1);

// Contoh-contoh pada bagian ini menggunakan fitur
// penyimpulan tipe data TypeScript untuk menyediakan
// perkakas TypeScript pada pola pemrograman JavaScript.

// For more examples on this:
//
//  - example:code-flow
