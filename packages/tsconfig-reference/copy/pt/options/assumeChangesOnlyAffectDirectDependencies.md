---
display: "Assume que as alterações afetem apenas dependências diretas"
oneline: "Uma opção do modo watch que é drasticamente mais rápida, mas ocasionalmente imprecisa."
---

Quando essa opção está ativada, o TypeScript apenas verifica/reconstrói os arquivos que foram alterados, bem como os arquivos que os importam diretamente. Evitando assim a verificação/reconstrução de todos os arquivos que realmente podem ter sido afetados pelas alterações.

Isso pode ser considerado uma implementação 'rápida' do algoritmo de observação, que pode reduzir drasticamente os tempos de reconstrução incremental às custas de ter que executar a compilação completa ocasionalmente para obter todas as mensagens de erro do compilador.
