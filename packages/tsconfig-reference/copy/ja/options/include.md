---
display: "Include"
oneline: "Files or patterns to include in this project"
---

プログラムに含めるファイル名またはパターンのリストを指定します。
ファイル名は`tsconfig.json`ファイルを含んでいるディレクトリからの相対パスとして解決されます。

```json
{
  "include": ["src/**/*", "tests/**/*"]
}
```

この設定は以下のようにマッチします。

<!-- TODO: #135
```diff
  .
- ├── scripts
- │   ├── lint.ts
- │   ├── update_deps.ts
- │   └── utils.ts
+ ├── src
+ │   ├── client
+ │   │    ├── index.ts
+ │   │    └── utils.ts
+ │   ├── server
+ │   │    └── index.ts
+ ├── tests
+ │   ├── app.test.ts
+ │   ├── utils.ts
+ │   └── tests.d.ts
- ├── package.json
- ├── tsconfig.json
- └── yarn.lock
``` -->

```
.
├── scripts                ⨯
│   ├── lint.ts            ⨯
│   ├── update_deps.ts     ⨯
│   └── utils.ts           ⨯
├── src                    ✓
│   ├── client             ✓
│   │    ├── index.ts      ✓
│   │    └── utils.ts      ✓
│   ├── server             ✓
│   │    └── index.ts      ✓
├── tests                  ✓
│   ├── app.test.ts        ✓
│   ├── utils.ts           ✓
│   └── tests.d.ts         ✓
├── package.json
├── tsconfig.json
└── yarn.lock
```

`include`と`exclude`はグロブパターンのためのワイルドカードをサポートしています:

- `*` ゼロ個以上の文字列にマッチ（ディレクトリセパレータは除く）
- `?` 任意の1文字にマッチ（ディレクトリセパレータは除く）
- `**/` 任意階層の任意ディレクトリにマッチ

グロブパターンがファイルの拡張子を含まない場合、サポートされる拡張子のみが含まれるようになります（例：`.ts`、`.tsx`と`.d.ts`はデフォルトでインクルードされ、`.js`と`.jsx`は`allowJs`が設定された場合のみインクルードされます）。
