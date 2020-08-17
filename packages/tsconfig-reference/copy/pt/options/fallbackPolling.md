---
display: "Alternativas na ausência de observadores"
oneline: "O que o observador deve fazer se o sistema ficar sem observadores de arquivos nativos."
---

Quando utilizar eventos de arquivos do sistema, essa opção indica as estratégias de verificação que o sistema deve executar quando estiver sem observadores e/ou não suportar os observadores nativos.

- `fixedPollingInterval`: Verifica se há alterações em cada arquivo, várias vezes por segundo, durante um intervalo fixo.
- `priorityPollingInterval`: Verifica se há alterações em cada arquivo, várias vezes por segundo, mas usa heurística para verificar mais alguns arquivos do que outros.
- `dynamicPriorityPolling`: Uma fila dinâmica onde os arquivos com menos frequências de modificações são verificados com menos frequência.
- `synchronousWatchDirectory`: Desativa a verificação adiada nos diretórios. Adiar a verificação é útil quando muitas mudanças podem acontecer de uma vez só (ex.: uma mudança em `node_modules` por executar o `npm install`), mas você pode querer desativar isso para configurações menos comuns.
