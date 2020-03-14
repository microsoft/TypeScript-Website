---
display: "Skip Lib Check"
oneline: "Skip type checking of declaration files"
---

型定義ファイルのチェックをスキップします。

型システムの精度を犠牲にすることで、コンパイル実行時間を削減します。
例えば、2つのライブラリが、同じ`type`を一貫性の無い方法で定義していたとします。
すべての`d.ts`ファイルの完全なチェックを行わずに、TypeScriptはアプリケーション内のソースコードで明示的に参照しているコードの型をチェックします。

`skipLibCheck`の利用を検討する一般的なケースは、あるライブラリの型定義が`node_modules`内にコピーされて複数存在している場合です。
このようなケースでは、
[yarn's resolutions](https://yarnpkg.com/lang/en/docs/selective-version-resolutions/)のような機能の利用を検討してツリーにおける該当の依存関係のコピーが1つだけであることを確認するか、
追加のツールを使わずに問題を修正するために依存関係の解決を理解して、コピーが1つだけであることを確認する方法を調査する必要があります。
