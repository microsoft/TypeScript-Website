---
display: "输出文件"
oneline: "将所有输出打包到一个 .js 文件中。如果 `declaration` 为 true 还可以指定一个 .d.ts 文件。"
---

如果被指定，所有 _全局_ （非模块） 文件将被合并到指定的单个输出文件中。

如果 `module` 为 `system` 或 `amd`，所有模块文件也将在所有全局内容之后被合并到这个文件中。

注：除非 `module` 是 `None`，`System` 或 `AMD`， 否则不能使用 `outFile`。
这个选项 _不能_ 用来打包 CommonJS 或 ES6 模块。
