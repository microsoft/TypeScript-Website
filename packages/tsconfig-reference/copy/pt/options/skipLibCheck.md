---
display: "Ignorar a verificação de biblioteca"
oneline: "Pula a verificação dos arquivos de declaração"
---

Ignora a verificação dos arquivos de declaração.

Isso pode economizar tempo durante a compilação, porém, às custas da precisão do sistema de tipos. Por exemplo, duas bibliotecas podem definir duas cópias do mesmo `type` de modo inconsistente. Em vez de fazer uma verificação completa de todos os arquivos `d.ts`, o TypeScript irá verificar o código ao qual você se refere no código-fonte do aplicativo.

Um uso comum para se usar o `skipLibCheck` é quando há duas cópias de uma biblioteca no seu `node_modules`. Nesses casos você deve considerar usar um recurso como as [resoluções do yarn](https://classic.yarnpkg.com/pt-BR/docs/selective-version-resolutions) para garantir que há apenas uma única cópia de cada dependência na sua árvore, ou descobrir como se certificar, entendendo as resoluções de dependência, como manter uma única cópia sem utilizar nenhuma ferramenta adicional.
