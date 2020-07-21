---
display: "Permitir Código Não Executado"
oneline: "Exibe um erro quando o código nunca será executado"
---

Mude para false para desabilitar os avisos sobre código não executável.
Estes avisos são somente sobre código que são provavelmente inalcançáveis e nunca serão executados por conta do uso da sintaxe do JavaScript como, por exemplo:

```ts
function fn(n: number) {
  if (n > 5) {
    return true;
  } else {
    return false;
  }
  return true;
}
```

Com `"allowUnreachableCode": false`:

```ts twoslash
// @errors: 7027
// @allowUnreachableCode: false
function fn(n: number) {
  if (n > 5) {
    return true;
  } else {
    return false;
  }
  return true;
}
```

Isso não afeta os erros exibidos com base em código que _parece_ ser inalcançável devido à análise de tipos.
