---
display: "Permitir Labels Não Utilizadas"
oneline: "Exibe um erro quando uma label é criada acidentalmente"
---

Defina como false para desabilitar os avisos sobre labels não utilizadas.

Labels são muito raras no JavaScript e, tipicamente, indicam uma tentativa de escrever um objeto literal:

```ts twoslash
// @errors: 7028
// @allowUnusedLabels: false
function verificarIdade(idade: number) {
  // Esquecemos o 'return'
  if (idade > 18) {
    verificado: true;
  }
}
```
