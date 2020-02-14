---
display: "Incremental"
oneline: "Save .tsbuildinfo files to allow for incremental compilation of projects"
---

最新のコンパイルでのプロジェクトグラフ情報をディスクにファイルとして保存するようにTypeScriptに指示します。
このオプションはコンパイルの出力先として指定されたフォルダに `.tsbuildinfo` のファイル群を作成します。
これらのファイルはコンパイルされたJavaScriptが実行時に利用することはなく、安全に削除できます。このフラグの詳細については[3.4 リリースノート](/docs/handbook/release-notes/typescript-3-4.html#faster-subsequent-builds-with-the---incremental-flag)で確認できます。

このファイル群の出力先フォルダを設定する場合、[`tsBuildInfoFile`](#tsBuildInfoFile)オプションを利用してください。
