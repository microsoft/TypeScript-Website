---
title: Resolução de módulos
layout: docs
permalink: /pt/docs/handbook/module-resolution.html
oneline: Como o TypeScript resolve módulos em JavaScript
translatable: true
---

> Esta seção assume alguns conhecimentos básicos sobre módulos.
> Por favor veja a documentação de [Modulos](/docs/handbook/modules.html) para mais informações.

_Resolução de Módulos_ (ou _Module Resolution_) é o processo que o compilador usa para descobrir a que se refere uma importação.
Considere uma declaração de importação como `import { a } from "moduleA"`;
a fim de verificar qualquer uso de `a`, o compilador precisa saber exatamente o que ele representa, e será necessário verificar sua definição `moduleA`.

Neste ponto, o compilador perguntará "qual é a forma do módulo `moduleA`?"
Embora isso pareça simples, `moduleA` poderia ser definido em um de seus próprios arquivos `.ts`/`.tsx`, ou em um arquivo `.d.ts` que seu código depende.

Primeiro, o compilador tentará localizar um arquivo que representa o módulo importado.
Para fazer isso, o compilador segue uma das duas estratégias diferentes: [Clássico](#classico) ou [Node](#node).
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

Existem duas estratégias de resolução de módulo possíveis: [Node](#node) e [Clássico](#classico).
Você pode usar a flag `--moduleResolution` para especificar a estratégia de resolução do módulo.
Se não for especificado, o padrão é [Node](#node) para `--module commonjs`, e [Clássico](#classico) para qualquer outra forma (incluso quando `--module` está configurado para `amd`, `system`, `umd`, `es2015`, `esnext`, etc.).

> Note: `node` A resolução do módulo é a mais comumente usada na comunidade TypeScript e é recomendada para a maioria dos projetos.
> Se você está tendo problemas de resolução com `import`s e `export`s em TypeScript, tente definir `moduleResolution: "node"` para ver se isso corrige o problema.

### Clássico

Essa costumava ser a estratégia de resolução padrão do TypeScript.
Atualmente, essa estratégia está presente principalmente para compatibilidade com versões anteriores.

Uma importação relativa será resolvida em relação ao arquivo de importação.
Então `import { b } from "./moduleB"` no arquivo `/root/src/folder/A.ts` resultaria nas seguintes pesquisas:

1. `/root/src/folder/moduleB.ts`
2. `/root/src/folder/moduleB.d.ts`

Para importações de módulos não relativos, entretanto, o compilador sobe na árvore de diretórios começando com o diretório que contém o arquivo de importação, tentando localizar um arquivo de definição correspondente.

Por exemplo:

Uma importação não relativa para `moduleB` como `import { b } from "moduleB"`, no arquivo `/root/src/folder/A.ts`, resultaria na tentativa dos seguintes locais para localizar `"moduleB"`:

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

Para entender quais etapas o compilador TS seguirá, é importante explicar como funciona os módulos Node.js.
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

No entanto, a resolução para um [nome do módulo não relativa](#importacoes-de-modulos-relativos-vs.-nao-relativos) é realizada de forma diferente.
O Node irá procurar seus módulos em pastas especiais chamadas `node_modules`.
Uma pasta `node_modules` pode estar no mesmo nível do arquivo atual, ou superior na cadeia de pastas.
O Node irá percorrer a cadeia de diretórios, olhando através de cada `node_modules` até encontrar o módulo que você tentou carregar.

Seguindo nosso exemplo acima, considere se `/root/src/moduleA.js` em vez disso usasse um caminho não relativo e tivesse a importação `var x = require("moduleB");`.
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
TypeScript também usará um campo no `package.json` chamado `"types"` para espelhar o propósito de `"main"` - o compilador irá usá-lo para encontrar o arquivo de definição "principal" para consultar.

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

## Flags de resolução de módulo adicional

Um layout de origem do projeto às vezes não corresponde ao da saída.
Normalmente, um conjunto de etapas de construção resulta na geração da saída final.
Isso inclui compilar arquivos `.ts` em `.js` e copiar dependências de diferentes locais de origem para um único local de saída.
O resultado final é que os módulos em tempo de execução podem ter nomes diferentes dos arquivos de origem que contêm suas definições.
Ou os caminhos do módulo na saída final podem não corresponder aos caminhos do arquivo de origem correspondente no momento da compilação.

O compilador TypeScript tem um conjunto de sinalizadores adicionais para _informar_ o compilador de transformações que devem ocorrer nas fontes para gerar a saída final.

É importante observar que o compilador _não_ executará nenhuma dessas transformações;
Ele apenas usa essas informações para guiar o processo de resolução de uma importação de módulo para seu arquivo de definição.

### URL base

Usar um `baseUrl` é uma prática comum em aplicativos que usam carregadores de módulo AMD onde os módulos são "deployados" em uma única pasta em tempo de execução.
As fontes desses módulos podem estar em diretórios diferentes, mas um script de construção irá colocá-los todos juntos.

Definir `baseUrl` informa ao compilador onde encontrar os módulos.
Todas as importações de módulos com nomes não relativos são consideradas relativas ao `baseUrl`.

O valor de _baseUrl_ é determinado como:

- valor do argumento da linha de comando _baseUrl_ (se o caminho fornecido for relativo, é calculado com base no diretório atual)
- valor da propriedade _baseUrl_ em 'tsconfig.json' (se o caminho fornecido for relativo, ele é calculado com base na localização de 'tsconfig.json')

Observe que as importações de módulos relativos não são afetadas pela configuração de baseUrl, pois elas sempre são resolvidas em relação aos arquivos de importação.

Você pode encontrar mais documentação sobre baseUrl em [RequireJS](http://requirejs.org/docs/api.html#config-baseUrl) e [SystemJS](https://github.com/systemjs/systemjs/blob/master/docs/api.md).

### Mapeamento de caminhos

Às vezes, os módulos não estão localizados diretamente em _baseUrl_.
Por exemplo, uma importação para um módulo `"jquery"` seria traduzido em tempo de execução para `"node_modules/jquery/dist/jquery.slim.min.js"`.
Os carregadores usam uma configuração de mapeamento para mapear nomes de módulos para arquivos em tempo de execução, consulte a [documentação do RequireJs](http://requirejs.org/docs/api.html#config-paths) e a [documentação do SystemJS](https://github.com/systemjs/systemjs/blob/master/docs/import-maps.md).

O compilador TypeScript suporta a declaração de tais mapeamentos usando a propriedade `"paths"` nos arquivos `tsconfig.json`.
Aqui está um exemplo de como especificar a propriedade `"paths"` para `jquery`.

```json tsconfig
{
  "compilerOptions": {
    "baseUrl": ".", // Deve ser especificado se "caminhos" for .
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"] // Este mapeamento é relativo a "baseUrl"
    }
  }
}
```

Observe que `"paths"` são resolvidos relativamente a `"baseUrl"`.
Ao definir`"baseUrl"` para outro valor que não `"."`, ou seja, o diretório de `tsconfig.json`, os mapeamentos devem ser alterados de acordo.
Digamos que, você define `"baseUrl": "./src"` no exemplo acima, então jquery deve ser mapeado para `"../node_modules/jquery/dist/jquery"`.

Usando `"paths"` também permite mapeamentos mais sofisticados, incluindo vários locais de fallback.
Considere uma configuração de projeto em que apenas alguns módulos estão disponíveis em um local e o restante em outro.
Uma etapa de construção iria colocá-los todos juntos em um só lugar.
O layout do projeto pode ser semelhante a:

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

O correspondente `tsconfig.json` pareceria com:

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

Isso diz ao compilador para qualquer importação de módulo que corresponda ao padrão `"*"` (ou seja, todos os valores), para olhar em dois locais:

1.  `"*"`: significando o mesmo nome inalterado, então mapear `<moduleName>` => `<baseUrl>/<moduleName>`
2.  `"generated/*"` significando o nome do módulo com um prefixo anexado "gerado", então mapear `<moduleName>` => `<baseUrl>/generated/<moduleName>`

Seguindo essa lógica, o compilador tentará resolver as duas importações como tais:

import 'folder1/file2':

1.  o padrão '\*' é correspondido e o curinga captura todo o nome do módulo
2.  tente a primeira substituição na lista: '\*' -> `folder1/file2`
3.  resultado da substituição é nome não relativo - combiná-lo com _baseUrl_ -> `projectRoot/folder1/file2.ts`.
4.  O arquivo existe. Feito.

import 'folder2/file3':

1.  pattern '\*' is matched and wildcard captures the whole module name
2.  tente a primeira substituição na lista: '\*' -> `folder2/file3`
3.  resultado da substituição é nome não relativo - combiná-lo com _baseUrl_ -> `projectRoot/folder2/file3.ts`.
4.  Arquivo não existe, passar para a segunda substituição
5.  segunda substituição 'gerada/\*' -> `generated/folder2/file3`
6.  resultado da substituição é nome não relativo - combiná-lo com _baseUrl_ -> `projectRoot/generated/folder2/file3.ts`.
7.  O arquivo existe. Feito.

### Diretórios virtuais com `rootDirs`

Às vezes, os fontes do projeto de vários diretórios em tempo de compilação são todos combinados para gerar um único diretório de saída.
Isso pode ser visto como um conjunto de diretórios de origem para criar um diretório "virtual".

Usando 'rootDirs', você pode informar ao compilador as _roots_ que compõem este diretório "virtual";
e, portanto, o compilador pode resolver as importações de módulos relativos dentro desses diretórios "virtuais" _como se_ fossem mesclados em um diretório.

Por exemplo, considere esta estrutura de projeto:

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

Arquivos em `src/views` são códigos de usuário para alguns controles de interface de usuário.
Os arquivos em `generated/templates` são códigos de vinculação de templates de interface de usuário gerado automaticamente por um gerador de template como parte da construção.
Uma etapa de compilação irá copiar os arquivos em `/src/views` e `/generated/templates/views` para o mesmo diretório na saída.
Em tempo de execução, uma visão pode esperar que seu modelo exista próximo a ela e, portanto, deve importá-lo usando um nome relativo como `"./template"`.

Para especificar essa relação com o compilador, use `"rootDirs"`.
`"rootDirs"` especifique uma lista de _roots_ cujo conteúdo deve se fundir em tempo de execução.
Então, seguindo nosso exemplo, o `tsconfig.json` arquivo deve ser parecido com:

```json tsconfig
{
  "compilerOptions": {
    "rootDirs": ["src/views", "generated/templates/views"]
  }
}
```

Cada vez que o compilador vê uma importação de módulo relativa em uma subpasta de um dos `rootDirs`, ele tentará procurar por essa importação em cada uma das entradas de `rootDirs`.

A flexibilidade de `rootDirs` não se limita a especificar uma lista de diretórios de origem física que são mesclados logicamente. O array fornecido pode incluir qualquer número de nomes de diretório arbitrários ad hoc, independentemente de existirem ou não. Isso permite que o compilador capture pacotes sofisticados e recursos de tempo de execução, como inclusão condicional e plug-ins de carregador específicos do projeto de maneira segura.

Considere um cenário de internacionalização onde uma ferramenta de construção gera automaticamente pacotes específicos de localidade interpolando um token de caminho especial, digamos `#{locale}`, como parte de um caminho de módulo relativo, como `./#{locale}/messages`. Nesta configuração hipotética, a ferramenta enumera localidades com suporte, mapeando o caminho abstrato em `./zh/messages`, `./de/messages`, e assim por diante.

Suponha que cada um desses módulos exporte um array de strings. Por exemplo `./zh/messages` pode conter:

```ts
export default ["您好吗", "很高兴认识你"];
```

Aproveitando `rootDirs` podemos informar o compilador deste mapeamento e, assim, permitir que ele resolva com segurança `./#{locale}/messages`, mesmo que o diretório nunca exista. Por exemplo, com o seguinte `tsconfig.json`:

```json tsconfig
{
  "compilerOptions": {
    "rootDirs": ["src/zh", "src/de", "src/#{locale}"]
  }
}
```

O compilador agora resolverá `import messages from './#{locale}/messages'` para `import messages from './zh/messages'` para fins de ferramentas, permitindo o desenvolvimento de uma maneira agnóstica de localidade sem comprometer o suporte ao tempo de design.

## Resolução do módulo de rastreamento

Conforme discutido anteriormente, o compilador pode visitar arquivos fora da pasta atual ao resolver um módulo.
Isso pode ser difícil ao diagnosticar porque um módulo não foi resolvido ou foi resolvido para uma definição incorreta.
Habilitar o rastreamento de resolução do módulo do compilador usando `--traceResolution` fornece uma visão do que aconteceu durante o processo de resolução do módulo.

Digamos que temos um aplicativo de amostra que usa o módulo `typescript`.
`app.ts` contém uma importação como `import * as ts from "typescript"`.

```tree
│   tsconfig.json
├───node_modules
│   └───typescript
│       └───lib
│               typescript.d.ts
└───src
        app.ts
```

Invocar o compilador com `--traceResolution`

```shell
tsc --traceResolution
```

Resulta em uma saída como:

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

#### Coisas para procurar

- Nome e localização da importação

> ======== Resolving module **'typescript'** of **'src/app.ts'**. ========

- A estratégia que o compilador está seguindo

> O tipo de resolução do módulo não é especificado, usando **'NodeJs'**.

- Carregando tipos de pacotes npm

> 'package.json' tem campos **'types'** em './lib/typescript.d.ts' que referencia 'node_modules/typescript/lib/typescript.d.ts'.

- Resultado final

> ======== Module name 'typescript' was **successfully resolved** to 'node_modules/typescript/lib/typescript.d.ts'. ========

## Utilizando `--noResolve`

Normalmente, o compilador tentará resolver todas as importações de módulo antes de iniciar o processo de compilação.
Cada vez que ele resolve com sucesso uma `importação` para um arquivo, o arquivo é adicionado ao conjunto de arquivos que o compilador irá processar mais tarde.

A opção de compliação `--noResolve` instrui o compilador a não "adicionar" nenhum arquivo à compilação que não tenha sido passado na linha de comando.
Ele ainda tentará resolver o módulo em arquivos, mas se o arquivo não for especificado, ele não será incluído.

Por exemplo:

#### app.ts

```ts
import * as A from "moduleA"; // OK, 'moduleA' passou na linha de comando
import * as B from "moduleB"; // Error TS2307: Cannot find module 'moduleB'.
```

```shell
tsc app.ts moduleA.ts --noResolve
```

Compilando `app.ts` usando `--noResolve` deve resultar em:

- Encontrando corretamente `moduleA` conforme foi passado na linha de comando.
- Erro por não encontrar `moduleB` como não foi passado.

## Perguntas Frequentes

### Por que um módulo na lista de exclusão ainda é selecionado pelo compilador?

`tsconfig.json` transforma uma pasta em um “projeto”.
Sem especificar nenhuma entrada `“exclude”` ou `“files”`, todos os arquivos na pasta que contém o `tsconfig.json` e todos os seus subdiretórios estão incluídos em sua compilação.
Se você deseja excluir alguns dos arquivos, use `“exclude”`, se você preferir especificar todos os arquivos em vez de permitir que o compilador os procure, use `“files”`.

Essa foi a inclusão automática de `tsconfig.json`.
Isso não incorpora a resolução do módulo conforme discutido acima.
Se o compilador identificou um arquivo como destino de uma importação de módulo, ele será incluído na compilação, independentemente de ter sido excluído nas etapas anteriores.

Portanto, para excluir um arquivo da compilação, você precisa excluí-lo em **todos** os arquivos que possuem uma diretiva `import` ou `/// <reference path="..." />`.
