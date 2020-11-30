//// { compiler: {  }, order: 1 }

// JavaScriptの柔軟性を考えると、ランタイムチェックにコードを追加して
// 仮定を検証するというのは良い考えでしょう。

// この検証を行うコードは一般的にアサーション(または不変条件)とよばれ、
// 変数が期待と一致しない場合に早期にエラーを発生させる
// 小さな関数です。

// Nodeには標準でこれを行うための、assertと呼ばれる関数が付属しており、
// インポートなしで使用することができます。

// しかし、ここでは自前で定義してみましょう。 
// valueという式がtrueであることを
// アサートする関数を次のように定義します:
declare function assert(value: unknown): asserts value;

// では、これを使用してEnumの型を検証してみましょう
declare const maybeStringOrNumber: string | number;
assert(typeof maybeStringOrNumber === "string");

// TypeScript 3.7では、コードフロー解析でこのような関数を使い、
// コードがどのようなものであるか把握することができます。そのため、下記の
// 変数にマウスをホバーすると、文字列または数値から単なる文字列に
// 絞り込まれていることがわかります。

maybeStringOrNumber;

// アサーション関数を使えば、推論されたコード全体で型の保証を行うことが
// できます。 
// 例えば、TypeScriptはパラメータに型を追加せずとも、
// 上記のアサート宣言を介して、この関数が数値を返すと
// 知っています。

function multiply(x: any, y: any) {
  assert(typeof x === "number");
  assert(typeof y === "number");

  return x * y;
}

// アサーション関数はタイプガードexample:type-guardsと
// 兄弟関係にありますが、関数を通して継続する場合に制御フローに
// 影響を与えるという点が異なります。

// 例えば、アサーション関数を使って段々とEnumを絞り込むことが
// できます

declare const oneOfFirstFiveNumbers: 1 | 2 | 3 | 4 | 5;

declare function isOdd(param: unknown): asserts param is 1 | 3 | 5;
declare function isBelowFour(param: unknown): asserts param is 1 | 2 | 3 | 4;

// これにより、Enumは次のように絞り込まれるはずです: 1 | 3 | 5

isOdd(oneOfFirstFiveNumbers);
oneOfFirstFiveNumbers;

// さらにこれにより、Enumの取りうる値は次のように切り取られます: 1 | 3

isBelowFour(oneOfFirstFiveNumbers);
oneOfFirstFiveNumbers;

// 上記は、TypeScript 3.7のアサーション関数の
// 機能についての入門です。
// 詳細はリリースノートを確認してください:
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
