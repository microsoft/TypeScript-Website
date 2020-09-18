//// { compiler: {  }, order: 1 }

// _Optional Chaining_ mencapai konsesus TC39 Tahap 3 ketika
// TypeScript 3.7 sedang dikembangkan. _Optional Chaining_
// mengizinkan Anda untuk menulis kode yang akan langsung berhenti
// menjalankan ekspresi ketika sebuah nilai null dan undefined
// ditemukan.

// Akses Properti

// Coba bayangkan bahwa ada sebuah album dimana artis dan
// biografinya mungkin tidak tertera pada data album tersebut.
// Contohnya, sebuah album kompilasi bisa saja sama sekali
// tidak memiliki seorang artis.

type ResponAPIAlbum = {
    judul: string;
    artis?: {
        nama: string;
        biografi?: string;
        albumSebelumnya?: string[];
    };
};

declare const album: ResponAPIAlbum;

// Dengan _optional chaining_, Anda dapat
// menulis kode seperti berikut:

const biografiArtis = album?.artis?.biografi;

// Dibandingkan dengan:

const mungkinBiografiArtis = album.artis && album.artis.biografi;

// Pada kasus ini, operator ?. akan mengambil tindakan yang berbeda bila
// dibandingkan dengan operator && karena operator && akan
// bertindak berbeda pada nilai "falsy" (contoh: sebuah string kosong,
// 0, NaN, dan false).

// _Optional chaining_ hanya akan menganggap null atau undefined
// sebagai sebuah sinyal untuk berhenti dan mengembalikan nilai undefined.

// Akses Elemen Opsional

// Properti dapat diakses melalui operator., _optional chaining_
// juga dapat digunakan dengan operator [] ketika mengakses elemen

const mungkinElemenBiografiArtis = album?.["artis"]?.["biografi"];

const mungkinAlbumSebelumnyaYangPertama = album?.artis?.albumSebelumnya?.[0];

// Pemanggilan Opsional

// Ketika berurusan dengan fungsi yang mungkin tidak ada
// pada saat program berjalan (runtime), _optional chaining_ mendukung
// kasus-kasus dimana sebuah fungsi hanya akan dipanggil
// jika fungsi tersebut ada. Hal tersebut dapat menggantikan kode yang
// biasanya ditulis seperti: if (func) func()

// Sebagai contoh, disini terdapat sebuah pemanggilan opsional
// pada _callback_ dari sebuah permintaan API

const panggilPembaruanMetadata = (metadata: any) => Promise.resolve(metadata); // Pemanggilan API palsu

const perbaruiMetadataAlbum = async (metadata: any, callback?: () => void) => {
    await panggilPembaruanMetadata(metadata);

    callback?.();
};

  // Anda dapat membaca lebih lanjut tentang _optional chaining_
  // pada tulisan blog TypeScript 3.7:
  //
  // https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
