// Any 是 TypeScript 的一个例外，你可以用 any 来声明一段代码是
// 类似于 JavaScript 一样动态的，或者解决类型系统的一些限制。

// 解析 JSON 是一个很好的例子：

const myObject = JSON.parse("{}");

// Any 声明代表着 TypeScript 将认为你更了解你的代码，
// 并且认为你的代码是安全的，即使它并不一定严格正确。
// 这段代码将会崩溃：

myObject.x.y.z;

// 使用 any 将会赋予你在舍弃一些类型安全性的前提下，
// 编写更接近原生 JavaScript 的代码能力。

// any 更像一个类型通配符，它可以允许你替换为任何类型（never 除外）
// 以使一种类型可以分配给另一种类型。

declare function debug(value: any): void;

debug("a string");
debug(23);
debug({ color: "blue" });

// 每个 debug 函数的调用都是合法的，因为你可以将参数中的 any
// 替换为任何其他类型来进行匹配。

// TypeScript 将会以不同形式来匹配 any 的位置，
// 例如将这些元组作为函数的参数：

declare function swap(x: [number, string]): [string, number];

declare const pair: [any, any];
swap(pair);

// 对 swap 的调用是合法的，因为在将第一个 any 替换为 number，
// 第二个 any 替换为 string 后，参数可以正常被匹配到。

// 如果你没有了解过元组，查看: example:tuples

// unknown 是 any 的同级别的类型，如果 any 代表着 ”我知道什么是正确的“，
// 那么 unknown 代表着 “我不确定什么是正确的，所以你需要将类型告诉 TypeScript”。
// example:unknown-and-never
