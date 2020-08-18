---
display: "Sem Variáveis Locais Não Utilizadas"
oneline: "Emite erro quando uma váriavel local não é lida"
---

Reporta erros em variáveis locais não utilizadas.

```ts twoslash
// @noUnusedLocals
// @errors: 6133
const criaTeclado = (modeloID: number) => {
  const modeloPadraoID = 23;
  return { tipo: "teclado", modeloID };
};
```
