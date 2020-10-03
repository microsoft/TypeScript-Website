//// { order: 1, compiler: { strict: false } }

// Objek JavaScript merupakan kumpulan nilai-nilai yang
// dibungkus menggunakan kata kunci yang memiliki nama.

const userAccount = {
  name: "Kieron",
  id: 0,
};

// Anda dapat menggabungkan objek-objek ini untuk
// membuat model data yang lebih besar dan lebih rumit.

const pie = {
  type: "Apple",
};

const purchaseOrder = {
  owner: userAccount,
  item: pie,
};

// Jika Anda menggunakan tetikus untuk mengarahkan
// kursor ke beberapa kata ini (coba arahkan kursor
// ke objek purchaseOrder di atas) Anda dapat melihat
// bagaimana TypeScript menafsirkan JavaScript Anda menjadi
// tipe data berlabel.

// Nilai dapat diakses melalui ".", Jadi untuk mendapatkan
// nama pengguna untuk pesanan pembelian:
console.log(purchaseOrder.item.type);

// Jika Anda mengarahkan kursor tetikus ke setiap bagian kode
// antara tanda (), Anda dapat melihat TypeScript menampilkan lebih banyak
// informasi tentang tiap-tiap bagian. Coba tulis ulang kode di bawah ini:

// Salin ini di baris berikutnya, karakter demi karakter:
//
// purchaseOrder.item.type

// TypeScript memberikan umpan balik ke area bermain
// tentang objek JavaScript apa saja yang tersedia di berkas ini
// dan memungkinkan Anda menghindari kesalahan ketik dan melihat tambahan
// informasi tanpa harus mencarinya di tempat lain.

// TypeScript juga menawarkan fitur yang sama untuk himpunan (_array_).
// Berikut adalah himpunan yang isinya hanya pesanan pembelian 
// yang kita buat.

const allOrders = [purchaseOrder];

// Jika Anda mengarahkan kursor ke allOrders, Anda dapat
// mengetahui bahwa itu adalah himpunan karena info _hover_ 
// diakhiri dengan []. Anda dapat mengakses
// urutan pertama menggunakan tanda kurung siku dengan indeks
// (mulai dari nol).

const firstOrder = allOrders[0];
console.log(firstOrder.item.type);

// Cara alternatif untuk mendapatkan objek adalah dengan memencet (_popping_)
// himpunan untuk menghapus objek. Dengan melakukan ini, kita bisa 
// menghapus objek dari himpunan, dan mengembalikan objek. Ini disebut
// mutasi himpunan, karena mengubah data di dalamnya.

const poppedFirstOrder = allOrders.pop();

// Sekarang allOrders menjadi kosong. Mutasi data dapat bermanfaat untuk
// banyak hal, tapi satu cara untuk mengurangi kerumitan di
// basis kode Anda adalah dengan menghindari mutasi. TypeScript menawarkan cara
// untuk mendeklarasikan himpunan hanya baca (_read-only_):

// Membuat tipe data berdasarkan bentuk pesanan pembelian:
type PurchaseOrder = typeof purchaseOrder;

// Membuat himpunan pesanan pembelian yang hanya bisa dibaca
const readonlyOrders: readonly PurchaseOrder[] = [purchaseOrder];

// Ya! Agak lebih banyak kode memang. Ada empat
// hal-hal baru di sini:
//
// type PurchaseOrder - Menyatakan tipe data baru ke TypeScript.
//
// typeof - Gunakan sistem inferensi tipe data (_type inference_) untuk 
// menyetel tipe data berdasarkan konstanta yang diteruskan berikutnya.
//
// purchaseOrder - Dapatkan variabel purchaseOrder dan beri tahu
// TypeScript ini adalah bentuk dari semua
// objek didalam himpunan pesanan.
//
// readonly - Objek ini tidak mendukung mutasi, sekali
// objek ini dibuat maka isi himpunan
// akan selalu sama.
//
// Sekarang jika Anda mencoba untuk keluar dari readonlyOrders, TypeScript
// akan memunculkan kesalahan.

readonlyOrders.pop();

// Anda bisa menggunakan _readonly_ di semua tempat,
// sedikit lebih banyak sintaks tambahan di sana-sini, tapi sintaks
// ini memberikan lebih banyak keamanan ekstra.

// Anda dapat mengetahui lebih lanjut tentang readonly:
//  - https://www.typescriptlang.org/docs/handbook/interfaces.html#readonly-properties
//  - https://basarat.gitbooks.io/typescript/content/docs/types/readonly.html

// Dan Anda bisa terus belajar tentang JavaScript dan
// TypeScript didalam contoh tentang fungsi:
// example:functions
//
// Atau jika Anda ingin tahu lebih banyak tentang immutability:
// example:immutability
