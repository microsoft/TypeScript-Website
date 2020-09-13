---
display: "Observar Arquivo"
oneline: "Qual técnica o observador de arquivos deve usar"
---

Define a estratégia como arquivos individuais devem ser observados por mudanças.

- `fixedPollingInterval`: Checa todos os arquivos por mudanças várias vezes por segundo a um intervalo pré-determinado.
- `priorityPollingInterval`: Checa todos os arquivos por mudanças várias vezes por segundo, mas usando heurísticas para checar alguns tipos de arquivos mais frequentemente que outros.
- `dynamicPriorityPolling`: Usa uma fila dinâmica onde arquivos menos modificados são checados menos frequentemente.
- `useFsEvents` (padrão): Tenta utilizar a funcionalidade nativa de eventos de modificação de arquivos do sistema operacional.
- `useFsEventsOnParentDirectory`: Tenta utilizar a implementação de eventos de modificação nativa do sistema operacional para detectar mudanças no diretório pai de um arquivo.
