// 条件类型（Conditional Types）允许在 TypeScript 类型系统中进行简单的运算。
// 这绝对是一项高级功能，您在日常开发工作中完全可以不适用它。

// 条件类型看起来是这样：
//
//   A extends B ? C : D
//
// 条件是某个类型是否继承某个表达式，如果是的话，返回什么类型。

// 让我们来看一些示例，为了简洁起见，我们将适用单个字母作为泛型的名称。
// 这是可选的，但是我们每行的长度被限制在 60 个字母以内，
// 这使我们很难将其显示在屏幕上。

type Cat = { meows: true };
type Dog = { barks: true };
type Cheetah = { meows: true; fast: true };
type Wolf = { barks: true; howls: true };

// 我们可以创建一个条件类型，该条件类型仅允许提取符合 barks 判断的类型。

type ExtractDogish<A> = A extends { barks: true } ? A : never;

// 然后我们可以创建 ExtractDogish 类型的包装：

// 猫（cat）不能够吠（bark），因此它返回 never
type NeverCat = ExtractDogish<Cat>;
// 狼（wolf）可以吠，因此它返回 wolf 。
type Wolfish = ExtractDogish<Wolf>;

// 这对您使用包含多种类型的并集类型，
// 并希望减少并集类型中可能的类型成员时很有帮助：

type Animals = Cat | Dog | Cheetah | Wolf;

// 当您将 ExtractDogish 应用到一个并集类型上时，可以视为对联合
// 类型中的每一个类型成员的应用：

type Dogish = ExtractDogish<Animals>;

// = ExtractDogish<Cat> | ExtractDogish<Dog> |
//   ExtractDogish<Cheetah> | ExtractDogish<Wolf>
//
// = never | Dog | never | Wolf
//
// = Dog | Wolf (查看 example:unknown-and-never)

// 由于类型被分派到每一个并集类型的成员，因此被叫做条件类型分派。

// 延迟条件类型

// 条件类型可以用于改进您的 API，这些 API 可以根据不同的输入返回不同的类型。

// 例如这个函数的返回值是 string 还是 number 取决于传入的 boolean。

declare function getID<T extends boolean>(fancy: T): T extends true ? string : number;

// 根据类型系统对 boolean 的推断，你将获得不同的返回值类型：

let stringReturnValue = getID(true);
let numberReturnValue = getID(false);
let stringOrNumber = getID(Math.random() < 0.5);

// 虽然在这个例子中，TypeScript 可以立即知道返回值，但是您也可以将
// 条件类型应用到您暂时不知道类型的函数中。这被称作延迟条件类型。

// 与上面的 Dogish 类似，但是是一个函数。
declare function isCatish<T>(x: T): T extends { meows: true } ? T : undefined;

// 条件类型还有一个额外有用的工具，它可以告诉 TypeScript 推迟时应该推断类型。
// 那就是 “infer” 关键字。

// infer 通常被用来创建您现有代码中的某些元类型，
// 可以将其视为在类型内部创建新的类型变量。

type GetReturnValue<T> = T extends (...args: any[]) => infer R ? R : T;

// 大意：
//
//  - 这是一个被称作 GetReturnValue 的泛型条件类型，它接收一个类型参数。
//
//  - 这个条件类型将检查如果传入的类型是一个函数，如果是，则根据函数的返回值类型
//    创建一个名为 R 的新类型。
//
//  - 如果检查通过，整个类型的值将被推断为返回值类型，否则是原有的类型。
//

type getIDReturn = GetReturnValue<typeof getID>;

// 这将不能通过是否是一个函数的检查，并且将返回传入的类型本身。
type getCat = GetReturnValue<Cat>;
