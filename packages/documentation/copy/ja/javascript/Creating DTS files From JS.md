---
title: .jsファイルから.d.tsファイルを生成する
layout: docs
permalink: /ja/docs/handbook/declaration-files/dts-from-js.html
oneline: "JavaScriptプロジェクトでd.tsファイルを生成する方法"
translatable: true
---

[TypeScript 3.7](/docs/handbook/release-notes/typescript-3-7.html#--declaration-and---allowjs)では、
TypeScript に、JSDoc 構文を使った JavaScript から.d.ts ファイルを生成するためのサポートが導入されました。

この仕組みは、プロジェクトを TypeScript に移行することなく、TypeScript が備わったエディタの体験を自分のものにできるということを意味します。
TypeScript はほとんどの JSDoc タグをサポートしています。リファレンスは[こちら](/docs/handbook/type-checking-javascript-files.html#supported-jsdoc)。

## .d.ts ファイルを出力するようにプロジェクトを設定する

プロジェクトに.d.ts ファイルの作成を追加するように設定するには、最大 4 つのステップを実行する必要があります:

- dev dependencies に TypeScript を追加する
- TypeScript を設定するための`tsconfig.json`を追加する
- TypeScript コンパイラを実行して、JS ファイルに対応する d.ts ファイルを生成する
- (任意) package.json を編集して型を参照できるようにする

### TypeScript を追加する

こちらは、[インストールページ](/download)を参照してください。

### TSConfig

TSConfig はコンパイラのフラグを設定し、対象のファイルを宣言するための jsonc ファイルです。
今回のケースでは、次のようなファイルが必要になるでしょう:

```jsonc tsconfig
{
  // プロジェクトに合わせて変更してください
  "include": ["src/**/*"],

  "compilerOptions": {
    // JSファイルは通常、ソースファイルとして無視されますが、
    // ここではJSファイルを読み込むようにTypeScriptに指示します
    "allowJs": true,
    // d.tsファイルを生成します
    "declaration": true,
    // コンパイラを実行すると
    // d.tsファイルのみ出力されます
    "emitDeclarationOnly": true,
    // 型はこのディレクトリに出力されます
    // このオプションを削除すると
    // .jsファイルの隣に.d.tsファイルが置かれます
    "outDir": "dist"
  }
}
```

オプションについては、[tsconfig リファレンス](/reference)で詳しく知ることができます。
TSConfig ファイルを使用する代替手段として CLI があります。次は上記の TSConfig ファイルの設定と同じふるまいをする CLI コマンドです。

```sh
npx typescript src/**/*.js --declaration --allowJs --emitDeclarationOnly --outDir types
```

## コンパイラを実行する

実行方法については[インストールページ](/download)を参照してください。
プロジェクトの`.gitignore`にファイルが指定してある場合は、これらのファイルがパッケージに含まれていることを確認しましょう。

## package.json を編集する

TypeScript は、.d.ts ファイルを見つけるためのステップを追加し、`package.json`の中で Node のモジュール解決を再現します。
大まかには、モジュール解決は任意のフィールドである`"types"`フィールドをチェックし、次に`"main"`フィールド、そして最後にルートの`index.d.ts`を試します。

| Package.json              | デフォルトの.d.ts の場所            |
| :------------------------ | :---------------------------------- |
| "types"フィールドがない   | "main"をチェックし、次に index.d.ts |
| "types": "main.d.ts"      | main.d.ts                           |
| "types": "./dist/main.js" | ./main/main.d.ts                    |

もし存在しなければ、次は"main"が使用されます

| Package.json             | デフォルトの.d.ts の場所 |
| :----------------------- | :----------------------- |
| "main"フィールドがない   | index.d.ts               |
| "main":"index.js"        | index.d.ts               |
| "main":"./dist/index.js" | ./dist/index.d.ts        |

## Tips

.d.ts ファイルにテストを記述したいなら、[tsd](https://github.com/SamVerschueren/tsd)を試してみてください。
