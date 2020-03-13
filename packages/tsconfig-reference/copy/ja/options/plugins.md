---
display: "Plugins"
oneline: "A list of language service plugins to include"
---

エディタ内部で動作させるLanguage Serviceのプラグインを列挙します。

Language Serviceプラグインを用いることで、ユーザーはTypeScriptファイルから追加情報を受け取ることができます。プラグインは、TypeScriptとエディタ間でやりとりされているメッセージを拡張したり、プラグイン独自エラーメッセージを提供できます。

例:

- [ts-sql-plugin](https://github.com/xialvjun/ts-sql-plugin#readme) &mdash; テンプレート文字列によるSQLビルダについて、SQLの構文チェックを追加します。
- [typescript-styled-plugin](https://github.com/Microsoft/typescript-styled-plugin) &mdash; テンプレート文字列内部のCSSを構文チェック機能を提供します。
- [typescript-eslint-language-service](https://github.com/Quramy/typescript-eslint-language-service) &mdash; eslintのエラーメッセージを出力や、出力されたエラーメッセージの修正機能を提供します。
- [ts-graphql-plugin](https://github.com/Quramy/ts-graphql-plugin) &mdash; テンプレート文字列内部のGraphQLクエリについて、バリデーションと自動補完機能を提供します。

VS Codeには、拡張のための[Lnguage Serviceプラグインの自動読込 ](https://code.visualstudio.com/api/references/contribution-points#contributes.typescriptServerPlugins)機能があるため、`tsconfig.json`にプラグインの定義を書かずにエディタ上でプラグインを動作させることもできます。
