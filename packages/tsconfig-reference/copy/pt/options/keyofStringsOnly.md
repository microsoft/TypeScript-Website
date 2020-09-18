---
display: "Somente Strings em KeyOf"
oneline: "Faça com que keyof retorne apenas strings em vez de strings ou números"
---

Este sinalizador muda o operador do tipo `keyof` para retornar` string` em vez de `string | number` quando aplicado a um tipo com uma assinatura de índice de string.

Este sinalizador é usado para ajudar as pessoas a evitar esse comportamento de [before TypeScript 2.9's release](/docs/handbook/release-notes/typescript-2-9.html#support-number-and-symbol-named-properties-with-keyof-and-mapped-types).
