---
display: "Alternativas na ausência de observadores"
oneline: "O que o observador deve fazer se o sistema ficar sem observadores de arquivos nativos."
---

Quando utilizar eventos de arquivos do sistema, essa opção indica as estratégias de verificação que o sistema deve executar quando estiver sem observadores e/ou não suportar os observadores nativos.

- `fixedPollingInterval`: Checa por mudanças nos arquivos várias vezes por segundo a um intervalo pré-determinado.
- `priorityPollingInterval`: Checa todos os arquivos por mudanças várias vezes por segundo, mas usando heurísticas para checar alguns tipos de arquivos mais frequentemente que outros.
- `dynamicPriorityPolling`: Usa uma fila dinâmica onde diretórios que são menos alterados serão checados menos vezes.
- `synchronousWatchDirectory`: Desativa a checagem adiada nos diretórios. Adiar a checagem é útil quando muitas mudanças podem acontecer de uma vez só (ex.: uma mudança em `node_modules` por executar o `npm install`), mas você pode querer desativar isso para configurações menos comuns.
