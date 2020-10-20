---
display: "Strict Checks"
---

我们建议使用[编译器选项`strict`](#strict)来选择性的启用每个可能的改进。

TypeScript支持大量的 JavaScript 模式，默认选项允许相当大的灵活性来适应这些模式。
通常，代码的安全性和潜在的可扩展性可能与这些技术中的一些不一致。

由于支持各种类型的 JavaScript，升级到新版本的 TypeScript 可能发现两种类型的错误:

-代码中已存在的错误：因为语言已经改进了对JavaScript的理解，TypeScript发现了它。
-处理新问题领域的一套新错误。

TypeScript通常会为后一组错误添加一个编译器标志，默认情况下这些选项是不启用的。