---
display: "组合"
oneline: "启用约束以使工程可以引用其他工程来用于构建。"
---

`composite` 选项会强制执行某些约束，使得构建工具（包括 在 `--build` 模式下的 TypeScript 本身）可以快速确定一个工程是否已经建立。

当此设置开启时：

- 如果没有明确指定 `rootDir`，则默认为包含 `tsconfig.json` 文件的目录。

- 所有实现的文件必须由 `include` 来匹配，或在 `files` 数组中指定。如果违反了这一约束，`tsc` 将告诉你哪些文件没有被指定。

- `declaration` 默认为 `true`。

你可以在[手册](https://www.typescriptlang.org/docs/handbook/project-references.html)中找到关于 TypeScript 工程的文档。
