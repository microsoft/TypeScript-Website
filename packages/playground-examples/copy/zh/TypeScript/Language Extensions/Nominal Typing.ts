// 标称类型系统（nominal type system）代表每一个类型都是唯一的。
// 即使你有值相同的数据，你也不可以赋值给其他不同的类型。

// TypeScript 的类型系统是结构化（structural）的，也就是说如果
// 一个类型的形状像一只鸭子，那它就是一只鸭子。如果一只鹅有所有鸭子的属性，那么它也是一只鸭子。
// 你可以在这里了解更多: example:structural-typing

// 这可能会有一些缺点，例如有一些有着特殊上下文的字符串或数字，
// 并且你不希望他们被用到其他地方，例如：
// - 用户输入的不安全的字符串
// - 用于翻译的字符串
// - 数字形式的用户 ID
// - 访问令牌

// 我们可以通过一点点额外的代码来实现和标称类型系统近乎同样的效果。

// 我们可以使用一个具有属性 '__brand'（这是一个约定俗成的名称）
// 并且值是一个唯一常量的类型与字符串的交集类型来实现。
// 这样会使普通的字符串不可以复制给下面的 ValidatedInputString 类型。

type ValidatedInputString = string & { __brand: "User Input Post Validation" };

// 我们会使用一个函数来将一个普通字符串转换为 ValidatedInputString 类型。
// 但是值得注意的是，这只是我们将这个转换告诉 TypeScript。

const validateUserInput = (input: string) => {
  const simpleValidatedInput = input.replace(/\</g, "≤");
  return simpleValidatedInput as ValidatedInputString;
};

// 现在我们可以创建一个只接受我们的新的标称类型而不是普通字符串的函数。

const printName = (name: ValidatedInputString) => {
  console.log(name);
};

// 例如，这里有一些用户输入的不安全的字符串，只有经过验证才可以被允许使用。

const input = "\n<script>alert('bobby tables')</script>";
const validatedInput = validateUserInput(input);
printName(validatedInput);

// 另一方面，将未经过验证的字符串传入 'printName' 会导致编译错误。

printName(input);

// 你可以阅读这个有 400 多个评论的 Github issue，
// 从中找到如何通过不同的方法创建标称类型, 以及关于它们的全面论述和折衷方案。
//
// https://github.com/Microsoft/TypeScript/issues/202
//
// 这篇文章是一个很好的总结。
//
// https://michalzalecki.com/nominal-typing-in-typescript/
