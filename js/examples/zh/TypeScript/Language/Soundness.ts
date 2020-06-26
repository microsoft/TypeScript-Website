//// {compiler: { strictFunctionTypes: false } }

// 如果您没有类型理论方面的背景知识，您可能不太了解
// 类型系统是 “健全的” 这个概念。

// 健全性是指编译器可以使值不仅在编译时，还可以在运行时具有预期的类型。
// 这对于大多数从一开始就具有类型的编程语言来说是很正常的。

// 要对于一个已经存在了几十年的语言建立一个类型系统，就需要对三个质量维度进行
// 权衡和取舍：简单性，可用性和健全性。

// TypeScript 的目标是支持所有的 JavaScript 代码，
// 且为 JavaScript 添加类型支持时，语言趋向于简单易用。

// 让我们看一些让 TypeScript 看起来没那么健全的例子，
// 并且去理解这些权衡和取舍是什么样子。

// 类型断言（Type Assertions）

const usersAge = ("23" as any) as number;

// TypeScript 允许您使用类型断言来重写一些可能错误的类型推断。
// 使用类型断言代表告诉 TypeScript 您知道最正确的信息，
// 并且 TypeScript 将会尝试让您继续使用它。

// 健全性比较好的语言有时会使用运行时检查来确保数据与您的类型匹配。
// 但是 TypeScript 旨在不对编译后的代码产生类型感知的运行时的影响。

// 函数参数双变

// 函数的参数支持将参数重新定义为原始类型声明的子类型。

interface InputEvent {
  timestamp: number;
}
interface MouseInputEvent extends InputEvent {
  x: number;
  y: number;
}
interface KeyboardInputEvent extends InputEvent {
  keyCode: number;
}

function listenForEvent(eventType: "keyboard" | "mouse", handler: (event: InputEvent) => void) {}

// 我们可以将参数的类型重新声明为它定义的子类型。
// 上例中 handler 预期为一个 'InputEvent' 类型，但是在后面
// 使用的例子中，TypeScript 接受附加了新属性的类型。

listenForEvent("keyboard", (event: KeyboardInputEvent) => {});
listenForEvent("mouse", (event: MouseInputEvent) => {});

// 而这个可以一直回溯到最小的公共类型：

listenForEvent("mouse", (event: {}) => {});

// 但没有更进一步。

listenForEvent("mouse", (event: string) => {});

// 这覆盖了实际环境中 JavaScript 事件监听器的模式，但是会牺牲一些健全性。

// 在 'strictFunctionTypes' 选项开启时，TypeScript 可以对此抛出一些异常，
// 或者您可以通过函数重载来解决这个特殊情况。
// 具体可以看 example:typing-functions

// Void special casing

// Parameter Discarding

// 查看 example:structural-typing 以了解更多函数参数的特殊例子。

// 剩余参数

// 剩余参数均被推断为可选参数，这意味着 TypeScript 将无法确保
// 用于回调的参数的数量。

function getRandomNumbers(count: number, callback: (...args: number[]) => void) {}

getRandomNumbers(2, (first, second) => console.log([first, second]));
getRandomNumbers(400, (first) => console.log(first));

// 空返回值函数可以匹配具有返回值的函数

// 一个返回空的函数，可以接受一个返回其他类型的函数。

const getPI = () => 3.14;

function runFunction(func: () => void) {
  func();
}

runFunction(getPI);

// 要了解更多关于类型系统健全性取舍的内容，可以查看：

// https://github.com/Microsoft/TypeScript/wiki/FAQ#type-system-behavior
// https://github.com/Microsoft/TypeScript/issues/9825
// https://www.typescriptlang.org/docs/handbook/type-compatibility.html
