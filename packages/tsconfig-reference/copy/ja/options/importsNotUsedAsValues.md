---
display: "Imports Not Used As Values"
oneline: "Does something"
---

このフラグは`import`がどのように動作するかを制御します。3つの異なるオプションがあります:

- `remove`: 型のみを参照する`import`文を削除するデフォルトの挙動

- `preserve`: 使用されない値または型のすべての`import`文を保持します。これにより、インポート/副作用が保持されます。

- `error`: すべてのimportを保持しますが(preserveオプションと同じ)、値のimportが型としてのみ使用されている場合にエラーを出力します。これは、誤って値がimportされないようにしつつ、副作用のあるimportを明示的にしたい場合に有用です。 

このフラグが機能することで、`import type`を使用して、JavaScriptに出力されない`import`文を明示的に作成できます。
