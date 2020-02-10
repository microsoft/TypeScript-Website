---
display: "Type Acquisition"
oneline: "Sets of options for Automatic Type Acquisition in JavaScript"
---

エディターにJavaScriptプロジェクトが存在する場合、TypeScriptは`@types`で定義されるDefinitelyTypedから提供されるファイルを用いて、`node_modules`のための型ファイルを自動で提供します。
これは自動型取得と呼ばれており、また設定の`typeAcquisition`を使ってカスタマイズできます。

この機能を無効化したりカスタマイズする場合、プロジェクトのルートに`jsconfig.json`ファイルを作成してください:

```json
{
  "typeAcquisition": {
    "enable": false
  }
}
```

プロジェクトに含めるべき特定のモジュールがある場合（それが`node_modules`には存在しない場合）:

```json
{
  "typeAcquisition": {
    "include": ["jest"]
  }
}
```

モジュールが自動で取得されるべきでない場合。例えば、そのライブラリが`node_modules`に含まれてはいるが、チームでこのライブラリを利用しないことを合意している場合:

```json
{
  "typeAcquisition": {
    "exclude": ["jquery"]
  }
}
```
