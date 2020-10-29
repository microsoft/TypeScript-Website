---
display: "Types"
oneline: "Digunakan untuk membuat sebuah daftar kumpulan tipe yang diizinkan untuk diikutsertakan pada kompilasi"
---

Secara _default_, semua _visible package_ "`@types`" diikutsertakan dalam kompilasi Anda.
*Package* dalam `node_modules/@types` yang terletak dalam folder lain dianggap sebagai _visible_.
Sebagai contoh, *package* yang berada di `./node_modules/@types/`, `../node_modules/@types/`, `../../node_modules/@types/`, dan seterusnya dianggap sebagai _visible_.

Jika `types` telah ditentukan, hanya *package* yang didaftarkan yang akan disertakan pada lingkup global, misalnya:

```json tsconfig
{
  "compilerOptions": {
    "types": ["node", "jest", "express"]
  }
}
```

Berkas `tsconfig.json` ini hanya akan menyertakan `./node_modules/@types/node`, `./node_modules/@types/jest` dan `./node_modules/@types/express`.
*Package* lainnya di bawah direktori `node_modules/@types/*` tidak akan diikutsertakan.

### Apa dampaknya?

Opsi ini tidak memengaruhi bagaimana `@types/*` diikutsertakan dalam kode aplikasi Anda, Sebagai contoh, apabila Anda memiliki `compilerOptions` seperti di pada contoh di atas dan kode seperti berikut:

```ts
import * as moment from "moment";

moment().format("MMMM Do YYYY, h:mm:ss a");
```

Import `moment` akan sepenuhnya diketik.

Ketika Anda memiliki opsi ini pada pengaturan tanpa menyertakan sebuah modul dalam _array_ `types`, maka:
- _globals_ tidak akan ditambahkan ke dalam proyek Anda (contoh: `process` pada node atau `expect` pada Jest)
- Ekspor tidak akan muncul sebagai rekomendasi _auto-import_

Pengaturan pada fitur ini hanya tentang menentukan `types` yang ingin Anda sertakan, sedangkan [`typeRoots`](#typeRoots) mendukung apabila Anda hanya menginginkan folder-folder tertentu saja.
