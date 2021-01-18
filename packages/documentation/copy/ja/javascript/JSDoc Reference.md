---
title: JSDocリファレンス
layout: docs
permalink: /ja/docs/handbook/jsdoc-supported-types.html
oneline: TypeScriptを備えたJavaScriptはどのようなJSDocをサポートしているか
translatable: true
---

以下のリストは、JavaScriptファイルの型情報を提供する
JSDocアノテーションにおいて、現在サポートされている構文の概要です。

以下に明示的にリストに入っていないタグ(`@async`など)はまだサポートされていないことに注意してください。

- `@type`
- `@param` (or `@arg` or `@argument`)
- `@returns` (or `@return`)
- `@typedef`
- `@callback`
- `@template`
- `@class` (or `@constructor`)
- `@this`
- `@extends` (or `@augments`)
- `@enum`

#### `class`拡張

- [プロパティ修飾子](#jsdoc-property-modifiers) `@public`、`@private`、`@protected`、`@readonly`

タグの意味は通常、[jsdoc.app](https://jsdoc.app)で与えられたものと同じか、あるいはそのスーパーセットです。
以下のコードでは、それぞれのタグの違いを説明し、使用例を示します。

**注意:** [JSDocサポートを探るプレイグラウンド](/play?useJavaScript=truee=4#example/jsdoc-support)を使用できます

## `@type`

"@type"タグを使用すれば、型名(プリミティブ、TypeScript宣言やJSDocの"@typedef"タグで定義されたもの)を参照することができます。
ほとんどのJSDoc型と、[`string`のような最も基本的なもの](/docs/handbook/basic-types.html)から[Conditional Typesのような高度なもの](/docs/handbook/advanced-types.html)まで、あらゆるTypeScriptの型を使うことができます。

```js twoslash
/**
 * @type {string}
 */
var s;

/** @type {Window} */
var win;

/** @type {PromiseLike<string>} */
var promisedString;

// DOMプロパティを使ってHTML要素を指定することができます。
/** @type {HTMLElement} */
var myElement = document.querySelector(selector);
element.dataset.myData = "";
```

`@type`ではUnion型も指定できます &mdash; 例えば、次の型は文字列か真偽値のどちらかになります。

```js twoslash
/**
 * @type {(string | boolean)}
 */
var sb;
```

Union型の場合は、丸括弧は任意であることに注意してください。

```js twoslash
/**
 * @type {string | boolean}
 */
var sb;
```

様々な構文を使って配列の型を指定することができます:

```js twoslash
/** @type {number[]} */
var ns;
/** @type {Array.<number>} */
var nds;
/** @type {Array<number>} */
var nas;
```

オブジェクトリテラル型を指定することもできます。
例えば、'a' (文字列) と 'b' (数値) をプロパティとして持つオブジェクトは次のような構文を使って指定します:

```js twoslash
/** @type {{ a: string, b: number }} */
var var9;
```

JSDocの標準構文かTypeScriptの構文を使えば、文字列と数値のインデックスシグネチャを使ってマップや配列のようなオブジェクトを指定することができます。

```js twoslash
/**
 * 任意の`string`プロパティを`number`にマッピングするマップライクなオブジェクト
 *
 * @type {Object.<string, number>}
 */
var stringToNumber;

/** @type {Object.<number, object>} */
var arrayLike;
```

前述の2つの型は、TypeScriptの型である`{ [x: string]: number }`および`{ [x: number]: any }`と等価です。コンパイラは両方の構文を理解します。

関数は、TypeScriptとClosureのどちらの構文を使っても指定することができます:

```js twoslash
/** @type {function(string, boolean): number} Closure構文 */
var sbn;
/** @type {(s: string, b: boolean) => number} TypeScript構文 */
var sbn2;
```

あるいは、型が特定されていない`Function`型を使うこともできます:

```js twoslash
/** @type {Function} */
var fn7;
/** @type {function} */
var fn6;
```

Closureの他の型でも動作します:

```js twoslash
/**
 * @type {*} - 'any'型になります
 */
var star;
/**
 * @type {?} - 不明な型('any'と同じ)
 */
var question;
```

### キャスト

TypeScriptはClosureからキャスト構文を借用しています。
これにより、丸括弧で囲まれた式の前に`@type`タグを追加することで、型を他の型にキャストすることができます。

```js twoslash
/**
 * @type {number | string}
 */
var numberOrString = Math.random() < 0.5 ? "hello" : 100;
var typeAssertedNumber = /** @type {number} */ (numberOrString);
```

### インポート型

インポート型を使用して他のファイルから宣言をインポートすることもできます。
この構文はTypeScript固有のものであり、JSDocの標準とは異なります:

```js twoslash
// @filename: types.d.ts
export type Pet = {
  name: string,
};

// @filename: main.js
/**
 * @param p { import("./types").Pet }
 */
function walk(p) {
  console.log(`Walking ${p.name}...`);
}
```

インポート型は型エイリアス宣言でも使用できます:

```js twoslash
// @filename: types.d.ts
export type Pet = {
  name: string,
};
// @filename: main.js
// ---cut---
/**
 * @typedef { import("./types").Pet } Pet
 */

/**
 * @type {Pet}
 */
var myPet;
myPet.name;
```

型がわからない場合や型が大きくて型を付けるのが面倒な場合に、インポート型を使ってモジュールから値の型を取得することができます:

```js twoslash
// @filename: accounts.d.ts
export const userAccount = {
  name: "Name",
  address: "An address",
  postalCode: "",
  country: "",
  planet: "",
  system: "",
  galaxy: "",
  universe: "",
};
// @filename: main.js
// ---cut---
/**
 * @type {typeof import("./accounts").userAccount }
 */
var x = require("./accounts").userAccount;
```

## `@param`と`@returns`

`@param`は`@type`と同じ型の構文を使用しますが、パラメータ名を追加します。
また、パラメータ名を角括弧で囲むことで、パラメータを任意のものとして宣言することもできます:

```js twoslash
// パラメータは様々な構文形式で宣言することができます
/**
 * @param {string}  p1 - 文字列パラメータ
 * @param {string=} p2 - 任意のパラメータ(Closure構文)
 * @param {string} [p3] - 任意のパラメータ(JSDoc構文).
 * @param {string} [p4="test"] - デフォルト値を持つ任意のパラメータ
 * @return {string} 結果
 */
function stringsStringStrings(p1, p2, p3, p4) {
  // TODO
}
```

関数の戻り値の型についても同様です:

```js twoslash
/**
 * @return {PromiseLike<string>}
 */
function ps() {}

/**
 * @returns {{ a: string, b: number }} - '@returns'と同じく'@return'を使うことができます
 */
function ab() {}
```

## `@typedef`、`@callback`および`@param`

複雑な型を定義するために`@typedef`を使うことができます。
`@param`を使った同様の構文でも動作します。

```js twoslash
/**
 * @typedef {Object} SpecialType - 'SpecialType'という名前の新しい型を作成
 * @property {string} prop1 - SpecialTypeの文字列プロパティ
 * @property {number} prop2 - SpecialTypeの数値プロパティ
 * @property {number=} prop3 - SpecialTypeの任意の数値プロパティ
 * @prop {number} [prop4] - SpecialTypeの任意の数値プロパティ
 * @prop {number} [prop5=42] - SpecialTypeのデフォルト値を持つ任意の数値プロパティ
 */

/** @type {SpecialType} */
var specialTypeObject;
specialTypeObject.prop3;
```

最初の行には、`object`あるいは`Object`のどちらかを使うことができます。

```js twoslash
/**
 * @typedef {object} SpecialType1 - 'SpecialType'という名前の新しい型を作成
 * @property {string} prop1 - SpecialTypeの文字列プロパティ
 * @property {number} prop2 - SpecialTypeの数値プロパティ
 * @property {number=} prop3 - SpecialTypeの任意の数値プロパティ
 */

/** @type {SpecialType1} */
var specialTypeObject1;
```

`@param`を使えば、同様の構文で一回限りの型を指定することができます。
ネストされたプロパティ名の前には、パラメータ名をつけなければならないことに注意してください:

```js twoslash
/**
 * @param {Object} options - 形状は上記のSpecialTypeと同じ
 * @param {string} options.prop1
 * @param {number} options.prop2
 * @param {number=} options.prop3
 * @param {number} [options.prop4]
 * @param {number} [options.prop5=42]
 */
function special(options) {
  return (options.prop4 || 1001) + options.prop5;
}
```

`@callback`は`@typedef`に似ていますが、オブジェクト型ではなく関数型を指定します:

```js twoslash
/**
 * @callback Predicate
 * @param {string} data
 * @param {number} [index]
 * @returns {boolean}
 */

/** @type {Predicate} */
const ok = (s) => !(s.length % 2);
```

もちろん、これらの型はすべてTypeScriptの構文を使って一行の`@typedef`で宣言することができます:

```js
/** @typedef {{ prop1: string, prop2: string, prop3?: number }} SpecialType */
/** @typedef {(data: string, index?: number) => boolean} Predicate */
```

## `@template`

ジェネリクス関数は`@template`タグを使って宣言することができます:

```js twoslash
/**
 * @template T
 * @param {T} x - 戻り値に流用するジェネリクスパラメータ
 * @return {T}
 */
function id(x) {
  return x;
}

const a = id("string");
const b = id(123);
const c = id({});
```

複数の型パラメータを宣言するには、コンマか複数のタグを使用します:

```js
/**
 * @template T,U,V
 * @template W,X
 */
```

型パラメータ名の前に、型制約を指定することもできます。
リストにある最初の型パラメータだけが、制約を受けます:

```js twoslash
/**
 * @template {string} K - Kは文字列または文字列リテラルでなければなりません
 * @template {{ serious(): string }} Seriousalizable - seriousメソッドを持っていなければなりません
 * @param {K} key
 * @param {Seriousalizable} object
 */
function seriousalize(key, object) {
  // ????
}
```

ジェネリクスのクラスや型の宣言はサポートされていません。

## クラス

クラスはES6のクラスとして宣言することができます。

```js twoslash
class C {
  /**
   * @param {number} data
   */
  constructor(data) {
    // プロパティの型は推測されます
    this.name = "foo";

    // あるいは、明示的に設定することもできます
    /** @type {string | null} */
    this.title = null;

    // また、他のところで設定されている場合は、単に型注釈をつけることもできます
    /** @type {number} */
    this.size;

    this.initialize(data); // initializerは文字列を受け取るので、エラーになるべきです
  }
  /**
   * @param {string} s
   */
  initialize = function (s) {
    this.size = s.length;
  };
}

var c = new C(0);

// Cはnewを使用した場合のみ呼び出されるべきですが、
// JavaScriptでは、以下は許可されており、
// これは'any'型とみなされます。
var result = C(1);
```

次の節で説明するように、コンストラクタ関数として宣言することもできます:

## `@constructor`

コンパイラはthisプロパティの代入に基づいてコンストラクタ関数を推測しますが、`@constructor`タグを追加すればより厳密なチェックとより良い提案を受けることができます:

```js twoslash
// @checkJs
// @errors: 2345 2348
/**
 * @constructor
 * @param {number} data
 */
function C(data) {
  // プロパティの型は推測されます
  this.name = "foo";

  // あるいは、明示的に設定することもできます
  /** @type {string | null} */
  this.title = null;

  // また、他のところで設定されている場合は、単に型注釈をつけることもできます
  /** @type {number} */
  this.size;

  this.initialize(data);
}
/**
 * @param {string} s
 */
C.prototype.initialize = function (s) {
  this.size = s.length;
};

var c = new C(0);
c.size;

var result = C(1);
```

> 注意: エラーメッセージが表示されるのは、[JSConfig](/docs/handbook/tsconfig-json.html)と[`checkJs`](/tsconfig#checkJs)が有効化されているJSコードベースのみです。

`@constructor`では、`this`はコンストラクタ関数`C`の内部でチェックされるので、数値を渡すと`initialize`メソッドへの提案とエラーが表示されます。また、コンストラクタの代わりに`C`を呼び出すと、エディタが警告を表示することもあります。

残念ながら、これは呼び出しも可能なコンストラクタ関数では、`@constructor`を使用できないことを意味します。

## `@this`

コンパイラは通常、`this`が用いられるコンテクストから`this`の型を推測することができます。推測できない場合、`@this`を使って明示的に`this`の型を指定することができます:

```js twoslash
/**
 * @this {HTMLElement}
 * @param {*} e
 */
function callbackForLater(e) {
  this.clientHeight = parseInt(e); // 大丈夫なはず！
}
```

## `@extends`

JavaScriptクラスがジェネリクスの基底クラスを拡張するとき、型パラメータが何であるべきかを指定するところがありません。`@extends`タグはそのような型パラメータを指定する方法を提供しています:

```js twoslash
/**
 * @template T
 * @extends {Set<T>}
 */
class SortableSet extends Set {
  // ...
}
```

`@extends`は、クラスに対してのみ動作することに注意してください。現在、コンストラクタ関数がクラスを拡張する方法はありません。

## `@enum`

`@enum`タグを使うと、すべてのメンバが指定された型であるオブジェクトリテラルを作成することができます。JavaScriptのたいていのオブジェクトリテラルとは異なり、明示されていないメンバは使用できません。

```js twoslash
/** @enum {number} */
const JSDocState = {
  BeginningOfLine: 0,
  SawAsterisk: 1,
  SavingComments: 2,
};

JSDocState.SawAsterisk;
```

注意すべき点は、`@enum`はTypeScriptの`enum`とは大きく異なっており、とてもシンプルです。一方で、TypeScriptの`enum`とは違って、`@enum`は任意の型を持つことができます:

```js twoslash
/** @enum {function(number): number} */
const MathFuncs = {
  add1: (n) => n + 1,
  id: (n) => -n,
  sub1: (n) => n - 1,
};

MathFuncs.add1;
```

## その他の例

```js twoslash
class Foo {}
// ---cut---
var someObj = {
  /**
   * @param {string} param1 - プロパティの割り当てに関する仕様は、
   */
  x: function (param1) {},
};

/**
 * 変数の代入や
 * @return {Window}
 */
let someFunc = function () {};

/**
 * クラスメソッド、
 * @param {string} greeting 使用する挨拶
 */
Foo.prototype.sayHi = (greeting) => console.log("Hi!");

/**
 * アロー関数式でも同様に動作します
 * @param {number} x - 乗数
 */
let myArrow = (x) => x * x;

/**
 * つまり、JSXのステートレス関数コンポーネントでも動作するということです
 * @param {{a: string, b: number}} test - いくつかのパラメータ
 */
var sfc = (test) => <div>{test.a.charAt(0)}</div>;

/**
 * パラメータには、Closure構文を使用して、クラスのコンストラクタを使用することができます。
 *
 * @param {{new(...args: any[]): object}} C - 登録するクラス
 */
function registerClass(C) {}

/**
 * @param {...string} p1 - 文字列の'レストパラメータ'(配列)引数 ('any'として扱われます)
 */
function fn10(p1) {}

/**
 * @param {...string} p1 - 文字列の'レストパラメータ'(配列)引数 ('any'として扱われます)
 */
function fn9(p1) {
  return p1.join();
}
```

## サポートされていないことが知られているパターン

コンストラクタ関数のようにオブジェクトも型を作らない限り、値空間のオブジェクトを型として参照することはできません。

```js twoslash
function aNormalFunction() {}
/**
 * @type {aNormalFunction}
 */
var wrong;
/**
 * 'typeof'を代わりに使用します:
 * @type {typeof aNormalFunction}
 */
var right;
```

オブジェクトリテラル型のプロパティ型の後ろに等号をつけても、任意のプロパティにはなりません:

```js twoslash
/**
 * @type {{ a: string, b: number= }}
 */
var wrong;
/**
 * 代わりにプロパティ名の後ろにクエスチョンマークを付けます:
 * @type {{ a: string, b?: number }}
 */
var right;
```

`strictNullChecks`が有効化されている場合のみ、Nullable型は動作します:

```js twoslash
/**
 * @type {?number}
 * strictNullChecks: trueの場合  -- number | null
 * strictNullChecks: falseの場合 -- number
 */
var nullable;
```

Union型も使うことができます:

```js twoslash
/**
 * @type {number | null}
 * strictNullChecks: trueの場合  -- number | null
 * strictNullChecks: falseの場合 -- number
 */
var unionNullable;
```

非Nullable型は意味を持たず、元の型と同じように扱われます:

```js twoslash
/**
 * @type {!number}
 * 数値型だけをもちます
 */
var normal;
```

JSDocの型システムとは異なり、TypeScriptは型にnullが含まれるかどうか記すことしかできません。
明示的な非Nullable型はありません -- strictNullChecksが有効なら、`number`はNullableではありません。
無効なら、`number`はNullableです。

### サポートされていないタグ

TypeScriptはサポートされていないJSDocタグを無視します。

以下のタグは、サポートを目標とした進行中のIssueがあります:

- `@const` ([issue #19672](https://github.com/Microsoft/TypeScript/issues/19672))
- `@inheritdoc` ([issue #23215](https://github.com/Microsoft/TypeScript/issues/23215))
- `@memberof` ([issue #7237](https://github.com/Microsoft/TypeScript/issues/7237))
- `@yields` ([issue #23857](https://github.com/Microsoft/TypeScript/issues/23857))
- `{@link …}` ([issue #35524](https://github.com/Microsoft/TypeScript/issues/35524))

## JSクラスの拡張

### JSDocプロパティ修飾子

TypeScript 3.8以降、JSDocを使ってクラスプロパティを修飾することができます。まずは、アクセシビリティ修飾子`@public`、`@private`、`@protected`です。
これらのタグは、TypeScriptの`public`、`private`、`protected`とそれぞれ同じように動作します。

```js twoslash
// @errors: 2341
// @ts-check

class Car {
  constructor() {
    /** @private */
    this.identifier = 100;
  }

  printIdentifier() {
    console.log(this.identifier);
  }
}

const c = new Car();
console.log(c.identifier);
```

- `@public`は常に暗黙的に宣言されており、省略可能です。どこからでもプロパティにアクセスできることを意味します。
- `@private`は、そのプロパティが含まれるクラス内でのみ使用可能であることを意味します。
- `@protected`は、そのプロパティが含まれるクラスと、そのクラスの派生クラス内で使用可能ですが、クラスのインスタンスからはアクセスできません。

次に、`@readonly`修飾子を追加しました。これを使用すると、プロパティが初期化時にのみ書き込まれることが保証されます。

```js twoslash
// @errors: 2540
// @ts-check

class Car {
  constructor() {
    /** @readonly */
    this.identifier = 100;
  }

  printIdentifier() {
    console.log(this.identifier);
  }
}

const c = new Car();
console.log(c.identifier);
```
