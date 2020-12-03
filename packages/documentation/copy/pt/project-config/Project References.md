---
title: Referência de Projeto
layout: docs
permalink: /pt/docs/handbook/project-references.html
oneline: Como dividir um projeto Typescript grande
translatable: true
---

Referências de projeto são uma nova funcionalidade no Typescript 3.0 que permitem que você estruture seus programas Typescript em peças menores.

Fazendo isso, você pode melhorar muito tempos de compilação, garantir separação lógica entre componentes e organizar seu código de melhores maneiras.

Nós também estamos introduzindo um novo modo para o `tsc`, o sinalizador `--buld`, que funciona juntamente com as referências de projeto para habilitar compilações Typescript mais rápidas.

## Um Projeto Exemplo

Vamos olhar para um programa bastante normal e ver como referências de projeto podem nos ajudar a organizá-lo melhor.
Imagine que você tem um projeto com dois módulos, `converter` e `units`, e um teste correspondente para cada um deles:

```shell
/src/converter.ts
/src/units.ts
/test/converter-tests.ts
/test/units-tests.ts
/tsconfig.json
```

Os arquivos de teste importam os arquivos de implementação e fazem alguns testes:

```ts
// converter-tests.ts
import * as converter from "../converter";

assert.areEqual(converter.celsiusToFahrenheit(0), 32);
```

Previamente, essa estrutura era um pouco estranha de se trabalhar se você usasse apenas um arquivo tsconfig:

- Era possível que os arquivos de implementação importassem os arquivos de teste
- Não era possível compilar `test` e `src` ao mesmo tempo sem que `src` aparecesse na pasta de saída, o que você provavelmente não gostaria que acontecesse
- Mudar apenas os arquivos de implementação exigiam que os testes passassem novamente por _checagem de tipo_ mesmo que isso não causasse novos erros
- Mudar apenas os testes exigia a checagem de tipo novamente na implementação, mesmo que nada tivesse mudado

Você poderia usar múltiplos arquivos tsconfig para resolver _alguns_ desses problemas, mas novos apareceriam:

- Não há checagem atualizada embutida, então você acaba sempre rodando `tsc` duas vezes
- Invocar `tsc` duas vezes implicaria em mais sobrecarga no tempo de inicialização
- `tsc -w` não pode ser executado em múltiplos arquivos de configuração de uma vez

Referências de projeto podem resolver todos esses problemas e mais.

## O que é uma Referência de Projeto?

Arquivos `tsconfig.json` tem uma nova propriedade de alto nível, `references`. É um array de objetos que especifica projetos para referência:

```js tsconfig
{
    "compilerOptions": {
        // O normal
    },
    "references": [
        { "path": "../src" }
    ]
}
```

A propriedade `path` de cada referência pode apontar para um diretório contendo um arquivo `tsconfig.json`, ou para o arquivo de configuração em si (que pode ter qualquer nome).

Quando você referencia um projeto, novas coisas acontecem:

- Importar módulos de um projeto referenciado irá na verdade carregar seus arquivos de declaração de _saída_ (`.d.ts`)
- Se o projeto referenciado produz um `outFile`, o arquivo de saída `.d.ts` daquele arquivo será visível neste projeto
- Modo de compilação (veja abaixo) vai automaticamente compilar o projeto referenciado se preciso

Por meio da separação em múltiplos projetos, você pode melhorar muito a velocidade de checagem de tipo e compilação, reduzir uso de memória usando um editor e melhorar a garantia de grupos lógicos de seu programa.

## `composite`

Projetos referenciados devem ter a nova configuração `composite` habilitada.
Essa configuração é necessária para garantir que o Typescript possa rapidamente determinar onde encontrar as saídas do projeto referenciado.
Habilitar a configuração `composite` muda algumas coisas:

- A configuração `rootDir`, se não explicitamente declarada, tem como padrão o diretório onde o arquivo `tsconfig` está
- Todos os arquivos de implementação tem que ser cobridos por um padrão `include` ou listados no vetor `files`. Se essa restrição for violada, o `tsc` vai te informar de quais arquivos não foram especificados.
- `declaration` tem que estar habilitada

## `declarationMap`

Nós também adicionamos suporte para [mapas de declaração de fontes](https://github.com/Microsoft/TypeScript/issues/14479).
Se você habilitar `--declarationMap`, você será capaz de usar funcionalidades de editores tais como "Ir para definição" e Renomear para transparentemente navegar e editar código entre projetos em editores que são suportados.

## `prepend` com `outFile`

Você também pode habilitar a prefixação de saídas de uma dependência usando a opção `prepend` em uma referência:

```js
   "references": [
       { "path": "../utils", "prepend": true }
   ]
```

Prefixar um projeto vai incluir a saída dele acima da saída do projeto atual.
A opção funciona tanto para arquivos `.js` como para arquivos `.d.ts`, e arquivos de mapa de fontes também serão emitidos corretamente.

`tsc` vai usar apenas arquivos existentes no disco para realizar esse processo, então é possível criar um projeto onde o arquivo de saída correto não pode ser gerado porque a saída de outro projeto estaria presente mais que uma vez no arquivo resultante.
Por exemplo:

```txt
   A
  ^ ^
 /   \
B     C
 ^   ^
  \ /
   D
```

É importante nessa situação que não seja realizada a prefixação em cada referência, porque você vai acabar tendo duas cópias de `A` na saída de `D` - isso pode levar a resultados inesperados.

## Ressalvas para Referências de Projetos

Referências de projeto têm algumas desvantagens que você deve conhecer.

Pelo fato de projetos dependentes fazerem uso dos arquivos `.d.ts` que são construídos a partir de suas dependências, você terá que checar algumas saídas de compilações _ou_ compilar um projeto depois de clonar antes de poder navegar no projeto em um editor sem ter que ver alguns falsos erros.
Estamos trabalhando num processo de geração de .d.ts nos bastidores que será capaz de mitigar isso, mas no momento recomendamos informar desenvolvedores que eles devem compilar logo depois de clonar.

Adicionalmente, para preservar compatibilidade com os fluxos de trabalho existentes, `tsc` não vai compilar dependências automaticamente se não for invocado com a opção `--build`.
Vamos aprender mais sobre a opção `--build`.

## Modo de Compilação para TypeScript

Uma feature muito esperada eram as compilações incrementais e inteligentes para projetos Typescript.
Na versão 3.0 você pode usar a opção `--build` com `tsc`.
Essa é uma nova porta de entrada efetiva para `tsc` que se comporta mais como um orquestrador de compilação do que como um simples compilador.

Executar `tsc --build` (`tsc -b` como atalho) fará o seguinte:

- Encontrar todos os projetos referenciados
- Detectar se estão todos atualizados
- Compilar os projetos desatualizados na ordem correta

Você pode executar `tsc -b` com múltiplos caminhos de arquivos de configuração (e.g. `tsc -b src test`).
Assim como `tsc -p`, especificar o nome do arquivo configuração é desnecessário se ele for nomeado `tsconfig.json`.

## `tsc -b` Commandline

Você pode especificar quantos arquivos de configuração quiser:

```shell
 > tsc -b                            # Usa o tsconfig.json no diretório atual
 > tsc -b src                        # Usa o src/tsconfig.json
 > tsc -b foo/prd.tsconfig.json bar  # Usa o foo/prd.tsconfig.json e bar/tsconfig.json
```

Não se preocupe quando a ordem dos arquivos que passar na linha de comando - o `tsc` vai reordená-los se necessário para que as dependências sejam sempre compiladas primeiro.

Também há algumas opções que podem ser enviadas para `tsc -b`

- `--verbose`: Imprime um log verboso para explicar o que está acontecendo (pode ser combinada com qualquer outra opção)
- `--dry`: Mostra o que seria feito mas não compila nada de fato
- `--clean`: Deleta as saídas dos projetos especificados (pode ser combinada com `--dry`)
- `--force`: Age como se todos os projetos estivessem desatualizados
- `--watch`: Mobo de observação (não pode ser combinado com qualquer opção exceto `--verbose`)

## Ressalvas

Normalmente `tsc` produzirá saídas (`.js` e `.d.ts`) na presença de erros de sintaxe ou de tipo, exceto que `noEmitOnError` esteja habilitada.
Fazer isso em um sistema de compilação incremental seria bem ruim - se um dos seus projetos desatualizados tivesse um novo erro, você só veria ele _uma vez_ pois em uma compilação subsequente, a compilação deste projeto seria pulada, pois o projeto agora está atualizado.
Por essa razão, `tsc -b` age efetivamente como se `noEmitOnError` estivesse habilitada para todos os projetos.

Se você checar qualquer saída de compilação (`.js`, `.d.ts`, `.d.ts.map`, etc.), você talvez precise executar uma compilaçao com `--force` antes de certas operações de controle de código dependendo se sua ferramenta de controle de código preserva os timestamps entre a cópia local e a cópia remota.

## MSBuild

Se você tem um projeto msbuild, você pode habilitar o modo de compilação adicionando

```xml
    <TypeScriptBuildMode>true</TypeScriptBuildMode>
```

Ao seu arquivo proj. Isso vai habilitar compilação incremental e limpeza automáticas.

Note que como com `tsconfig.json`/`-p`, propriedades de projetos Typescript existentes não serão respeitados - todas as configurações devem ser gerenciadas usando seu arquivo tsconfig.

Alguns times configuraram fluxos de trabalho baseados em msbuild onde os arquivos tsconfig tem a mesma ordenação gráfica _implícita_ que os projetos gerenciados com que que estão associados.
Se a sua solução se parece com isso, você pode continuar usando `msbuild` com `tsc -p` junto com as referências de projeto; eles são completamente interoperáveis.

## Guia

## Estrutura Geral

Com mais arquivos `tsconfig.json`, você usualmente vai querer usar [Herança de arquivos de configuração](/docs/handbook/tsconfig-json.html) para centralizar as opções de compilação comuns.
Dessa forma você pode mudar uma configuração em apenas um arquivo ao invés de ter que editar múltiplos arquivos.

Outra boa prática é ter um arquivo `tsconfig.json` "solução" que simplesmente tem `referências` aos outros projetos e configura `files` como um vetor vazio (de outra forma, o arquivo de solução causaria dupla compilação dos arquivos). Note que a partir da 3.0, não é mais considerado um erro ter um vetor `files` vazio se você tem pelo menos uma `reference` em um arquivo `tsconfig.json`.

Isso apresenta um único ponto de entrada; e.g. no repositório do Typescript nós simplesmente rodamos `tsc -b src` para compilar todos os pontos finais porque listamos todos os subprojetos no `src/tsconfig.json`

Você pode ver esses padrões no repositório do Typescript - veja `src/tsconfig_base.json`, `src/tsconfig.json`, e `src/tsc/tsconfig.json` como exemplos chave.

## Estrutura para módulos relativos

Em geral, não é necssário muito para fazer a transição um repositório usando módulos relativos.
Simplesmente coloque um arquivo `tsconfig.json` em cada subdiretório de uma determinada pasta pai e adicione `referências` para esses arquivos de configuração para corresponder a camada pretendida do programa.
Você vai precisar configurar a opçao `outDir` para uma subpasta explícita da pasta de saída, ou configurar `rootDir` para a pasta raiz de todas as pastas do projeto.

## Estrutura para outFiles

A camada para compilações usando `outFile` é mais flexível porque os caminhos relativos não importam tanto.
Uma coisa para se lembrar é que você geralmente vai querer não usar `prepend` até o "último" projeto - isso vai melhorar o tempo de compilação e reduzir a quantidade de E/S necessária em cada build realizada.
O próprio repositório do Typescript é uma ótima referência aqui - nós temos alguns projetos "bibliotecas" e alguns projetos "pontos finais"; projetos "pontos finais" são mantidos tão pequenos quanto possível e importam apenas as bibliotecas que precisam.

<!--
## Structuring for monorepos

TODO: Experiment more and figure this out. Rush and Lerna seem to have different models that imply different things on our end
-->
