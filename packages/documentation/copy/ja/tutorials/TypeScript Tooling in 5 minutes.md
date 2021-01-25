---
title: 5分でわかるTypeScriptツール
layout: docs
permalink: /ja/docs/handbook/typescript-tooling-in-5-minutes.html
oneline: TypeScriptで小さなウェブサイトを作る方法を理解するためのチュートリアル
translatable: true
---

TypeScriptを使って簡単なWebアプリケーションを作ることからはじめてみましょう。

## TypeScriptのインストール

プロジェクトでTypeScriptを利用できるようにするには、主に2つの方法があります:

- npm(Node.jsのパッケージマネージャー)を使う
- TypeScriptのVisual Studioプラグインをインストールする

Visual Studio 2017とVisual Studio 2015 Update 3にはTypeScriptがデフォルトで含まれています。
Visual StudioにTypeScriptをインストールしなかった場合でも、[ダウンロード](/download)は可能です。

npmを使う場合はこちら:

```shell
> npm install -g typescript
```

## 初めてのTypeScriptファイルの作成

エディタで`greeter.ts`ファイルに次のJavaScriptコードを入力してください:

```ts twoslash
// @noImplicitAny: false
function greeter(person) {
  return "Hello, " + person;
}

let user = "Jane User";

document.body.textContent = greeter(user);
```

## コードのコンパイル

上記で`.ts`拡張子を使いましたが、コードはただのJavaScriptです。
既存のJavaScriptアプリからそのままコピー/ペーストすることもできます。

コマンドラインで、TypeScriptコンパイラを実行します:

```shell
tsc greeter.ts
```

結果は、先ほど入力したJavaScriptと同じものが含まれた`greeter.js`というファイルになります。
つまり、JavaScriptアプリ上でTypeScriptを実行しているのです！

これで、TypeScriptが提供する新しいツールを活用できるようになりました。
次に示すように、関数の引数'person'に対して`: string`という型注釈を付けてみましょう:

```ts twoslash
function greeter(person: string) {
  return "Hello, " + person;
}

let user = "Jane User";

document.body.textContent = greeter(user);
```

## 型注釈

TypeScriptの型注釈は、関数や変数に対する意図的な制約を記録するための軽量な方法です。
この例では、greeter関数を単一の文字列パラメータで呼び出すことを意図しています。
代わりに配列を渡すように、greeterの呼び出しを変更してみましょう:

```ts twoslash
// @errors: 2345
function greeter(person: string) {
  return "Hello, " + person;
}

let user = [0, 1, 2];

document.body.textContent = greeter(user);
```

再コンパイルすると、エラーが表示されます:

```shell
error TS2345: Argument of type 'number[]' is not assignable to parameter of type 'string'.
```

同様に、greeter関数の呼び出しに渡す引数をすべて削除してみてください。
TypeScriptは、予期しない数のパラメータを使ってこの関数を呼び出したことを知らせてくれます。
どちらの場合も、TypeScriptはコードの構造と提供された型注釈に基づいた静的解析を行うことができます。

エラーがあったにもかかわらず`greeter.js`ファイルが生成されたことに注意してください。
コード中にエラーがあってもTypeScriptを使用することはできます。しかし、その場合は、TypeScriptは期待通りに動作しない可能性が高いことを警告しています。

## インターフェース

サンプルをさらに発展させましょう。ここでは、firstNameとlastNameフィールドをもつオブジェクトを記述するインターフェースを使用します。
TypeScript では、2つの型の内部構造に互換性があれば、それらの型は互換性があるとみなされます。
このことにより、明示的な`implements`句がなくても、インターフェースが必要とする形状を持つだけで、インターフェースを実装することができます。

```ts twoslash
interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

let user = { firstName: "Jane", lastName: "User" };

document.body.textContent = greeter(user);
```

## クラス

最後に、クラスを使ってこの例をもう一度だけ拡張してみましょう。
TypeScriptは、クラスベースのオブジェクト指向プログラミングなど、JavaScriptの新しい機能をサポートしています。

ここでは、コンストラクタといくつかのpublicフィールドをもつ`Student`クラスを作成します。
クラスとインターフェースがうまく連携し、プログラマーが適切な抽象度を決定できるようになっていることに注目してください。

また、コンストラクタの引数に`public`を使うことが、その名前のプロパティを自動的に作成する省略表現になっていることにも注意してください。

```ts twoslash
class Student {
  fullName: string;
  constructor(
    public firstName: string,
    public middleInitial: string,
    public lastName: string
  ) {
    this.fullName = firstName + " " + middleInitial + " " + lastName;
  }
}

interface Person {
  firstName: string;
  lastName: string;
}

function greeter(person: Person) {
  return "Hello, " + person.firstName + " " + person.lastName;
}

let user = new Student("Jane", "M.", "User");

document.body.textContent = greeter(user);
```

`tsc greeter.ts`を再実行すると、生成されたJavaScriptが前述のコードと同じであることが確認できます。
TypeScriptのクラスは、JavaScriptで頻繁に使われているプロトタイプベースのオブジェクト指向プログラミングの単なる省略表現にしかすぎません。

## TypeScript の Web アプリを実行

`greeter.html`に次のように入力してください:

```html
<!DOCTYPE html>
<html>
  <head>
    <title>TypeScript Greeter</title>
  </head>
  <body>
    <script src="greeter.js"></script>
  </body>
</html>
```

ブラウザで`greeter.html`を開いて、あなたにとって初めてのシンプルなTypeScriptのWebアプリケーションを実行してみましょう！

任意: `greeter.ts`をVisual Studioで開くか、TypeScriptプレイグラウンドにコードをコピーしてください。
識別子にマウスをホバーすると、その型が表示されます。
型が自動的に推測されているケースもあることに注目してください。
最後の行を再入力すると、DOM要素の型に基づいた補完リストとパラメータのヘルプが表示されます。
greeter関数の参照にマウスを置いて、F12を押せば、関数の定義に移動します。
シンボルを右クリックして、名前を変更するリファクタリングツールを使うことができることにも注目してください。

提供された型情報は、アプリケーションの規模でJavaScriptを操作するツールと連携して動作します。
TypeScriptで可能なことのその他の例ついては、Webサイトのサンプルセクションを参照してください。

![Visual Studio picture](/images/docs/greet_person.png)
