---
display: "Watch Options"
---

O TypeScript 3.8 lançou uma nova estratégia para monitorar as pastas, que é crucial para obter as mudanças no `node_modules`.

Nos sistemas operacionais como Linux, o Typescript instala monitores de diretórios (ao contrário dos monitores de arquivos) no `node_modules` e muitos dos seus sub-diretórios para detectar mudanças nas suas dependências.
Isto é devido a quantidade de monitores de arquivos disponíveis que é eclipsado pelo número de arquivos no `node_modules`, enquanto há muito poucos diretórios para rastrear.

Como cada projeto deve funcionar melhor com diferentes estratégias, e esta nova abordagem pode não funcionar para o seu fluxo de trabalho, o TypeScript 3.8 introduziu o novo campo `watchOptions` que permite que o usuário diga ao compilador/serviço de linguagem quais estratégias de monitoramento devem ser utilizadas para manter o controle dos diretórios e arquivos.
