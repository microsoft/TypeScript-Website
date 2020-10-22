---
display: "类型"
oneline: "用于创建一个允许包含在编译过程中的类型列表"
---

默认情况下，所有 _可见_ 的 "`@types`" 包都将包含在你的编译过程中。
在 `node_modules/@types` 中的任何包都被认为是 _可见_ 的。
例如，这意味着包含 `./node_modules/@types/`，`../node_modules/@types/`，`../../node_modules/@types/` 中所有的包。。

当 `types` 被指定，则只有列出的包才会被包含在全局范围内。例如：

```json tsconfig
{
  "compilerOptions": {
    "types": ["node", "jest", "express"]
  }
}
```

这个 `tsconfig.json` 文件将 _只会_ 包含 `./node_modules/@types/node`，`./node_modules/@types/jest` 和 `./node_modules/@types/express`。
其他在 `node_modules/@types/*` 下的包将不会被包含。

### 这会影响什么？

此选项不会影响 `@types/*` 如何被包含在你的代码中，例如你在有上面例子里 `compilerOptions` 的环境中写了这样的代码：

```ts
import * as moment from "moment";

moment().format("MMMM Do YYYY, h:mm:ss a");
```

`moment` 导入会有完整的类型。

当你设置了这个选项，通过不在 `types` 数组中包含，它将：
- 不会再你的项目中添加全局声明（例如 node 中的 `process` 或 Jest 中的 `expect`）
- 导出不会出现再自动导入的建议中

此功能与 [`类型根路径`](#typeRoots) 不同的是，它只指定你想要包含的具体类型，而 [`类型根路径`](#typeRoots) 支持你想要特定的文件夹。
