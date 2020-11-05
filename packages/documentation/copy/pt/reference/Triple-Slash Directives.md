---
title: Diretivas de barra tripla
layout: docs
permalink: /pt/docs/handbook/triple-slash-directives.html
oneline: Como usar diretivas de barra tripla no TypeScript
translatable: true
---

As diretivas de barra tripla são comentários de uma única linha contendo uma única tag XML. O conteúdo do comentário é usado como diretivas do compilador.

As diretivas de barra tripla são válidas **apenas** na parte superior do arquivo que as contém. Uma diretiva de barra tripla só pode ser precedida por comentários de uma ou várias linhas, incluindo outras diretivas de barra tripla. Se forem encontrados após uma declaração ou declaração, serão tratados como comentários regulares de uma única linha e não terão nenhum significado especial.

## `/// <reference path="..." />`

A diretiva `/// <reference path="..." />` é a mais comum desse grupo.
Ela serve como uma declaração de _dependência_ entre arquivos.

As referências de barra tripla instruem o compilador a incluir arquivos adicionais no processo de compilação.

Elas também servem como um método para ordenar a saída ao usar `--out` ou `--outFile`.
Os arquivos são emitidos para o local do arquivo de saída na mesma ordem da entrada após a passagem de pré-processamento.

### Arquivos de pré-processamento de entrada

O compilador executa uma passagem de pré-processamento nos arquivos de entrada para resolver todas as diretivas de referência de barra tripla. Durante este processo, arquivos adicionais são adicionados à compilação.

O processo começa com um conjunto de _arquivos raizes_ ;
esses são os nomes de arquivo especificados na linha de comando ou na lista `"files"` do arquivo `tsconfig.json`.
Esses arquivos raizes são pré-processados ​​na mesma ordem em que são especificados.
Antes de um arquivo ser adicionado à lista, todas as referências de barra tripla nele são processadas e seus destinos incluídos.
As referências de barra tripla são resolvidas primeiro em profundidade, na ordem em que foram vistas no arquivo.

Um caminho de referência de barra tripla é resolvido em relação ao arquivo que o contém, se não tiver raiz.

### Erros

É um erro fazer referência a um arquivo que não existe.
É um erro um arquivo ter uma referência de barra tripla a si mesmo.

### Usando `--noResolve`

Se a flag do compilador `--noResolve` for especificada, as referências de barra tripla serão ignoradas; elas não resultam na adição de novos arquivos, nem alteram a ordem dos arquivos fornecidos.

## `/// <reference types="..." />`

Semelhante à uma diretiva `/// <reference path="..." />`, que serve como uma declaração de _dependência_ , uma diretiva `/// <reference types="..." />` declara uma dependência em um pacote.

O processo de resolução desses nomes de pacote é semelhante ao processo de resolução de nomes de módulo em uma instrução `import`.
Uma maneira fácil de pensar em diretivas de tipos de referência de barra tripla é como um `import` para declaração de pacotes.

Por exemplo, incluir `/// <reference types="node" />` em um arquivo de declaração declara que esse arquivo usa nomes declarados em `@types/node/index.d.ts`;
e, portanto, este pacote precisa ser incluído na compilação junto com o arquivo de declaração.

Use essas diretivas apenas quando estiver criando um arquivo `d.ts` manualmente.

Para arquivos de declaração gerados durante a compilação, o compilador adicionará automaticamente `/// <reference types="..." />` para você;
Um `/// <reference types="..." />` em um arquivo de declaração gerado é adicionado _se e se somente se_ o arquivo resultante usar qualquer declaração do pacote referenciado.

Para declarar uma dependência de um `@types` pacote em um arquivo `.ts`, use `--types` na linha de comando ou em seu arquivo `tsconfig.json`.
veja [usando `@types`, `typeRoots` e `types` em arquivos `tsconfig.json`](/docs/handbook/tsconfig-json.html#types-typeroots-and-types) para mais detalhes.

## `/// <reference lib="..." />`

Esta diretiva permite que um arquivo inclua explicitamente um arquivo _lib_ integrado existente.

Os arquivos _lib_ integrados são referenciados da mesma maneira que a opção `"lib"` do compilador em _tsconfig.json_ (e.g. use `lib="es2015"` e não `lib="lib.es2015.d.ts"`, etc.).

Para autores de arquivos de declaração que dependem de tipos integrados, por exemplo, APIs DOM ou construtores de tempo de execução JS integrados como `Symbol` ou `Iterable`, diretivas lib de referência de barra tripla são recomendadas. Anteriormente, esses arquivos .d.ts tinham que adicionar declarações de forward/duplicate desses tipos.

Por exemplo, adicionar `/// <reference lib="es2017.string" />` a um dos arquivos em uma compilação é equivalente a compilar com `--lib es2017.string`.

```ts
/// <reference lib="es2017.string" />

"foo".padStart(4);
```

## `/// <reference no-default-lib="true"/>`

Esta diretiva marca um arquivo como uma _biblioteca padrão_.
Você verá este comentário na parte superior `lib.d.ts` e suas diferentes variantes.

Esta diretiva instrui o compilador a não incluir a biblioteca padrão (ou seja, `lib.d.ts`) na compilação.
O impacto aqui é semelhante a passar `--noLib` na linha de comando.

Observe também que, ao passar `--skipDefaultLibCheck`, o compilador só irá ignorar a verificação de arquivos com `/// <reference no-default-lib="true"/>`.

## `/// <amd-module />`

Por padrão, os módulos AMD são gerados anônimos.
Isso pode levar a problemas quando outras ferramentas são usadas para processar os módulos resultantes, como bundlers (por exemplo `r.js`).

A diretiva `amd-module` permite passar um nome de módulo opcional para o compilador:

##### amdModule.ts

```ts
///<amd-module name="NamedModule"/>
export class C {}
```

Resultará na atribuição do nome `NamedModule` ao módulo como parte da chamada do AMD `define`:

##### amdModule.js

```js
define("NamedModule", ["require", "exports"], function (require, exports) {
  var C = (function () {
    function C() {}
    return C;
  })();
  exports.C = C;
});
```

## `/// <amd-dependency />`

> **Note**: esta diretiva foi descontinuada. Use `import "moduleName";` em vez disso.

`/// <amd-dependency path="x" />` informa o compilador sobre uma dependência do módulo não-TS que precisa ser injetada na chamada de requerimento do módulo resultante.

A diretiva `amd-dependency` também pode ter uma propriedade `name`; isso permite passar um nome opcional para uma `amd-dependency`:

```ts
/// <amd-dependency path="legacy/moduleA" name="moduleA"/>
declare var moduleA: MyType;
moduleA.callStuff();
```

Código JS gerado:

```js
define(["require", "exports", "legacy/moduleA"], function (
  require,
  exports,
  moduleA
) {
  moduleA.callStuff();
});
```
