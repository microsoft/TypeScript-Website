//// { order: 2, compiler: { esModuleInterop: true } }

// 在 JavaScript 中，链式函数是很常见的 API 模式。由于他们
// 具有嵌套特性，所以可以让您的代码减少中间值，并且增加可读性。

// jQuery 拥有一个常见的、可以链式使用的 API，这是
// jQuery 与 DefinitelyTyped 中的类型一起使用的示例：

import $ from "jquery";

// 这是使用 jQuery API 的示例：

$("#navigation").css("background", "red").height(300).fadeIn(200);

// 如果您在上面的行中增加了一个点（.），则会看到一长串函数。
// 这种模式很容易在 JavaScript 中复现。关键是要确保
// 返回相同的对象。

// 这是创建链式 API 的一个示例。关键是要有一个跟踪内部状态的
// 外部函数，以及一个最终返回的暴露 API 的对象。

const addTwoNumbers = (start = 1) => {
  let n = start;

  const api = {
    // 实现您 API 中的所有函数
    add(inc: number = 1) {
      n += inc;
      return api;
    },

    print() {
      console.log(n);
      return api;
    },
  };
  return api;
};

// 允许我们使用与 jQuery 中相同的 API 风格：

addTwoNumbers(1).add(3).add().print().add(1);

// 这是一个使用类时的链式调用示例：

class AddNumbers {
  private n: number;

  constructor(start = 0) {
    this.n = start;
  }

  public add(inc = 1) {
    this.n = this.n + inc;
    return this;
  }

  public print() {
    console.log(this.n);
    return this;
  }
}

// 下面的代码可以按预期工作：

new AddNumbers(2).add(3).add().print().add(1);

// 本例是使用 TypeScript 的类型推导来为 JavaScript 的模式
// 提供帮助的一种方法。

// 更多的例子可以查看：
//
//  - example:code-flow
