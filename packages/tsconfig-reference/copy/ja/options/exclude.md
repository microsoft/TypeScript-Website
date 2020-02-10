---
display: "Exclude"
oneline: "Files or patterns to be skipped from the include option"
---

`include`の解決時にスキップさせるファイル名やパターンのリストを指定します。

**重要**: `exclude`は`include`の結果として、どのファイルが含まれるべきか_のみ_に影響を与えます。
`exclude`に指定されたファイルは、コードでの`import`や`types`でのインクルード、`/// <reference` ディレクティブ、`files`リストの指定によって、コードベースの一部となり得ます。

`exclude`はコードベースに含まれているファイルの読み込みを**防ぐ**ための仕組みではありません。`include`設定の結果を変更するだけです。
