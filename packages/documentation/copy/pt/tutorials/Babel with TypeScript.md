---
title: Usando Babel com TypeScript
layout: docs
permalink: /pt/docs/handbook/babel-with-typescript.html
oneline: Como criar um projeto híbrido com Babel + TypeScript
translatable: true
---

## Babel vs `tsc` para TypeScript

Ao desenvolver um projeto JavaScript moderno, você pode se perguntar qual a forma correta de converter arquivos do TypeScript para o JavaScript.

Várias vezes a resposta é _"depende"_, ou _"alguém pode ter decidido por você"_ dependendo do projeto. Se você está construindo seu projeto com algum framework existente como [tsdx](https://tsdx.io), [Angular](https://angular.io/), [NestJS](https://nestjs.com/) ou qualquer outro framework mencionado na seção [Começando com TypeScript](/docs/home) então essa decisão é sua.

Contudo, uma heurística útil seria:

- A saída do seu processo de build é, na maioria das vezes, igual aos arquivos de entrada? Use `tsc`
- Você precisa de um pipeline de build com múltiplas sáidas possíveis? Use `babel` para transpilar e `tsc` para checagem de tipo.

## Babel para transpilar, `tsc` para tipos

Esse é um padrão comum para projetos com infraestruturas de build já existentes e que têm sido portados de uma base de código JavaScript para TypeScript.

Essa técnica é uma abordagem híbrida, usando o [preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript) do Babel para gerar seus arquivos JS, e então usar o TypeScript para fazer a checagem de tipos e gerar os arquivos `.d.ts`.

Usando o suporte do babel para o Typescript, você consegue trabalhar com pipelines de build existentes e tem mais chances de gerar JS mais rápido porque o Babel não faz checagem de tipo no seu código.

#### Checagem de Tipo e geração de arquivos .d.ts

A desvantagem de usar babel é que você não tem checagem de tipos durante a transição do TS para o JS. Isso significa que erros de tipagem que você deixou passar no seu editor podem acabar no código de produção.

Além disso, Babel não pode criar arquivos `.d.ts` para seu TypeScript o que pode fazer com que o trabalho fique mais difícil se seu projeto for uma biblioteca.

Para corrigir esses problemas, você provavelmente vai querer configurar um comando para fazer a checagem de tipos do seu projeto usando TSC. Isso provavelmente significa duplicar algumas das suas configurações do babel para um [`tsconfig.json`](/tconfig) correspondente e garantir que estas diretivas estão ativadas:

```json tsconfig
"compilerOptions": {
  // Garante que arquivos .d.ts são criados pelo tsc, mas não arquivos .js
  "declaration": true,
  "emitDeclarationOnly": true,
  // Garante que o Babel pode transpilar de maneira segura os arquivos no projeto TypeScript
  "isolatedModules": true
}
```

Para mais informações sobre essas diretivas:

- [`isolatedModules`](/tsconfig#isolatedModules)
- [`declaration`](/tsconfig#declaration), [`emitDeclarationOnly`](/tsconfig#emitDeclarationOnly)
