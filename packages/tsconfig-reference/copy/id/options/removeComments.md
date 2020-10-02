---
display: "Menghapus Komentar"
oneline: "Menghapus Komentar di TypeScript sehingga tidak muncul di Javascript"
---

Menghapus semua komentar pada berkas Typescript pada saat mengkonversi ke berkas Javascript. Pengaturan bawaannya adalah `false`

Sebagai contoh, ini adalah berkas TypeScript yang memiliki komentar JSDoc:

```ts
/** Terjemahan dari 'Hello world' ke bahasa Portugis */
export const helloWorldPTBR = "Olá Mundo";
```

Ketika `removeComments` disetel ke `true`:

```ts twoslash
// @showEmit
// @removeComments: true
/** Terjemahan dari 'Hello world' ke bahasa Portugis */
export const helloWorldPTBR = "Olá Mundo";
```

Tanpa menyetel `removeComments` atau menjadikannya sebagai `false`:

```ts twoslash
// @showEmit
// @removeComments: false
/** Terjemahan dari 'Hello world' ke bahasa Portugis */
export const helloWorldPTBR = "Olá Mundo";
```

Artinya, komentar anda akan muncul di kode Javascript
