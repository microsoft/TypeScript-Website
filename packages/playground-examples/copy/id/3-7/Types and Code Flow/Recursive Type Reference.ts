//// { compiler: {  }, order: 2 }

// Memilih antara menggunakan tipe dan antarmuka adalah
// tentang memilih batasan dari fitur yang ditawarkan keduanya.
// Dengan TypeScript 3.7, salah satu batasan yang dimiliki
// oleh tipe namun tidak dimiliki antarmuka telah dihapus.

// Anda dapat mengetahui lebih lanjut tentang hal ini pada
// example:types-vs-interfaces

// Dulunya, Anda tidak dapat mengacu pada tipe yang Anda
// definiskan di dalam tipe itu sendiri. Hal ini adalah sebuah
// batasan yang tidak terdapat dalam sebuah antarmuka, dan dapat
// diatasi dengan sebuah cara tertentu.

// Contohnya, ekspresi di bawah ini tidak valid pada TypeScript versi 3.6:
type NilaiAtauArray<T> = T | Array<NilaiAtauArray<T>>;

// Di bawah ini merupakan cara untuk mengatasi masalah tersebut, dengan
// menggabungkan tipe dengan sebuah antarmuka
type NilaiAtauArray2<T> = T | ArrayOfNilaiAtauArray<T>;
interface ArrayOfNilaiAtauArray<T> extends Array<NilaiAtauArray2<T>> { }

// Hal tersebut memungkinkan sebuah definisi JSON yang komprehensif,
// yang dinyatakan dengan mengacu pada dirinya sendiri.

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const contohStatusJSON: Json = {
    tersedia: true,
    namaPengguna: "Jean-loup",
    ruangan: {
        nama: "Highcrest",
        // Tidak dapat menambahkan fungsi pada tipe Json
        // perbarui: () => {}
    },
};

// Ada hal lain yang dapat dipelajari dari catatan rilis TypeScript versi
// 3.7 _beta_ dan _pull request_nya.
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
// https://github.com/microsoft/TypeScript/pull/33050
