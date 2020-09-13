---
display: "Permitir código inalcanzable"
oneline: "Muestra un error cuando el código nunca será ejecutado"
---

Cuando:

- `undefined` (por defecto) proporciona sugerencias como advertencias a los editores
- `true` código inalcanzable es ignorado
- `false` genera errores de compilación cuando se detecta código inalcanzable

Estas advertencias son sólo sobre el código que es evidentemente inalcanzable debido al uso de la sintaxis de JavaScript, por ejemplo:

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

Con la opción `"allowUnreachableCode": false`:

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

Esto no afecta a los errores sobre la base del código que _parece_ ser inalcanzable debido al análisis de tipos.
