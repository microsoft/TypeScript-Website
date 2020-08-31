---
display: "Plugins"
oneline: "Uma lista de plugins de linguagem a serem incluídos"
---

Lista de plugins de serviço de linguagem a serem executados dentro do editor.

Os plugins de serviço de linguagem são uma forma de fornecer informações adicionais a um usuário com base em arquivos TypeScript existentes. Eles podem aprimorar as mensagens existentes entre o TypeScript e um editor ou fornecer suas próprias mensagens de erro.

Por exemplo:

- [ts-sql-plugin](https://github.com/xialvjun/ts-sql-plugin#readme) &mdash; Adiciona linting SQL com um construtor SQL usando template strings.
- [typescript-styled-plugin](https://github.com/Microsoft/typescript-styled-plugin) &mdash; Fornece linting CSS dentro de template strings.
- [typescript-eslint-language-service](https://github.com/Quramy/typescript-eslint-language-service) &mdash; Fornece mensagens de erro ESLint e correções dentro da saída do compilador.
- [ts-graphql-plugin](https://github.com/Quramy/ts-graphql-plugin) &mdash; Fornece validação e preenchimento automático dentro das strings do modelo de consulta GraphQL.

VS Code tem a capacidade de uma extensão para [incluir automaticamente plugins de serviço de linguagem](https://code.visualstudio.com/api/references/contribution-points#contributes.typescriptServerPlugins), e assim você pode ter alguns rodando em seu editor sem precisar defini-los em seu `tsconfig.json`.
