---
display: "增量"
oneline: "为支持增量编译工程，保存 .tsbuildinfo 文件"
---

使 TypeScript 将上次编译的工程图信息保存到磁盘上的文件中。这将会在您编译输出的同一文件夹中创建一系列 `.tsbuildinfo` 文件。
它们不会再运行时被您的 JavaScript 使用，并且可以被安全的删除。
你可以在 [3.4 发布日志](/docs/handbook/release-notes/typescript-3-4.html#faster-subsequent-builds-with-the---incremental-flag) 中获取更多关于该选项的内容。

可以使用 [`tsBuildInfoFile`](#tsBuildInfoFile) 来控制 `.tsbuildinfo` 文件被编译到哪个文件夹。
