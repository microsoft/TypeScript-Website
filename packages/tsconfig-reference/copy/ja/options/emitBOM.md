---
display: "Emit BOM"
oneline: "Include a byte order mark to output files"
---

TypeScriptがファイルを書き込むときに[バイトオーダーマーク（BOM）](https://wikipedia.org/wiki/Byte_order_mark)を出力するかどうかを制御します。
一部の実行環境ではJavaScriptファイルを正しく解釈するために、BOMが必要となりますが、他の実行環境ではBOMの存在を許容しません。
デフォルト値の`false`は一般的に最適な値ですが、必要であれば変更できます。
