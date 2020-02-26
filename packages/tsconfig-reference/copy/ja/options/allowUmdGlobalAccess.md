---
display: "Allow Umd Global Access"
oneline: "Assume UMD imports are all globally available"
---

`allowUmdGlobalAccess`をtrueに設定すると、モジュールの内部からUMDへグローバルにアクセスできるようになります。モジュールファイルとは、importやexportを使っているファイルのことです。このフラグを利用しない場合、UMDモジュールを利用するにはimport宣言文が必要です。

このフラグの利用例は、特定のライブラリ（jQueryやLodashなど）が常に実行時に利用可能であると分かっているが、import文ではそのライブラリにアクセスできないようなwebプロジェクトです。
