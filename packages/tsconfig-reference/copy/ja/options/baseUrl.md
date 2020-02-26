---
display: "Base Url"
oneline: "Set a baseurl for relative module names"
---

絶対パス参照でないモジュール名を解決するための基点となるディレクトリを設定できます。

絶対パスで解決するために、ルートフォルダを決めることもできます。すなわち、

```
baseUrl
├── ex.ts
├── hello
│   └── world.ts
└── tsconfig.json
```

`"baseUrl": "./"`とすると、このプロジェクト内では、TypeScriptは`tsconfig.json`と同じフォルダからファイルの探索を行います。

```ts
import { helloWorld } from "hello/world";

console.log(helloWorld);
```

`"../"`や`"./"`のような毎度のインポート文にうんざりしていたり、
ファイルを移動するときにインポート文を変更する必要がある場合、このオプションは修正するための良い方法です。
