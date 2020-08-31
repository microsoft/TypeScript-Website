---
display: "Sem casos de Fallthrough no Switch"
oneline: "Relate erros para casos de falha nas instruções switch."
---

Reportar erros para casos de fallthrough em instruções switch.
Garante que qualquer caso não vazio dentro de uma instrução switch inclua `break` ou`return`.
Isso significa que você não enviará acidentalmente um bug de fallthrough.

```ts twoslash
// @noFallthroughCasesInSwitch
// @errors: 7029
const a: number = 6;

switch (a) {
  case 0:
    console.log("par");
  case 1:
    console.log("impar");
    break;
}
```
