---
display: "保留符号链接"
oneline: "不解析符号链接路径"
---

这是为了匹配 Node.js 中相同的选项，它不解析符号链接的真实路径。

这个选项也表现出与 Webpack 中 `resolve.symlinks` 选项相反的行为（即设置 TypeScript 的 `preserveSymlinks` 为 true, 与之对应的 Webpack 的 `resolve.symlinks` 为 false。反之亦然）

启用后，对于模块和包的引用（例如 `import` 和 `/// <reference type="..." />` 指令都相对于符号链接所在的位置进行解析，而不是相对于符号链接解析后的路径。
