---
display: "Izinkan Kode Tak Terjangkau"
oneline: "Galat ketika kode tidak akan pernah dipanggil"
---

Kapan:

- `undefined` _default_ memberikan saran sebagai peringatan kepada editor
- `true` kode yang tidak dapat dijangkau diabaikan
- `false` menimbulkan galat kompiler tentang kode yang tidak dapat dijangkau

Peringatan ini hanya tentang kode yang terbukti tidak dapat dijangkau karena penggunaan sintaks JavaScript, misalnya:

```ts
function fn(n: number) {
  if (n > 5) {
    return true;
  } else {
    return false;
  }
  return true;
}
```

Dengan `"allowUnreachableCode": false`:

```ts twoslash
// @errors: 7027
// @allowUnreachableCode: false
function fn(n: number) {
  if (n > 5) {
    return true;
  } else {
    return false;
  }
  return true;
}
```

Ini tidak mempengaruhi galat atas dasar kode yang _muncul_ menjadi tidak dapat dijangkau karena menggolongkan uraian.
