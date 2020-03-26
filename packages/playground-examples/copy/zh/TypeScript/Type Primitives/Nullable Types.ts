//// { order: 3, compiler: { strictNullChecks: false } }

// JavaScript 有两种不同的方法声明不存在的值，TypeScript 添加了额外的
// 语法，以提供更多方法来声明某些内容声明为可选或可空。

// 首先，两种 JavaScript 基本类型中的不同：undefined 和 null

// Undefined 是指找不到或无法设置某些内容

const emptyObj = {};
const anUndefinedProperty: undefined = emptyObj["anything"];

// Null 则在明确的没有值的情况下使用

const searchResults = {
  video: { name: "LEGO Movie" },
  text: null,
  audio: { name: "LEGO Movie Soundtrack" },
};

// 为什么不使用 undefined？主要原因是让您可以正确的校验 text 是否被包含。
// 而如果 text 返回的是 undefined，那么这个值和没有被设置时相同。

// 这可能感觉没有什么用处，但是当转换为一个 JSON 字符串时，如果 text 是 undefined，
// 那么它将不会被包含在等效的字符串中，

// 严格的空检查

// 在 TypeScript 2.0 之前，类型系统中实际上忽略了 null 和 undefined。
// 这让 TypeScript 提供了一个更接近没有类型的 JavaScript 的开发环境。

// 2.0 版本添加了一个叫做 严格空检查（strictNullChecks）的编译选项，
// 这个选项要求人们将 undefined 和 null 视为需要通过代码流分析来处理的类型。
// （更多信息可以查看 example:code-flow）

// 一个让 TypeScript 将严格空检查打开的示例，将鼠标悬停
// 在下面的“Potential String”上。

type PotentialString = string | undefined | null;

// PotentialString 丢弃了 undefined 和 null。如果您
// 在设置中开启严格空检查并返回这里，你可以看到悬停在 PotentialString 上时
// 会显示完整的并集类型。

declare function getID(): PotentialString;

const userID = getID();
console.log("User Logged in: ", userID.toUpperCase());

// 只有在严格模式下时，以上操作会出错 ^

// 同样有一些方式告诉 TypeScript 你知道更多信息
// 例如使用类型断言或通过非空断言操作符（!）

const definitelyString1 = getID() as string;
const definitelyString2 = getID()!;

// 或者你可以通过 if 安全地检查是否存在：

if (userID) {
  console.log(userID);
}

// 可选属性

// Void

// Void 是一个函数没有返回值时返回的类型。

const voidFunction = () => {};
const resultOfVoidFunction = voidFunction();

// 这通常是偶然的，TypeScript 会保留 void 类型以使您得到编译错误
// - 即使在运行时值将会是 undefined。
