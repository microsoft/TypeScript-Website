---
title: TypeScriptでBabelを使用する
layout: docs
permalink: /ja/docs/handbook/babel-with-typescript.html
oneline: BabelとTypeScriptを組み合わせたプロジェクトの作成方法
translatable: true
---

## BabelとTypeScriptの`tsc`の比較

モダンなJavaScriptプロジェクトを作る際、TypeScriptからJavaScriptにファイルをトランスパイルするにはどのような方法が正しいのでしょうか？

その答えは、プロジェクトによって _"状況次第"_ だったり、 _"誰かが決めてくれたもの"_ であることが多いです。[tsdx](https://tsdx.io)、[Angular](https://angular.io/)、[NestJS](https://nestjs.com/)といった既存のフレームワークや、あるいは[Getting Started](/docs/home)で紹介したようなフレームワークを使ってプロジェクトを構築しているのならば、あなたに代わってこの決定を行ってくれます。

一方で、有用な経験則としては次のようなものがあります:

- ビルド出力はソースの入力ファイルとほとんど同じですか？では、`tsc`を使いましょう
- 出力が複数になる可能性があるビルドパイプラインが必要ですか？では、トランスパイルには`babel`を、型チェックには`tsc`を使いましょう

## トランスパイルのためのBabel、型のための`tsc`

ここで紹介するのは、JavaScriptのコードベースからTypeScriptに移植された可能性がある既存のビルドインフラストラクチャを持つプロジェクトでよく見られるパターンです。

このテクニックは、Babelの[preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript)を使ってJSファイルを生成し、次にTypeScriptを用いて型チェックと`.d.ts`ファイルの生成を行うというハイブリッドなアプローチです。

BabelのTypeScriptサポートを活用することで、既存のビルドパイプラインとの連携が可能になり、また、Babelはコードの型チェックを行わないため、JS出力にかかる時間が短縮できる可能性が高まります。

#### 型チェックとd.tsファイルの生成

Babelを使う際の欠点としては、TSからJSへのトランスパイルを行う際に型チェックを受けられないことがあります。これは、エディタで見逃した型エラーが本番コードに潜り込んでしまうかもしれないことを意味します。

加えて、BabelはTypeScript用の`.d.ts`ファイルを生成することができないため、プロジェクトがライブラリである場合、そのライブラリを扱うのが難しくなる可能性があります。

こうした問題を解決するには、TSCを使ってプロジェクトの型チェックを行うコマンドを設定する必要があります。これはおそらく、Babelの設定の一部を対応する[`tsconfig.json`](/tsconfig)にコピーし、次のフラグが有効になっていることを確認することになるでしょう:

```json tsconfig
"compilerOptions": {
  // tscによって.d.tsファイルを作成させますが、.jsファイルは作成されないようにします
  "declaration": true,
  "emitDeclarationOnly": true,
  // BabelがTypeScriptプロジェクト内のファイルを安全にトランスパイルできるようにします
  "isolatedModules": true
}
```

上記のフラグの詳細についてはこちらをご確認ください:

- [`isolatedModules`](/tsconfig#isolatedModules)
- [`declaration`](/tsconfig#declaration)、[`emitDeclarationOnly`](/tsconfig#emitDeclarationOnly)
