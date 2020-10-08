---
display: "Tipos"
oneline: "Utilizada para criar uma lista de tipos permitidos, a serem incluídos na compilação"
---

Por padrão todos pacotes `@types` _visíveis_ são incluídos na sua compilação.
Pacotes em `node_modules/@types` de qualquer diretório adjacente são considerados _visíveis_.
Por exemplo, isso significa pacotes dentro de `./node_modules/@types/`, `../node_modules/@types/`, `../../node_modules/@types/`, e assim por diante.

Se `types` está especificado, somente pacotes listados serão incluídos no escopo global. Por exemplo:

```json tsconfig
{
  "compilerOptions": {
    "types": ["node", "jest", "express"]
  }
}
```

Este arquivo `tsconfig.json` _somente_ irá incluir `./node_modules/@types/node`, `./node_modules/@types/jest` e `./node_modules/@types/express`.
Outros pacotes dentro de `node_modules/@types/*` não serão incluídos.

### O que isto reflete?

Esta opção não altera como `@types/*` são incluídos no código da sua aplicação, por exemplo se você tivesse o `compilerOptions` acima, com o seguinte código:

```ts
import * as moment from "moment";

moment().format("MMMM Do YYYY, h:mm:ss a");
```

O import `moment` estaria completamente tipado.

Quando você tem esta opção definida, ao não incluir um módulo no vetor de `types`, ela:

- Não vai adicionar globais ao seu projeto (p. ex. `process` no node, ou `expect` no Jest)
- Não vai fazer com que exports apareçam como recomendações de auto-import

Esta opção difere de [`typeRoots`](#typeRoots), pois serve para especificar somente os tipos exatos a serem incluídos, enquanto [`typeRoots`](#typeRoots) permite que você defina diretórios específicos.
