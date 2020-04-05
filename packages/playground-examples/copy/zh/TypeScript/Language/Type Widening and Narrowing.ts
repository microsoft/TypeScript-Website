// 通过例子来研究类型扩展（Widening）和缩小（Narrowing）比较容易被接受：

const welcomeString = "Hello There";
let replyString = "Hey";

// 除了字符文本的差异外，welcomeString 是由 const 定义的（代表值不会变），
// replyString 是由 let 定义的（代表值可以被改变）。

// 如果你将鼠标悬停在每个变量上，你会看到 TypeScript 提供的非常不同的类型信息。
//
//   const welcomeString: "Hello There"
//
//   let replyString: string

// TypeScript 推断出 welcomeString 的类型是字符串字面量类型 "Hello There",
// 而 replyString 是普通字符串。

// 这是因为 let 需要一个更宽泛的类型，你可以将 replyString 赋值为任何其他字符串，
// 这意味着它具有更多的可能性。

replyString = "Hi :wave:";

// 如果 replyString 的类型是字符串字面量 "Hey", 那么你将不能改变它的值,
// 因为它只可以再次被赋值为 ”Hey“

// 扩展和缩小类型是增减类型可以表示的可能性。

// 类型缩小的一个例子是关于并集类型的，这个代码流分析中的例子几乎完全基于类型缩小。
// example:code-flow

// 通过可空检查的严格模式，类型缩小可以具有强大的能力。
// 当严格模式关闭，例如 undefined 或 null 等可空性的标记将会在并集类型中被忽略。

declare const quantumString: string | undefined;
// 这个例子仅会在严格模式产生错误。
quantumString.length;

// 在严格模式下，代码作者需要确保使用的类型已经缩小为非空类型。
// 通常来说，它就像添加一个 if 检查一样简单：

if (quantumString) {
  quantumString.length;
}

// 在严格模式下 quantumString 的类型有两种可能性，
// 在 if 语句中，类型被缩小，只剩余字符串。

// 你可以在这里看到更多关于缩小的例子：
//
// example:union-and-intersection-types
// example:discriminate-types

//
// 以及网络上有更多的资源：
//
// https://mariusschulz.com/blog/literal-type-widening-in-typescript
// https://sandersn.github.io/manual/Widening-and-Narrowing-in-Typescript.html
