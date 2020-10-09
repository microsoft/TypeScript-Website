//// { compiler: { ts: "4.0.2" } }

// Dikarenakan JavaScript memperbolehkan untuk menggunakan
// tipe data apapun, TypeScript tidak mendukung
// deklarasi tipe data pada sebuah galat (`Error()`)

try {
  // ..
} catch (e) { }

// Secara historis, hal tersebut menandakan bahwa `e` dalam
// blok `catch` akan dianggap sebagai `any`. Anggapan tersebut
// memberikan kebebasan untuk mengakses properti apapun.
// Pada TypeScript versi 4.0, kami telah melonggarkan 
// batasan pada pernyataan tipe pada klausa `catch` sehingga
// tipe `any` dan `unknown` merupakan tipe yang valid.  

// Perilaku yang sama dengan `any`:
try {
  // ..
} catch (e) {
  e.stack;
}

// Perilaku eksplisit dengan `unknown`:

try {
  // ..
} catch (e) {
  // Anda tidak dapat menggunakan `e` sama sekali
  // sampai sistem tipe data mengetahui tipe data dari `e`.
  // Anda dapat mempelajari lebih lanjut mengenai
  // hal tersebut melalui example:unknown-and-never.
  e.stack;

  if (e instanceof SyntaxError) {
    e.stack;
  }
}
