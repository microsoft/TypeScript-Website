---
title: Resolução de módulos
layout: docs
permalink: /pt/docs/handbook/module-resolution.html
oneline: Como o TypeScript resolve módulos em JavaScript
translatable: true
---

> Esta seção assume alguns conhecimentos básicos sobre módulos.
> Por favor veja a documentação de [Modulos](/docs/handbook/modules.html) para mais informações.

_Module resolution_ é o processo que o compilador usa para descobrir a que se refere uma importação.
Considere uma declaração de importação como `import { a } from "moduleA"`;
a fim de verificar qualquer uso de `a`, o compilador precisa saber exatamente o que ele representa, e será necessário verificar sua definição `moduleA`.

Neste ponto, o compilador perguntará "qual é a forma do módulo `moduleA`?"
Embora isso pareça simples, `moduleA` poderia ser definido em um de seus próprios arquivos `.ts`/`.tsx`, ou em um arquivo `.d.ts` que seu código depende.

Primeiro, o compilador tentará localizar um arquivo que representa o módulo importado.
Para fazer isso, o compilador segue uma das duas estratégias diferentes: [Clássico](#classic) ou [Node](#node).
Essas estratégias dizem ao compilador _onde_ procurar por `moduleA`.

Se isso não funcionar e se o nome do módulo não for relativo (e no caso de `"moduleA"`, é relativo), então o compilador tentará localizar um [ambient module declaration](/docs/handbook/modules.html#ambient-modules).
Vamos cobrir as importações não relativas a seguir.

Finalmente, se o compilador não puder resolver o módulo, ele registrará um erro.
Nesse caso, o erro seria algo como `error TS2307: Cannot find module 'moduleA'.`

## Importações de módulos relativos vs. não relativos

As importações de módulo são resolvidas de forma diferente com base em se a referência do módulo é relativa ou não relativa.

Uma _importação relativa_ é aquela que começa com `/`, `./` ou `../`.
Alguns exemplos incluem:

- `import Entry from "./components/Entry";`
- `import { DefaultHeaders } from "../constants/http";`
- `import "/mod";`

Qualquer outra importação é considerada **não relativa**.
Alguns exemplos incluem:

- `import * as $ from "jquery";`
- `import { Component } from "@angular/core";`

Uma importação relativa é resolvida em relação ao arquivo de importação e _não pode_ ser resolvida para uma declaração de módulo de ambiente.
Você deve usar importações relativas para seus próprios módulos, que garantem manter sua localização relativa no tempo de execução.

Uma importação não relativa pode ser resolvida em relação ao `baseUrl`, ou por meio de mapeamento de caminho, que abordaremos a seguir.
Eles também podem resolver para [declarações do módulo ambiente](/docs/handbook/modules.html#ambient-modules).
Use caminhos não relativos ao importar qualquer uma de suas dependências externas.

## Estratégias de resolução de módulo

Existem duas estratégias de resolução de módulo possíveis: [Node](#node) e [Clássico](#classic).
Você pode usar a flag `--moduleResolution` para especificar a estratégia de resolução do módulo.
Se não for especificado, o padrão é [Node](#node) para `--module commonjs`, e [Clássico](#classic) para qualquer outra forma (incluso quando `--module` está configurado para `amd`, `system`, `umd`, `es2015`, `esnext`, etc.).

> Note: `node` A resolução do módulo é a mais comumente usada na comunidade TypeScript e é recomendada para a maioria dos projetos.
> Se você está tendo problemas de resolução com `import`s e `export`s em TypeScript, tente definir `moduleResolution: "node"` para ver se isso corrige o problema.

### Clássico

Essa costumava ser a estratégia de resolução padrão do TypeScript.
Atualmente, essa estratégia está presente principalmente para compatibilidade com versões anteriores.

Uma importação relativa será resolvida em relação ao arquivo de importação.
Então `import { b } from "./moduleB"` no arquivo `/root/src/folder/A.ts` resultaria nas seguintes pesquisas:

1. `/root/src/folder/moduleB.ts`
2. `/root/src/folder/moduleB.d.ts`

Para importações de móddulos não relativos, entretanto, o compilador sobe na árvore de diretórios começando com o diretório que contém o arquivo de importação, tentando localizar um arquivo de definição correspondente.

Por exemplo:

Uma importação não relativa para `moduleB` como `import { b } from "moduleB"`, no arquivo `/root/src/folder/A.ts`,resultaria na tentativa dos seguintes locais para localizar `"moduleB"`:

1. `/root/src/folder/moduleB.ts`
2. `/root/src/folder/moduleB.d.ts`
3. `/root/src/moduleB.ts`
4. `/root/src/moduleB.d.ts`
5. `/root/moduleB.ts`
6. `/root/moduleB.d.ts`
7. `/moduleB.ts`
8. `/moduleB.d.ts`

### Node

Esta estratégia de resolução tenta imitar o mecanismo de resolução do módulo em tempo de execução do [Node.js](https://nodejs.org/).
O algoritmo de resolução Node.js completo é descrito na [Documentação de módulos do Node.js ](https://nodejs.org/api/modules.html#modules_all_together).

#### Como o Node.js resolve os módulos

Para entender quais etapas o compilador TS seguirá, é importante 'iluminar' os módulos Node.js.
Tradicionalmente, as importações em Node.js são realizadas chamando uma função chamada `require`.
O comportamento do Node.js será diferente dependendo se `require` recebe um caminho relativo ou um caminho não relativo.

Os caminhos relativos são bastante simples.
Como exemplo, vamos considerar um arquivo localizado em `/root/src/moduleA.js`, que contém a importação `var x = require("./moduleB");`
Node.js resolve essa importação na seguinte ordem:

1. Pergunte ao arquivo chamado `/root/src/moduleB.js`, se existe.

2. Verifique se a pasta `/root/src/moduleB` contém um arquivo chamado `package.json` que especifica um módulo `"main"`.
   Em nosso exemplo, se o Node.js encontrar o arquivo `/root/src/moduleB/package.json` contendo `{ "main": "lib/mainModule.js" }`, então o Node.js vai referir-se a `/root/src/moduleB/lib/mainModule.js`.

3. Verifique se a pasta `/root/src/moduleB` contém um arquivo chamado `index.js`.
   Esse arquivo é implicitamente considerado o módulo "principal" dessa pasta.

Você pode ler mais sobre isso na documentação do Node.js disponível em [módulos de arquivo](https://nodejs.org/api/modules.html#modules_file_modules) e [módulos de pasta](https://nodejs.org/api/modules.html#modules_folders_as_modules).

No entanto, a resolução para um [nome do módulo não relativa](#relative-vs-não relativa-module-imports) é realizada de forma diferente.
O Node irá procurar seus módulos em pastas especiais chamadas `node_modules`.
Uma pasta `node_modules` pode estar no mesmo nível do arquivo atual, ou superior na cadeia de diretório.
O Node irá percorrer a cadeia de diretórios, olhando através de cada `node_modules` até encontrar o módulo que você tentou carregar.

Seguindo nosso exemplo acima, considere se `/root/src/moduleA.js` em vez disso usasse um caminho não relativa e tivesse a importação `var x = require("moduleB");`.
O Node tentaria resolver o `moduleB` para cada um dos locais até que um funcionasse.

1. `/root/src/node_modules/moduleB.js`
2. `/root/src/node_modules/moduleB/package.json` (se especifica uma propriedade `"main"`)
3. `/root/src/node_modules/moduleB/index.js`
   <br /><br />
4. `/root/node_modules/moduleB.js`
5. `/root/node_modules/moduleB/package.json` (se especifica uma propriedade `"main"`)
6. `/root/node_modules/moduleB/index.js`
   <br /><br />
7. `/node_modules/moduleB.js`
8. `/node_modules/moduleB/package.json` (se especifica uma propriedade `"main"`)
9. `/node_modules/moduleB/index.js`

Observe que o Node.js saltou para um diretório nas etapas (4) e (7).

Você pode ler mais sobre o processo na documentação do Node.js em [carregando módulos do `node_modules`](https://nodejs.org/api/modules.html#modules_loading_from_node_modules_folders).

#### Como o TypeScript resolve os módulos

O TypeScript irá imitar a estratégia de resolução de tempo de execução do Node.js para localizar arquivos de definição para módulos em tempo de compilação.
Para realizar isso, TypeScript sobrepõe as extensões de arquivo de origem do TypeScript (`.ts`, `.tsx`, and `.d.ts`) sobre a lógica de resolução do Node.
TypeScript também usará um campo em `package.json` chamado `"types"` para espelhar o propósito de `"main"` - o compilador irá usá-lo para encontrar o arquivo de definição "principal" para consultar.

Por exemplo, uma declaração de importação como `import { b } from "./moduleB"` em `/root/src/moduleA.ts` resultaria na tentativa dos seguintes locais para localizar `"./moduleB"`:

1. `/root/src/moduleB.ts`
2. `/root/src/moduleB.tsx`
3. `/root/src/moduleB.d.ts`
4. `/root/src/moduleB/package.json` (se especifica uma propriedade `"types"`)
5. `/root/src/moduleB/index.ts`
6. `/root/src/moduleB/index.tsx`
7. `/root/src/moduleB/index.d.ts`

Lembre-se de que o Node.js procurou um arquivo chamado `moduleB.js`, então um aplicável `package.json`, e então por um `index.js`.

Da mesma forma, uma importação não relativa seguirá a lógica de resolução do Node.js, primeiro procurando um arquivo, depois procurando uma pasta aplicável.
Então `import { b } from "moduleB"` no arquivo `/root/src/moduleA.ts` resultaria nas seguintes pesquisas:

1. `/root/src/node_modules/moduleB.ts`
2. `/root/src/node_modules/moduleB.tsx`
3. `/root/src/node_modules/moduleB.d.ts`
4. `/root/src/node_modules/moduleB/package.json` (se especifica uma propriedade `"types"`)
5. `/root/src/node_modules/@types/moduleB.d.ts`
6. `/root/src/node_modules/moduleB/index.ts`
7. `/root/src/node_modules/moduleB/index.tsx`
8. `/root/src/node_modules/moduleB/index.d.ts`
   <br /><br />
9. `/root/node_modules/moduleB.ts`
10. `/root/node_modules/moduleB.tsx`
11. `/root/node_modules/moduleB.d.ts`
12. `/root/node_modules/moduleB/package.json` (se especifica uma propriedade `"types"`)
13. `/root/node_modules/@types/moduleB.d.ts`
14. `/root/node_modules/moduleB/index.ts`
15. `/root/node_modules/moduleB/index.tsx`
16. `/root/node_modules/moduleB/index.d.ts`
    <br /><br />
17. `/node_modules/moduleB.ts`
18. `/node_modules/moduleB.tsx`
19. `/node_modules/moduleB.d.ts`
20. `/node_modules/moduleB/package.json` (se especifica uma propriedade `"types"`)
21. `/node_modules/@types/moduleB.d.ts`
22. `/node_modules/moduleB/index.ts`
23. `/node_modules/moduleB/index.tsx`
24. `/node_modules/moduleB/index.d.ts`

Não se assuste com o número de etapas aqui - o TypeScript ainda só pula os diretórios duas vezes nas etapas (9) e (17).
Isso realmente não é mais complexo do que o que o próprio Node.js está fazendo.

## Additional module resolution flags

A project source layout sometimes does not match that of the output.
Usually a set of build steps result in generating the final output.
These include compiling `.ts` files into `.js`, and copying dependencies from different source locations to a single output location.
The net result is that modules at runtime may have different names than the source files containing their definitions.
Or module paths in the final output may not match their corresponding source file paths at compile time.

The TypeScript compiler has a set of additional flags to _inform_ the compiler of transformations that are expected to happen to the sources to generate the final output.

It is important to note that the compiler will _not_ perform any of these transformations;
it just uses these pieces of information to guide the process of resolving a module import to its definition file.

### Base URL

Using a `baseUrl` is a common practice in applications using AMD module loaders where modules are "deployed" to a single folder at run-time.
The sources of these modules can live in different directories, but a build script will put them all together.

Setting `baseUrl` informs the compiler where to find modules.
All module imports with não relativa names are assumed to be relative to the `baseUrl`.

Value of _baseUrl_ is determined as either:

- value of _baseUrl_ command line argument (if given path is relative, it is computed based on current directory)
- value of _baseUrl_ property in 'tsconfig.json' (if given path is relative, it is computed based on the location of 'tsconfig.json')

Note that relative module imports are not impacted by setting the baseUrl, as they are always resolved relative to their importing files.

You can find more documentation on baseUrl in [RequireJS](http://requirejs.org/docs/api.html#config-baseUrl) and [SystemJS](https://github.com/systemjs/systemjs/blob/master/docs/api.md#baseurl) documentation.

### Path mapping

Sometimes modules are not directly located under _baseUrl_.
For instance, an import to a module `"jquery"` would be translated at runtime to `"node_modules/jquery/dist/jquery.slim.min.js"`.
Loaders use a mapping configuration to map module names to files at run-time, see [RequireJs documentation](http://requirejs.org/docs/api.html#config-paths) and [SystemJS documentation](https://github.com/systemjs/systemjs/blob/master/docs/config-api.md#paths).

The TypeScript compiler supports the declaration of such mappings using `"paths"` property in `tsconfig.json` files.
Here is an example for how to specify the `"paths"` property for `jquery`.

```json tsconfig
{
  "compilerOptions": {
    "baseUrl": ".", // This must be specified if "paths" is.
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"] // This mapping is relative to "baseUrl"
    }
  }
}
```

Please notice that `"paths"` are resolved relative to `"baseUrl"`.
When setting `"baseUrl"` to another value than `"."`, i.e. the directory of `tsconfig.json`, the mappings must be changed accordingly.
Say, you set `"baseUrl": "./src"` in the above example, then jquery should be mapped to `"../node_modules/jquery/dist/jquery"`.

Using `"paths"` also allows for more sophisticated mappings including multiple fall back locations.
Consider a project configuration where only some modules are available in one location, and the rest are in another.
A build step would put them all together in one place.
The project layout may look like:

```tree
projectRoot
├── folder1
│   ├── file1.ts (imports 'folder1/file2' and 'folder2/file3')
│   └── file2.ts
├── generated
│   ├── folder1
│   └── folder2
│       └── file3.ts
└── tsconfig.json
```

The corresponding `tsconfig.json` would look like:

```json tsconfig
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "*": ["*", "generated/*"]
    }
  }
}
```

This tells the compiler for any module import that matches the pattern `"*"` (i.e. all values), to look in two locations:

1.  `"*"`: meaning the same name unchanged, so map `<moduleName>` => `<baseUrl>/<moduleName>`
2.  `"generated/*"` meaning the module name with an appended prefix "generated", so map `<moduleName>` => `<baseUrl>/generated/<moduleName>`

Following this logic, the compiler will attempt to resolve the two imports as such:

import 'folder1/file2':

1.  pattern '\*' is matched and wildcard captures the whole module name
2.  try first substitution in the list: '\*' -> `folder1/file2`
3.  result of substitution is não relativa name - combine it with _baseUrl_ -> `projectRoot/folder1/file2.ts`.
4.  File exists. Done.

import 'folder2/file3':

1.  pattern '\*' is matched and wildcard captures the whole module name
2.  try first substitution in the list: '\*' -> `folder2/file3`
3.  result of substitution is não relativa name - combine it with _baseUrl_ -> `projectRoot/folder2/file3.ts`.
4.  File does not exist, move to the second substitution
5.  second substitution 'generated/\*' -> `generated/folder2/file3`
6.  result of substitution is não relativa name - combine it with _baseUrl_ -> `projectRoot/generated/folder2/file3.ts`.
7.  File exists. Done.

### Virtual Directories with `rootDirs`

Sometimes the project sources from multiple directories at compile time are all combined to generate a single output directory.
This can be viewed as a set of source directories create a "virtual" directory.

Using 'rootDirs', you can inform the compiler of the _roots_ making up this "virtual" directory;
and thus the compiler can resolve relative modules imports within these "virtual" directories _as if_ were merged together in one directory.

For example consider this project structure:

```tree
 src
 └── views
     └── view1.ts (imports './template1')
     └── view2.ts

 generated
 └── templates
         └── views
             └── template1.ts (imports './view2')
```

Files in `src/views` are user code for some UI controls.
Files in `generated/templates` are UI template binding code auto-generated by a template generator as part of the build.
A build step will copy the files in `/src/views` and `/generated/templates/views` to the same directory in the output.
At run-time, a view can expect its template to exist next to it, and thus should import it using a relative name as `"./template"`.

To specify this relationship to the compiler, use`"rootDirs"`.
`"rootDirs"` specify a list of _roots_ whose contents are expected to merge at run-time.
So following our example, the `tsconfig.json` file should look like:

```json tsconfig
{
  "compilerOptions": {
    "rootDirs": ["src/views", "generated/templates/views"]
  }
}
```

Every time the compiler sees a relative module import in a subfolder of one of the `rootDirs`, it will attempt to look for this import in each of the entries of `rootDirs`.

The flexibility of `rootDirs` is not limited to specifying a list of physical source directories that are logically merged. The supplied array may include any number of ad hoc, arbitrary directory names, regardless of whether they exist or not. This allows the compiler to capture sophisticated bundling and runtime features such as conditional inclusion and project specific loader plugins in a type safe way.

Consider an internationalization scenario where a build tool automatically generates locale specific bundles by interpolating a special path token, say `#{locale}`, as part of a relative module path such as `./#{locale}/messages`. In this hypothetical setup the tool enumerates supported locales, mapping the abstracted path into `./zh/messages`, `./de/messages`, and so forth.

Assume that each of these modules exports an array of strings. For example `./zh/messages` might contain:

```ts
export default ["您好吗", "很高兴认识你"];
```

By leveraging `rootDirs` we can inform the compiler of this mapping and thereby allow it to safely resolve `./#{locale}/messages`, even though the directory will never exist. For example, with the following `tsconfig.json`:

```json tsconfig
{
  "compilerOptions": {
    "rootDirs": ["src/zh", "src/de", "src/#{locale}"]
  }
}
```

The compiler will now resolve `import messages from './#{locale}/messages'` to `import messages from './zh/messages'` for tooling purposes, allowing development in a locale agnostic manner without compromising design time support.

## Tracing module resolution

As discussed earlier, the compiler can visit files outside the current folder when resolving a module.
This can be hard when diagnosing why a module is not resolved, or is resolved to an incorrect definition.
Enabling the compiler module resolution tracing using `--traceResolution` provides insight in what happened during the module resolution process.

Let's say we have a sample application that uses the `typescript` module.
`app.ts` has an import like `import * as ts from "typescript"`.

```tree
│   tsconfig.json
├───node_modules
│   └───typescript
│       └───lib
│               typescript.d.ts
└───src
        app.ts
```

Invoking the compiler with `--traceResolution`

```shell
tsc --traceResolution
```

Results in an output such as:

```txt
======== Resolving module 'typescript' from 'src/app.ts'. ========
Module resolution kind is not specified, using 'NodeJs'.
Loading module 'typescript' from 'node_modules' folder.
File 'src/node_modules/typescript.ts' does not exist.
File 'src/node_modules/typescript.tsx' does not exist.
File 'src/node_modules/typescript.d.ts' does not exist.
File 'src/node_modules/typescript/package.json' does not exist.
File 'node_modules/typescript.ts' does not exist.
File 'node_modules/typescript.tsx' does not exist.
File 'node_modules/typescript.d.ts' does not exist.
Found 'package.json' at 'node_modules/typescript/package.json'.
'package.json' has 'types' field './lib/typescript.d.ts' that references 'node_modules/typescript/lib/typescript.d.ts'.
File 'node_modules/typescript/lib/typescript.d.ts' exist - use it as a module resolution result.
======== Module name 'typescript' was successfully resolved to 'node_modules/typescript/lib/typescript.d.ts'. ========
```

#### Things to look out for

- Name and location of the import

> ======== Resolving module **'typescript'** from **'src/app.ts'**. ========

- The strategy the compiler is following

> Module resolution kind is not specified, using **'NodeJs'**.

- Loading of types from npm packages

> 'package.json' has **'types'** field './lib/typescript.d.ts' that references 'node_modules/typescript/lib/typescript.d.ts'.

- Final result

> ======== Module name 'typescript' was **successfully resolved** to 'node_modules/typescript/lib/typescript.d.ts'. ========

## Using `--noResolve`

Normally the compiler will attempt to resolve all module imports before it starts the compilation process.
Every time it successfully resolves an `import` to a file, the file is added to the set of files the compiler will process later on.

The `--noResolve` compiler options instructs the compiler not to "add" any files to the compilation that were not passed on the command line.
It will still try to resolve the module to files, but if the file is not specified, it will not be included.

For instance:

#### app.ts

```ts
import * as A from "moduleA"; // OK, 'moduleA' passed on the command-line
import * as B from "moduleB"; // Error TS2307: Cannot find module 'moduleB'.
```

```shell
tsc app.ts moduleA.ts --noResolve
```

Compiling `app.ts` using `--noResolve` should result in:

- Correctly finding `moduleA` as it was passed on the command-line.
- Error for not finding `moduleB` as it was not passed.

## Common Questions

### Why does a module in the exclude list still get picked up by the compiler?

`tsconfig.json` turns a folder into a “project”.
Without specifying any `“exclude”` or `“files”` entries, all files in the folder containing the `tsconfig.json` and all its sub-directories are included in your compilation.
If you want to exclude some of the files use `“exclude”`, if you would rather specify all the files instead of letting the compiler look them up, use `“files”`.

That was `tsconfig.json` automatic inclusion.
That does not embed module resolution as discussed above.
If the compiler identified a file as a target of a module import, it will be included in the compilation regardless if it was excluded in the previous steps.

So to exclude a file from the compilation, you need to exclude it and **all** files that have an `import` or `/// <reference path="..." />` directive to it.
