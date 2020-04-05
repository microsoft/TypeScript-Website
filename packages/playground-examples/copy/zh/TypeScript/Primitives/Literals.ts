// TypeScript 对于代码中的字面量有一些有趣的特殊处理。

// 某种程度上，很大一部分支持在类型扩展和
// 缩小（example:type-widening-and-narrowing）中被支持，
// 建议首先了解一下他们。

// 字面量类型是一个类型中，更具体的一个子类型。
// 这意味着在类型系统中 “Hello World” 是一个字符串，
// 但是一个字符串并不一定是 “Hello World”。

const helloWorld = "Hello World";
let hiWorld = "Hi World"; // 这里的类型是字符串，因为它是由 let 定义的。

// 这个函数接受所有的字符串。
declare function allowsAnyString(arg: string);
allowsAnyString(helloWorld);
allowsAnyString(hiWorld);

// 这个函数仅接受字符串字面量 “Hello World”。
declare function allowsOnlyHello(arg: "Hello World");
allowsOnlyHello(helloWorld);
allowsOnlyHello(hiWorld);

// 它可以让你使用并集类型，定义某个 API 仅接受一些特定的字面量值。

declare function allowsFirstFiveNumbers(arg: 1 | 2 | 3 | 4 | 5);
allowsFirstFiveNumbers(1);
allowsFirstFiveNumbers(10);

let potentiallyAnyNumber = 3;
allowsFirstFiveNumbers(potentiallyAnyNumber);

// 看上去这个规则不适用于复杂的对象。

const myUser = {
  name: "Sabrina",
};

// 可以看到虽然它被定义为不可变，但是它依旧
// 将 `name: "Sabrina"` 转换为 "name: string"。
// 这是因为 name 依旧可以被改变。

myUser.name = "Cynthia";

// 因为 myUser 的 name 属性可以被改变，TypeScript 不能在类型系统
// 中使用字面量版本的类型。但是有一个功能可以允许你做到这一点。

const myUnchangingUser = {
  name: "Fatma",
} as const;

// 当 "as const" 被应用到一个对象上，它将变为一个不可变的
// 对象字面量，而不是一个可以被改变的对象。

myUnchangingUser.name = "Raîssa";

// "as const" 是用于常量数据的好工具，并且可以使代码变为内联的字面量。
// "as const" 同样可以用于数组。

const exampleUsers = [{ name: "Brian" }, { name: "Fahrooq" }] as const;
