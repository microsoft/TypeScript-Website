---
title: JavaScriptからの移行
layout: docs
permalink: /ja/docs/handbook/migrating-from-javascript.html
oneline: JavaScriptからTypeScriptに移行する方法
---

TypeScriptはそれ単独で存在しているわけではありません。
JavaScriptのエコシステムを念頭において構築されたものであり、今日ではたくさんのJavaScriptが存在しています。
JavaScriptのコードベースをTypeScriptに移行することは、多少面倒ですが、通常は難しくはありません。
本チュートリアルでは、どのようにして移行を開始するのが良いのかについて見ていきましょう。
新しいTypeScriptコードを記述するためのハンドブックを十分読み込んだことを前提としています。

Reactプロジェクトでの移行を考えているのであれば、まずは[React Conversion Guide](https://github.com/Microsoft/TypeScript-React-Conversion-Guide#typescript-react-conversion-guide)を読むことをおすすめします。

## ディレクトリの設定

素のJavaScriptを書いているならば、JavaScriptを直接実行している可能性が高いです。
この場合、`.js`ファイルは`src`、`lib`、あるいは`dist`ディレクトリに置かれ、必要に応じて実行されていることでしょう。

こうしたケースでは、記述したファイルはTypeScriptの入力として使用され、TypeScriptが生成する出力を実行することになります。
JSからTSへの移行中、TypeScriptが入力ファイルを上書きしないように入力ファイルを分離する必要があります。
出力ファイルを特定のディレクトリに置く必要がある場合、そのディレクトリが出力ディレクトリとなります。

バンドルしたり、Babelのような別のトランスパイラを使ったり、JavaScriptに対して中間ステップを実行していることがあるかもしれません。
この場合は、すでに上述したようなフォルダ構成が設定されている可能性があります。

ここからは、ディレクトリが次のように設定されていると仮定します:

```
projectRoot
├── src
│   ├── file1.js
│   └── file2.js
├── built
└── tsconfig.json
```

`src`ディレクトリの外に`tests`フォルダがある場合、`src`の中に`tsconfig.json`をひとつ置き、`tests`の中にもひとつ置くことができます。

## 設定ファイルの記述

TypeScriptは、どのファイルを含めたいのか、どの種類のチェックを実行したいのかといったプロジェクトの設定を管理する`tsconfig.json`と呼ばれるファイルを使用します。
プロジェクトにとって必要最低限の設定ファイルを作成してみましょう:

```json
{
  "compilerOptions": {
    "outDir": "./built",
    "allowJs": true,
    "target": "es5"
  },
  "include": ["./src/**/*"]
}
```

上記では、TypeScriptに対して数点指定しています:

1. `src`ディレクトリにある解釈可能なファイルを読み込む(`include`にて)
2. JavaScriptファイルを入力ファイルとして許可する(`allowJs`にて)
3. `built`ディレクトリにすべての出力ファイルを出力する(`outDir`にて)
4. 新しいJavaScriptの構造をECMAScript5のようなより古いバージョンに変換する(`target`にて)

この時点でプロジェクトのルートで`tsc`を実行してみると、`built`ディレクトリに出力ファイルが確認できるはずです。
`built`にあるファイルのレイアウトは`src`のものと同じように見えるでしょう。
これで、あなたのプロジェクトにおいて、TypeScriptが動作するようになりました。

## 初期に導入することによるメリット

この段階でも、TypeScriptがあなたのプロジェクトを理解することで受けられるメリットがいくつかあります。
[VS Code](https://code.visualstudio.com)や[Visual Studio](https://visualstudio.com)のようなエディタを開くと、補完などのツールによるサポートをたびたび受けられることが確認できるでしょう。
また、以下のようなオプションを設定することで、特定のバグを発見することもできます:

- `noImplicitReturns`は、関数の最後の戻り値の設定忘れを防止します。
- `noFallthroughCasesInSwitch`は、`switch`ブロックの`case`間で`break`文を忘れたくない時に便利です。

TypeScriptは、到達不可能なコードやラベルについても警告します。この警告は、それぞれ`allowUnreachableCode`と`allowUnusedLabels`でオフにできます。

## ビルドツールとの統合

パイプラインにもっと多くのビルドステップが存在しているかもしれません。
もしかしたらそれぞれのファイルに何か他のファイルを連結していることもあるでしょう。
それぞれビルドツールは異なりますが、ここではその要点をできる限りカバーします。

## Gulp

Gulpを何らかの方法で使用してる場合は、TypeScriptと[Gulpの使用](/docs/handbook/gulp.html)について、およびBrowserify、Babelify、Uglifyといった一般的なビルドツールとの統合についてのチュートリアルがあります。
詳しくはそちらをご確認ください。

## Webpack

Webpackとの統合はとても簡単です。
TypeScriptローダーである`ts-loader`と、デバッグを簡単にするための`source-map-loader`を組み合わせることができます。
次のコマンドを実行します

```shell
npm install ts-loader source-map-loader
```

そして、以下のオプションを`webpack.config.js`ファイルにマージします:

```js
module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "./dist/bundle.js",
  },

  // webpack の出力をデバッグするためのソースマップを有効にします。
  devtool: "source-map",

  resolve: {
    // 解決可能な拡張子として'.ts'と'.tsx'を追加します。
    extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
  },

  module: {
    rules: [
      // '.ts'または'.tsx'拡張子を持つすべてのファイルは'ts-loader'によって処理されます。
      { test: /\.tsx?$/, loader: "ts-loader" },

      // 出力されるすべての'.js'ファイルは'source-map-loader'によって再処理されたソースマップを持ちます。
      { test: /\.js$/, loader: "source-map-loader" },
    ],
  },

  // その他のオプション...
};
```

重要なのは、`.js`ファイルを扱う他のどのローダーよりも先に、ts-loaderを実行する必要があるという点です。

WebpackのもうひとつのTypeScriptローダーである[awesome-typescript-loader](https://github.com/TypeStrong/ts-loader)でも同様です。
この2つの違いについては、[こちら](https://github.com/s-panferov/awesome-typescript-loader#differences-between-ts-loader)を参照してください。

Webpackを使用している例は、[ReactとWebpackのチュートリアル](/docs/handbook/react-&-webpack.html)で確認することができます。

## TypeScriptファイルに移行する

ここまでで、TypeScriptファイルを使い始める準備ができたことでしょう。
移行の最初のステップとして、`.js`ファイルを`.ts`にリネームします。
もしファイルがJSXを使用している場合は、`.tsx`にリネームする必要があります。

このステップを終えましたか？
いいですね！
これでJavaScriptからTypeScriptへのファイルの移行に成功しました！

もちろん、このステップが正しくないと思うかもしれません。
TypeScriptサポートがあるエディタでファイルを開く(あるいは `tsc --pretty` を実行する)と、特定の行に赤い波線が表示されている可能性があります。
これは、Microsoft Wordようなエディタの赤い波線と同じように考えてください。
赤い波線があってもWordで文書を印刷することができるのと同じように、赤い波線があってもTypeScriptはコードを変換します。

これが手抜きだと思うならば、このふるまいを厳しくすることができます。
例えば、エラーがあるときはTypeScriptにJavaScriptへのコンパイルを _させたくない_ 場合、`noEmitOnError`オプションを使うことができます。
そうした意味では、TypeScriptには厳しさの調整つまみがあり、そのつまみを好きなだけ強くすることができると言えます。

もし利用可能なより厳しい設定を使用するつもりならば、今のうちに設定を有効化しておくのがベストです(後述の[より厳密なチェック](#getting-stricter-checks)を確認してください)。
例えば、明示的に指定していない型をTypeScriptが`any`と暗黙的に推測することを望まない場合、ファイルの修正を始める前に`noImplicitAny`を使いましょう。
修正すべきコードが多くて多少困惑するかもしれませんが、長期的な利益をかなり早い時点で受けることができます。

## エラーの除去

前述したように、変換後にエラーメッセージが出ることは予測できないことではありません。
重要なことは、実際にエラーをひとつひとつ確認して、そのエラーにどう対処するかを決めることです。
多くの場合、これらは妥当なバグなのですが、時には何をしようとしているのかをTypeScriptにもう少し上手に説明しなければならないこともあるでしょう。

### Modulesからのインポート

最初は、`Cannot find name 'require'.`や`Cannot find name 'define'.`といったエラーがたくさん表示されるかもしれません。
このようなケースでは、おそらくモジュールを使用していることでしょう。
これらの呼び出しが存在していることをTypeScriptに確信させるには、次のようなコードや

```ts
// Node/CommonJS用
declare function require(path: string): any;
```

あるいは次のようなコード

```ts
// RequireJS/AMD用
declare function define(...args: any[]): any;
```

を記述することもできますが、これらの呼び出しを削除し、インポートにはTypeScriptの構文を使った方が良いでしょう。

まず、TypeScriptの`module`フラグを設定してモジュールシステムを有効化する必要があります。
有効なオプションは、`commonjs`、`amd`、`system`そして`umd`です。

以下のようなNode/CommonJSコード:

```js
var foo = require("foo");

foo.doStuff();
```

あるいは次のような RequireJS/AMDコードがあったとします:

```js
define(["foo"], function (foo) {
  foo.doStuff();
});
```

その場合、次のようなTypeScriptコードを記述することになります:

```ts
import foo = require("foo");

foo.doStuff();
```

### 宣言ファイルの取得

TypeScriptのインポートに変換し始めた場合、おそらく`Cannot find module 'foo'.`といったエラーに遭遇するでしょう。
ここでの問題は、ライブラリを記述するための _宣言ファイル_ を持っていないことです。
幸運なことに、これはとても簡単に解決できます。
TypeScriptが`lodash`のようなパッケージについて文句を言ってきたら、ただ次のように記述すればよいのです

```shell
npm install -S @types/lodash
```

もし、`commonjs`以外のモジュールオプションを使用しているならば、`moduleResolution`オプションに`node`を設定する必要があるでしょう。

これで、問題なくlodashをインポートして、正確な補完を得ることができます。

### モジュールからのエクスポート

通常、モジュールからのエクスポートは、`exports`や`module.exports`のような値にプロパティを追加することを必要とします。
TypeScriptでは、トップレベルのエクスポート宣言を使うことができます。
例えば、次のような関数をエクスポートしたとします:

```js
module.exports.feedPets = function (pets) {
  // ...
};
```

これは、次のように記述することもできます:

```ts
export function feedPets(pets) {
  // ...
}
```

時々、exportsオブジェクトを完全に上書きすることがあります。
これは、以下のスニペットのように、すぐに呼び出すことのできるモジュールを作成するために、よく使われるパターンです:

```js
var express = require("express");
var app = express();
```

以前は次のように記述していたかもしれません:

```js
function foo() {
  // ...
}
module.exports = foo;
```

TypeScriptでは、`export =`構造体でモデル化することができます。

```ts
function foo() {
  // ...
}
export = foo;
```

### 多すぎる/少なすぎる引数

多すぎる/少なすぎる引数で関数を呼び出していることに気づくことが時々あります。
通常、これはバグですが、場合によってはパラメータを記述する代わりに`arguments`オブジェクトを使用する関数を宣言しているかもしれません。

```js
function myCoolFunction() {
  if (arguments.length == 2 && !Array.isArray(arguments[1])) {
    var f = arguments[0];
    var arr = arguments[1];
    // ...
  }
  // ...
}

myCoolFunction(
  function (x) {
    console.log(x);
  },
  [1, 2, 3, 4]
);
myCoolFunction(
  function (x) {
    console.log(x);
  },
  1,
  2,
  3,
  4
);
```

この場合、関数のオーバーロードを使って`myCoolFunction`を呼び出すことのできる方法を、呼び出し元に伝えるためにTypeScriptを使用する必要があります。

```ts
function myCoolFunction(f: (x: number) => void, nums: number[]): void;
function myCoolFunction(f: (x: number) => void, ...nums: number[]): void;
function myCoolFunction() {
  if (arguments.length == 2 && !Array.isArray(arguments[1])) {
    var f = arguments[0];
    var arr = arguments[1];
    // ...
  }
  // ...
}
```

2つのオーバーロードシグネチャを`myCoolFunction`に追加しました。
最初の関数シグネチャは、`myCoolFunction`が(`number`を受け取る)関数を受け取り、次に`number`のリストを受け取ることを示しています。
二番目は、同様に関数を受け取り、レストパラメータ(`...nums`)を使ってそれ以降の引数は任意の数の`number`である必要があることを示しています。

### 順次追加されるプロパティ

次のように、オブジェクトを作成してその後すぐにプロパティを追加するほうが、審美性が高いと思う人もいます:

```js
var options = {};
options.color = "red";
options.volume = 11;
```

TypeScriptは、`options`型をプロパティを持たない`{}`として最初に理解したので、`color`と`volume`を代入できないと言うでしょう。
プロパティの宣言をオブジェクトリテラルの中に移動させれば、エラーが発生しません:

```ts
let options = {
  color: "red",
  volume: 11,
};
```

また、`options`型を定義して、オブジェクトリテラルに型アサーションを追加することができます。

```ts
interface Options {
  color: string;
  volume: number;
}

let options = {} as Options;
options.color = "red";
options.volume = 11;
```

あるいは、`options`は、`any`型であると指定することもできます。これが最も簡単な方法ですが、メリットは最も少ないです。

### `any`、`Object`、そして`{}`

`Object`は、ほとんどの場合最も一般的な型なので、値に任意の型を持たせるために、`Object`や`{}`を使いたくなるかもしれません。
しかし、このような場合では **`any`こそ実際に使用したい型**です。というのも、これこそが最も _柔軟な_ 型だからです。

例えば、`Object`と型が付けられているものでは、`toLowerCase()`のようなメソッドを呼び出すことはできません。
より一般的な型であるということは、通常、型でできることは少なくなるということを意味しますが、`any`は最も一般的な型でありながら何でもできるという点で特別です。
つまり、呼び出したり、コンストラクタとして使えたり、プロパティにアクセスしたりなどができるということです。
しかし、`any`を使うと常に、TypeScriptが提供するエラーチェックやエディタサポートが失われるということは覚えておいてください。

もし、`Object`か`{}`を選ぶことになったら、`{}`を選ぶべきです。
2つはほとんど同じですが、特定の難解なケースでは`{}`のほうが`Object`より技術的に一般的な型です。

## より厳密なチェック

TypeScriptには、安全性を高めプログラムの解析を向上させるための、あるチェック機能が備わっています。
ひとたびコードベースをTypeScriptに変換したら、安全性を高めるために、これらのチェックを有効化することができます。

### 暗黙的な`any`の禁止

TypeScriptがある種の型が何であるかを理解できない場合があります。
できる限り型の選択肢を緩くするために、TypeScriptは代わりに`any`を使うことになるでしょう。
この決定はTypeScriptへの移行という点では最適ですが、`any`を使うことは型の安全性が得られないということを意味し、他のところで得られていたツールサポートも得られません。
`noImplicitAny`を使えば、TypeScriptに対してこうした箇所に印をつけてエラーを出すように指示することができます。

### 厳密な`null`と`undefined`チェック

デフォルトでは、TypeScriptは`null`と`undefined`があらゆるの型の領域にあると仮定しています。
つまり、`number`型で宣言されたものはすべて`null`や`undefined`になる可能性があるということです。
`null`や`undefined`はJavaScriptやTypeScriptで頻繁にバグの原因となるため、TypeScriptには`strictNullChecks`オプションがあり、こういった問題を心配するストレスを軽減してくれます。

`strictNullChecks`を有効にすると、`null`と`undefined`はそれぞれ`null`と`undefined`という独自の型を取得します。
何らかの値が`null`である _可能性がある_ 場合は常に元の型とのUnion型を使うことができます。
例えば、ある値が`number`や`null`になる可能性がある場合、その型を`number | null`と記述します。

もし、TypeScriptが`null`/`undefined`の可能性があると考えている値があったとしても、あなたがその可能性がないことを知っている場合は、接尾辞`!`演算子を使って、そう伝えることができます。

```ts
declare var foo: string[] | null;

foo.length; // エラー - 'foo'は'null'の可能性があります

foo!.length; // OK - 'foo!'は'string[]'型だけです
```

注意点として、`strictNullChecks`を使う場合は、同様に`strictNullChecks`を使うように依存関係を更新する必要があるかもしれません。

### `this`に対する暗黙的な`any`の禁止

クラスの外側で`this`キーワードを使用する場合、デフォルトでは`any`型となります。
例えば、`Point`クラスがあり、メソッドとして追加したい関数があるとしましょう:

```ts
class Point {
  constructor(public x, public y) {}
  getDistance(p: Point) {
    let dx = p.x - this.x;
    let dy = p.y - this.y;
    return Math.sqrt(dx ** 2 + dy ** 2);
  }
}
// ...

// インターフェースを再定義する
interface Point {
  distanceFromOrigin(): number;
}
Point.prototype.distanceFromOrigin = function () {
  return this.getDistance({ x: 0, y: 0 });
};
```

これは、前述したものと同じ問題があります - `getDistance`のスペルを間違えてしまうかもしれませんし、その場合エラーも出ません。
このため、TypeScriptには、`noImplicitThis`オプションがあります。
このオプションが設定されていれば、TypeScriptは、`this`が明示的な(あるいは推測された)型を持たないで使用された場合、エラーを出します。
修正するには、`this`パラメータを使ってインターフェースや関数自体の中で明示的な型を与えます。

```ts
Point.prototype.distanceFromOrigin = function (this: Point) {
  return this.getDistance({ x: 0, y: 0 });
};
```
