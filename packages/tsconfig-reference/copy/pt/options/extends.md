---
display: "Estender"
oneline: "Permite herança das opções de outro arquivo TSConfig"
---

O valor de `extends` é uma _string_ que contém o caminho para outro arquivo de configuração do qual ele herdará.
O caminho pode usar o estilo de resolução do Node.Js

A configuração do aquivo base é carregada primeiro, e então sobrescrita por aquelas presentes no arquivo de configuração herdado. Todos os caminhos relativos encontrados no arquivo de configuração serão resolvidos relativamente ao arquivo de configuração em que estes se originaram.

Vale notar que `files`, `include` e `exclude` da configuração que está sendo estendida _sobrescreve_ aquelas definidas na configuração base, e circularidade entre arquivos de configuração não é permitida.

Atualmente, a única propriedade de _top-level_ que é excluída da herança é [`references`](#references).

##### Exemplo

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

Propriedades com caminhos relativos encontrados no arquivo de configuração, e que não sejam excluídas da herança, serão resolvidos relativamente ao arquivo de configuração em que estas se originaram.
