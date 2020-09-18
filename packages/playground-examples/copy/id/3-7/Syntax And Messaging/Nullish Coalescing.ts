//// { compiler: {  }, order: 2 }

// Operator _nullish coalescing_ adalah sebuah alternatif
// untuk operator || yang akan mengembalikan ekspresi sebelah kanan
// apabila ekspresi sebelah kiri bernilai null atau undefined.

// Sebaliknya, operator || menggunakan pemeriksaan _falsy_, yang berarti
// sebuah string kosong atau bilangan yang bernilai akan dianggap false.

// Sebuah contoh yang baik untuk fitur ini adalah ketika berurusan dengan
// objek parsial yang memiliki nilai anggapan ketika sebuah pengidentifikasi
// tidak dinyatakan.

interface KonfigurasiAplikasi {
    // Nilai anggapan: "(tidak bernama)"; string kosong merupakan nilai yang VALID
    nama: string;

    // Nilai anggapan: -1; 0 merupakan nilai yang valid
    barang: number;

    // Nilai anggapan: true
    aktif: boolean;
}

function perbaruiAplikasi(konfigurasi: Partial<KonfigurasiAplikasi>) {
    // Dengan operator _null-coalescing_
    konfigurasi.nama = konfigurasi.nama ?? "(tidak bernama)";
    konfigurasi.barang = konfigurasi.barang ?? -1;
    konfigurasi.aktif = konfigurasi.aktif ?? true;

    // Solusi saat ini
    konfigurasi.nama = typeof konfigurasi.nama === "string" ? konfigurasi.nama : "(tidak bernama)";
    konfigurasi.barang = typeof konfigurasi.barang === "number" ? konfigurasi.barang : -1;
    konfigurasi.aktif = typeof konfigurasi.aktif === "boolean" ? konfigurasi.aktif : true;

    // Menggunakan operator || yang dapat menghasilkan data yang buruk
    konfigurasi.nama = konfigurasi.nama || "(tidak bernama)"; // tidak mengizinkan masukan bernilai ""
    konfigurasi.barang = konfigurasi.barang || -1; // tidak mengizinkan masukan bernilai 0
    konfigurasi.aktif = konfigurasi.aktif || true; // sangat buruk, karena selalu mengembalikan nilai true
}

  // Anda dapat membaca lebih lanjut tentang _nullish coalescing_ pada
  // tulisan blog versi 3.7:
  //
  // https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
