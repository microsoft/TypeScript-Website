//// { compiler: { ts: "4.0.2" } }

// _Variadic tuples_ memberikan kemampuan pada _tuple_ untuk menangani
// operator _rest_ (...) untuk memberikan tipe data pada pemeriksa tipe
// data dengan cara yang mirip dengan tipe generik.

// _Variadic tuples_ merupakan topik yang rumit, sehingga Anda tidak perlu
// khawatir bila Anda merasa kebingungan. Contoh di bawah berdasarkan
// example:generic-functions dan example:tuples.

// Sebagai permulaan, di bawah ini merupakan sebuah _variadic tuple_ yang
// akan selalu memberikan prefiks pada _tuple_ lain dengan sebuah bilangan:

type AddMax<T extends unknown[]> = [max: number, ...rest: T];
//          ^ Tipe generik digunakan untuk
//            membatasi T
//                                                ^ Operator `...` digunakan
//                                                  untuk mengetahui letak
//                                                  penggabungan

// Tipe data di atas dapat digunakan untuk komposisi:
type MaxMin = AddMax<[min: number]>
type MaxMinDiameter = AddMax<[min: number, diameter: number]>

// Hal yang sama juga digunakan setelah penggunaan _tuple_:
type SuffixDIContext<T extends unknown[]> = [...first: T, context: any];
type DIContainer = SuffixDIContext<[param: string]>

// Mekanisme ini dapat digabungkan dengan banyak parameter masukan.
// Sebagai contoh, fungsi di bawah ini menggabungkan dua buah _array_
// namun menggunakan '\0' sebagai karakter yang menjadi tanda
// dimana _array_ dimulai dan berakhir.
function joinWithNullTerminators<T extends unknown[], U extends unknown[]>(t: [...T], u: [...U]) {
    return ['\0', ...t, '\0', ...u, '\0'] as const;
}

// TypeScript dapat menyimpulkan tipe data kembalian dari sebuah
// fungsi seperti berikut:
const result = joinWithNullTerminators(['variadic', 'types'], ["terminators", 3]);

//
// Perkakas ini memungkinkan kita untuk memberi tipe data
// pada sebuah fungsi seperti fungsi untuk _currying_
// yang merupakan sebuah konsep yang sering digunakan
// pada pemrograman fungsional:

function curry<T extends unknown[], U extends unknown[], R>(f: (...args: [...T, ...U]) => R, ...a: T) {
    return (...b: U) => f(...a, ...b);
}

// Ada 3 parameter generik:
// - T: Kumpulan masukan yang digunakan pada fungsi _curry_
// - U: Kumpulan masukan yang tidak digunakan pada fungsi
//      _curry_, dan harus diteruskan pada fungsi yang dikembalikan
// - R: Tipe kembalian dari fungsi yang diberikan

const sum = (left: number, right: number,) => left + right

const a = curry(sum, 1, 2)
const b = curry(sum, 1)(2)
const c = curry(sum)(1, 2)

// Anda dapat mempelajari lebih lanjut tentang _variadic tuples_,
// beserta dengan contoh kode programnya pada:
// https://github.com/microsoft/TypeScript/pull/39094

