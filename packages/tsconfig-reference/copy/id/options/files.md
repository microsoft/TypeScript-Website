---
display: "Files"
oneline: "Sertakan daftar berkas, tidak mendukung globs"
---

Menentukan daftar berkas yang diijinkan untuk disertakan dalam program. Kesalahan terjadi jika salah satu berkas tidak dapat ditemukan.

```json tsconfig
{
  "compilerOptions": {},
  "files": [
    "core.ts",
    "sys.ts",
    "types.ts",
    "scanner.ts",
    "parser.ts",
    "utilities.ts",
    "binder.ts",
    "checker.ts",
    "tsc.ts"
  ]
}
```

Ini berguna ketika Anda hanya memiliki sejumlah berkas kecil dan tidak perlu menggunakan _glob_ untuk mereferensikan banyak berkas.
Jika Anda membutuhkannya, gunakan [`include`](#include).
