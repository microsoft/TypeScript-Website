---
display: "TS 构建信息文件"
oneline: "为 .tsbuildinfo 增量编译信息指定目录。"
---

这个选项可以让您指定一个文件来存储增量编译信息，以作为复合工程的一部分，从而可以更快的构建更大的 TypeScript 代码库。你可以 [在手册](/docs/handbook/project-references.html) 阅读更多关于复合工程的内容。

这个选项提供了一种方法，可以配置 TypeScript 追踪它存储在磁盘上的文件的位置，用来指示项目的构建状态。—— 默认情况下，它们与你生成的 JavaScript 在同一个文件夹中。
