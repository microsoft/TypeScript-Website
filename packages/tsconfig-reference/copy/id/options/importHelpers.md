---
display: "Import Helpers"
oneline: "Izinkan mengimpor fungsi penunjang satu kali per proyek, termasuk menyertakan per-berkas"
---

Untuk operasi penurunan tingkat tertentu, TypeScript menggunakan beberapa kode penunjang untuk operasi seperti memperluas kelas, himpunan(spread) susunan atau objek, dan menyambungkan operasi.
Secara umum, penunjang ini dimasukkan ke dalam berkas yang menggunakannya.
Ini dapat mengakibatkan duplikasi kode jika penunjang yang sama digunakan di banyak berkas yang berbeda.

Jika `importHelpers` kode ini aktif, fungsi penunjang ini diimpor dari [tslib](https://www.npmjs.com/package/tslib) modul.
Anda perlu memastikan bahwa berkas `tslib` modul dapat diimpor saat dijalankan.
Ini hanya mempengaruhi modul, berkas kode tidak akan mencoba mengimpor modul.

Misalnya, dengan TypeScript:

```ts
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

Memasang [`downlevelIteration`](#downlevelIteration) dan `importHelpers` masih salah:

```ts twoslash
// @showEmit
// @target: ES5
// @downleveliteration
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

Lalu aktifkan keduanya [`downlevelIteration`](#downlevelIteration) dan `importHelpers`:

```ts twoslash
// @showEmit
// @target: ES5
// @downleveliteration
// @importhelpers
// @noErrors
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

Anda bisa menggunakan [`noEmitHelpers`](#noEmitHelpers) saat menyediakan implementasi untuk fungsi-fungsi ini.
