---
display: "Composite"
oneline: "Used to create multiple build projects"
---

`composite`オプションは、ビルドツール（`--build`モードでのTypeScript自体を含む）
がプロジェクトがビルドされているかどうかを迅速に判断できるようにするために特定の制約を適用します。

この設定が有効なとき:

- 明示的に設定されていない`rootDir`のデフォルト値は`tsconfig.json`ファイルを含むディレクトリとなります。

- すべての実装ファイルは、`include`パターンにマッチするか`files`リストに含まれなくてはなりません。この制約に違反した場合、`tsc`はどのファイルが指定されていないかを通知します。

- `declaration`のデフォルト値が`true`になります。

TypeScriptのプロジェクト機能についてのドキュメントは[ハンドブック](https://www.typescriptlang.org/docs/handbook/project-references.html)から参照できます。
