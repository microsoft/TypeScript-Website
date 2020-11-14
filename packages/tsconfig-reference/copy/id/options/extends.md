---
display: "Extends"
oneline: "Mewarisi opsi untuk TSConfig"
---

Nilai `extends` adalah string yang berisi jalur ke berkas konfigurasi lain untuk mewarisi.
Jalur tersebut mungkin menggunakan resolusi gaya Node.js.

Konfigurasi dari berkas dasar dimuat terlebih dahulu, kemudian diganti dengan yang ada di berkas konfigurasi pewarisan. Semua jalur relatif yang ditemukan di berkas konfigurasi akan diselesaikan secara relatif terhadap berkas konfigurasi tempat asalnya.

Perlu diperhatikan bahwa `files`,` include` dan `exclude` dari berkas konfigurasi yang mewarisi _overwrite_ yang berasal dari
berkas konfigurasi dasar, dan sirkularitas antara berkas konfigurasi tidak diperbolehkan.

Saat ini, satu-satunya properti tingkat atas yang dikecualikan dari warisan adalah [`referensi`](#references).

#### Contoh

`configs/base.json`:

```json tsconfig
{
  "compilerOptions": {
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

`tsconfig.json`:

```json tsconfig
{
  "extends": "./configs/base",
  "files": ["main.ts", "supplemental.ts"]
}
```

`tsconfig.nostrictnull.json`:

```json tsconfig
{
  "extends": "./tsconfig",
  "compilerOptions": {
    "strictNullChecks": false
  }
}
```

Properti dengan jalur relatif yang ditemukan di berkas konfigurasi, yang tidak dikecualikan dari warisan, akan diselesaikan secara relatif terhadap berkas konfigurasi tempat asalnya.
