---
display: "类型根路径"
oneline: "TypeScript 应该去哪些路径寻找类型定义"
---

默认情况下，所有 _可见_ 的 "`@types`" 包都将包含在你的编译过程中。
在 `node_modules/@types` 中的任何包都被认为是 _可见_ 的。
例如，这意味着包含 `./node_modules/@types/`，`../node_modules/@types/`，`../../node_modules/@types/` 中所有的包。

当 `typeRoots` 被指定，_仅有_ 在 `typeRoots` 下的包会被包含。例如：

```json tsconfig
{
  "compilerOptions": {
    "typeRoots": ["./typings", "./vendor/types"]
  }
}
```

这个配置文件将包含 `./typings` 和 `./vendor/types` 下的所有包，而不包括 `./node_modules/@types` 下的。其中所有的路径都是相对于 `tsconfig.json`。
