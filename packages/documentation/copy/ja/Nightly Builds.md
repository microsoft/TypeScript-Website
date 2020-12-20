---
title: ナイトリービルド
layout: docs
permalink: /ja/docs/handbook/nightly-builds.html
oneline: TypeScriptのナイトリービルドを使うには
translatable: true
---

ナイトリービルドは、[TypeScriptの`master`](https://github.com/Microsoft/TypeScript/tree/master)ブランチからビルドされて、PST深夜0時までにnpmに公開されています。
これを入手してご自身のツールで利用する手順は次のとおりです。

## npmを使う

```shell
npm install -g typescript@next
```

## ナイトリービルドを使用するためにIDEを更新する

ナイトリービルドを使うように、IDEを更新することもできます。
まず、npmを使ってパッケージをインストールする必要があります。
npmパッケージはグローバルにインストールするか、ローカルの`node_modules`フォルダにインストールします。

このセクションの残りの部分は、`typescript@next`がすでにインストールされていることを前提としています。

### Visual Studio Code

次のように`.vscode/settings.json`を更新します:

```json
"typescript.tsdk": "<path to your folder>/node_modules/typescript/lib"
```

詳細は[VSCode documentation](https://code.visualstudio.com/Docs/languages/typescript#_using-newer-typescript-versions)を参照してください。

### Sublime Text

`Settings - User`ファイルを次のように更新します:

```json
"typescript_tsdk": "<path to your folder>/node_modules/typescript/lib"
```

詳細は[TypeScript Plugin for Sublime Text installation documentation](https://github.com/Microsoft/TypeScript-Sublime-Plugin#installation)を参照してください。

### Visual Studio 2013 と 2015

> 注意: ほとんどの変更は新しいバージョンのVS TypeScriptプラグインをインストールする必要はありません

現在、ナイトリービルドには完全なプラグインのセットアップは含まれていませんが、ナイトリービルドベースのインストーラーも同様に公開する作業を進めています。

1. [VSDevMode.ps1](https://github.com/Microsoft/TypeScript/blob/master/scripts/VSDevMode.ps1)スクリプトをダウンロードします。

   > [カスタム言語サービスファイルの利用](https://github.com/Microsoft/TypeScript/wiki/Dev-Mode-in-Visual-Studio#using-a-custom-language-service-file)についてはwikiページもご確認ください。

2. PowerShellコマンドウィンドウで次のように実行します:

VS 2015では:

```posh
VSDevMode.ps1 14 -tsScript <path to your folder>/node_modules/typescript/lib
```

VS 2013では:

```posh
VSDevMode.ps1 12 -tsScript <path to your folder>/node_modules/typescript/lib
```

### IntelliJ IDEA (Mac)

`Preferences` > `Languages & Frameworks` > `TypeScript`へと進む:

> TypeScript Version: npmからインストールした場合: `/usr/local/lib/node_modules/typescript/lib`

### IntelliJ IDEA (Windows)

`File` > `Settings` > `Languages & Frameworks` > `TypeScript`へと進む:

> TypeScript Version: npmからインストールした場合: `C:\Users\USERNAME\AppData\Roaming\npm\node_modules\typescript\lib`
