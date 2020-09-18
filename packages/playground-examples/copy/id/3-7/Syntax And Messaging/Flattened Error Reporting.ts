//// { compiler: {  }, order: 3 }

// Pesan kesalahan yang ditampilkan TypeScript terkadang berlebihan.
// Dengan TypeScript 3.7, kami telah mengambil beberapa kasus dimana
// pesan kesalahan yang ditampilkan oleh TypeScript sangat buruk.

// Properti bersarang

let a = { b: { c: { d: { e: "string" } } } };
let b = { b: { c: { d: { e: 12 } } } };

a = b;

// Sebelumnya, terdapat 2 baris kode untuk satu properti bersarang,
// dimana orang-orang akan belajar untuk membaca pesan kesalahan
// dengan membaca baris pertama terlebih dahulu dan kemudian
// membaca baris terakhir.

// Sekarang pesan kesalahan tersebut ditampilkan dalam satu baris. :tada:

// Sebelumnya pada versi 3.6:
//
// Type '{ b: { c: { d: { e: number; }; }; }; }' is not assignable to type '{ b: { c: { d: { e: string; }; }; }; }'.
//   Types of property 'b' are incompatible.
//     Type '{ c: { d: { e: number; }; }; }' is not assignable to type '{ c: { d: { e: string; }; }; }'.
//       Types of property 'c' are incompatible.
//         Type '{ d: { e: number; }; }' is not assignable to type '{ d: { e: string; }; }'.
//           Types of property 'd' are incompatible.
//             Type '{ e: number; }' is not assignable to type '{ e: string; }'.
//               Types of property 'e' are incompatible.
//                 Type 'number' is not assignable to type 'string'

// Cara ini dapat menampilkan pesan kesalahan pada berbagai
// tipe objek, namun tetap mampu untuk menampilkan
// pesan kesalahan yang jelas dan berguna.

class ContohKelas {
    state = "ok";
}

class KelasLain {
    state = 12;
}

let x = { a: { b: { c: { d: { e: { f: ContohKelas } } } } } };
let y = { a: { b: { c: { d: { e: { f: KelasLain } } } } } };
x = y;

// Sebelumnya pada versi 3.6:
//
// Type '{ a: { b: { c: { d: { e: { f: typeof KelasLain; }; }; }; }; }; }' is not assignable to type '{ a: { b: { c: { d: { e: { f: typeof ContohKelas; }; }; }; }; }; }'.
//   Types of property 'a' are incompatible.
//     Type '{ b: { c: { d: { e: { f: typeof KelasLain; }; }; }; }; }' is not assignable to type '{ b: { c: { d: { e: { f: typeof ContohKelas; }; }; }; }; }'.
//       Types of property 'b' are incompatible.
//         Type '{ c: { d: { e: { f: typeof KelasLain; }; }; }; }' is not assignable to type '{ c: { d: { e: { f: typeof ContohKelas; }; }; }; }'.
//           Types of property 'c' are incompatible.
//             Type '{ d: { e: { f: typeof KelasLain; }; }; }' is not assignable to type '{ d: { e: { f: typeof ContohKelas; }; }; }'.
//               Types of property 'd' are incompatible.
//                 Type '{ e: { f: typeof KelasLain; }; }' is not assignable to type '{ e: { f: typeof ContohKelas; }; }'.
//                   Types of property 'e' are incompatible.
//                     Type '{ f: typeof KelasLain; }' is not assignable to type '{ f: typeof ContohKelas; }'.
//                       Types of property 'f' are incompatible.
//                         Type 'typeof KelasLain' is not assignable to type 'typeof ContohKelas'.
//                           Type 'KelasLain' is not assignable to type 'ContohKelas'.
//                             Types of property 'state' are incompatible.
//                               Type 'number' is not assignable to type 'string'
