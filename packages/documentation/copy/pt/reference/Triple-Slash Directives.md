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

O processo começa com um conjunto de _arquivos raíz_ ;
esses são os nomes de arquivo especificados na linha de comando ou na lista `"files"` do arquivo `tsconfig.json`.
Esses arquivos raízes são pré-processados ​​na mesma ordem em que são especificados.
Antes de um arquivo ser adicionado à lista, todas as referências de barra tripla nele são processadas e seus destinos incluídos.
As referências de barra tripla são resolvidas primeiro em profundidade, na ordem em que foram vistas no arquivo.

Um caminho de referência de barra tripla é resolvido em relação ao arquivo que o contém, se não tiver raiz.

### Errors

It is an error to reference a file that does not exist.
It is an error for a file to have a triple-slash reference to itself.

### Using `--noResolve`

If the compiler flag `--noResolve` is specified, triple-slash references are ignored; they neither result in adding new files, nor change the order of the files provided.

## `/// <reference types="..." />`

Similar to a `/// <reference path="..." />` directive, which serves as a declaration of _dependency_, a `/// <reference types="..." />` directive declares a dependency on a package.

The process of resolving these package names is similar to the process of resolving module names in an `import` statement.
An easy way to think of triple-slash-reference-types directives are as an `import` for declaration packages.

For example, including `/// <reference types="node" />` in a declaration file declares that this file uses names declared in `@types/node/index.d.ts`;
and thus, this package needs to be included in the compilation along with the declaration file.

Use these directives only when you're authoring a `d.ts` file by hand.

For declaration files generated during compilation, the compiler will automatically add `/// <reference types="..." />` for you;
A `/// <reference types="..." />` in a generated declaration file is added _if and only if_ the resulting file uses any declarations from the referenced package.

For declaring a dependency on an `@types` package in a `.ts` file, use `--types` on the command line or in your `tsconfig.json` instead.
See [using `@types`, `typeRoots` and `types` in `tsconfig.json` files](/docs/handbook/tsconfig-json.html#types-typeroots-and-types) for more details.

## `/// <reference lib="..." />`

This directive allows a file to explicitly include an existing built-in _lib_ file.

Built-in _lib_ files are referenced in the same fashion as the `"lib"` compiler option in _tsconfig.json_ (e.g. use `lib="es2015"` and not `lib="lib.es2015.d.ts"`, etc.).

For declaration file authors who rely on built-in types, e.g. DOM APIs or built-in JS run-time constructors like `Symbol` or `Iterable`, triple-slash-reference lib directives are recommended. Previously these .d.ts files had to add forward/duplicate declarations of such types.

For example, adding `/// <reference lib="es2017.string" />` to one of the files in a compilation is equivalent to compiling with `--lib es2017.string`.

```ts
/// <reference lib="es2017.string" />

"foo".padStart(4);
```

## `/// <reference no-default-lib="true"/>`

This directive marks a file as a _default library_.
You will see this comment at the top of `lib.d.ts` and its different variants.

This directive instructs the compiler to _not_ include the default library (i.e. `lib.d.ts`) in the compilation.
The impact here is similar to passing `--noLib` on the command line.

Also note that when passing `--skipDefaultLibCheck`, the compiler will only skip checking files with `/// <reference no-default-lib="true"/>`.

## `/// <amd-module />`

By default AMD modules are generated anonymous.
This can lead to problems when other tools are used to process the resulting modules, such as bundlers (e.g. `r.js`).

The `amd-module` directive allows passing an optional module name to the compiler:

##### amdModule.ts

```ts
///<amd-module name="NamedModule"/>
export class C {}
```

Will result in assigning the name `NamedModule` to the module as part of calling the AMD `define`:

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

> **Note**: this directive has been deprecated. Use `import "moduleName";` statements instead.

`/// <amd-dependency path="x" />` informs the compiler about a non-TS module dependency that needs to be injected in the resulting module's require call.

The `amd-dependency` directive can also have an optional `name` property; this allows passing an optional name for an amd-dependency:

```ts
/// <amd-dependency path="legacy/moduleA" name="moduleA"/>
declare var moduleA: MyType;
moduleA.callStuff();
```

Generated JS code:

```js
define(["require", "exports", "legacy/moduleA"], function (
  require,
  exports,
  moduleA
) {
  moduleA.callStuff();
});
```
