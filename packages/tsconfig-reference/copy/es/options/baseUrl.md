---
display: "URL Base"
oneline: "Configura una URL base para los nombres de los módulos relativos"
---

Le permite establecer un directorio base para resolver nombres de módulos no absolutos.

Puede definir una carpeta raíz donde puede hacer la resolución absoluta de los archivos. Por ejemplo:

```
baseUrl
├── ex.ts
├── hello
│   └── world.ts
└── tsconfig.json
```

Con `"baseUrl": "./"` dentro de este proyecto, TypeScript TypeScript buscará los archivos que empiezan en la misma carpeta que el archivo `tsconfig.json`.

```ts
import { helloWorld } from "hello/world";

console.log(helloWorld);
```

Si te cansas de que las importaciones siempre se vean como `"../"` o `"./"`. o que necesiten cambiarse al mover los archivos, esta es una gran manera de arreglar eso.
