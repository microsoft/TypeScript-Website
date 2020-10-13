//// { order: 0, isJavaScript: true }

// DOM (_Document Object Model_) merupakan API dasar ketika
// ingin bekerja dengan sebuah halaman web, dan TypeScript
// memiliki dukungan yang baik untuk API tersebut.

// Mari kita buat sebuah _popover_ untuk tampil ketika
// Anda menekan tombol "Run" pada _toolbar_ di atas.

const popover = document.createElement("div");
popover.id = "example-popover";

// Perhatikan bahwa tipe data _popover_ disimpulkan dengan tepat
// menjadi sebuah HTMLDivElement karena kita memberikan elemen "div"
// secara spesifik.

// Supaya kode program dapat dijalankan kembali, kita akan
// membuat sebuah fungsi untuk menghapus _popover_ jika
// _popover_ sudah ada pada halaman web.

const hapusPopover = () => {
  const popoverYangSudahAda = document.getElementById(popover.id);
  if (popoverYangSudahAda && popoverYangSudahAda.parentElement) {
    popoverYangSudahAda.parentElement.removeChild(existingPopover);
  }
};

// Sekarang, panggil fungsi tersebut.

hapusPopover();

// Kita dapat mengatur _inline styles_ pada elemen
// melalui properti `.style` pada sebuah HTMLElement
// - seluruh properti tersebut memiliki definisi tipe data.

popover.style.backgroundColor = "#0078D4";
popover.style.color = "white";
popover.style.border = "1px solid black";
popover.style.position = "fixed";
popover.style.bottom = "10px";
popover.style.left = "20px";
popover.style.width = "200px";
popover.style.height = "100px";
popover.style.padding = "10px";

// Termasuk atribut CSS yang kurang dikenal atau sudah
// tidak didukung lagi.
popover.style.webkitBorderRadius = "4px";

// Untuk menambahkan konten pada _popover_, kita akan
// menambahkan sebuah elemen paragraf dan menggunakan
// elemen tersebut untuk menambahkan beberapa teks.

const pesan = document.createElement("p");
pesan.textContent = "Ini adalah contoh popover";

// Dan kita juga akan menambahkan sebuah tombol
// untuk menutup _popover_.

const tombolTutup = document.createElement("a");
tombolTutup.textContent = "X";
tombolTutup.style.position = "absolute";
tombolTutup.style.top = "3px";
tombolTutup.style.right = "8px";
tombolTutup.style.color = "white";

tombolTutup.onclick = () => {
  hapusPopover();
};

// Lalu tambahkan seluruh elemen di atas pada halaman web.
popover.appendChild(pesan);
popover.appendChild(tombolTutup);
document.body.appendChild(popover);

// Apabila Anda menekan tombol "Run" di atas, maka sebuah _popup_
// seharusnya muncul pada bagian kiri bawah penjelajah web,
// yang Anda dapat tutup dengan menekan "x" yang ada pada
// bagian kanan atas dari _popup_.

// Contoh ini menunjukkan bagaimana Anda dapat menggunakan
// API DOM pada JavaScript - namun juga menggunakan TypeScript
// untuk menyediakan dukungan perkakas yang baik.

// Ada sebuah contoh lain yang lebih luas tentang dukungan
// perkakas TypeScript dengan WebGL yang dapat dilihat di sini:
// example:typescript-with-webgl

// There is an extended example for TypeScript tooling with
// WebGL available here: example:typescript-with-webgl
