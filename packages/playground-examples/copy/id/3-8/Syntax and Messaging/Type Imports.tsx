//// { compiler: { ts: "3.8.3" } }

// Pada TypeScript versi 3.8, kami menambahkan sintaks baru
// untuk mengimpor tipe, yang akan terasa familiar bagi
// pengguna yang datang dari flow.

// `import type` menjadi cara untuk mendeklarasikan sebuah
// impor yang hanya mengimpor tipe. Hal tersebut akan membuat
// Anda menjadi lebih yakin bahwa potongan kode tersebut akan
// dihapus ketika kode program diubah menjadi JavaScript dengan
// cara yang lebih mudah diprediksi karena kode tersebut pasti
// akan dihapus!

// Sebagai contoh, baris kode di bawah ini tidak akan menambahkan
// sebuah pernyataan `import` atau `require`
import type { CSSProperties } from "react";

// Tipe tersebut akan digunakan pada baris kode di bawah ini:
const style: CSSProperties = {
  textAlign: "center",
};

// Hal ini berbanding terbalik dengan pernyataan impor di bawah ini:
import * as React from "react";

// Yang akan dimasukkan pada kode JavaScript
export class SelamatDatang extends React.Component {
  render() {
    return (
      <div style={style}>
        <h1>Halo dunia</h1>
      </div>
    );
  }
}

// Namun, bila pernyataan impor dilakukan tanpa kata kunci `type`
// dan hanya mengimpor sebuah tipe menggunakan pernyataan 'import'
// biasa - pernyataan tersebut bisa dihapus. Jika Anda melihat
// pada berkas JavaScript hasil kompilasi, impor di bawah ini
// tidak dimasukkan pada kode program.

import { FunctionComponent } from "react";

export const PengumumanBeta: FunctionComponent = () => {
  return <p>Halaman ini masih dalam tahap beta</p>;
};

// Hal ini disebut sebagai _import elision_, dan hal tersebut
// dapat menjadi sumber kebingungan. Sintaks `import type`
// memperbolehkan Anda untuk menuliskan apa yang Anda inginkan
// secara lebih spesifik pada JavaScript.

// Dokumen ini merupakan gambaran singkat dari kasus penggunaan
// utama dari `import types` namun ada kasus penggunaan lainnya
// yang Anda dapat pelajari pada catatan rilis TypeScript versi 3.8

// https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#type-only-imports-exports
