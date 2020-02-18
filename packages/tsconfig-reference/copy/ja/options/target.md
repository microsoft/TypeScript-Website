---
display: "Target"
oneline: "Set the supported JavaScript language runtime to transpile to"
---

モダンブラウザーはすべてのES6機能をサポートしているため、`ES6`は良い選択です。
もし、コードをより古い環境へデプロイするのであれば、より下位の値を、逆により新しい環境での動作が保証される場合は、より上位の値をターゲットとして選択してください。

`target`設定は、どのJS機能が古いJavaScript構文にトランスパイルされ、どの機能がそのまま残されるかを変更します。
例えば`target`がES5以下である場合、アロー関数`() => this`は等価な`function`式へ変換されます。

`target`の変更は[`lib`](#lib)のデフォルト値も変更します。
必要に応じて`target`と`lib`の値を組み合わせることも可能ですが、簡単に`target`の値のみを設定することも可能です。

もし動作環境がNode.jsのみであるならば、Nodeのベースバージョン毎に推奨される`target`は次のとおりです:

| Name    | Supported Target |
| ------- | ---------------- |
| Node 8  | `ES2017`         |
| Node 10 | `ES2018`         |
| Node 12 | `ES2019`         |

この表は[node.green](https://node.green)のデータベースを元に作成しています。

`ESNext` という特別な値はTypeScriptがサポートしている最新のターゲットバージョンを参照します。
この設定値は、異なるTypeScriptのバージョン間におけるターゲットバージョンの一致を意味せず、アップグレード予測が困難になる可能性があるため、注意して利用する必要があります。
