//// { order: 2 }

// 当调用一个类的方法时，您通常希望它引用该类的当前实例。

class Safe {
  contents: string;

  constructor(contents: string) {
    this.contents = contents;
  }

  printContents() {
    console.log(this.contents);
  }
}

const safe = new Safe("Crown Jewels");
safe.printContents();

// 如果您有其他拥有易于理解的 this 或 self 的面向对象语言的
// 经验，那么您可能会发现 ‘this’ 令人困惑的地方：
//
// https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/
// https://aka.ms/AA5ugm2

// 太长不看：this 可以改变。this 所引用的对象可能因调用函数的方式而不同。

// 例如，如果您将函数传递给另一个函数，并在在另一个对象的上下文中
// 调用该函数的引用，那么 this 变量引用的对象已经变为调用时的宿主对象。

const customObjectCapturingThis = { contents: "http://gph.is/VxeHsW", print: safe.printContents };
customObjectCapturingThis.print(); // 输出 "http://gph.is/VxeHsW" - 而不是 "Crown Jewels"

// 这很棘手，因为在处理 API 的回调时，直接传递函数的引用非常吸引人。
// 可以通过在调用方创建一个新的函数来解决这个问题。

const objectNotCapturingThis = { contents: "N/A", print: () => safe.printContents() };
objectNotCapturingThis.print();

// 有几种方法可以解决这个问题，一种是通过 bind 强制将其绑定为您最初
// 希望绑定的对象。

const customObjectCapturingThisAgain = { contents: "N/A", print: safe.printContents.bind(safe) };
customObjectCapturingThisAgain.print();

// 要解决这种意外情况，您还可以通过在类中创建函数的方式。通过创建一个
// 值为箭头函数的属性，可以让 this 在不同的时间完成绑定。这对于那些
// 不太熟悉 JavaScript 运行时的人来说更具可预测性。

class SafelyBoundSafe {
  contents: string;

  constructor(contents: string) {
    this.contents = contents;
  }

  printContents = () => {
    console.log(this.contents);
  };
}

// 将函数传递给另外一个对象将不会更改 this 的绑定。

const saferSafe = new SafelyBoundSafe("Golden Skull");
saferSafe.printContents();

const customObjectTryingToChangeThis = {
  contents: "http://gph.is/XLof62",
  print: saferSafe.printContents,
};

customObjectTryingToChangeThis.print();

// 如果您有 TypeScript 项目，您可以使用 noImplicitThis 编译选项
// 以高亮显示 TypeScript 不能确定某个函数 ‘this’ 的类型的情况。

// 你可以在手册中了解更多相关信息：
//
// https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypet
