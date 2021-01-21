---
title: TypeScriptを活用したJSプロジェクト
layout: docs
permalink: /ja/docs/handbook/intro-to-js-ts.html
oneline: TypeScriptを使ってJavaScriptファイルに型チェックを追加する方法
translatable: true
---

TypeScriptの型システムがコードベースを扱う際には、様々な厳密さのレベルがあります:

- JavaScriptのコードを使った推論のみに基づく型システム
- [JSDoc](/docs/handbook/jsdoc-supported-types.html)によるJavaScriptの段階的な型付け
- JavaScriptファイルにおける`// @ts-check`の使用
- TypeScriptコード
- [`strict`](/tsconfig#strict)を有効にしたTypeScript

それぞれのステップはより安全な型システムへの動きを表していますが、すべてのプロジェクトがそのレベルでの検証を必要としているわけではありません。

## JavaScriptと併用するTypeScript

こちらは、オートコンプリートやシンボルへのジャンプといった機能や、リネームなどのリファクタリングツールを提供するためにTypeScriptを使用しているエディタを使う場合です。
[homepage](/)では、TypeScriptプラグインを備えているエディタをリストしています。

## JSDocを使ってJSで型ヒントを提供する

`.js`ファイルでは、多くの場合型を推測することが可能です。型が推測できない場合、JSDoc構文を使って指定することができます。

宣言の前でJSDocのアノテーションを使い、その宣言の型を設定します。例えば:

```js twoslash
/** @type {number} */
var x;

x = 0; // OK
x = false; // OK?!
```

サポートしているJSDocパターンの全リストは[JSDocがサポートする型](/docs/handbook/jsdoc-supported-types.html)にあります。

## `@ts-check`

前述のコードサンプルの最後の行はTypeScriptではエラーとなりますが、JSプロジェクトのデフォルトではエラーを発生させません。
JavaScriptファイルでエラーを有効化するには、`.js`ファイルの最初の行に`// @ts-check`を追加して、TypeScriptにエラーを発生させるようにします。

```js twoslash
// @ts-check
// @errors: 2322
/** @type {number} */
var x;

x = 0; // OK
x = false; // エラー
```

エラーを追加したいJavaScriptファイルがたくさんある場合は、[`jsconfig.json`](/docs/handbook/tsconfig-json.html)を使用するように変更しましょう。
ファイルに`// @ts-nocheck`コメントをつけることで、ファイルのチェックを省略することができます。

TypeScriptはあなたが納得できないようなエラーを発生させるかもしれませんが、その場合は前の行に`// @ts-ignore`または`// @ts-expect-error`を追加することで、特定の行のエラーを無視することができます。

```js twoslash
// @ts-check
/** @type {number} */
var x;

x = 0; // OK
// @ts-expect-error
x = false; // エラー
```

JavaScriptがTypeScriptによってどのように解釈されるかについて知りたい場合は、[TSの型がJSをチェックする方法](/docs/handbook/type-checking-javascript-files.html)を参照してください。
