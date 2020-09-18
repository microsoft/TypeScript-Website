---
display: "Base Url"
oneline: "Tetapkan baseurl untuk nama modul relatif"
---

Memungkinkan Anda menyetel direktori dasar untuk menyelesaikan nama modul dengan benar.

Anda dapat menentukan folder root di mana Anda dapat melakukan keputusan berkas yang sesungguhnya, misalnya :

```
baseUrl
├── ex.ts
├── hello
│   └── world.ts
└── tsconfig.json
```

Dengan `"baseUrl": "./"` di dalam proyek ini TypeScript akan mencari berkas yang dimulai dari folder yang sama dengan `tsconfig.json`.

```ts
import { helloWorld } from "hello/world";

console.log(helloWorld);
```

Jika Anda lelah cara impor selalu seperti `"../"` atau `"./"`. Atau harus untuk merubah saat Anda memindahkan berkas, ini adalah cara terbaik untuk memperbaikinya.
