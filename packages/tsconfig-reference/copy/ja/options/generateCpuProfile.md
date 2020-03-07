---
display: "Generate CPU Profile"
oneline: "Emit a v8 CPU profile of the compiler run for debugging"
---

このオプションを用いると、TypeScriptにコンパイラが実行中のv8のCPUプロファイルを出力させられます。CPUプロファイルはなぜビルドが遅くなるのかについての示唆を与えてくれます。

このオプションはCLIから`--generateCpuProfile tsc-output.cpuprofile`を介してのみ使用できます。

```sh
npm run tsc --generateCpuProfile tsc-output.cpuprofile
```

このファイルはChromeやEdge Developerのようなchromiumをベースとしたブラウザの[CPU profiler](https://developers.google.com/web/tools/chrome-devtools/rendering-tools/js-execution)で開くことができます。
[TypeScript Wikiのパフォーマンスセクション](https://github.com/microsoft/TypeScript/wiki/Performance)でコンパイラのパフォーマンスについて詳細を学ぶことができます。
