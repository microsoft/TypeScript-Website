---
display: "URL Base"
oneline: "Seta uma URL base para os nomes relativos de módulos"
---

Permite definir um diretório base para resolver nomes de módulo não absolutos.

Você pode definir uma pasta raiz na qual pode fazer a resolução absoluta do arquivo. Por exemplo.

```
URLBase
├── ex.ts
├── ola
│   └── mundo.ts
└── tsconfig.json
```

Com `"baseUrl": "./"` no projeto, o TypeScript vai procurar por arquivos começando na mesma pasta do `tsconfig.json`.

```ts
import { olaMundo } from "ola/mundo";

console.log(olaMundo);
```

Se você se cansar de importações sempre parecidas com `"../"` ou `"./"`. Ou precisando
alterar à medida que você move os arquivos, essa é uma ótima maneira de corrigir isso.
