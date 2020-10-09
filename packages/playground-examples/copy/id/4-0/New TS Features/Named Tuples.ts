//// { compiler: { ts: "4.0.2" } }

// _Tuple_ adalah _array_ dimana urutan elemennya penting bagi
// sistem tipe, Anda dapat mempelajari lebih lanjut tentang _tuple_
// di example:tuples.

// Pada TypeScript versi 3.9, tipe dari sebuah _tuple_ mendapatkan
// kemampuan untuk memberikan nama pada elemen-elemen _array_.

// Sebagai contoh, Anda biasanya menulis lokasi garis lintang
// dan garis bujur dalam sebuah _tuple_:

type LokasiLama = [number, number]

const lokasi: LokasiLama[] = [
    [40.7144, -74.006],
    [53.6458, -1.785]
]

// Cara penulisan tersebut menyebabkan Anda kesulitan untuk membedakan
// nilai garis lintang dan garis bujur, sehingga Anda biasanya akan
// menamai _tuple_ tersebut sebagai LintangBujur.

// Pada TypeScript versi 4.0, Anda dapat menulis:

type LokasiBaru = [lintang: number, bujur: number]

const lokasiBaru: LokasiBaru[] = [
    [52.3702, 4.8952],
    [53.3498, -6.2603]
]

// Nama-nama yang telah dinyatakan pada _tuple_ akan muncul
// di editor ketika Anda menyorot angka 0 dan 1 pada akhir
// baris selanjutnya.
const lintangPertama = lokasiBaru[0][0]
const bujurPertama = lokasiBaru[0][1]

// Walaupun terkesan sangat sederhana, tujuan utama dari fitur
// tersebut adalah menjamin bahwa informasi tidak hilang
// ketika bekerja dengan sistem tipe. Sebagai contoh, ketika
// mengekstrak parameter dari sebuah fungsi menggunakan
// tipe perkakas `Parameter`:

function pindahkanKeTengahPeta(bujur: number, lintang: number) { }

// Pada TypeScript versi 4.0, cara penulisan ini tetap
// menyimpan informasi bujur dan lintang.
type parameterPindahkanKeTengahPeta = Parameters<typeof pindahkanKeTengahPeta>

// Pada TypeScript versi 3.9, tipe di atas akan ditulis sebagai:
type parameterLamaPindahkanKeTengahPeta = [number, number]

// Hal tersebut membuat beberapa manipulasi tipe yang rumit
// kehilangan informasi mengenai informasi parameter.
