// Unknown

// Unknown is one of those types that once it clicks, you
// can find quite a lot of uses for it. It acts like a sibling
// to the any type. Where any allows for ambiguity - unknown
// requires specifics.

// 封装 JSON 解析器是一个不错的例子，JSON 数据可以以多种不同的形式出现，
// 并且 JSON 解析器函数的作者并不知道数据的形状。而调用解析函数的人应该知道。

const jsonParser = (jsonString: string) => JSON.parse(jsonString);

const myAccount = jsonParser(`{ "name": "Dorothea" }`);

myAccount.name;
myAccount.email;

// 如果你将鼠标悬停在 jsonParser 上，你可以看到它的返回值类型是 any，
// myAccount 也是如此，虽然可以使用泛型来解决这个问题，但是我们也可以使用 unknown。

const jsonParserUnknown = (jsonString: string): unknown => JSON.parse(jsonString);

const myOtherAccount = jsonParserUnknown(`{ "name": "Samuel" }`);

myOtherAccount.name;

// myOtherAccount 对象在类型声明给 TypeScript 之前不可以被使用，
// 这可以保证 API 的使用者预先考虑他们的类型。

type User = { name: string };
const myUserAccount = jsonParserUnknown(`{ "name": "Samuel" }`) as User;
myUserAccount.name;

// unknown 是一个很好的工具，可以查看这些以了解更多：
// https://mariusschulz.com/blog/the-unknown-type-in-typescript
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type

// Never

// 由于 TypeScript 支持代码流分析，语言必须可以表示在逻辑上不会执行的代码。
// 例如，这个函数将永远不会返回:

const neverReturns = () => {
  // If it throws on the first line
  throw new Error("Always throws, never returns");
};

// 如果你将鼠标悬停在 neverReturns 上，你可以看到它的类型是 () => never，
// 这代表着它永远不会执行。这依然可以像其他值一样传递：

const myValue = neverReturns();

// 对于处理不可预测的 JavaScript 运行时行为以及当 API 的使用者不适用类型时，
// 使函数永不返回（返回 never） 非常有用。

const validateUser = (user: User) => {
  if (user) {
    return user.name !== "NaN";
  }

  // 在类型系统中，这条路径上的代码永远不会被执行，这与 neverReturns 的
  // 返回值类型 never 相匹配。

  return neverReturns();
};

// 虽然类型定义规定用户必须按类型传递参数，但是在 JavaScript 中有足够
// 多的特殊情况，所以您不能保证这一点。

// 使用永不返回的函数可以允许您在一些不可能的地方上添加额外的代码。
// 这对于提供更好的错误信息，或者释放一些诸如文件的资源或循环时非常有用。

// 一个非常常见的 never 的使用方法是确保 switch 是被穷尽的。
// 也就是每个路径都有被覆盖到。

// 有一个枚举和一个穷尽的 switch，你可以尝试为枚举添加一个新的选项（例如 Tulip?）。

enum Flower {
  Rose,
  Rhododendron,
  Violet,
  Daisy,
}

const flowerLatinName = (flower: Flower) => {
  switch (flower) {
    case Flower.Rose:
      return "Rosa rubiginosa";
    case Flower.Rhododendron:
      return "Rhododendron ferrugineum";
    case Flower.Violet:
      return "Viola reichenbachiana";
    case Flower.Daisy:
      return "Bellis perennis";

    default:
      const _exhaustiveCheck: never = flower;
      return _exhaustiveCheck;
  }
};

// 你会收到一个编译期错误，表示 flower 的类型不可以被转换为 never。

// 并集类型中的 Never

// never 会在并集类型中被自动移除。

type NeverIsRemoved = string | never | number;

// 如果你查看 NeverIsRemoved 的类型，你会看到它是 string | number。
// 这是因为在运行时你永远不能将 never 赋值给它，所以它永远不会发生。

// 这个特性经常被使用到：example:conditional-types
