---
title: TypeScript Tooling dalam 5 menit
layout: docs
permalink: /id/docs/handbook/typescript-tooling-in-5-minutes.html
oneline: Sebuah tutorial untuk memahami cara membuat situs web kecil dengan TypeScript
translatable: true
---

Mulai membangun aplikasi web sederhana dengan TypeScript.

## Memasang TypeScript

Berikut adalah 2 cara agar TypeScript ada pada proyekmu:

- Melalui npm (package manager dari Node.js)
- Dengan memasang _plugin_ Visual Studio TypeScript

Standar dari Visual Studio 2017 dan Visual Studio 2015 Update 3 telah menyertakan TypeScript.
Jika anda belum memasang TypeScript dengan Visual Studio, anda masih bisa [mengunduhnya disini](/download).

Untuk pengguna npm:

```shell
> npm install -g typescript
```

## Membangun berkas TypeScript pertamamu

Di editormu, ketik kode JavaScript berikut pada berkas `greeter.ts`:

```ts twoslash
// @noImplicitAny: false
function greeter(person) {
  return "Hello, " + person;
}

let user = "Jane User";

document.body.textContent = greeter(user);
```

## Mengkompilasi kodemu

Kita menggunakan ekstensi `.ts`, tapi kode ini hanyalah JavaScript.
Anda dapat menyalin/menempel ini langsung dari aplikasi JavaScript yang ada.

Di _command line_, jalankan TypeScript kompilator:

```shell
tsc greeter.ts
```

Hasilnya akan menjadi berkas `greeter.js` yang berisi JavaScript yang sama dengan yang anda masukkan.
Kodenya telah berhasil menjalankannya menggunakan TypeScript di aplikasi JavaScript!

Sekarang kita bisa melangkah lebih jauh tentang tool yang ditawarkan oleh TypeScript.
Tambahkan sebuah jenis anotasi `: string` ke argumen 'person' pada fungsi `greeter`, seperti berikut:

```ts twoslash
function greeter(person: string) {
  return "Hello, " + person;
}

let user = "Jane User";

document.body.textContent = greeter(user);
```

## Jenis Anotasi

Jenis anotasi di TypeScript adalah cara yang mudah untuk mengetahui bagaimana fungsi atau variabel tersebut yang dimaksudkan.
Dalam kasus ini, kami bermaksud agar fungsi _greeter_ dipanggil dengan parameter string tunggal.
Kita dapat mencoba mengubah pemanggilan fungsi _greeter_ untuk mengirimkan _array_ sebagai gantinya:

```ts twoslash
// @errors: 2345
function greeter(person: string) {
  return "Hello, " + person;
}

let user = [0, 1, 2];

document.body.textContent = greeter(user);
```

_Compile_ ulang, dan Anda akan melihat galat berikut:

```shell
error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.
```

Demikian pula, coba hapus semua argumen saat pemanggilan fungsi _greeter_.
TypeScript akan memberi tahu Anda bahwa Anda telah memanggil fungsi ini dengan jumlah _parameter_ yang tidak terduga.
Dalam kedua kasus, TypeScript dapat menawarkan analisis statis berdasarkan struktur kode Anda, dan jenis anotasi yang Anda berikan.

Perhatikan ketika terjadi galat, berkas `greeter.js` tetap dibuat.
Anda bisa menggunakan TypeScript bahkan jika terjadi galat pada kodemu. Tapi pada kasus ini, TypeScript memperingatkan bahwa kodemu akan bekerja tidak sesuai dengan ekspektasi.

## _Interfaces_

Mari kembangkan sampel kita lebih jauh. Di sini kami menggunakan _interface_ yang mendeskripsikan objek yang memiliki _field_ firstName dan lastName.
Di TypeScript, dua jenis anotasi akan kompatibel jika struktur internalnya juga kompatibel.
Ini membolehkan kita untuk mengimplementasikan sebuah _interface_ hanya dengan memiliki bentuk _interface_ yang dibutuhkan, tanpa klausa `implements` yang eksplisit.

```ts twoslash
interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

let user = { firstName: "Jane", lastName: "User" };

document.body.textContent = greeter(user);
```

## Kelas

Terakhir, mari menambahkan penggunaan kelas pada contoh yang sedang kita kerjakan.
TypeScript mendukung fitur baru di JavaScript, seperti dukungan untuk kelas berbasiskan pemrograman objek.

Disini kita mulai dengan membuat kelas `Student` dengan konstruktor dan beberapa _field_ publik.
Perhatikan bahwa kelas dan _interface_ saling bersinergi, sehingga memberikan kebebasan ke programmer untuk memutuskan level abstraksi yang tepat.

Juga perlu perhatikan, penggunaan `public` pada argumen di konstruktor adalah singkatan yang membolehkan kita untuk secara otomatis membuat properti dengan nama tersebut.

```ts twoslash
class Student {
  fullName: string;
  constructor(
    public firstName: string,
    public middleInitial: string,
    public lastName: string
  ) {
    this.fullName = firstName + " " + middleInitial + " " + lastName;
  }
}

interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

let user = new Student("Jane", "M.", "User");

document.body.textContent = greeter(user);
```

Jalankan ulang perintah `tsc greeter.ts` dan anda akan melihat kode JavaScript-nya.
Kelas pada TypeScript hanyalah singkatan untuk _object-oriented_ berbasiskan _prototipe_ yang sama, yang sering digunakan di JavaScript.

## Menjalankan aplikasi web TypeScript-mu

Sekarang ketik kode berikut di `greeter.html`:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>TypeScript Greeter</title>
  </head>
  <body>
    <script src="greeter.js"></script>
  </body>
</html>
```

Buka `greeter.html` di _browser_ untuk menjalankan aplikasi web TypeScript-mu yang pertama!

Opsional: Buka `greeter.ts` di Visual Studio, atau salin kode ke TypeScript _playground_.
Anda dapat mengarahkan kursor ke _identifier_ untuk melihat tipe mereka.
Perhatikan bahwa dalam beberapa kasus, tipe ini disimpulkan secara otomatis untuk Anda.
Ketik ulang baris terakhir, dan lihat daftar penyelesaian dan bantuan _parameter_ berdasarkan jenis elemen DOM.
Letakkan kursor Anda pada referensi ke fungsi greeter, dan tekan F12 untuk masuk ke definisinya.
Perhatikan juga bahwa Anda dapat mengklik kanan pada simbol dan menggunakan _refactoring_ untuk mengganti namanya.

Jenis informasi yang disediakan bekerja sama dengan _tool_ untuk memudahkan pekerjaan dengan aplikasi JavaScript.
Untuk informasi lebih lanjut tentang apa yang mungkin kita bisa lakukan dengan TypeScript, anda dapat melihat beberapa sample di situs ini.

![Visual Studio picture](/images/docs/greet_person.png)
