---
display: "Isolated Modules"
oneline: "Ensure that each file can be safely transpiled without relying on other imports"
---

TypeScriptをTypeScriptコードからJavaScriptコードを生成する用途で利用可能な一方、[Babel](https://babeljs.io)などの他のトランスパイラの利用も一般的です。
しかし、他のトランスパイラは一度に１ファイルのみを扱うため、全体の型システムの知識に依存したコード変換はできません。
ビルドツールで用いられるTypeScriptの`ts.transpileModule`APIについても、この制約が課せられます。

この制限は、TypeScriptの`const enum`や`namespace`のような機能を利用したときに実行時の問題を引き起こします。
`isolatedModules`フラグは、単一ファイルのトランスパイル処理で正しく解釈できないコードが書かれたときに、TypeScriptが警告を与えるように設定します。

このフラグは、コードの挙動を変更せず、また、TypeScriptのチェック・出力プロセスの挙動も変更しません。

`isolatedModules`が有効な場合に機能しないコードをいくつか例示します。

#### 値でない識別子のエクスポート

TypeScriptでは、_型_をインポートしてからエクスポートできます:

```ts twoslash
// @noErrors
import { someType, someFunction } from "someModule";

someFunction();

export { someType, someFunction };
```

`someType`という値は存在しないため、出力された`export`文はエクスポートを試行しません（これはJavaScriptの実行時エラーになります）:


```js
export { someFunction };
```

単一ファイルのトランスパイラは、`someType`が値なのかどうかを知らないため、型のみを参照した名前をエクスポートするエラーになります。

#### Moduleでないファイル

`isolatedModules`が設定されている場合、すべての実装ファイルは_Module_でなくてはなりません（`import`/`export`の形式を利用しているという意味）。ファイルがModuleでない場合、エラーが発生します。

```ts twoslash
// @errors: 1208
// @isolatedModules
function fn() {}
```

この制約は`.d.ts`ファイルには適用されません。

#### `const enum`メンバーへの参照

TypeScriptでは、`const enum`のメンバへ参照すると、出力されるJavaScriptでは、その参照は実際の値へと置換されます。TypeScriptによる変換は次のようになります:

```ts twoslash
declare const enum Numbers {
  Zero = 0,
  One = 1
}
console.log(Numbers.Zero + Numbers.One);
```

JavaScriptでは:

```ts twoslash
// @showEmit
// @removeComments
declare const enum Numbers {
  Zero = 0,
  One = 1
}
console.log(Numbers.Zero + Numbers.One);
```

他のトランスパイラはメンバー値の知識無しに`Numbers`への参照を置換できません。これが取り残されると、実行時のエラーとなります（なぜなら`Numbers`オブジェクトは実行時に存在しないからです）。
したがって、`isolatedModules`が設定されている場合、`const enum`メンバーへのアンビエント参照はエラーとなります。
