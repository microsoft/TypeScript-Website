---
display: "Declarações"
oneline: "Emite arquivos d.ts para os arquivos referenciados no projeto"
---

Gere arquivos `.d.ts` para cada arquivo TypeScript ou JavaScript dentro do seu projeto.
Esses arquivos `.d.ts` são arquivos de definição de tipo que descrevem a API externa do seu módulo.
Com arquivos `.d.ts`, ferramentas como o TypeScript podem fornecer intellisense e tipos mais precisos para código que ainda não foi digitado.

Quando a opção `declaration` é definida como `true`, executando o compilador com este código TypeScript:

```ts twoslash
export let olaMundo = "olá!";
```

Vai gerar um arquivo `index` como este:

```ts twoslash
// @showEmit
export let olaMundo = "olá!";
```

Com um outro arquivo correspondente `olaMundo.d.ts`:

```ts twoslash
// @showEmittedFile: index.d.ts
// @showEmit
// @declaration
export let olaMundo = "olá!";
```

Ao trabalhar com arquivos `.d.ts` para arquivos JavaScript, você pode usar [`emitDeclarationOnly`](#emitDeclarationOnly) ou usar [`outDir`](#outDir) para garantir que os arquivos JavaScript não sejam sobrescritos.
