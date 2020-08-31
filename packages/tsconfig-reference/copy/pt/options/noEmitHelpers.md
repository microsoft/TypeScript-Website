---
display: "No Emit Helpers"
oneline: "Suponha que auxiliares estejam disponíveis no tempo de execução global"
---

Em vez de importar auxiliares com [`importHelpers`](#importHelpers), você pode fornecer implementações no escopo global para os auxiliares que você usa e desligar completamente a emissão de funções auxiliares.

Por exemplo, usar esta função `async` no ES5 requer uma função do tipo `await` e uma função do tipo `generator` para executar:

```ts twoslash
const getAPI = async (url: string) => {
  // Get API
  return {};
};
```

O que cria bastante JavaScript:

```ts twoslash
// @showEmit
// @target: ES5
const getAPI = async (url: string) => {
  // Get API
  return {};
};
```

Que pode ser alternado com seus próprios globais por meio deste sinalizador:

```ts twoslash
// @showEmit
// @target: ES5
// @noEmitHelpers
const getAPI = async (url: string) => {
  // Get API
  return {};
};
```
