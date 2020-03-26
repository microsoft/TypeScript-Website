// TypeScript 的类型推断可以帮助您做很多事，但是还有很多其他方法可以
// 提供更丰富的标记函数形状的方法。

// 可选函数是看起来很棒的一点，它可以让其他人知道你可以跳过这个参数。

let i = 0;
const incrementIndex = (value?: number) => {
  i += value === undefined ? 1 : value;
};

// 这个函数可以像这样调用：

incrementIndex();
incrementIndex(0);
incrementIndex(3);

// 你可以将参数标记为函数，从而在编写函数时提供类型推导。

const callbackWithIndex = (callback: (i: number) => void) => {
  callback(i);
};

// 嵌入函数接口可能很难阅读（可能有很多箭头）。使用类型别名可以
// 为函数参数命名

type NumberCallback = (i: number) => void;
const callbackWithIndex2 = (callback: NumberCallback) => {
  callback(i);
};

// 他们可以像这样调用：

callbackWithIndex((index) => {
  console.log(index);
});

// 将鼠标悬停在上面的 index 上，您可以看到 TypeScript 可以正确
// 推断出 index 是一个 number 类型。

// 将函数作为实例的引用传递时，TypeScript 类型推导也可以正常工作。
// 为了展示这一点，我们会使用一个将 number 转换为 string 的函数：

const numberToString = (n: number) => {
  return n.toString();
};

// 它可以适用于数组的 map 之类的方法中，比如将所有数字转换为字符串。
// 如果您将鼠标悬停在下面的 stringedNumbers 上，则可以看到期望的类型。
const stringedNumbers = [1, 4, 6, 10].map((i) => numberToString(i));

// 我们可以使用快捷形式直接传递函数，并通过更简洁的代码获得相同的结果：
const stringedNumbersTerse = [1, 4, 6, 10].map(numberToString);

// 您的函数可能可以接受许多类型，但是您可能只对其中一部分属性感兴趣。
// 而类型签名中的索引签名（indexed signature）对这种情况很有用。
// 以下类型声明此函数可以用于所有对象，只要它包含属性 name 即可：

interface AnyObjectButMustHaveName {
  name: string;
  [key: string]: any;
}

const printFormattedName = (input: AnyObjectButMustHaveName) => {};

printFormattedName({ name: "joey" });
printFormattedName({ name: "joey", age: 23 });

// 如果您希望了解更多关于索引签名的内容，我们建议访问以下链接：
//
// https://www.typescriptlang.org/docs/handbook/interfaces.html#excess-property-checks
// https://basarat.gitbooks.io/typescript/docs/types/index-signatures.html

// 您还可以通过 tsconfig 配置中 suppressExcessPropertyErrors
// 的选项来在任何地方允许这种行为——但是您不知道其他使用您 API 的用户
// 是否关掉了这个选项。

// JavaScript 中的函数可以接受不同的参数。有两种常见的模式来描述：用于
// 参数和返回值的并集类型以及函数重载。

// 只有在仅有一两处不同且不需要在不同函数中展示不同的文档时，才适合在
// 参数中使用并集类型。

const boolOrNumberFunction = (input: boolean | number) => {};

boolOrNumberFunction(true);
boolOrNumberFunction(23);

// 另一方面，函数重载为参数和返回类型提供了丰富的语法。

interface BoolOrNumberOrStringFunction {
  /** 接受一个 bool，返回一个 bool */
  (input: boolean): boolean;
  /** 接受一个 number，返回一个 number */
  (input: number): number;
  /** 接受一个 string，返回一个 bool */
  (input: string): boolean;
}

// 如果这是您第一次看到 declare 关键字，它使您可以告诉 TypeScript
// 文件中某些即使在运行时不存在的东西存在，对于映射有副作用的代码或
// 实现某些东西需要很多代码的 demo 来说都非常有用。

declare const boolOrNumberOrStringFunction: BoolOrNumberOrStringFunction;

const boolValue = boolOrNumberOrStringFunction(true);
const numberValue = boolOrNumberOrStringFunction(12);
const boolValue2 = boolOrNumberOrStringFunction("string");

// 将鼠标悬停在上述值和函数上，您可以看到正确的文档和返回值。

// 函数重载对您很有帮助，但是还有一种可以处理不同类型的输入
// 和返回值的工具，那就是泛型。

// 这为您提供了一种在类型定义中将类型作为占位符变量的方法。

// example:generic-functions
// example:function-chaining
