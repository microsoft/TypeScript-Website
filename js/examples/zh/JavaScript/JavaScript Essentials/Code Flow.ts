//// { order: 3, compiler: { strictNullChecks: true } }

// JavaScript 文件中的代码流会影响整个程序的类型。

const users = [{ name: "Ahmed" }, { name: "Gemma" }, { name: "Jon" }];

// 我们尝试找到名为 “jon” 的用户。
const jon = users.find((u) => u.name === "jon");

// 在上面的情况中，“find” 可能失败，在这种情况下我们不能得到一个对象，
// 它会创建如下类型：
//
//   { name: string } | undefined
//
// 如果您将鼠标悬停在下面的三个用到 ‘jon’ 的地方，您会看到类型的
// 变化依赖于文本在哪里：

if (jon) {
  jon;
} else {
  jon;
}

// 类型 ‘{ name: string } | undefined’ 使用了叫做
// 并集类型的 TypeScript 的功能，并集类型是声明对象可能是
// 几种东西之一的方式。
//
// 管道符号充当不同类型间的分隔符，JavaScript 的动态特性意味着许多
// 函数会收到和返回不同类型的对象，因此我们需要能够表达需要处理的对象。

// 我们可以通过几种方式来使用它。让我们看一下具有不同类型的值的数组。

const identifiers = ["Hello", "World", 24, 19];

// 我们可以使用 ‘typeof x === y’ 的 JavaScript 语法来检查第一个
// 元素的类型。您可以将鼠标悬停在下面的 ‘randomIdentifier’ 上以
// 查看它在不同的位置之间的变化。

const randomIdentifier = identifiers[0];
if (typeof randomIdentifier === "number") {
  randomIdentifier;
} else {
  randomIdentifier;
}

// 控制流分析代表着我们可以编写原始 JavaScript，而 TypeScript 将尝试
// 去了解代码类型在不同位置如何变化。

// 去了解更多关于代码流分析的信息：
// - example:type-guards

// 要继续阅读示例，您可以跳转到以下不同的位置：
//
// - 现代 JavaScript: example:immutability
// - 类型守卫: example:type-guards
// - JavaScript 函数式编程 example:function-chaining
