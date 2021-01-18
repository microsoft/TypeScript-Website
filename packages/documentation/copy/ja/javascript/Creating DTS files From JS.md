---
title: .jsファイルから.d.tsファイルを生成する
layout: docs
permalink: /ja/docs/handbook/declaration-files/dts-from-js.html
oneline: "JavaScriptプロジェクトでd.tsファイルを生成する方法"
translatable: true
---

[TypeScript 3.7](/docs/handbook/release-notes/typescript-3-7.html#--declaration-and---allowjs)では、
TypeScriptに、JSDoc構文を使ったJavaScriptから.d.tsファイルを生成するためのサポートが導入されました。

この仕組みは、プロジェクトをTypeScriptに移行することなく、TypeScriptが備わったエディタの体験を自分のものにできるということを意味します。
TypeScriptはほとんどのJSDocタグをサポートしています。リファレンスは[こちら](/docs/handbook/type-checking-javascript-files.html#supported-jsdoc)。

## .d.tsファイルを出力するようにプロジェクトを設定する

プロジェクトに.d.tsファイルの作成を追加するように設定するには、最大4つのステップを実行する必要があります:

- dev dependenciesにTypeScriptを追加する
- TypeScriptを設定するための`tsconfig.json`を追加する
- TypeScriptコンパイラを実行して、JSファイルに対応するd.tsファイルを生成する
- (任意) package.jsonを編集して型を参照できるようにする

### TypeScriptを追加する

こちらは、[インストールページ](/download)を参照してください。

### TSConfig

TSConfigはコンパイラのフラグを設定し、対象のファイルを宣言するためのjsoncファイルです。
今回のケースでは、次のようなファイルが必要になるでしょう:

```json5
{
  // プロジェクトに合わせて変更してください
  include: ["src/**/*"],

  compilerOptions: {
    // JSファイルは通常、ソースファイルとして無視されますが、
    // ここではJSファイルを読み込むようにTypeScriptに指示します
    allowJs: true,
    // d.tsファイルを生成します
    declaration: true,
    // コンパイラを実行すると
    // d.tsファイルのみ出力されます
    emitDeclarationOnly: true,
    // 型はこのディレクトリに出力されます
    // このオプションを削除すると
    // .jsファイルの隣に.d.tsファイルが置かれます
    outDir: "dist",
  },
}
```

オプションについては、[tsconfigリファレンス](/reference)で詳しく知ることができます。
TSConfigファイルを使用する代替手段としてCLIがあります。次は上記のTSConfigファイルの設定と同じふるまいをするCLIコマンドです。

```sh
npx typescript src/**/*.js --declaration --allowJs --emitDeclarationOnly --outDir types
```

## コンパイラを実行する

実行方法については[インストールページ](/download)を参照してください。
プロジェクトの`.gitignore`にファイルが指定してある場合は、これらのファイルがパッケージに含まれていることを確認しましょう。

## package.jsonを編集する

TypeScriptは、.d.tsファイルを見つけるためのステップを追加し、`package.json`の中でNodeのモジュール解決を再現します。
大まかには、モジュール解決は任意のフィールドである`"types"`フィールドをチェックし、次に`"main"`フィールド、そして最後にルートの`index.d.ts`を試します。

| Package.json              | デフォルトの.d.tsの場所           |
| :------------------------ | :----------------------------- |
| "types"フィールドがない      | "main"をチェックし、次にindex.d.ts|
| "types": "main.d.ts"      | main.d.ts                      |
| "types": "./dist/main.js" | ./main/main.d.ts               |

もし存在しなければ、次は"main"が使用されます

| Package.json              | デフォルトの.d.tsの場所     |
| :----------------------- | :------------------------ |
| "main"フィールドがない      | index.d.ts                |
| "main":"index.js"        | index.d.ts                |
| "main":"./dist/index.js" | ./dist/index.d.ts         |

## Tips

.d.tsファイルにテストを記述したいなら、[tsd](https://github.com/SamVerschueren/tsd)を試してみてください。
