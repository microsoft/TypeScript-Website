---
display: "Max Node Module JS Depth"
oneline: "How deep should TypeScript run type checking in node_modules"
---

`node_modules`配下で依存関係を探す際や、JavaScriptファイルをロードする際の最大の深さです。

このフラグは[`allowJs`](#allowJs)が有効化されているときのみ利用可能であり、`node_modules`内のすべてのJavaScriptについて、TypeScriptに型推論させたいときに用います。

理想的には、このオプションの値は0（デフォルト値）であるべきで、`d.ts`ファイルでモジュールを明示的に定義すべきです。
ただし、速度と精度を犠牲にして、このオプションを有効化したいという場合もあるかもしれません。
