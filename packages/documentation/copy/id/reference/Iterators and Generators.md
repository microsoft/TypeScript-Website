---
title: Iterators dan Generators
layout: docs
permalink: /id/docs/handbook/iterators-and-generators.html
oneline: Bagaimana Iterator dan Generator bekerja di TypeScript
translatable: true
---

## Iterasi

Sebuah objek dapat dilakukan perulangan jika memiliki properti [`Symbol.iterator`](Symbols.html#symboliterator).
Beberapa tipe bawaan seperti `Array`, `Map`, `Set`, `String`, `Int32Array`, `Uint32Array`, etc. sudah memiliki properti `Symbol.iterator`.
Fungsi `Symbol.iterator` pada sebuah objek, bertanggungjawab untuk mengembalikan _list_ nilai-nilai untuk menjalankan iterasi.

## Pernyataan `for..of`

`for..of` mengulang objek yang dapat diulang dengan cara memanggil properti `Symbol.iterator` pada objek tersebut.
Berikut ini _loop_ `for..of` sederhana pada sebuah _array_:

```ts
let someArray = [1, "string", false];

for (let entry of someArray) {
  console.log(entry); // 1, "string", false
}
```

### Pernyataan `for..of` vs `for..in`

Baik pernyataan `for..of` dan `for..in` akan mengiterasi _list_; yang membedakan antara keduanya adalah `for..in` akan mengembalikan daftar _keys_ dari objek tersebut, sedangkan `for..of` mengembalikan daftar _values_ properti numeric dari objek yang diiterasi.

Berikut adalah contoh implementasi dari perbedaan keduanya:

```ts
let list = [4, 5, 6];

for (let i in list) {
  console.log(i); // "0", "1", "2",
}

for (let i of list) {
  console.log(i); // "4", "5", "6"
}
```

Perbedaan lainnya adalah `for..in` bekerja pada objek apapun; ini berfungsi sebagai cara untuk memeriksa properti pada objek tersebut.
Di sisi lain, `for..of` tertarik pada nilai dari objek yang dapat diulang. Objek bawaan seperti `Map` dan`Set` mengimplementasikan properti `Symbol.iterator` yang memungkinkan akses ke nilai yang disimpan.

```ts
let pets = new Set(["Cat", "Dog", "Hamster"]);
pets["species"] = "mammals";

for (let pet in pets) {
  console.log(pet); // "species"
}

for (let pet of pets) {
  console.log(pet); // "Cat", "Dog", "Hamster"
}
```

### Pembuatan kode

#### Menargetkan ES5 dan ES3

Ketika menargetkan ke engine ES5 atau ES3, _iterator_ hanya membolehkan nilai bertipe `Array`.
Akan terjadi galat jika `for..of` melakukan perulangan pada nilai yang bukan Array, bahkan jika nilai non _Array_ tersebut memiliki properti `Symbol.iterator`.

Kompilator akan menghasilkan perulangan `for` sederhana untuk `for..of`, misalnya:

```ts
let numbers = [1, 2, 3];
for (let num of numbers) {
  console.log(num);
}
```

akan menghasilkan:

```js
var numbers = [1, 2, 3];
for (var _i = 0; _i < numbers.length; _i++) {
  var num = numbers[_i];
  console.log(num);
}
```

#### Menargetkan ECMAScript 2015 dan yang lebih tinggi

Ketika menargetkan ke _engine_ ECMAScript 2015, kompilator akan membuat perulangan `for..of` untuk menargetkan implementasi _iterator_ bawaan di mesin.
