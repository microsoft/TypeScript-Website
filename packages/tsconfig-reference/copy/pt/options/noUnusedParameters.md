---
display: "Sem Parâmetros Não Utilizados"
oneline: "Emite erro quando um parâmetro não é utilizado"
---

Reporta erros em parâmetros não utilizados em funções.

```ts twoslash
// @noUnusedParameters
// @errors: 6133
const criaTecladoPadrao = (modeloID: number) => {
  const modeloPadraoID = 23;
  return { tipo: "teclado", modeloID: modeloPadraoID };
};
```
