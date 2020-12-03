---
title: Configurando Watch
layout: docs
permalink: /pt/docs/handbook/configuring-watch.html
oneline: Como configurar o modo de observação do Typescript
translatable: true
---

O compilador suporta configurar como observar arquivos e diretórios usando opções de compilador no Typescript 3.8+, e variáveis de ambiente antes dessa versão.

## Contexto

A implementação `--watch` do compilador se apoia em usar `fs.watch` e `fs.watchFile` que são providos pelo node, ambos os métodos têm seus prós e contras.

`fs.watch` usa os eventos do file system para notificar as mudanças no arquivo/diretório. Mas isso depende do SO e a notificação não é completamente confiável e não funciona como esperado em vários SOs. Também pode haver um limite do número de observadores que podem ser criados, eg. linux, e nós poderíamos superar esse limite bem rápido com programas que incluem grandes números de arquivos. Mas, por usar os eventos do file system, não há tantos ciclos de CPU envolvidos. O compilador usa `fs.watch` tipicamente para observar diretórios (eg. diretórios fonte que são incluídos por um arquivo de configuração, diretório em que a resolução de módulos falhou etc.) estes podem lidar com a falta de precisão em notificação de mudanças. Mas observação recursiva é suportada apenas no Windows e no OSX. Isso significa que precisamos de algo para substituir a natureza recursiva em outros SOs.

`fs.watchFile` usa uma checagem de estado dos arquivos e por isso envolve ciclos de CPU. Mas essa é a forma mais confiável de se conseguir atualizações dos arquivos/diretórios. O compilador usa `fs.watchFile` tipicamente para observar arquivos fonte, arquivos de configuração e arquivos em falta (referências de arquivos falhas) e isso significa que o uso de CPU depende da quantidade de arquivos no programa.

## Configurando observação de arquivos usando o `tsconfig.json`

```json tsconfig
{
  // Algumas opções típicas do compilador
  "compilerOptions": {
    "target": "es2020",
    "moduleResolution": "node"
    // ...
  },

  // NOVO: Opçoes para observação de arquivo/diretório
  "watchOptions": {
    // Usa os eventos nativos do file system para arquivos e diretórios
    "watchFile": "useFsEvents",
    "watchDirectory": "useFsEvents",

    // Checka os arquivos buscando atualizações mais frequentemente
    // quando eles são muito atualizados
    "fallbackPolling": "dynamicPriority"
  }
}
```

Você pode ler mais sobre isso nas [notas de atualização](/docs/handbook/release-notes/typescript-3-8.html#better-directory-watching-on-linux-and-watchoptions).

## Configurando observação de arquivos usando variáveis de ambiente `TSC_WATCHFILE`

<!-- prettier-ignore -->
Opção                                          | Descrição
-----------------------------------------------|----------------------------------------------------------------------
`PriorityPollingInterval`                      | Usa `fs.watchFile` mas usa diferentes intervalos de checagem para arquivos fonte, arquivos de configuração e arquivos em falta
`DynamicPriorityPolling`                       | Usa uma fila dinâmica onde os arquivos modificados mais frequentemente serão checados em menor intervalo e os que se mantem inalterados serão checados em um intervalo maior
`UseFsEvents`                                  | Usa o `fs.watch` que por sua vez usa os eventos de file system (mas pode não ser exato em diferentes SOs) para conseguir as notificações de mudança/criação/remoção de arquivos. Note que alguns SOs eg. linux tem um limite no número de observadores e a falha de criação de um observador com `fs.watch` resultará na criação de outro observador usando `fs.watchFile`
`UseFsEventsWithFallbackDynamicPolling`        | Essa opção é similar a `UseFsEvents` exceto na falha de criação de um observador usando `fs.watch`, a contingência de observação acontece por filas de checagem dinâmicas (como explicado em `DynamicPriorityPolling`)
`UseFsEventsOnParentDirectory`                 | Essa opção observa o diretório pai do arquivo com `fs.watch` (usando eventos do file system) causando com que o uso de CPU seja baixo
default (nenhum valor especificado)            | Se a variável de ambiente `TSC_NONPOLLING_WATCHER` tem valor true, observa os diretórios pai dos arquivos (assim como `UseFsEventsOnParentDirectory`). De outra forma observa os arquivos usando `fs.watchFile` com `250ms` como tempo limite para qualquer arquivo.

## Configurando observação de diretório usando a variável de ambiente `TSC_WATCHDIRECTORY`

A observação de diretório em plataformas que não suportam observação recursiva de diretório nativamente em node é suportada por meio da criação recursiva de observadores de diretório para os diretórios filhos usando diferentes opções selecionadas pela variável ambiente `TSC_WATCHDIRECTORY`. Note que, em plataformas que suportam observação de diretórios recursivamente (e.g. windows), o valor dessa variável é ignorado.

<!-- prettier-ignore -->
Opção                                          | Descrição
-----------------------------------------------|----------------------------------------------------------------------
`RecursiveDirectoryUsingFsWatchFile`           | Usa `fs.watchFile` para observar os diretórios e diretórios filhos o que torna isso uma observação por checagem de estado (consumindo ciclos de CPU).
`RecursiveDirectoryUsingDynamicPriorityPolling`| Usa a fila de checagem de estado dinâmica para checar por mudanças nos diretórios e diretórios filhos.
default (sem valor especificado)               | Usa `fs.watch` para observar diretórios e diretórios filhos.
