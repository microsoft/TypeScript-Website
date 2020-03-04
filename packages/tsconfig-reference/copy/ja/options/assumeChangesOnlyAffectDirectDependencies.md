---
display: "Assume Changes Only Affect Direct Dependencies"
oneline: "A drastically faster, but occasionally inaccurate watch mode option."
---

このオプションを設定すると、TypeScriptは本当に影響を受ける可能性があるすべてのファイルの再チェック/再ビルドを避け、変更されたファイルとそれらを直接importしているファイルのみを再チェック/再ビルドするようになります。

これは監視アルゴリズムの「高速で緩い」実装と見なせます。これにより、すべてのコンパイルエラーメッセージを得るためにフルビルドが必要になりますが、インクリメンタルビルドの再ビルド時間を大幅に短縮できます。
