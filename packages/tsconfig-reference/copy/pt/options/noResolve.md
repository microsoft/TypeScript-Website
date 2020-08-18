---
display: "Sem Resolução"
oneline: "Pula a verificação antecipada para arquivos de 'import' e '<reference'"
---

Por padrão, o TypeScript examinará o conjunto inicial de arquivos para as diretivas `import` e`<reference` e adicionará esses arquivos resolvidos ao seu programa.

Se `noResolve` estiver definido, este processo não acontecerá.
No entanto, as instruções `import` ainda são verificadas para ver se elas resolvem para um módulo válido, então você precisa ter certeza de que isso é satisfeito por algum outro meio.
