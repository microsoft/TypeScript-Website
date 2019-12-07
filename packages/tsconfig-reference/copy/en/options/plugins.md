---
display: "Plugins"
---

List of language service plugins to run inside the editor. 

Language service plugins are a way to provide additional information to a user based on existing TypeScript files. They have access to enhance existing TypeScript messaging to the editor, or to provide their own error messages.

For example:

 - [ts-sql-plugin]() - Adds SQL linting with a template strings SQL builder
 - [typescript-styled-plugin](https://github.com/Microsoft/typescript-styled-plugin) - Provides CSS linting inside template strings 
 - [typescript-eslint-language-service](https://github.com/Quramy/typescript-eslint-language-service) - Provides eslint error messaging and fix-its using the compiler's APIs

VS Code has the ability for a VS Code extension to [automatically include language service plugins](https://code.visualstudio.com/api/references/contribution-points#contributes.typescriptServerPlugins), and so you may have some running in your editor without needing to define them in your `tsconfig.json`.
