//// { compiler: {  }, order: 1 }

// Fitur baru yang terdapat pada versi 3.7
// adalah kemampuan untuk menerjemahkan sebuah
// variabel `const` ke sebuah `let` ketika nilainya
// telah ditetapkan kembali.

// Anda dapat mencoba fitur ini dengan menyoroti kesalahan dibawah ini
// dan memilih untuk mengeksekusi `Quick Fix`

const displayName = "Andrew";

displayName = "Andrea";
