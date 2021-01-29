---
display: "disableReferencedProjectLoad"
oneline: "Reduces the number of projects loaded automatically by TypeScript"
---

複数プロジェクトのTypeScriptプログラムでは、TypeScriptは利用可能なすべてのプロジェクトをメモリに読み込みます。これにより、「すべての参照元を検索」のような完全なナレッジグラフを必要とするエディタのレスポンスに対して正確な結果を提供することができます。

プロジェクトが大規模な場合は、`disableReferencedProjectLoad`フラグを使用してすべてのプロジェクトの自動読み込みを無効にすることができます。代わりに、エディタでファイルを開いたときに動的にプロジェクトが読み込まれます。
