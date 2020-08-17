---
display: "Bind Call Apply Restritos"
oneline: "Garante que 'call', 'bind' e 'apply' tenham os argumentos corretos"
---

Quando definido, o TypeScript verificará se os métodos integrados das funções `call`, `bind` e `apply` são invocados com os argumentos corretos para a função subjacente:

```ts twoslash
// @strictBindCallApply: true
// @errors: 2345

// Com strictBindCallApply ativado
function fn(x: string) {
  return parseInt(x);
}

const n1 = fn.call(undefined, "10");

const n2 = fn.call(undefined, false);
```

Caso contrário, essas funções aceitarão qualquer argumento e retornarão `any`:

```ts twoslash
// @strictBindCallApply: false

// Com strictBindCallApply desativado
function fn(x: string) {
  return parseInt(x);
}

// Nota: Sem erro; tipo do retorno é 'any'
const n = fn.call(undefined, false);
```
