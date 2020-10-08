//// { compiler: {  }, order: 1 }

// Terdapat sebuah fitur pada TypeScript versi 3.7,
// yaitu pemeriksaan pada pernyataan `if` ketika
// anda secara tidak sengaja menggunakan sebuah fungsi
// dimana seharusnya anda menggunakan nilai kembalian
// dari sebuah fungsi.

// Hal ini hanya berlaku bila fungsi yang dimaksud ada,
// yang menyebabkan pernyataan `if` akan selalu bernilai `true`.

// Di bawah ini merupakan sebuah contoh antarmuka _plugin_,
// dimana ada _callback_ yang harus ada dan _callback_ pilihan.
interface PengaturanPlugin {
    pluginShouldLoad?: () => void;
    pluginIsActivated: () => void;
}

declare const plugin: PengaturanPlugin;

// Karena _method_ `pluginShouldLoad` bisa saja tidak ada,
// maka pemeriksaan pada pernyataan `if` sah dilakukan.

if (plugin.pluginShouldLoad) {
    // Lakukan sesuatu ketika `pluginShouldLoad` ada.
}

// Pada TypeScript versi 3.6 ke bawah, hal ini bukan merupakan sebuah kesalahan.

if (plugin.pluginIsActivated) {
    // Ingin melakukan sesuatu ketika _plugin_ diaktifkan,
    // namun tidak dengan memanggil _method_ melainkan kita gunakan
    // sebagai properti.
}

// _Method_ `pluginIsActivated` seharusnya selalu ada, namun TypeScript
// tetap memperbolehkan pemeriksaan pada pernyataan `if`, karena _method_
// tersebut dijalankan di dalam blok `if`.

if (plugin.pluginIsActivated) {
    plugin.pluginIsActivated();
}
