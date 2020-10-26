---
display: "No Implicit This"
oneline: "Menimbulkan kesalahan-kesalahan saat 'this' menjadi bertipe any"
---

Menimbulkan kesalahan kepada pernyataan 'this' dengan tersiratnya tipe 'any'.

Sebagai contoh, class dibawah ini mengembalikan suatu fungsi yang mencoba mengakses `this.width` dan `this.height` – tapi konteksnya
untuk `this` didalam fungsi yang didalam `getAreaFunction` ini, bukanlah instansi dari class Rectangle.

```ts twoslash
// @errors: 2683
class Rectangle {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  getAreaFunction() {
    return function() {
      return this.width * this.height;
    };
  }
}
```
