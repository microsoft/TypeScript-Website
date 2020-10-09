//// { compiler: { ts: "4.0.2" } }

// Pada Typescript versi 4.0, label JSDoc @deprecated ditambahkan
// pada sistem tipe. Anda dapat menggunakan @deprecated di mana pun
// Anda dapat menggunakan JSDoc.

interface InformasiAkun {
  nama: string;
  jenisKelamin: string;

  /** @deprecated mohon gunakan atribut jenisKelamin */
  sex: "pria" | "wanita";
}

declare const informasiPengguna: InformasiAkun;
informasiPengguna.sex;

// TypeScript akan memberikan sebuah peringatan yang tidak
// memblokir ketika sebuah properti yang usang diakses, dan
// editor seperti Visual Studio Code akan menunjukkan informasi
// keusangan pada tempat-tempat seperti _intellisense_, _outlines_,
// dan kode program Anda.
