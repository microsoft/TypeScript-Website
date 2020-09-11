---
display: "Checagem estrita de nulos"
oneline: "Certifique-se de que a nulidade é respeitada ao se verificar os tipos"
---

Quando `strictNullChecks` é `false`, `null` e `undefined` são efetivamentes ignorados pela linguagem. Isso pode levar a erros inesperados em tempo de execução.

Quando `strictNullChecks` é `true`, `null` e `undefined` têm seus próprios tipos distintos e você obterá um erro de tipo se tentar usá-los onde um valor concreto é esperado.

Por exemplo, com este código TypeScript, `usuarios.find` você não tem garantia de que realmente encontrará um usuário, mas você pode escrever o código como se ele fosse:

```ts twoslash
// @strictNullChecks: false
// @target: ES2015
declare const nomeDeUsuarioLogado: string;

const usuarios  = [
  { nome: "Henrique", idade: 12 },
  { nome: "Carol", idade: 32 }
];

const usuarioLogado = usuarios.find(u => u.nome === nomeDeUsuarioLogado);
console.log(usuarioLogado.idade);
```

Configurar `strictNullChecks` para `true` irá gerar um erro de que você não garantiu a existência de `usuarioLogado` antes de tentar usá-lo.

```ts twoslash
// @errors: 2339 2532
// @target: ES2020
// @strictNullChecks
declare const nomeDeUsuarioLogado: string;

const usuarios = [
  { nome: "Henrique", idade: 12 },
  { nome: "Carol", idade: 32 }
];

const usuarioLogado = usuarios.find(u => u.nome === nomeDeUsuarioLogado);
console.log(usuarioLogado.idade);
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
