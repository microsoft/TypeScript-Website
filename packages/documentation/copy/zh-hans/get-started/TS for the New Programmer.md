---
title: 入门编程者的 TypeScript
short: 入门编程者的 TS
layout: docs
permalink: /docs/handbook/typescript-from-scratch.html
oneline: 从零开始学习TypeScript
---

恭喜你选择 TypeScript 作为你的第一门语言之一--你已经做出了很棒的决定！

你可能听说过 TypeScript 是 JavaScript 的一种 "调料 "或 "变种"。
TypeScript(TS)和 JavaScript(JS)之间的关系在现代编程语言中是相当独特的，因此，进一步了解这种关系将有助于你理解 TypeScript 是如何为 JavaScript 增色的。

## JavaScript 是什么? 了解一段简短的历史

JavaScript（又称 ECMAScript）是作为一种简单的浏览器脚本语言而开始的。在它被发明出来的时候，人们期望它能用于网页中嵌入的简短的代码段--写出超过几十行的代码就有些不寻常了。
因此，早期的 Web 浏览器执行此类代码的速度非常慢。不过随着时间的推移，JS 变得越来越流行，Web 开发人员开始使用它来创建交互式体验。

Web 浏览器开发人员通过优化他们的执行引擎（动态编译）和扩展可以用它做的事情（添加 API）来应对这种 JS 使用量的增加，这反过来又使 Web 开发人员更多地使用它。
在现代网站上，你的浏览器经常运行跨越数十万行代码的应用程序。这就是 "网络" 漫长而渐进的成长过程，从一个简单的静态网页开始，逐渐发展成为一个百花齐放的*应用* 平台。

不仅如此，JS 已经延伸到可以在浏览器之外使用，比如使用 node.js 实现 JS 服务器。JS 的 "随处可跑 "的特性使其成为跨平台开发的诱人选择。现在有很多开发人员整个开发栈 _只用_ JavaScript 来编程!

综上所述，我们有一种语言，它是为快速使用而设计的，然后成长为一个成熟的工具，可以编写数百万行的应用程序。
每种语言都有自己的 _怪癖_--古怪而惊奇，而 JavaScript 筚路蓝缕使它具有*许多*奇特之处。举一些例子：

- JavaScript 的等价运算符 (`==`) _强制转换_ 其参数, 导致出现意外的情况::

  ```js
  if ("" == 0) {
    // 居然相等! 但是为什么??
  }
  if (1 < x < 3) {
    // 对x的 *任意* 值都为真!!!
  }
  ```

- JavaScript 还允许访问不存在的属性:

  ```js
  const obj = { width: 10, height: 15 };
  // 为什么是NaN? 完全拼写正确很难!
  const area = obj.width * obj.heigth;
  ```

当出现这类错误时，大多数编程语言都会抛出一个错误,有些会在编译过程中抛出错误--在任何代码运行之前。
在编写简单程序的时候，这样的怪癖是很烦人的，但也是可以控制的；但当编写有数百或数千行代码的应用程序时，这些不断出现的意外是一个严重的问题。

## TypeScript:静态类型检查器

我们前面说过，有些语言根本不允许那些错误的程序运行。
在不运行代码的情况下检测代码中的错误被称为*静态检查*。根据被操作的值的类型来确定什么是错误，什么不是错误，这就是所谓的静态*类型*检查。

TypeScript 有静态类型检查器，可以在代码执行前并对*值*的*类型*进行检查，诊断程序是否有错误。例如，上面的最后一个例子因为`obj`的*类型*而出现了错误。下面是 TypeScript 发现的错误:

```ts twoslash
// @errors: 2551
const obj = { width: 10, height: 15 };
const area = obj.width * obj.heigth;
```

### JavaScript 的类型化超集

TypeScript 与 JavaScript 有什么关系呢？

#### 语法

TypeScript 是一种语言，是 JavaScript 的*超集*：因此 JS 语法是合法的 TS。
语法指的是我们编写文本形成程序的方式。
举个例子, 这个代码存在一处*语法*错误因为它缺少`)`:

```ts twoslash
// @errors: 1005
let a = (4
```

TypeScript 的语法不会将任何 JavaScript 代码视为错误。这意味着你可以将任何有效的 JavaScript 代码放在 TypeScript 文件中，而不用担心具体怎么写。

#### 类型

然而，TypeScript 是一个*类型化*的超集，这意味着它增加了使用不同类型的值的规则。
先前的`obj.heigth`并不是*语法*错误:它是以错误的方式使用某种值（类型）的错误。

再举个例子，你可以在浏览器运行下面的 JavaScript 代码，它*将*会打印出一个值：

```js
console.log(4 / []);
```

这个语法上合法的程序可以打印出`Infinity`。
但是，TypeScript 认为数组除法是一个无意义的操作，并且会报出错误:

```ts twoslash
// @errors: 2363
console.log(4 / []);
```

有可能你真的打算*用*一个数字除以一个数组，也许只是想看看会发生什么，但大多数情况下，这是一个编程错误。TypeScript 的类型检查器被设计为允许正确的程序通过，同时尽可能多地捕捉到的常见错误。
(稍后，我们将学习如何配置 TypeScript 代码检查严格程度的设置)

如果你把一些代码从 JavaScript 文件移到 TypeScript 文件中，你可能会看到*类型错误*，这取决于代码是如何编写的。这些可能是代码合法性的问题，或者 TypeScript 过于保守。在本指南中，我们将演示如何添加各种 TypeScript 语法来消除这些错误。

#### 运行时行为

TypeScript 也是一种保留了 JavaScript*运行时行为*的编程语言。
例如，在 JavaScript 中除以零会得到`Infinity`，而不是抛出一个运行时异常。
TypeScript 以 **从不** 改变 JavaScript 代码的运行时行为为原则。

也就是说，如果你把代码从 JavaScript 转移到 TypeScript，即使 TypeScript 认为代码有类型错误，它也能 **保证** 以同样的方式运行。

保持与 JavaScript 相同的运行时行为是 TypeScript 的基本承诺，因此你可以很容易地在这两种语言之间转换，而不用担心其中微妙的差异可能会使你的程序停止工作。

<!--
Missing subsection on the fact that TS extends JS to add syntax for type
specification.  (Since the immediately preceding text was raving about
how JS code can be used in TS.)
-->

#### 类型擦除

大致就是，一旦 TypeScript 的编译器完成了对你的代码的检查，它就会*擦除*类型来产生 "编译" 的代码。
这意味着，一旦你的代码被编译成的纯 JS 代码就没有类型信息。

就是说 TypeScript 永远不会根据它推断的类型来改变你的程序的*行为*。
最重要的是，虽然你在编译过程中可能会看到类型错误，但类型系统不会影响程序运行。

最后，TypeScript 不提供任何额外的运行时库。
你的程序将使用与 JavaScript 程序相同的标准库（或外部库），所以没有额外的 TypeScript 特定框架需要学习。

<!--
Should extend this paragraph to say that there's an exception of
allowing you to use newer JS features and transpile the code to an older
JS, and this might add small stubs of functionality when needed.  (Maybe
with an example --- something like `?.` would be good in showing readers
that this document is maintained.)
-->

## 学习 JavaScript 和 TypeScript

我们经常会看到 "我应该学习 JavaScript 还是 TypeScript？"这类问题。

答案是如果不学习 JavaScript 就无法学习 TypeScript!
TypeScript 与 JavaScript 共享语法和运行时行为，所以你学习 JavaScript 同时也在帮助你学习 TypeScript。

有很多很多资源可以供编程者学习 JavaScript;
如果你正在编写 TypeScript，你*不*应该忽略这些资源。

例如，标记为 `Javascript` 的 StackOverflow 问题大概比标记为 `typescript` 的多 20 倍，但*所有*的 `javascript` 问题也适用于 TypeScript。

如果你在搜索类似于 "如何在 TypeScript 中对一个 list 进行排序"这样的内容时, 请记住: **TypeScript 只是有一个编译时类型检查 JavaScript 的运行时**。
在 TypeScript 中对 list 进行排序的方式和在 JavaScript 中是一样的。
如果你找到了一个直接使用 TypeScript 的资源，那也很好，但记住不要把自己局限在认为你需要 TypeScript 特定的答案来解决如何完成运行时任务的日常问题。

---

开始之前，我们建议学习一些 JavaScript 基础知识 ([JavaScript 指南](https://developer.mozilla.org/docs/Web/JavaScript/Guide) 作为一个好的开端。)

当你感觉理解通透了，就回到此处阅读 [JavaScript 编程者的 TypeScript](/docs/handbook/typescript-in-5-minutes.html), 再从 [手册](/docs/handbook/intro.html) 开始或者查看 [Playground 示例](/play#show-examples)。

<!-- Note: I'll be happy to write the following... -->
<!--
## Types

    * What's a type? (For newbies)
      * A type is a *kind* of value
      * Types implicitly define what operations make sense on them
      * Lots of different kinds, not just primitives
      * We can make descriptions for all kinds of values
      * The `any` type -- a quick desctiption, what it is, and why it's bad
    * Inference 101
      * Examples
      * TypeScript can figure out types most of the time
      * Two places we'll ask you what the type is: Function boundaries, and later-initialized values
    * Co-learning JavaScript
      * You can+should read existing JS resources
      * Just paste it in and see what happens
      * Consider turning off 'strict' -->
