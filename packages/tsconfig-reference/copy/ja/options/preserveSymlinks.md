---
display: "Preserve Symlinks"
oneline: "Do not resolve symlink paths"
---

シンボリックリンクを実体パスへ解決しないというNode.jsの同名フラグを反映したオプションです。

このフラグはWebpackの`resolve.symlinks`オプションと逆の動作をします（つまり、TypeScriptの`preserveSymlinks`をtrueに設定することは、Webpackの`resolve.symlinks`をfalseに設定することと同等です。逆も然りです）。

このオプションを有効化すると、モジュールとパッケージへの参照（例えば、`import`や`/// <reference type="..." />` ディレクティブ）は、シンボリックリンクが解決する場所としてではなく、そのシンボリックリンクファイルからの相対パスとして解決されます。
