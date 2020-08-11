---
display: "Strict Null Checks"
oneline: "Certifique-se de que a nulidade é respeitada no verificador de tipo"
---

Quando `strictNullChecks` é `false`, `null` e `undefined` são efetivamentes ignorados pela linguagem. Isso pode levar a erros inesperados no tempo de execução.

Quando `strictNullChecks` é `true`, `null` e `undefined` têm seus próprios tipos distintos e você obterá um erro de tipo se tentar usá-los onde um valor concreto é esperado.

Por exemplo, com este código TypeScript, `users.find` você não tem garantia de que realmente encontrará um usuário, mas você pode escrever o código como se ele fosse:

```ts twoslash
// @strictNullChecks: false
// @target: ES2015
declare const loggedInUsername: string;

const users = [
  { name: "Henrique", age: 12 },
  { name: "Carol", age: 32 }
];

const loggedInUser = users.find(u => u.name === loggedInUsername);
console.log(loggedInUser.age);
```

Configurar `strictNullChecks` para `true` irá gerar um erro de que você não garantiu a existência de `loggingInUser` antes de tentar usá-lo.

```ts twoslash
// @errors: 2339 2532
// @target: ES2020
// @strictNullChecks
declare const loggedInUsername: string;

const users = [
  { name: "Henrique", age: 12 },
  { name: "Carol", age: 32 }
];

const loggedInUser = users.find(u => u.name === loggedInUsername);
console.log(loggedInUser.age);
```

O segundo exemplo falhou porque a função `find` do array se parece um pouco com esta simplificação:

```ts
// Quando strictNullChecks: true
type Array = {
  find(predicate: (value: any, index: number) => boolean): S | undefined;
};

// Quando strictNullChecks: false, o undefined é removido do sistema de tipos,
// permitindo que você escreva um código que assume que sempre encontrou um resultado
type Array = {
  find(predicate: (value: any, index: number) => boolean): S;
};
```
