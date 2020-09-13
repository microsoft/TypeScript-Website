---
display: "Raizes de Tipo"
oneline: "Locais onde o TypeScript deve buscar por definições de tipo"
---

Por padrão todos pacotes `@types` _visíveis_ são incluídos na sua compilação.
Pacotes em `node_modules/@types` de qualquer diretório adjacente são considerados _visíveis_.
Por exemplo, isso significa pacotes dentro de `./node_modules/@types/`, `../node_modules/@types/`, `../../node_modules/@types/`, e assim por diante.

Se `typeRoots` está especificado, _somente_ pacotes dentro de `typeRoots` serão incluídos. Por exemplo:

```json tsconfig
{
  "compilerOptions": {
    "typeRoots": ["./typings", "./vendor/types"]
  }
}
```

Este arquivo de configuração vai incluir _todos_ os pacotes definidos em `./typings` e `./vendor/types` , e nenhum pacote de `./node_modules/@types`.
Todo os caminhos são relativos ao arquivo `tsconfig.json`.
