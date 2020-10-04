//// { compiler: { ts: "3.8.3" }, isJavaScript: true }
// @ts-check

// Dukungan JSDoc terhadap TypeScript telah diperluas untuk
// mendukung pengubah izin akses pada atribut kelas. Ada:
//
// @public - yang merupakan nilai anggapan.
// @private - atribut yang memiliki izin akses ini
//            hanya dapat diakses pada kelas yang sama
//            dimana atribut ini ditetapkan.
// @protected - atribut yang memiliki izin akses ini 
//              dapat diakses pada kelas dimana
//              atribut ini ditetapkan dan kelas-kelas turunannya.

// Di bawah ini merupakan sebuah kelas dasar yang bernama Binatang,
// kelas ini memiliki sebuah atribut `private` dan `protected`.
// Kelas turunan dari Binatang dapat mengakses "this.cepat"
// tapi tidak bisa mengakses "this.tipe".

// Diluar kelas-kelas tersebut, kedua atribut tidak terlihat
// dan akan mengembalikan kesalahan kompilasi ketika // @ts-check
// diaktifkan.

class Binatang {
  constructor(tipe) {
    /** @private */
    this.tipe = tipe
    /** @protected */
    this.cepat = tipe === 'citah'
  }

  bersuara() {
    // Biasanya binatang ini jarang menimbulkan suara
    if (this.tipe === 'bengal') {
      console.log('')
    } else {
      throw new Error('bersuara dipanggil pada kelas dasar')
    }
  }
}

class Kucing extends Binatang {
  constructor(type) {
    super(type || 'kucing rumahan')
  }

  bersuara() {
    console.log('meow')
  }

  lari() {
    if (this.cepat) {
      console.log('Berhasil menjauh')
    } else {
      console.log('Gagal menjauh')
    }
  }
}

class Citah extends Kucing {
  constructor() {
    super('citah')
  }
}

class Bengal extends Kucing {
  constructor() {
    super('bengal')
  }
}

const kucingRumahan = new Kucing()
kucingRumahan.bersuara()

// Atribut-atribut di bawah ini tidak tersedia
kucingRumahan.tipe
kucingRumahan.cepat

// Anda dapat mempelajari lebih lanjut melalui
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#jsdoc-modifiers
