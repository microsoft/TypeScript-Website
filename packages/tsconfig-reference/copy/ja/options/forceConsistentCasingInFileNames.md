---
display: "Force Consistent Casing In File Names"
oneline: "Ensure that casing is correct in imports"
---

TypeScriptが大文字小文字を区別するかどうかは、動作しているファイルシステムに従います。
これが問題になるのは、ある開発者はケースセンシティブなファイルシステムで作業をしている一方で、別の開発者はそうではない場合です。
あるファイルが`fileManager.ts`のImportを`./FileManager.ts`と指定したとき、ケースセンシティブでないファイルシステムではファイルが見つかりますが、ケースセンシティブなファイルシステムでは見つかりません。

このオプションを有効化すると、TypeScriptはプログラムがディスク上の大文字小文字と異なるファイルをインクルードしようとした場合にエラーを発生させます。
