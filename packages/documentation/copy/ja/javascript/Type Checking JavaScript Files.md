---
title: JavaScriptファイルの型チェック
layout: docs
permalink: /ja/docs/handbook/type-checking-javascript-files.html
oneline: TypeScriptを使ってJavaScriptファイルに型チェックを追加する方法
---

ここでは、`.js`ファイルを`.ts`ファイルと比較したときの、チェック機能の違いについて注目すべき点をいくつか挙げます。

## プロパティはクラス本体における代入から推測される

ES2015には、クラスのプロパティを宣言する手段がありません。プロパティはオブジェクトリテラルのように、動的に代入されます。

`.js`ファイルでは、コンパイラはクラス本体のプロパティの代入からプロパティを推測します。
コンストラクタで型が定義されていない場合や、コンストラクタでの型がundefinedまたはnullである場合を除いて、プロパティの型はコンストラクタ内で与えられた型になります。
プロパティの型がコンストラクタ内で与えられない場合、プロパティの型は、プロパティの代入式におけるすべての右辺の値の型によるUnion型となります。
メソッドやgetter、setter内で定義されたプロパティは任意とみなされるのに対して、コンストラクタで定義されたプロパティは常に存在するものとみなされます。

```js twoslash
// @checkJs
// @errors: 2322
class C {
  constructor() {
    this.constructorOnly = 0;
    this.constructorUnknown = undefined;
  }
  method() {
    this.constructorOnly = false;
    this.constructorUnknown = "plunkbat"; // ok、constructorUnknown は string | undefined です
    this.methodOnly = "ok"; // ok、しかし、methodOnlyはundefinedの可能性もあります
  }
  method2() {
    this.methodOnly = true; // こちらもokです。methodOnlyの型は string | boolean | undefined です
  }
}
```

クラス本体でプロパティが設定されていない場合、そのプロパティは未知のものとみなされます。
クラスプロパティが読み取り専用ならば、コンストラクタにプロパティを追加した後に、型指定のためJSDocを使って型宣言の注釈を付けます。
後で初期化されるのであれば、値を指定する必要さえありません:

```js twoslash
// @checkJs
// @errors: 2322
class C {
  constructor() {
    /** @type {number | undefined} */
    this.prop = undefined;
    /** @type {number | undefined} */
    this.count;
  }
}

let c = new C();
c.prop = 0; // OK
c.count = "string";
```

## コンストラクタ関数はクラスと同等である

ES2015以前のJavascriptでは、クラスの代わりにコンストラクタ関数が使われていました。
コンパイラはこうしたパターンをサポートしており、コンストラクタ関数をES2015のクラスと同等のものとして理解します。
上記で説明したプロパティの推論ルールも全く同じように動作します。

```js twoslash
// @checkJs
// @errors: 2683 2322
function C() {
  this.constructorOnly = 0;
  this.constructorUnknown = undefined;
}
C.prototype.method = function () {
  this.constructorOnly = false;
  this.constructorUnknown = "plunkbat"; // OK、型はstring | undefinedです
};
```

## CommonJSモジュールがサポートされている

`.js`ファイルでは、TypeScriptはCommonJSモジュール形式をサポートしています。
`exports`や`module.exports`への代入は、エクスポート宣言として認識されていますし、
同様に`require`関数の呼び出しも、モジュールインポートとして認識されます。例えば:

```js
// `import module "fs"`と同じ
const fs = require("fs");

// `export function readFile`と同じ
module.exports.readFile = function (f) {
  return fs.readFileSync(f);
};
```

JavaScriptのモジュールサポートは、TypeScriptのモジュールサポートよりも構文的に寛容です。
ほとんどの代入と宣言の組み合わせがサポートされています。

## クラス、関数、オブジェクトリテラルは名前空間を作る

クラスは`.js`ファイルにおける名前空間を作成します。
これを利用してクラスをネストすることができます。例えば:

```js twoslash
class C {}
C.D = class {};
```

また、ES2015以前のコードのための擬似的な静的メソッドとしても利用できます:

```js twoslash
function Outer() {
  this.y = 2;
}

Outer.Inner = function () {
  this.yy = 2;
};

Outer.innter();
```

シンプルな名前空間を作成することにも使えます:

```js twoslash
var ns = {};
ns.C = class {};
ns.func = function () {};

ns;
```

その他の変形も同様に可能です:

```js twoslash
// IIFE (即時実行関数式)
var ns = (function (n) {
  return n || {};
})();
ns.CONST = 1;

// グローバル名前空間をデフォルトにする
var assign =
  assign ||
  function () {
    // ここにコードを記述する
  };
assign.extra = 1;
```

## オブジェクトリテラルは無制限型である

`.ts`ファイルにおいて、変数宣言を初期化するオブジェクトリテラルは、宣言に型を与えます。
元のリテラルで指定されていない新しいメンバを追加することはできません。
このルールは`.js`ファイルでは緩和されています; オブジェクトリテラルには無制限型(インデックスシグネチャ)があり、元々定義されていないプロパティを追加したり検索したりすることができます。
例えば:

```js twoslash
var obj = { a: 1 };
obj.b = 2; // これは許容されます
```

オブジェクトリテラルはインデックスシグネチャ `[x:string]: any` を持っているかのように動作し、制限をもつオブジェクトではなく無制限のマップとして扱うことができます。

他の特別なJSチェックの動作と同様に、変数にJSDoc型を指定することでこの動作を変更することができます。例えば:

```js twoslash
// @checkJs
// @errors: 2339
/** @type {{a: number}} */
var obj = { a: 1 };
obj.b = 2;
```

## null、undefined、空の配列の初期化子はanyまたはany[]型を付ける

nullまたはundefinedで初期化されたパラメータやプロパティは、厳密なnullチェックが有効化されていたとしても、any型になります。
[]で初期化されたパラメータやプロパティは、厳密なnullチェックが有効化されていたとしても、any[]型になります。
唯一の例外は上記で説明した初期化子を複数持つプロパティの場合です。

```js twoslash
function Foo(i = null) {
  if (!i) i = 1;
  var j = undefined;
  j = 2;
  this.l = [];
}

var foo = new Foo();
foo.l.push(foo.i);
foo.l.push("end");
```

## 関数のパラメータはデフォルトでは任意である

ES2015以前のJavascriptでは、パラメータが任意かどうかを指定する方法がないため、`.js`ファイルの関数パラメータはすべて任意とみなされます。
宣言されたパラメータ数よりも少ない引数で、関数を呼び出すことが可能です。

宣言された数より、引数の数が多い関数を呼び出すとエラーになるので注意が必要です。

例えば:

```js twoslash
// @checkJs
// @strict: false
// @errors: 7006 7006 2554
function bar(a, b) {
  console.log(a + " " + b);
}

bar(1); // OK、二番目の引数は任意とみなされます
bar(1, 2);
bar(1, 2, 3); // エラー、引数が多すぎます
```

JSDocの注釈付き関数はこの規則から除外されます。
任意であることを表すには、JSDocの任意パラメータ構文(`[` `]`)を使用します。例えば:

```js twoslash
/**
 * @param {string} [somebody] - 誰かの名前
 */
function sayHello(somebody) {
  if (!somebody) {
    somebody = "John Doe";
  }
  console.log("Hello " + somebody);
}

sayHello();
```

## 可変長引数のパラメータ宣言は、`arguments`の使い方から推測される

関数本体で`arguments`を参照すると、暗黙的に可変長引数パラメータ(つまり: `(...arg: any[]) => any`)を持っているとみなされます。JSDocの可変長引数構文を使って、引数の型を指定します。

```js twoslash
/** @param {...number} args */
function sum(/* numbers */) {
  var total = 0;
  for (var i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}
```

## 未指定の型パラメータのデフォルトは`any`である

Javascriptにはジェネリクス型のパラメータを指定するための標準構文がないため、未指定の型パラメータはデフォルトで`any`となります。

### extends句において

例えば、`React.Component`は、`Props`と`State`の2つの型パラメータを持つように定義されています。
`.js`ファイルでは、extends句でこれらを指定する正しい方法はありません。型引数はデフォルトで`any`となります:

```js
import { Component } from "react";

class MyComponent extends Component {
  render() {
    this.props.b; // this.propsはany型なので、許可されています
  }
}
```

JSDocの`@augments`を使って明示的に型を指定します。例えば:

```js
import { Component } from "react";

/**
 * @augments {Component<{a: number}, State>}
 */
class MyComponent extends Component {
  render() {
    this.props.b; // エラー: b は {a:number} に存在しません
  }
}
```

### JSDocリファレンスにおいて

JSDocで指定されていない型引数のデフォルトはanyです:

```js twoslash
/** @type{Array} */
var x = [];

x.push(1); // OK
x.push("string"); // OK、xはArray<any>型です

/** @type{Array.<number>} */
var y = [];

y.push(1); // OK
y.push("string"); // エラー、stringはnumberに代入できません
```

### 関数呼び出しにおいて

ジェネリクス関数の呼び出しでは、引数から型パラメータを推論します。この処理では、主に推論の根拠がないために型の推論に失敗することが時たまあります。そのような場合、型パラメータはデフォルトで`any`となります。例えば:

```js
var p = new Promise((resolve, reject) => {
  reject();
});

p; // Promise<any>;
```

JSDocで利用可能なすべての機能を知りたい場合は、[リファレンス](/docs/handbook/jsdoc-supported-types.html)を参照してください。
