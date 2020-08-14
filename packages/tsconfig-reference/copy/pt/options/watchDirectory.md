---
display: "Observar Diretório"
oneline: "Determina como os diretórios são observados"
---

Determina a estratégia que rege como árvores de diretório são observadas por mudanças em sistemas que não possuem a funcionalidade de observação recursiva de arquivos.

- `fixedPollingInterval`: Checa por mudanças nos arquivos várias vezes por segundo a um intervalo pré-determinado.
- `dynamicPriorityPolling`: Usa uma fila dinâmica onde diretórios que são menos alterados serão checados menos vezes.
- `useFsEvents` (padrão): Tenta utilizar os eventos de modificação de diretórios/arquivos do próprio sistema operacional.
