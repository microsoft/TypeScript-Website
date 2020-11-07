---
title: Referensi JSDoc
layout: docs
permalink: /id/docs/handbook/jsdoc-supported-types.html
oneline: JSDoc apa yang didukung JavaScript dan TypeScript?
translatable: true
---

Dibawah ini adalah daftar anotasi yang didukung saat menggunakan JSDoc untuk menyediakan informasi di berkas Javscript.

Perhatikan semua tag yang tidak secara eksplisit dicantumkan di bawah (seperti `@ async`) belum didukung.

- `@type`
- `@param` (atau `@arg` atau `@argument`)
- `@returns` (atau `@return`)
- `@typedef`
- `@callback`
- `@template`
- `@class` (atau `@constructor`)
- `@this`
- `@extends` (atau `@augments`)
- `@enum`

#### Ekstensi `class`

- [Property Modifiers](#jsdoc-property-modifiers) `@public`, `@private`, `@protected`, `@readonly`

Artinya biasanya sama, atau _superset_, dari arti _tag_ yang diberikan di [jsdoc.app](https://jsdoc.app).
Kode dibawah mendeskripsikan perbedaan dan beberapa contoh dari setiap _tag_-nya.

**Catatan:** Anda bisa menggunakan [_playground_ untuk mengeksplor dukungan JSDoc](/play?useJavaScript=truee=4#example/jsdoc-support).

## `@type`

Anda dapat menggunakan _tag_ "@type" dan mereferensikan nama jenis (baik primitif, ditentukan dalam deklarasi TypeScript, atau dalam _tag_ "@typedef" JSDoc).
Anda dapat menggunakan sebagian besar jenis JSDoc dan jenis TypeScript apa pun, dari [yang paling dasar seperti `string`](/docs/handbookbasic-types.html) hingga [yang paling canggih, seperti jenis bersyarat](/docs/handbook/advanced-types.html).

```js twoslash
/**
 * @type {string}
 */
var s;

/** @type {Window} */
var win;

/** @type {PromiseLike<string>} */
var promisedString;

// Anda dapat menentukan Elemen HTML dengan properti DOM
/** @type {HTMLElement} */
var myElement = document.querySelector(selector);
element.dataset.myData = "";
```

`@type` dapat menetapkan tipe gabungan &mdash; misalnya, sesuatu bisa berupa _string_ atau _boolean_.

```js twoslash
/**
 * @type {(string | boolean)}
 */
var sb;
```

Perhatikan bahwa tanda kurung bersifat opsional untuk tipe gabungan.

```js twoslash
/**
 * @type {string | boolean}
 */
var sb;
```

Anda dapat menentukan tipe _array_ menggunakan berbagai sintaks:

```js twoslash
/** @type {number[]} */
var ns;
/** @type {Array.<number>} */
var nds;
/** @type {Array<number>} */
var nas;
```

Anda juga dapat menentukan tipe _literal_ objek.
Misalnya, objek dengan properti 'a' (_string_) dan 'b' (angka) menggunakan sintaks berikut:

```js twoslash
/** @type {{ a: string, b: number }} */
var var9;
```

Anda dapat menentukan objek seperti _map_ dan _array_ menggunakan index signature _string_ dan angka, menggunakan sintaks JSDoc standar atau sintaks TypeScript.

```js twoslash
/**
 * Objek map yang memetakan kunci string dan nilainya bertipe number.
 *
 * @type {Object.<string, number>}
 */
var stringToNumber;

/** @type {Object.<number, object>} */
var arrayLike;
```

Dua jenis sebelumnya sama dengan tipe TypeScript `{ [x: string]: number }` dan `{ [x: number]: any }`. Kompilator memahami kedua sintaks tersebut.

Anda dapat menentukan jenis fungsi menggunakan sintaks TypeScript atau _Closure_:

```js twoslash
/** @type {function(string, boolean): number} Closure syntax */
var sbn;
/** @type {(s: string, b: boolean) => number} TypeScript syntax */
var sbn2;
```

Atau anda dapat menggunakan type `Function` yang tidak ditentukan:

```js twoslash
/** @type {Function} */
var fn7;
/** @type {function} */
var fn6;
```

Type lainnya dari _Closure_ juga berfungsi:

```js twoslash
/**
 * @type {*} - can be 'any' type
 */
var star;
/**
 * @type {?} - unknown type (same as 'any')
 */
var question;
```

### Casts

TypeScript meminjam sintaks _cast_ dari _Closure_.
Ini memungkinkan Anda mentransmisikan tipe ke tipe lain dengan menambahkan tag `@type` sebelum ekspresi dalam tanda kurung.

```js twoslash
/**
 * @type {number | string}
 */
var numberOrString = Math.random() < 0.5 ? "hello" : 100;
var typeAssertedNumber = /** @type {number} */ (numberOrString);
```

### Impor type

Anda bisa juga mengimpor deklarasi dari berkas lain menggunakan impor tipe.
Sintaks ini khusus untuk TypeScript dan berbeda dari standar JSDoc:

```js twoslash
// @filename: types.d.ts
export type Pet = {
  name: string,
};

// @filename: main.js
/**
 * @param p { import("./types").Pet }
 */
function walk(p) {
  console.log(`Walking ${p.name}...`);
}
```

mengimpor tipe juga dapat digunakan di deklarasi tipe alias:

```js twoslash
// @filename: types.d.ts
export type Pet = {
  name: string,
};
// @filename: main.js
// ---cut---
/**
 * @typedef { import("./types").Pet } Pet
 */

/**
 * @type {Pet}
 */
var myPet;
myPet.name;
```

Mengimpor tipe dapat digunakan untuk mendapatkan tipe nilai dari modul, jika Anda tidak mengetahui jenisnya, atau jika nilai tersebut memiliki tipe yang besar yang dapat mengganggu untuk diketik:

```js twoslash
// @filename: accounts.d.ts
export const userAccount = {
  name: "Name",
  address: "An address",
  postalCode: "",
  country: "",
  planet: "",
  system: "",
  galaxy: "",
  universe: "",
};
// @filename: main.js
// ---cut---
/**
 * @type {typeof import("./accounts").userAccount }
 */
var x = require("./accounts").userAccount;
```

## `@param` and `@returns`

`@param` menggunakan jenis sintaks yang sama dengan `@type`, tapi dengan tambahan sebuah nama _parameter_.
_Parameter_ juga dapat dideklarasikan secara opsional dengan membungkus namanya menggunakan kurung siku:

```js twoslash
// Parameter dapat dideklarasikan dalam berbagai bentuk sintaksis
/**
 * @param {string}  p1 - Parameter string.
 * @param {string=} p2 - Opsional param (sintaks Closure)
 * @param {string} [p3] - Opsional param lainnya (sintaks JSDoc).
 * @param {string} [p4="test"] - Opsional param dengan nilai standar
 * @return {string} Ini adalah hasilnya
 */
function stringsStringStrings(p1, p2, p3, p4) {
  // MELAKUKAN
}
```

Demikian juga, untuk tipe kembalian suatu fungsi:

```js twoslash
/**
 * @return {PromiseLike<string>}
 */
function ps() {}

/**
 * @returns {{ a: string, b: number }} - Dapat menggunakan '@returns' serta '@return'
 */
function ab() {}
```

## `@typedef`, `@callback`, and `@param`

`@ty[edef` juga dapat digunakan untuk mendefinisikan tipe yang kompleks.
Sintaks yang bekerja dengan `@params`.

```js twoslash
/**
 * @typedef {Object} SpecialType - buat type baru bernama 'SpecialType'
 * @property {string} prop1 - properti string dari SpecialType
 * @property {number} prop2 - properti number dari SpecialType
 * @property {number=} prop3 - properti number opsional dari SpecialType
 * @prop {number} [prop4] - properti number opsional dari SpecialType
 * @prop {number} [prop5=42] - properti number opsional dari SpecialType dengan nilai standar
 */

/** @type {SpecialType} */
var specialTypeObject;
specialTypeObject.prop3;
```

Anda bisa menggunakan `object` atau `Object` pada baris pertama.

```js twoslash
/**
 * @typedef {object} SpecialType1 - buat tipe baru bernama 'SpecialType'
 * @property {string} prop1 - properti string dari SpecialType
 * @property {number} prop2 - properti number dari SpecialType
 * @property {number=} prop3 - opsional properti number dari SpecialType
 */

/** @type {SpecialType1} */
var specialTypeObject1;
```

`@params` memperbolehkan sintaks yang serupa untuk spesifikasi tipenya.
Perhatikan bahwa nama properti _nested_ harus diawali dengan nama _parameter_-nya:

```js twoslash
/**
 * @param {Object} options - Bentuknya sama dengan SpecialType di atas
 * @param {string} options.prop1
 * @param {number} options.prop2
 * @param {number=} options.prop3
 * @param {number} [options.prop4]
 * @param {number} [options.prop5=42]
 */
function special(options) {
  return (options.prop4 || 1001) + options.prop5;
}
```

`@callback` mirip dengan `@typedef`, tetapi ini menetapkan tipe fungsi daripada tipe objek:

```js twoslash
/**
 * @callback Predicate
 * @param {string} data
 * @param {number} [index]
 * @returns {boolean}
 */

/** @type {Predicate} */
const ok = (s) => !(s.length % 2);
```

Tentu saja, salah satu dari jenis ini dapat dideklarasikan menggunakan sintaks TypeScript dalam satu baris `@typedef`:

```js
/** @typedef {{ prop1: string, prop2: string, prop3?: number }} SpecialType */
/** @typedef {(data: string, index?: number) => boolean} Predicate */
```

## `@template`

Anda dapat mendeklarasikan fungsi generik dengan tag `@template`:

```js twoslash
/**
 * @template T
 * @param {T} x - Parameter umum yang mengalir ke tipe kembalian
 * @return {T}
 */
function id(x) {
  return x;
}

const a = id("string");
const b = id(123);
const c = id({});
```

Gunakan koma atau beberapa _tag_ untuk mendeklarasikan beberapa _parameter_ tipe:

```js
/**
 * @template T,U,V
 * @template W,X
 */
```

Anda juga bisa menentukan batasan tipe sebelum nama _parameter_-nya.
Hanya _parameter_ tipe pertama dalam sebuah list yang dibatasi.

```js twoslash
/**
 * @template {string} K - K harus berupa string atau string literal
 * @template {{ serious(): string }} Seriousalizable - harus memiliki method serious
 * @param {K} key
 * @param {Seriousalizable} object
 */
function seriousalize(key, object) {
  // ????
}
```

Mendeklarasikan kelas generik atau tipe yang tidak didukung.

## Classes

Kelas yang dapat dideklarasikan sebagai kelas ES6.

```js twoslash
class C {
  /**
   * @param {number} data
   */
  constructor(data) {
    // tipe properti yang bisa diketahui
    this.name = "foo";

    // atau mengaturnya secara eksplisit
    /** @type {string | null} */
    this.title = null;

    // atau hanya diberi anotasi, jika disetel di tempat lain
    /** @type {number} */
    this.size;

    this.initialize(data); // Seharusnya galat, karena inisialisasi mengharapkan string
  }
  /**
   * @param {string} s
   */
  initialize = function (s) {
    this.size = s.length;
  };
}

var c = new C(0);

// C seharusnya hanya dipanggil dengan yang baru,
// tetapi karena ini adalah JavaScript, ini
// diperbolehkan dan dianggap sebagai 'any'.
var result = C(1);
```

Mereka juga dapat dideklarasikan sebagai fungsi konstruktor, seperti yang dijelaskan di bagian selanjutnya:

## `@constructor`

Kompilator menyimpulkan fungsi konstruktor berdasarkan penetapan properti ini, tetapi Anda dapat membuat pemeriksaan lebih ketat dan saran lebih baik jika Anda menambahkan _tag_ `@constructor`:

```js twoslash
// @checkJs
// @errors: 2345 2348
/**
 * @constructor
 * @param {number} data
 */
function C(data) {
  // tipe properti yang dapat diketahui
  this.name = "foo";

  // atau atur secara eksplisit
  /** @type {string | null} */
  this.title = null;

  // atau hanya diberi anotasi, jika disetel di tempat lain
  /** @type {number} */
  this.size;

  this.initialize(data);
}
/**
 * @param {string} s
 */
C.prototype.initialize = function (s) {
  this.size = s.length;
};

var c = new C(0);
c.size;

var result = C(1);
```

> Catatan: Pesan galat hanya tampil di basis kode JS dengan [JSConfig](/docs/handbook/tsconfig-json.html) dan [`checkJS`](/tsconfig#checkJs) yang diaktifkan.

Dengan `@constructor`, `this` diperiksa didalam fungsi konstruktor `C`, jadi anda akan mendapatkan saran untuk method `initialize` dan sebuah galat jika anda memasukkan sebuah angka. Editor-mu mungkin akan menampilkan peringatan jika memanggil `C` daripada mengkonstruksikannya.

Sayangnya, ini berarti bahwa fungsi konstruktor yang juga dapat dipanggil tidak dapat menggunakan `@constructor`.

## `@this`

Kompilator biasanya dapat mengetahui tipe `this` ketika ia memiliki beberapa konteks untuk dikerjakan. Jika tidak, Anda dapat secara eksplisit menentukan jenis `this` dengan `@this`:

```js twoslash
/**
 * @this {HTMLElement}
 * @param {*} e
 */
function callbackForLater(e) {
  this.clientHeight = parseInt(e); // seharusnya baik-baik saja!
}
```

## `@extends`

Ketika kelas JavaScript memperluas _base class_, tidak ada tempat untuk menentukan seharusnya menggunakan parameter tipe yang seperti apa. _Tag_ `@extends` menyediakan tempat untuk parameter jenis itu:

```js twoslash
/**
 * @template T
 * @extends {Set<T>}
 */
class SortableSet extends Set {
  // ...
}
```

Perhatikan bahwa `@extends` hanya berfungsi dengan kelas. Saat ini, tidak ada cara untuk fungsi konstruktor memperluas kelas.

## `@enum`

Tag `@enum` memungkinkan Anda membuat _literal_ objek yang tipe anggotanya spesifik. Tidak seperti kebanyakan _literal_ objek di JavaScript, ini tidak mengizinkan anggota lain.

```js twoslash
/** @enum {number} */
const JSDocState = {
  BeginningOfLine: 0,
  SawAsterisk: 1,
  SavingComments: 2,
};

JSDocState.SawAsterisk;
```

Perhatikan bahwa `@enum` sangat berbeda, dan jauh lebih sederhana daripada `enum` TypeScript. Namun, tidak seperti _enum_ TypeScript, `@enum` dapat memiliki tipe apa saja:

```js twoslash
/** @enum {function(number): number} */
const MathFuncs = {
  add1: (n) => n + 1,
  id: (n) => -n,
  sub1: (n) => n - 1,
};

MathFuncs.add1;
```

## Lebih banyak contoh

```js twoslash
class Foo {}
// ---cut---
var someObj = {
  /**
   * @param {string} param1 - Dokumen tentang tugas properti
   */
  x: function (param1) {},
};

/**
 * Seperti halnya dokumen tentang tugas variabel
 * @return {Window}
 */
let someFunc = function () {};

/**
 * Dan method kelas
 * @param {string} greeting Salam untuk digunakan
 */
Foo.prototype.sayHi = (greeting) => console.log("Hi!");

/**
 * Dan ekspresi arrow function
 * @param {number} x - Pengganda
 */
let myArrow = (x) => x * x;

/**
 * Artinya, ini juga berfungsi untuk komponen fungsi stateless di JSX
 * @param {{a: string, b: number}} test - Beberapa param
 */
var sfc = (test) => <div>{test.a.charAt(0)}</div>;

/**
 * Parameter bisa menjadi konstruktor kelas, menggunakan sintaks Closure.
 *
 * @param {{new(...args: any[]): object}} C - Kelas untuk mendaftar
 */
function registerClass(C) {}

/**
 * @param {...string} p1 - A 'rest' arg (array) of strings. (treated as 'any')
 */
function fn10(p1) {}

/**
 * @param {...string} p1 - A 'rest' arg (array) of strings. (treated as 'any')
 */
function fn9(p1) {
  return p1.join();
}
```

## Pola yang diketahui TIDAK didukung

Mengacu pada objek di _value space_ sebagai tipe yang tidak berfungsi, kecuali objek tersebut juga membuat tipe, seperti fungsi konstruktor.

```js twoslash
function aNormalFunction() {}
/**
 * @type {aNormalFunction}
 */
var wrong;
/**
 * Gunakan 'typeof' sebagai gantinya:
 * @type {typeof aNormalFunction}
 */
var right;
```

_Postfix_ sama dengan tipe properti dalam tipe _literal_ objek yang tidak menetapkan properti opsional:

```js twoslash
/**
 * @type {{ a: string, b: number= }}
 */
var wrong;
/**
 * Gunakan postfix question pada nama properti sebagai gantinya:
 * @type {{ a: string, b?: number }}
 */
var right;
```

Jenis _Nullable_ hanya memiliki arti jika `strictNullChecks` aktif:

```js twoslash
/**
 * @type {?number}
 * With strictNullChecks: true  -- number | null
 * With strictNullChecks: false -- number
 */
var nullable;
```

Anda juga bisa menggunakan tipe gabungan:

```js twoslash
/**
 * @type {number | null}
 * With strictNullChecks: true  -- number | null
 * With strictNullChecks: false -- number
 */
var unionNullable;
```

Tipe _non-nullable_ tidak memiliki arti dan diperlakukan seperti jenis aslinya:

```js twoslash
/**
 * @type {!number}
 * Hanya bertipe number
 */
var normal;
```

Tidak seperti sistem tipe JSDoc, TypeScript hanya memungkinkan Anda untuk menandai tipe, apakah mengandung null atau tidak.
Tidak ada non-nullability eksplisit - jika strictNullChecks aktif, `number` tidak dapat dinihilkan.
Jika tidak aktif, maka `number` adalah nullable.

### _Tag_ yang tidak didukung

TypeScript mengabaikan semua _tag_ JSDoc yang tidak didukung.

_Tag_ berikut memiliki isu terbuka untuk mendukungnya:

- `@const` ([issue #19672](https://github.com/Microsoft/TypeScript/issues/19672))
- `@inheritdoc` ([issue #23215](https://github.com/Microsoft/TypeScript/issues/23215))
- `@memberof` ([issue #7237](https://github.com/Microsoft/TypeScript/issues/7237))
- `@yields` ([issue #23857](https://github.com/Microsoft/TypeScript/issues/23857))
- `{@link …}` ([issue #35524](https://github.com/Microsoft/TypeScript/issues/35524))

## Extensi kelas JS

### _Modifier Property_ JSDoc

Dari TypeScript 3.8 dan seterusnya, Anda dapat menggunakan JSDoc untuk mengubah properti kelas. Pertama adalah pengubah aksesibilitas: `@public`,`@private`, dan `@protected`.
Tag ini bekerja persis seperti `public`,`private`, dan `protected`, masing-masing berfungsi di TypeScript.

```js twoslash
// @errors: 2341
// @ts-check

class Car {
  constructor() {
    /** @private */
    this.identifier = 100;
  }

  printIdentifier() {
    console.log(this.identifier);
  }
}

const c = new Car();
console.log(c.identifier);
```

- `@public` ini berarti properti dapat diakses dari mana saja.
- `@private` berarti bahwa properti hanya dapat digunakan di dalam kelas yang memuatnya.
- `@protected` berarti bahwa properti hanya dapat digunakan di dalam kelas penampung, dan semua subkelas turunan, tetapi tidak pada instance kelas penampung yang berbeda.

Selanjutnya, kita juga telah menambahkan _modifier_ `@readonly` untuk memastikan bahwa sebuah properti hanya dapat di-_write_ selama inisialisasi.

```js twoslash
// @errors: 2540
// @ts-check

class Car {
  constructor() {
    /** @readonly */
    this.identifier = 100;
  }

  printIdentifier() {
    console.log(this.identifier);
  }
}

const c = new Car();
console.log(c.identifier);
```
