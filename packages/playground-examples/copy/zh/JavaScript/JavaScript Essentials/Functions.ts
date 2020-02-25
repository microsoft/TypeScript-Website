//// { order: 2, compiler: { noImplicitAny: false } }

// 在 JavaScript 中有很多方式可以声明函数。让我们看一个将两个
// 数字相加的函数：

// 创建一个叫做 addOldSchool 的全局函数。
function addOldSchool(x, y) {
  return x + y;
}

// 您也可以将函数的名称移动到一个变量名中。
const anonymousOldSchoolFunction = function (x, y) {
  return x + y;
};

// 您也可以使用箭头函数作为函数的快捷方式。
const addFunction = (x, y) => {
  return x + y;
};

// 我们将着重介绍最后一种方式，但是所有内容都适用于全部三种方式。

// TypeScript 提供了函数定义和标记函数预期类型的额外语法。
//
// 接下来是 add 函数的最开放的版本，它代表 add 接受任意类型的两个
// 输入：它可以是您输入的字符串，数字或对象。

const add1 = (x: any, y: any) => {
  return x + y;
};
add1("Hello", 23);

// 这是合法的 JavaScript（例如可以这样连接字符串），但是对于我们
// 已知的适用于数字的函数并不是最佳选择。因此我们将 x 和 y 转换为
// 仅接受数字。

const add2 = (x: number, y: number) => {
  return x + y;
};
add2(16, 23);
add2("Hello", 23);

// 很好，如果我们传入任何其他非数字的东西可以得到一个错误。如果
// 您将鼠标悬停在上面的 add2 上，您将会看到 TypeScript 将其描述为：
//
//   const add2: (x: number, y: number) => number
//
// 推断出两个输入都是数字时，数字也是唯一可能的返回值类型。很好，您不
// 需要编写额外的语法。让我们看看这样做的必要条件：

const add3 = (x: number, y: number): string => {
  return x + y;
};

// 这个函数将会报错，因为我们告诉 TypeScript 应该返回一个字符串，
// 但是函数没有实现其承诺。

const add4 = (x: number, y: number): number => {
  return x + y;
};

// 这是非常明确的 add2 的版本——在某些情况下，您希望使用显式的返回类型
// 语法给自己在开始前留下一些工作空间。和测试驱动开发建议从失败的测试开始
// 类似。但是在这种情况下，它的函数是不正确的。

// 此示例仅是入门知识，您可以在手册以及 JavaScript 函数式编程的示例中
// 了解更多关于 TypeScript 函数的工作原理：
//
// https://www.typescriptlang.org/docs/handbook/functions.html
// example:function-chaining

// 为了继续学习 JavaScript 精粹，我们将了解代码流如何影响 TypeScript 的类型：
// example:code-flow
