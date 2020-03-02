---
display: "Root Dirs"
oneline: "Set multiple root directories"
---

`rootDirs`を用いると、単一のルートとして振る舞う「仮想的な」ディレクトリが複数存在することをコンパイラへ伝えることができます。

「仮想的な」ディレクトリは1つにまとめられるとしても、この設定によって、コンパイラはこれらのディレクトリ内での相対パスによるモジュールのインポートを解決できるようになります。


例えば:

```
 src
 └── views
     └── view1.ts (can import "./template1", "./view2`)
     └── view2.ts (can import "./template1", "./view1`)

 generated
 └── templates
         └── views
             └── template1.ts (can import "./view1", "./view2")
```

```json
{
  "compilerOptions": {
    "rootDirs": ["src/views", "generated/templates/views"]
  }
}
```

この設定はTypeScriptがどのようにJavaScriptを出力するかには影響しません。
実行時に相対パスを使って動作可能であるという仮定がエミュレートされるだけです。
