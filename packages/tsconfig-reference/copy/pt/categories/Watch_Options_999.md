---
display: "Opções de Monitoramento"
---

TypeScript 3.8 lançou uma nova estratégia para monitorar diretórios que é crucial para verificar com eficiência as alterações no `node_modules`.

Em sistemas operacionais como o Linux, o TypeScript instala monitores de diretório (diferentemente dos monitores de arquivos) no `node_modules` e em muitos de seus subdiretórios para detectar alterações em dependências.
Isso acontece porque o número de monitores de arquivos disponíveis geralmente é ofuscado pelo número de arquivos em `node_modules`, enquanto que a quantidade de diretórios a serem rastreados é muito menor.

Como cada projeto pode funcionar melhor sob diferentes estratégias e essa nova abordagem pode não funcionar bem no seu fluxo de trabalho, o TypeScript 3.8 introduz um novo campo `watchOptions` que permite aos usuários informar ao compilador/serviço de linguagem quais estratégias de monitoramento devem ser usadas para manter o rastreamento de arquivos e diretórios.