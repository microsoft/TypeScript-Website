---
display: "Emitir Somente Declarações"
oneline: "Somente emitir arquivos .d.ts e não emitir arquivos .js"
---

_Só_ emite arquivos `.d.ts`; não emite arquivos `.js`.

Essa configuração é útil em dois casos:

- Você está usando um transpilador diferente do TypeScript para gerar seu JavaScript.
- Você está usando o TypeScript para gerar apenas arquivos `d.ts` para seus consumidores.