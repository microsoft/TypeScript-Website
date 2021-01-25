---
display: "插件"
oneline: "要包含的语言服务插件列表"
---

可在编辑器内运行的语言服务插件列表。

语言服务插件是一种基于现有 TypeScript 文件向用户提供额外信息的方法。它们可以改进 TypeScript 和编辑器之间的现有信息，或提供自己的错误信息。

例如：

- [ts-sql-plugin](https://github.com/xialvjun/ts-sql-plugin#readme) &mdash; 增加了用模板字符串做 SQL 构建器时的风格检查。
- [typescript-styled-plugin](https://github.com/Microsoft/typescript-styled-plugin) &mdash; 在目标字符串中提供 CSS 风格检查。
- [typescript-eslint-language-service](https://github.com/Quramy/typescript-eslint-language-service) &mdash; 在编译器的输出中提供 eslint 的错误信息和修复信息。
- [ts-graphql-plugin](https://github.com/Quramy/ts-graphql-plugin) &mdash; 
在 GraphQL 查询目标字符串中提供验证和补全。

VS Code 可以让一个扩展 [自动包含语言服务插件](https://code.visualstudio.com/api/references/contribution-points#contributes.typescriptServerPlugins)，所以你可以在编辑器中运行一些插件，而不需要在 `tsconfig.json` 中指定他们。
