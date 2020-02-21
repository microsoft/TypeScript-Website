---
display: "Root Dir"
oneline: "Sets the root folder within your source files"
---

**デフォルト値**: 型定義ファイルでないすべての入力ファイルの中での最長の共通パス。`composite`が設定されている場合、この値の代わりに`tsconfig.json`を含むディレクトリがデフォルトとなります。

TypeScriptはファイルをコンパイルするとき、入力ディレクトリ内のディレクトリ構造が同じになるように出力ディレクト内の構造を保ちます。

例えば、いくつかの入力ファイルがあったとしましょう:

```
MyProj
├── tsconfig.json
├── core
│   ├── a.ts
│   ├── b.ts
│   ├── sub
│   │   ├── c.ts
├── types.d.ts
```

推定される`rootDir`の値は、型定義ファイルでないすべての入力ファイルの中での最長の共通パス、この例では`core/`となります。

`outDir`が`dist`だったとすると、TypeScriptは次のツリー構造を出力します:

```
MyProj
├── dist
│   ├── a.ts
│   ├── b.ts
│   ├── sub
│   │   ├── c.ts
```

ただし、出力ディレクトリ内に`core`を含めることを意図している場合があります。
`rootDir: "."`を`tsconfig.json`に設定すると、TypeScriptは次のツリー構造を出力します:

```
MyProj
├── dist
│   ├── core
│   │   ├── a.js
│   │   ├── b.js
│   │   ├── sub
│   │   │   ├── c.js
```

重要なこととして、`rootDir`は**どのファイルがコンパイルに含められるかに影響しません**。
`tsconfig.json`の`include`、`exclude`や`files`設定との相互作用はありません。

TypeScriptは`outDir`以外のディレクトリに出力ファイルを書き込むことはなく、ファイルの入力をスキップすることもありません。
このため、`rootDir`は出力する必要があるすべてのファイルがrootDirパスの下にあることを強制します。

例えば、次のツリー構造があったとしましょう:

```
MyProj
├── tsconfig.json
├── core
│   ├── a.ts
│   ├── b.ts
├── helpers.ts
```

`rootDir`を`core`に、`include`を`*`に設定すると、`outDir`の_外部_（i.e. `../helpers.ts`）に出力する必要のあるファイル（`helpers.ts`）が生まれるため、エラーとなります。
