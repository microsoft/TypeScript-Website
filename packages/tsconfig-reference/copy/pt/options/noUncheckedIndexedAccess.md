---
display: "noUncheckedIndexedAccess"
oneline: "Usa undefined para um tipo quando acessado através de um índice"
---

TypeScript tem uma maneira para descrever objetos que têm chaves desconhecidas, mas valores conhecidos, através da assinatura de índice.

```ts twoslash
interface EnvironmentVars {
  NAME: string;
  OS: string;

  // Propriedades desconhecidas são cobertas por esta assinatura de índice.
  [propName: string]: string;
}

declare const env: EnvironmentVars;

// Declarada como existente
const sysName = env.NAME;
const os = env.OS;
//    ^?

// Não declarada, mas por causa da assinatura
// de índice, é considerada uma string
const nodeEnd = env.NODE_ENV;
//    ^?
```

Ativar `noUncheckedIndexedAccess` adicionará `undefined` para qualquer campo não declarado no tipo.

```ts twoslash
interface EnvironmentVars {
  NAME: string;
  OS: string;

  // Propriedades desconhecidas são cobertas por esta assinatura de índice.
  [propName: string]: string;
}
// @noUncheckedIndexedAccess
// ---cut---
declare const env: EnvironmentVars;

// Declarada como existente
const sysName = env.NAME;
const os = env.OS;
//    ^?

// Não declarada, mas por causa da assinatura
// de índice, é considerada uma string
const nodeEnd = env.NODE_ENV;
//    ^?
```
