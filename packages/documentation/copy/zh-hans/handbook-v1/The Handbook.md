---
title: TypeScript 手册
layout: docs
permalink: /docs/handbook/intro.html
oneline: 学习 TypeScript 的第一步
---

## 关于本手册

JavaScript 诞生并被编程社区使用至今已有 20 多年，是有史以来应用最广泛的跨平台语言之一。JavaScript 从一种为网页添加简易交互的小型脚本语言，发展到作为各种规模的前端和后端应用的首选语言。虽然用 JavaScript 编写的程序的规模、广度和复杂度都成倍增长，但 JavaScript 语言表达不同代码单元之间关系的能力却没有。再加上 JavaScript 相当独特的运行时语义，语言与程序复杂度之间的不匹配，使得 JavaScript 难以负担起开发大规模应用的任务。

程序员最常见的类型错误：明确类型的值却使用了其他类型的值而出错。 这可能是由于简单的拼写错误、没有理解库的 API 提供的接口规则、对运行时行为的错误假设或其他错误造成的。TypeScript 的目标是成为 JavaScript 程序的静态类型检查器--换句话说，是一个在你的代码运行之前运行的工具（静态），并确保程序的类型是正确的（类型明确）。

如果你是在没有学过 JavaScript 背景的情况下来学习 TypeScript，并以 TypeScript 作为你的第一门语言，我们建议你首先开始阅读文档[JavaScript 指南](https://developer.mozilla.org/docs/Web/JavaScript/Guide)。
如果你有其他编程语言的使用经验，通过阅读这本手册，你应该可以很快学会 JavaScript 语法。

## 本手册的结构是怎样的

本手册分为两部分:

- **手册**

  《 TypeScript 手册》旨在成为给日常程序员阐释 TypeScript 的全面文档。您可以在左侧导航从上到下阅读手册。

  本手册每一章或每一页都能为你提供对给定概念的深刻理解。TypeScript 手册并不是一份完整的语言规范，但它是一份旨在成为该语言所有特性和行为的综合指南。

  全部阅读完应该能学会:

  - 看懂常用的 TypeScript 语法和模式。
  - 解释重要编译器选项的效果。
  - 在大多数情况下正确预测类型系统的行为。
  - 为一个简单的函数、对象或类写一个.d.ts 声明。

  为了简洁明了，本手册的主要内容将不会探讨所涵盖功能的每一个边缘案例或细枝末节。你可以在手册参考中找到关于特定概念的更多细节。

- **手册参考**

  手册参考是建立在对 TypeScript 的特定部分如何工作提供更丰富的解释。你可以从上到下阅读，但每一节的目的都是为了对单一概念提供更深入的解释--这意味着没有内容关联性。

### 非目标

本手册也旨在成为一份简明扼要的文档，可以在几个小时内轻松阅读。为了缩短篇幅，某些主题不会被涉及。

具体来说，本手册并不会完全介绍 JavaScript 的核心基础知识，如函数、类和闭包。在适当的地方，我们会附上背景阅读的链接，你可以用来阅读这些概念。

本手册也不是为了取代语言规范。在某些情况下，边缘案例或者行为规范将被跳过，转而使用高级,浅显易懂的解释。那些被略过的内容，则有单独的参考页，可以更精确和正式地描述 TypeScript 行为的许多方面。参考页面不适合给不熟悉 TypeScript 的读者阅读，因此它们可能会使用高级术语或你尚未阅读的参考主题。。

最后，除非在必要的情况下，本手册不会涉及 TypeScript 如何与其他工具交互。像如何使用 webpack、rollup、parcel、react、babel、closure、lerna、rush、bazel、preact、vue、angular、svelte、jquery、yarn 或 npm 来配置 TypeScript 这样的主题不在范围内--你可以使用网络来寻找这些资源。

## 开始使用

在开始学习[基本类型](/docs/handbook/basic-types.html)之前,我们建议阅读下面适合你的介绍页面。这些介绍旨在强调 TypeScript 和你喜欢的编程语言之间的关键相似性和差异性，并消除这些语言特有的常见误解。

- [入门编程者的 TypeScript ](/docs/handbook/typescript-from-scratch.html)
- [JavaScript 编程者的 TypeScript ](/docs/handbook/typescript-in-5-minutes.html)
- [面向对象编程者的 TypeScript ](/docs/handbook/typescript-in-5-minutes-oop.html)
- [函数式编程者的 TypeScript ](/docs/handbook/typescript-in-5-minutes-func.html)
