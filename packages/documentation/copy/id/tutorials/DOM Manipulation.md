---
title: Manipulasi DOM
layout: docs
permalink: /id/docs/handbook/dom-manipulation.html
oneline: Menggunakan DOM dengan TypeScript
translatable: true
---

## Manipulasi DOM

### Eksplorasi ke dalam tipe `HTMLElement`

Dalam 20+ tahun sejak standarisasi, JavaScript telah berkembang pesat. Meskipun pada tahun 2020, JavaScript dapat digunakan di _server_, dalam ilmu data, dan bahkan pada perangkat _IoT_, penting untuk mengingat kasus penggunaannya yang paling populer: _web browser_.

Situs _web_ terdiri dari dokumen HTML dan/atau XML. Dokumen-dokumen ini statis, tidak berubah. _Document Object Model (DOM)_ adalah antarmuka pemrograman yang diterapkan oleh _browser_ untuk membuat situs _web_ statis berfungsi. API DOM dapat digunakan untuk mengubah struktur dokumen, _style_, dan konten. API ini sangat kuat sehingga _framework frontend_ yang tak terhitung jumlahnya (jQuery, React, Angular, dll.) telah dikembangkan di sekitarnya untuk membuat situs _web_ dinamis lebih mudah dikembangkan.

TypeScript adalah _superset_ dari JavaScript, dan TypeScript dilengkapi dengan definisi tipe untuk DOM API. Secara standar, definisi ini sudah tersedia dalam proyek TypeScript. Dari 20.000+ baris definisi di _lib.dom.d.ts_, satu yang menonjol di antara yang lain: `HTMLElement`. Jenis ini adalah hal penting untuk manipulasi DOM dengan TypeScript.

> Anda bisa mengeksplor source code [Definisi tipe DOM](https://github.com/microsoft/TypeScript/blob/master/lib/lib.dom.d.ts)

## Contoh Dasar

Diberikan berkas _index.html_ yang disederhanakan:

    <!DOCTYPE html>
    <html lang="en">
      <head><title>TypeScript Dom Manipulation</title></head>
      <body>
        <div id="app"></div>
        <!-- Assume index.js is the compiled output of index.ts -->
        <script src="index.js"></script>
      </body>
    </html>

Mari kita jelajahi kode TypeScript yang menambahkan elemen `<p>Hello, World</p>` ke elemen `#app`.

```ts
// 1. Pilih elemen div menggunakan properti id
const app = document.getElementById("app");

// 2. Buat element <p></p> baru secara terprogram
const p = document.createElement("p");

// 3. Tambahkan konten teks
p.textContent = "Hello, World!";

// 4. Tambahkan elemen p ke elemen div
app?.appendChild(p);
```

Setelah menyusun dan menjalankan halaman _index.html_, HTML yang dihasilkan adalah:

```html
<div id="app">
  <p>Hello, World!</p>
</div>
```

## Antarmuka `Document`

Baris pertama kode TypeScript menggunakan variabel global `document`. Memeriksa variabel menunjukkan bahwa ia didefinisikan oleh antarmuka `Dokumen` dari berkas _lib.dom.d.ts_. Cuplikan kode berisi panggilan ke dua _method_, `getElementById` dan `createElement`.

### `Document.getElementById`

Definisi dari _method_ ini adalah sebagai berikut:

```ts
getElementById(elementId: string): HTMLElement | null;
```

Berikan string id elemen dan itu akan mengembalikan `HTMLElement` atau`null`. _Method_ ini memperkenalkan salah satu jenis terpenting, `HTMLElement`. Ini berfungsi sebagai antarmuka dasar untuk setiap antarmuka elemen lainnya. Misalnya, variabel `p` dalam contoh kode berjenis `HTMLParagraphElement`. Perhatikan juga bahwa _method_ ini dapat mengembalikan `null`. Ini karena _method_ tidak dapat memastikan kapan elemen itu tersedia atau apakah elemen tersebut ada atau tidak. Di baris terakhir cuplikan kode, operator _optional chaining_ digunakan untuk memanggil `appendChild`.

### `Document.createElement`

Definisi untuk metode ini adalah (definisi _deprecated_ telah dihilangkan):

```ts
createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K];
createElement(tagName: string, options?: ElementCreationOptions): HTMLElement;
```

Ini adalah definisi fungsi yang kelebihan beban. Kelebihan kedua adalah yang paling sederhana dan bekerja sangat mirip dengan method `getElementById`. Berikan setiap `string` dan ia akan mengembalikan standar HTMLElement. Definisi inilah yang memungkinkan developer membuat tag elemen HTML yang unik.

Misalnya `document.createElement('xyz')` mengembalikan elemen `<xyz></xyz>`, jelas bukan elemen yang ditentukan oleh spesifikasi HTML.

> Jika tertarik, Anda dapat berinteraksi dengan elemen _tag_ kustom menggunakan `document.getElementsByTagName`

Untuk definisi pertama dari `createElement`, ini menggunakan beberapa pola umum lanjutan. Paling baik dipahami jika dipecah menjadi beberapa bagian, dimulai dengan ekspresi umum: `<K extends keyof HTMLElementTagNameMap>`. Ekspresi ini mendefinisikan parameter umum `K` yang _constrained_ ke kunci antarmuka`HTMLElementTagNameMap`. Antarmuka peta berisi setiap nama tag HTML yang ditentukan dan antarmuka tipe yang sesuai. Berikut adalah 5 nilai yang dipetakan pertama:

```ts
interface HTMLElementTagNameMap {
    "a": HTMLAnchorElement;
    "abbr": HTMLElement;
    "address": HTMLElement;
    "applet": HTMLAppletElement;
    "area": HTMLAreaElement;
        ...
}
```

Beberapa elemen tidak menunjukkan properti unik sehingga mereka hanya mengembalikan `HTMLElement`, tetapi tipe lain memiliki properti dan method unik sehingga mereka mengembalikan antarmuka spesifiknya (yang akan memperluas atau mengimplementasikan `HTMLElement`).

Sekarang, untuk sisa definisi `createElement`:`(tagName: K, options ?: ElementCreationOptions): HTMLElementTagNameMap [K]`. Argumen pertama `tagName` didefinisikan sebagai parameter umum `K`. Interpreter TypeScript cukup pintar untuk _infer_ parameter generik dari argumen ini. Ini berarti bahwa pengembang sebenarnya tidak harus menentukan parameter umum saat menggunakan metode ini; nilai apa pun yang diteruskan ke argumen `tagName` akan disimpulkan sebagai `K` dan karenanya dapat digunakan di seluruh definisi lainnya. Itulah yang sebenarnya terjadi; nilai kembalian `HTMLElementTagNameMap [K]` mengambil argumen `tagName` dan menggunakannya untuk mengembalikan jenis yang sesuai. Definisi ini adalah bagaimana variabel `p` dari kode sebelumnya mendapatkan jenis `HTMLParagraphElement`. Dan jika kodenya adalah `document.createElement ('a')`, maka itu akan menjadi elemen jenis `HTMLAnchorElement`.

## Antarmuka `Node`

Fungsi `document.getElementById` mengembalikan `HTMLElement`. Antarmuka `HTMLElement` memperluas antarmuka `Element`, yang memperluas antarmuka `Node`. Ekstensi prototipe ini memungkinkan semua `HTMLElements` untuk menggunakan _subset_ method standar. Dalam cuplikan kode, kami menggunakan properti yang ditentukan pada antarmuka `Node` untuk menambahkan elemen`p` baru ke situs _web_.

### `Node.appendChild`

Baris terakhir dari potongan kode adalah `app?.AppendChild (p)`. Bagian sebelumnya, `document.getElementById`, merinci bahwa operator _optional chaining_ digunakan di sini karena `app` berpotensi menjadi _null_ pada waktu proses. Method `appendChild` didefinisikan oleh:

```ts
appendChild<T extends Node>(newChild: T): T;
```

Method ini bekerja mirip dengan metode `createElement` karena parameter umum `T` disimpulkan dari argumen `newChild`. `T` adalah _constrained_ ke antarmuka dasar lain`Node`.

## Perbedaan antara `children` dan `childNodes`

Sebelumnya, dokumen ini merinci antarmuka `HTMLElement` yang diperluas dari `Element` yang diturunkan dari `Node`. Di DOM API ada konsep elemen _children_. Misalnya dalam HTML berikut, tag `p` adalah turunan dari elemen `div`

```tsx
<div>
  <p>Hello, World</p>
  <p>TypeScript!</p>
</div>;

const div = document.getElementsByTagName("div")[0];

div.children;
// HTMLCollection(2) [p, p]

div.childNodes;
// NodeList(2) [p, p]
```

Setelah menangkap elemen `div`, _prop_ `children` akan mengembalikan daftar `HTMLCollection` yang berisi `HTMLParagraphElements`. Properti `childNodes` akan mengembalikan daftar node `NodeList` yang serupa. Setiap _tag_ `p` akan tetap berjenis `HTMLParagraphElements`, tetapi `NodeList` dapat berisi _HTML node_ tambahan yang tidak bisa dilakukan oleh _list_ `HTMLCollection`.

Ubah html dengan menghapus salah satu _tag_ `p`, tetapi pertahankan teksnya.

```tsx
<div>
  <p>Hello, World</p>
  TypeScript!
</div>;

const div = document.getElementsByTagName("div")[0];

div.children;
// HTMLCollection(1) [p]

div.childNodes;
// NodeList(2) [p, text]
```

Lihat bagaimana kedua daftar berubah. `children` sekarang hanya berisi elemen `<p>Hello, World</p>`, dan `childNodes` berisi simpul `teks` daripada dua simpul `p`. Bagian `teks` dari `NodeList` adalah `Node` _literal_ yang berisi teks `TypeScript!`. _List_ `children` tidak berisi `Node`, ini karena tidak dianggap sebagai `HTMLElement`.

## _Method_ `querySelector` dan `querySelectorAll`

Kedua _method_ ini adalah _tool_ yang hebat untuk mendapatkan daftar elemen dom yang sesuai dengan kumpulan _constraint_ yang lebih unik. Mereka didefinisikan di _lib.dom.d.ts_ sebagai:

```ts
/**
 * Mengembalikan elemen pertama yang merupakan turunan dari node yang cocok dengan selector.
 */
querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
querySelector<E extends Element = Element>(selectors: string): E | null;

/**
 * Menampilkan semua turunan elemen node yang cocok dengan selector.
 */
querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
```

Definisi `querySelectorAll` mirip dengan `getElementsByTagName`, kecuali ia mengembalikan tipe baru: `NodeListOf`. Jenis kembalian ini pada dasarnya adalah implementasi khusus dari elemen daftar standar JavaScript. Bisa dibilang, mengganti `NodeListOf<E>` dengan `E[]` akan menghasilkan pengalaman pengguna yang sangat mirip. `NodeListOf` hanya mengimplementasikan properti dan method berikut:`length`, `item (index)`,`forEach ((value, key, parent) => void)`, dan _numeric indexing_. Selain itu, _method_ ini mengembalikan daftar _elements_, bukan _nodes_, yang dikembalikan oleh `NodeList` dari _method_ `.childNodes`. Meskipun ini mungkin tampak sebagai perbedaan, perhatikan bahwa antarmuka `Element` merupakan turunan dari `Node`.

Untuk melihat _method_ ini beraksi, ubah kode yang ada menjadi:

```tsx
<ul>
  <li>First :)</li>
  <li>Second!</li>
  <li>Third times a charm.</li>
</ul>;

const first = document.querySelector("li"); // mengembalikan elemen li pertama
const all = document.querySelectorAll("li"); // mengembalikan daftar semua elemen li
```

## Tertarik untuk mempelajari lebih lanjut?

Bagian terbaik tentang definisi tipe _lib.dom.d.ts_ adalah bahwa definisi tersebut mencerminkan tipe yang dijelaskan di situs dokumentasi _Mozilla Developer Network_ (MDN). Misalnya, antarmuka `HTMLElement` didokumentasikan oleh [halaman HTMLElement](https://developer.mozilla.org/docs/Web/API/HTMLElement) di MDN. Halaman ini mencantumkan semua properti yang tersedia, method, dan terkadang bahkan contoh. Aspek hebat lainnya dari halaman-halaman tersebut adalah mereka menyediakan tautan ke dokumen standar yang sesuai. Berikut ini tautan ke [Rekomendasi W3C untuk HTMLElement](https://www.w3.org/TR/html52/dom.html#htmlelement).

Sumber:

- [ECMA-262 Standard](http://www.ecma-international.org/ecma-262/10.0/index.html)
- [Pengenalan DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)
