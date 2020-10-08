---
display: "Incremental"
oneline: "Salve arquivos .tsbuildinfo para permitir a compilação incremental de projetos"
---

Diz ao TypeScript para salvar informações sobre o grafo do projeto da última compilação em arquivos armazenados no disco.
Este cria uma série de arquivos `.tsbuildinfo` na mesma pasta de sua saída de compilação. Eles não são usados por seu JavaScript em tempo de execução e pode ser excluído com segurança. Você pode ler mais sobre a bandeira no [3.4 notas de lançamento](/docs/handbook/release-notes/typescript-3-4.html#faster-subsequent-builds-with-the---incremental-flag).

Para controlar em quais pastas você deseja que os arquivos sejam construídos, use a opção de configuração [`tsBuildInfoFile`](#tsBuildInfoFile).
