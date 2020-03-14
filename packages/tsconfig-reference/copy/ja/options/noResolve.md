---
display: "No Resolve"
oneline: "Skip ahead-of-time checking for import and <reference files"
---

デフォルトでは、TypeScriptは起動時に与えられたファイルについて`import`と`<reference`ディレクティブを確認し、解決されたファイルをプログラムに追加します。

`noResolve`が設定されているとき、このプロセスは発生しなくなります。
しかし、`import`文は正しいモジュールを解決しているかどうかチェックされるため、これが満たされているかどうかを他の方法で確認する必要があります。
