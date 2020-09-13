---
display: "Sem truncamento de erro"
oneline: "Não truncar mensagens de erro"
---

Não truncar mensagens de erro

Com `false`, o padrão.

```ts twoslash
// @errors: 2322 2454
// @noErrorTruncation: false
var x: {
  propertyWithAnExceedinglyLongName1: string;
  propertyWithAnExceedinglyLongName2: string;
  propertyWithAnExceedinglyLongName3: string;
  propertyWithAnExceedinglyLongName4: string;
  propertyWithAnExceedinglyLongName5: string;
};

// A representação da string do tipo 'x' deve ser truncada na mensagem de erro
var s: string = x;
```

Com `true`

```ts twoslash
// @errors: 2322 2454
// @noErrorTruncation: true
var x: {
  propertyWithAnExceedinglyLongName1: string;
  propertyWithAnExceedinglyLongName2: string;
  propertyWithAnExceedinglyLongName3: string;
  propertyWithAnExceedinglyLongName4: string;
  propertyWithAnExceedinglyLongName5: string;
};

// A representação da string do tipo 'x' deve ser truncada na mensagem de erro
var s: string = x;
```
