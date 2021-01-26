---
display: "严格检查"
---

我们建议启用[编译选项 `strict`](#strict)，从而在构建时获得所有可能的改进。

TypeScript 可以非常广泛的支持 JavaScript，并且默认具有相当的灵活性来处理它的编程风格。
一般来说，一个代码库的安全性和潜在的可扩展性可能会与其中的一些技术冲突。

由于 JavaScript 的多样性，升级到新版本的 TypeScript 可能会发现两种类型的错误：

- TypeScript 发现了在你代码库中已经存在的错误，因为 TypeScript 完善了对 JavaScript 的理解。
- 一系列新的错误，它们解决了一个新领域的问题。

TypeScript 通常会为后一种错误添加一个编译选项，并且默认不启用它们。

