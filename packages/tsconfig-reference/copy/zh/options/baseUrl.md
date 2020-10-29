---
display: "基准目录"
oneline: "为相对路径的模块名设置基准目录"
---

可以让您设置解析非绝对路径模块名时的基准目录。

你可以定义一个根目录，以进行绝对路径文件解析。例如：

```
baseUrl
├── ex.ts
├── hello
│   └── world.ts
└── tsconfig.json
```

在这个项目中被配置为 `"baseUrl": "./"`，TypeScript 将会从首先寻找与 `tsconfig.json` 处于相同目录的文件。

```ts
import { helloWorld } from "hello/world";

console.log(helloWorld);
```

当你厌倦了导入文件时总是 `"../"` 或 `"./"`，或需要在移动文件时更改路径，这是一个很好的解决方法。
