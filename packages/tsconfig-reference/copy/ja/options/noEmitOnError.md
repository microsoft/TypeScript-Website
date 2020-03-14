---
display: "No Emit On Error"
oneline: "Only emit files on a successful compile"
---

エラーがあるときに、JavaScriptソースコードやソースマップファイル、型定義ファイルなどをコンパイラに出力させないようにします。

デフォルト値は`false`であり、このため、すべてのエラーを解決するよりも前に別の環境でコードの変更結果を確認したいといったファイル監視環境において、TypeScriptが扱いやすくなっています。
