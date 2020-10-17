//// { order: 2, compiler: { jsx: 2, esModuleInterop: true } }

// React adalah sebuah pustaka yang populer untuk membangun
// antarmuka pengguna. React menyediakan abstraksi JavaScript
// untuk membuat komponen tampilan menggunakan ekstensi
// bahasa JavaScript yang bernama JSX.

// TypeScript mendukung JSX, dan menyediakan banyak perkakas
// tipe data untuk menetapkan bagaimana komponen-komponen
// saling terhubung.

// Untuk memahami bagaimana TypeScript bekerja dengan komponen
// React, Anda mungkin ingin untuk melihat dasar-dasar tipe
// generik:
//
// - example:generic-functions
// - example:generic-classes

// Pertama, kita akan lihat bagaimana antarmuka generik digunakan
// untuk memetakan komponen React. Di bawah ini merupakan sebuah
// komponen fungsional React yang semu:

type FauxactFunctionComponent<Props extends {}> = (
  props: Props,
  context?: any,
) => FauxactFunctionComponent<any> | null | JSX.Element;

// Secara garis besar:
//
// FauxactFunctionComponent merupakan sebuah fungsi generik yang
// bergantung pada tipe data lain, yaitu Props. Props harus merupakan
// sebuah objek (supaya Anda tidak meneruskan sebuah tipe data primitif)
// dan tipe data Props akan digunakan ulang sebagai argumen
// pertama dari fungsi tersebut.

// Untuk menggunakan fungsi tersebut, Anda membutuhkan sebuah
// tipe data untuk properti:

interface PropertiTanggal {
  tanggalIso8601: string;
  pesan: string;
}

// Kita nantinya dapat membuat sebuah DateComponent yang
// menggunakan antarmuka DateProps, dan mengeluarkan tanggal.

const KomponenTanggal: FauxactFunctionComponent<PropertiTanggal> = (props) => (
  <time dateTime={props.tanggalIso8601}>{props.pesan}</time>
);

// Ekspresi di atas membuat sebuah fungsi generik dengan
// sebuah variabel Props yang harus merupakan sebuah objek.
// Fungsi komponen akan mengembalikan komponen lain atau null.

// API komponen lain adalah sebuah API berbasis kelas. Berikut
// merupakan penyederhanaan dari API tersebut:

interface FauxactClassComponent<Props extends {}, State = {}> {
  props: Props;
  state: State;

  setState: (prevState: State, props: Props) => Props;
  callback?: () => void;
  render(): FauxactClassComponent<any> | null;
}

// Karena kelas ini dapat memiliki Props dan State - kelas
// ini memiliki dua buah argumen generik yang digunakan
// di sepanjang kelas.

// Pustaka React memiliki definisi tipe datanya sendiri
// seperti di atas namun jauh lebih komprehensif. Mari
// kita gunakan tipe data tersebut pada arena bermain ini
// dna menjelajahi beberapa komponen.

import * as React from "react";

// Properti Anda merupakan API publik Anda, sehingga
// ada baiknya untuk meluangkan waktu untuk menggunakan
// JSDoc untuk menjelaskan bagaimana properti tersebut
// bekerja:

export interface Props {
  /** Nama pengguna */
  nama: string;
  /** Menentukan apakah nama harus dicetak dengan huruf tebal */
  prioritas?: boolean;
}

const PrintName: React.FC<Props> = (props) => {
  return (
    <div>
      <p style={{ fontWeight: props.prioritas ? "bold" : "normal" }}>
        {props.nama}
      </p>
    </div>
  );
};

// Anda dapat mencoba menggunakan komponen baru tersebut
// seperti di bawah ini:

const TampilkanPengguna: React.FC<Props> = (props) => {
  return <PrintName nama="Ned" />;
};

// TypeScript mendukung penyediaan _intellisense_ di dalam
// atribut {}

let namaPengguna = "Cersei";
const TampilkanPenggunaTersimpan: React.FC<Props> = (props) => {
  return <PrintName name={namaPengguna} prioritas />;
};

// TypeScript juga mendukung kode React modern, di sini Anda
// dapat melihat bahwa `count` dan `setCount` telah
// disimpulkan untuk menggunakan bilangan dengan tepat
// berdasarkan nilai awal yang diberikan pada `useState`.

import { useState, useEffect } from "react";

const ContohPenghitung = () => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    document.title = `Anda mengklik sebanyak ${count} times`;
  });

  return (
    <div>
      <p>Anda mengklik sebanyak {count} times</p>
      <button onClick={() => setCount(count + 1)}>Klik disini</button>
    </div>
  );
};

// React dan TypeScript merupakan topik yang sangat luas
// namun memiliki dasar yang sederhana: TypeScript mendukung
// JSX dan sisanya ditangani oleh tipe-tipe data milik
// React dari Definitely Typed.

// Anda dapat mempelajari lebih lanjut tentang cara menggunakan
// React dengan TypeScript melalui situs web berikut:
//
// https://github.com/typescript-cheatsheets/react-typescript-cheatsheet
// https://egghead.io/courses/use-typescript-to-develop-react-applications
// https://levelup.gitconnected.com/ultimate-react-component-patterns-with-typescript-2-8-82990c516935
