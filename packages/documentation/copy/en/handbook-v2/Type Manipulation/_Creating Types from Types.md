---
title: 用现有类型创建新类型
layout: docs
permalink: /zh/docs/handbook/2/types-from-types.html
oneline: "概述如何从现有的类型创建更多的类型"
---

TypeScript 的类型系统非常强大，因为它允许用*其他类型*表达类型。

这个想法最简单的形式就是泛型。此外，我们还有多种*类型操作符*可以使用。我们也可以用我们已有的*值*表达类型。

通过组合不同的类型操作符，我们可以用简洁、可维护的方式表达复杂的操作和值。在本部分中，我们将介绍如何用现有的类型或值表达新的类型。

- [泛型](/zh/docs/handbook/2/generics.html)——带有参数的类型
- [Keyof 类型操作符](/zh/docs/handbook/2/keyof-types.html)——使用 `keyof` 操作符创建新的类型
- [Typeof 类型操作符](/zh/docs/handbook/2/typeof-types.html)——使用 `typeof` 操作符创建新的类型
- [索引访问类型](/zh/docs/handbook/2/indexed-access-types.html)——使用 `Type['a']` 语法访问类型的子集
- [条件类型](/zh/docs/handbook/2/conditional-types.html)——类型系统中类似于 if 语句的类型
- [映射类型](/zh/docs/handbook/2/mapped-types.html)——通过映射现有类型的每个属性创建类型
- [模板字面量类型](/zh/docs/handbook/2/template-literal-types.html)——通过模板字面量字符串改变属性的映射类型
