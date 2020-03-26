// JavaScript 是有一门多种方式声明您的对象不可变的语言。最常见的方式是
// const ——表示某些值不会变。

const helloWorld = "Hello World";

// 您不可以更改 helloWorld，TypeScript 将会在您试图修改时报错，
// 因为您同样不能再运行时这样做。

helloWorld = "Hi world";

// 为什么要关心不变性？很大一部分原因是为了减少代码复杂度。如果您
// 可以减少可变事物的数量，那么需要跟踪的东西也会随之变少。

// 使用 const 是很好的第一步，但是使用 object 时这样会失效。

const myConstantObject = {
  msg: "Hello World",
};

// myConstantObject 并不是一个常量，因为我们仍然可以更改对象的某些
// 部分。例如我们可以更改 msg：

myConstantObject.msg = "Hi World";

// const 代表该引用的值不变，但对象本身可能在内部发生变化。
// 我们可以改用 Object.freeze 来实现。

const myDefinitelyConstantObject = Object.freeze({
  msg: "Hello World",
});

// 当一个对象被 “冻结”，之后您将不能改变其内部。TypeScript 将
// 对这些情况抛出错误：

myDefinitelyConstantObject.msg = "Hi World";

// 这对数组同样有效：

const myFrozenArray = Object.freeze(["Hi"]);
myFrozenArray.push("World");

// 使用 freeze 代表您确认这个对象将会保持不变。

// TypeScript 有一些为了改进对不可变数据处理的额外语法，您可以
// 在这些例子中里看到他们：
//
// example:literals
// example:type-widening-and-narrowing
