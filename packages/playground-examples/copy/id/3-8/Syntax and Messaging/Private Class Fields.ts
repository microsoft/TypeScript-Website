//// { compiler: { ts: "3.8.3" } }

// TypeScript versi 3.8, menambahkan atribut `private`, dimana hal tersebut
// merupakan sebuah cara untuk mendeklarasikan sebuah atribut kelas
// yang tidak dapat diakses diluar kelas tempat atribut tersebut 
// dinyatakan, termasuk oleh kelas turunannya.

// Sebagai contoh, kelas Orang di bawah ini tidak mengizinkan siapapun
// menggunakan objek dari kelas tersebut untuk membaca nama depan,
// nama belakang, atau prefiks

class Orang {
  #namaDepan: string;
  #namaBelakang: string;
  #prefiks: string;

  constructor(namaDepan: string, namaBelakang: string, prefiks: string) {
    this.#namaDepan = namaDepan;
    this.#namaBelakang = namaBelakang;
    this.#prefiks = prefiks;
  }

  sapa() {
    // Di Islandia, nama lengkap lebih umum digunakan dibandingkan
    // bentuk [prefix] [nama belakang]
    // https://www.w3.org/International/questions/qa-personal-names#patronymic
    if (navigator.languages[0] === "is") {
      console.log(`Góðan dag, ${this.#namaDepan} ${this.#namaBelakang}`);
    } else {
      console.log(`Halo, ${this.#prefiks} ${this.#namaBelakang}`);
    }
  }
}

let jeremy = new Orang("Jeremy", "Bearimy", "Mr");

// Anda tidak dapat mengakses atribut `private` di luar kelas tersebut:

// Sebagai contoh, ekspresi di bawah ini tidak valid:
console.log(jeremy.#namaBelakang);

// Begitu pun ekspresi di bawah ini:
console.log("Nama belakang orang adalah:", jeremy["#namaBelakang"]);

// Pertanyaan umum yang seringkali kami dapatkan adalah
// "Mengapa Anda memilih cara ini dibandingkan kata kunci `private` pada
// sebuah atribut kelas?" - mari kita bandingkan kedua hal tersebut
// dengan membandingkan cara kerjanya pada TypeScript sebelum versi 3.8: 

class Anjing {
  private _nama: string;
  constructor(nama: string) {
    this._nama = nama;
  }
}

let oby = new Anjing("Oby");
// Pernyataan tersebut tidak memperbolehkan Anda mengakses atribut
// nama menggunakan notasi titik.
oby._nama = "Spot";
// Namun, TypeScript memperbolehkan pengaksesan atribut sebagai
// jalan keluarnya.
oby["_nama"] = "Cherny";

// Referensi TypeScript pada sebuah atribut `private` hanya tersedia
// pada tingkat tipe saja yang berarti Anda hanya dapat mempercayai
// izin akses sampai tingkat tersebut saja. Melalui atribut `private`
// yang akan menjadi bagian dari bahasa JavaScript, maka Anda dapat
// membuat jaminan yang lebih baik mengenai visibilitas pada kode
// program Anda.

// Kami tidak berencana untuk menghapus dukungan terhadap
// kata kunci `private` pada TypeScript, sehingga kode program
// Anda tetap dapat dijalankan, namun sekarang Anda dapat menulis
// kode program yang lebih dekat dengan bahasa JavaScript.

// Anda dapat mempelajari lebih lanjut tentang atribut kelas
// pada proposal tc39
// https://github.com/tc39/proposal-class-fields/
// dan catatan rilis _beta_:
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#ecmascript-private-fields
