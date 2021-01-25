---
display: "输出目录"
oneline: "为所有生成的文件设置一个输出目录。"
---

如果被指定，`.js` （以及 `.d.ts`, `.js.map` 等）将会被生成到这个目录下。
原始源文件的目录将会被保留，如果计算出的根目录不是你想要的，可以查看 [rootDir](#rootDir)。

如果没有指定，`.js` 将被生成至于生成它们的 `.ts` 文件相同的目录中：

```sh
$ tsc

example
├── index.js
└── index.ts
```

使用类似这样的 `tsconfig.json`：

```json tsconfig
{
  "compilerOptions": {
    "outDir": "dist"
  }
}
```

使用这些配置运行 `tsc` 时，会将文件移动到指定的 `dist` 文件夹中：

```sh
$ tsc

example
├── dist
│   └── index.js
├── index.ts
└── tsconfig.json
```
