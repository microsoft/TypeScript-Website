//// { compiler: { ts: "4.0.2" } }

// Operator dan deklarasi logika merupakan fitur baru
// pada JavaScript tahun 2020. Fitur tersebut merupakan
// sekumpulan operator baru yang mengubah sebuah objek
// JavaScript.

// Tujuan dari fitur tersebut adalah untuk menggunakan
// konsep matematika (contoh: +=, -=, dan *=) kembali
// dengan logika.

interface Pengguna {
  id?: number
  nama: string
  lokasi: {
    kodePos?: string
  }
}

function perbaruiPengguna(pengguna: Pengguna) {
  // Kode di bawah ini dapat diganti
  if (!pengguna.id) pengguna.id = 1

  // Kode di bawah ini juga dapat diganti
  pengguna.id = pengguna.id || 1

  // Dengan kode di bawah ini:
  pengguna.id ||= 1
}

// Sekumpulan operator tersebut dapat menangani kasus
// atribut bersarang, yang dapat mengurangi baris kode
// _boilerplate_.

declare const pengguna: Pengguna
pengguna.lokasi.kodePos ||= "90210"

// Ada tiga buah operator baru:
//
// ||= yang ditunjukkan pada bari kode di atas.
// &&= yang menggunakan operator logika 'and'
// ??= yang yang terdapat pada example:nullish-coalescing
//     untuk menawarkan versi || yang lebih ketat yang menggunakan
//     operator ===

// Anda dapat mempelajari lebih lanjut mengenai hal ini
// pada proposal yang terdapat pada:
// https://github.com/tc39/proposal-logical-assignment
