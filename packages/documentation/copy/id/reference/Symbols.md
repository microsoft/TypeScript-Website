---
title: Symbols
layout: docs
permalink: /id/docs/handbook/symbols.html
oneline: Menggunakan Simbol JavaScript primitif di TypeScript
translatable: true
---

Mulai dari ECMAScript 2015, `symbol` adalah tipe data primitif, sama seperti `number` dan `string`.

Nilai `simbol` dibuat dengan memanggil konstruktor `Symbol`.

```ts
let sym1 = Symbol();

let sym2 = Symbol("key"); // kunci string opsional
```

Simbol tidak dapat diubah, dan unik.

```ts
let sym2 = Symbol("key");
let sym3 = Symbol("key");

sym2 === sym3; // false, symbol itu unik
```

Sama seperti string, simbol dapat digunakan sebagai kunci untuk properti objek.

```ts
const sym = Symbol();

let obj = {
  [sym]: "value",
};

console.log(obj[sym]); // "value"
```

Simbol juga dapat digabungkan dengan deklarasi properti yang dihitung untuk mendeklarasikan properti objek dan anggota kelas.

```ts
const getClassNameSymbol = Symbol();

class C {
  [getClassNameSymbol]() {
    return "C";
  }
}

let c = new C();
let className = c[getClassNameSymbol](); // "C"
```

## Simbol Terkenal

Selain simbol yang ditentukan pengguna, ada simbol bawaan yang terkenal.
Simbol bawaan digunakan untuk mewakili perilaku bahasa internal.

Berikut adalah daftar simbol yang terkenal:

## `Symbol.hasInstance`

Sebuah method yang menentukan apakah objek konstruktor mengenali objek sebagai salah satu contoh konstruktor. Dipanggil oleh semantik dari operator instanceof.

## `Symbol.isConcatSpreadable`

Nilai Boolean yang menunjukkan bahwa sebuah objek harus diratakan ke elemen arraynya dengan Array.prototype.concat.

## `Symbol.iterator`

Sebuah method yang mengembalikan iterator standar untuk sebuah objek. Dipanggil oleh semantik pada pernyataan for-of.

## `Symbol.match`

Metode ekspresi reguler yang mencocokkan ekspresi reguler dengan string. Dipanggil dengan method `String.prototype.match`.

## `Symbol.replace`

Method regular expression yang menggantikan substring yang cocok dari sebuah string. Dipanggil dengan method `String.prototype.replace`.

## `Symbol.search`

Method regular expression yang mengembalikan indeks dalam string yang cocok dengan ekspresi reguler. Dipanggil dengan method `String.prototype.search`.

## `Symbol.species`

Properti bernilai fungsi yang merupakan fungsi konstruktor yang digunakan untuk membuat objek turunan.

## `Symbol.split`

Method regular expression yang memisahkan string pada indeks yang cocok dengan ekspresi reguler.
Dipanggil dengan method `String.prototype.split`.

## `Symbol.toPrimitive`

Method yang mengonversi objek menjadi nilai primitif yang sesuai.
Dipanggil oleh operasi abstrak `ToPrimitive`.

## `Symbol.toStringTag`

Nilai String yang digunakan dalam pembuatan deskripsi string bawaan dari suatu objek.
Dipanggil oleh method bawaan `Object.prototype.toString`.

## `Symbol.unscopables`

Objek yang nama propertinya adalah nama properti yang dikecualikan dari environment 'dengan' dari objek terkait.
