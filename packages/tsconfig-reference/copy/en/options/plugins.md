---
display: "Plugins"
oneline: "Specify a list of language service plugins to include."
---

List of language service plugins to run inside the editor.

Language service plugins are a way to provide additional information to a user based on existing TypeScript files. They can enhance existing messages between TypeScript and an editor, or to provide their own error messages.

For example:

- [ts-sql-plugin](https://github.com/xialvjun/ts-sql-plugin#readme) &mdash; Adds SQL linting with a template strings SQL builder.
- [typescript-styled-plugin](https://github.com/Microsoft/typescript-styled-plugin) &mdash; Provides CSS linting inside template strings .
- [typescript-eslint-language-service](https://github.com/Quramy/typescript-eslint-language-service) &mdash; Provides eslint error messaging and fix-its inside the compiler's output.
- [ts-graphql-plugin](https://github.com/Quramy/ts-graphql-plugin) &mdash; Provides validation and auto-completion inside GraphQL query template strings.

VS Code has the ability for a extension to [automatically include language service plugins](https://code.visualstudio.com/api/references/contribution-points#contributes.typescriptServerPlugins), and so you may have some running in your editor without needing to define them in your `tsconfig.json`.
