---
display: "Downlevel Iteration"
oneline: "Memancarkan JavaScript yang lebih sesuai, tetapi verbose untuk objek iterasi"
---

Downleveling adalah istilah TypeScript untuk mentranspilasi ke versi JavaScript yang lebih lama.
Tanda ini untuk mengaktifkan dukungan untuk implementasi yang lebih akurat tentang bagaimana JavaScript modern melakukan iterasi melalui konsep baru dalam waktu proses JavaScript yang lebih lama.

ECMAScript 6 menambahkan beberapa primitif iterasi baru: loop `for / of` (` for (el of arr) `), Array spread (` [a, ... b] `), penyebaran argumen (` fn (... args) `), dan` Symbol.iterator`.
`--downlevelIteration` memungkinkan primitif iterasi ini digunakan secara lebih akurat dalam lingkungan ES5 jika ada implementasi` Symbol.iterator`.

#### Contoh: Efek pada `for / of`

Tanpa `downlevelIteration` aktif, loop` for / of` pada objek apa pun diturunkan levelnya menjadi loop `for` tradisional:

```ts twoslash
// @target: ES5
// @showEmit
const str = "Hello!";
for (const s of str) {
  console.log(s);
}
```

Hal ini sering kali diharapkan orang, tetapi tidak 100% sesuai dengan perilaku ECMAScript 6.
String tertentu, seperti emoji (😜), memiliki `.length` 2 (atau bahkan lebih!), Tetapi harus diiterasi sebagai 1 unit dalam perulangan` for-of`.
Lihat [entri blog ini oleh Jonathan New](https://blog.jonnew.com/posts/poo-dot-length-equals-two) untuk penjelasan yang lebih panjang.

Jika `downlevelIteration` diaktifkan, TypeScript akan menggunakan fungsi helper yang memeriksa implementasi` Symbol.iterator` (baik native atau polyfill).
Jika implementasi ini hilang, Anda akan kembali ke iterasi berbasis indeks.

```ts twoslash
// @target: ES5
// @downlevelIteration
// @showEmit
const str = "Hello!";
for (const s of str) {
  console.log(s);
}
```

> > **Note:** enabling `downlevelIteration` does not improve compliance if `Symbol.iterator` is not present in the runtime.

#### Contoh: Efek pada Array Spreads

Ini adalah sebaran array:

```js
// Make a new array who elements are 1 followed by the elements of arr2
const arr = [1, ...arr2];
```

Berdasarkan uraian tersebut, sepertinya mudah untuk menurunkan ke ES5:

```js
// The same, right?
const arr = [1].concat(arr2);
```

Namun, ini sangat berbeda dalam kasus tertentu yang jarang terjadi.
Misalnya, jika sebuah array memiliki "lubang" di dalamnya, indeks yang hilang akan membuat properti _own_ jika disebarkan, tetapi tidak akan jika dibuat menggunakan `concat`:

```js
// Make an array where the '1' element is missing
let missing = [0, , 1];
let spreaded = [...missing];
let concated = [].concat(missing);

// true
"1" in spreaded;
// false
"1" in concated;
```

Sama seperti dengan `for / of`,` downlevelIteration` akan menggunakan `Symbol.iterator` (jika ada) untuk lebih akurat meniru perilaku ES 6.
