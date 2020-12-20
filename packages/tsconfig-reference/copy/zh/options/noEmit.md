---
display: "禁止生成"
oneline: "不在编译中生产文件。"
---

禁止编译器生成文件，例如 JavaScript 代码，source-map 或声明。

这为另一个工具提供了空间，例如用 [Babel](https://babeljs.io) 或 [swc](https://github.com/swc-project/swc) 来处理将 TypeScript 转换为可以在 JavaScript 环境中运行的文件的过程。

然后你可以使用 TypeScript 作为提供编辑器集成的工具，或用来对源码进行类型检查。
