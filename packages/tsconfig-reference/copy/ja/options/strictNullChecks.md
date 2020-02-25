---
display: "Strict Null Checks"
oneline: "Ensure that nullability is respected in the type checker"
---

`strictNullChecks`が`false`のとき、`null`と`undefined`は言語により事実上無視されます。
これは実行時の予期しないエラーの原因となります。

`strictNullChecks`が`true`のとき、`null`と`undefined`はそれ自身に明示的な型が与えられ、具体的な値を期待して利用しようとした場合にエラーとなります。

例えば、次のTypeScriptコードの`users.find`は実際にユーザーを見つけられる保証がありません。
しかし、ユーザーを見つけられたかのようにコードを書くことができます:

```ts twoslash
// @strictNullChecks: false
// @target: ES2015
declare const loggedInUsername: string;

const users = [
  { name: "Oby", age: 12 },
  { name: "Heera", age: 32 }
];

const loggedInUser = users.find(u => u.name === loggedInUsername);
console.log(loggedInUser.age);
```

`strictNullChecks`を`true`にすると、`loggedInUser`を利用する前に存在を確認していないことを示すエラーが発生します。

```ts twoslash
// @errors: 2339 2532
// @target: ES2020
// @strictNullChecks
declare const loggedInUsername: string;

const users = [
  { name: "Oby", age: 12 },
  { name: "Heera", age: 32 }
];

const loggedInUser = users.find(u => u.name === loggedInUsername);
console.log(loggedInUser.age);
```

単純化してみると配列の`find`関数が次のようになっていることから、2つ目の例はエラーとなったのです:


```ts
// strictNullChecks: trueのとき
type Array = {
  find(predicate: (value: any, index: number) => boolean): S | undefined;
};

// strictNullChecks: falseのとき、undefinedは型システムから取り除かれ、
// 常に結果が見つかるかのようにコードを書けるようになります
type Array = {
  find(predicate: (value: any, index: number) => boolean): S;
};
```
