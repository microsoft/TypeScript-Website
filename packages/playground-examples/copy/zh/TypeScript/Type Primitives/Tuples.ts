// 通常来说，一个数组包含某个类型的一个或多个对象。TypeScript 针对包含
// 多个类型的数组有特殊的分析，并且在数组中索引的位置非常重要。

// 这被称为元组（Tuples），可以将他们视为连接数据的一种
// 方式，但是语法上来说比有键的对象简单。

// 你可以像创建 JavaScript 的数组一样创建一个元组。

const failingResponse = ["Not Found", 404];

// 但是你需要声明它的类型是一个元组。

const passingResponse: [string, number] = ["{}", 200];

// 如果你将鼠标悬停在两个变量的名称上，你可以看到
// 数组（(string | number)[]）和元组 （[string, number]）之间的不同。

// 对于数组来说，顺序不重要，所以任何索引上的子项都可以是 string 或 number。
// 在元组中，顺序和长度将会得到报障。

if (passingResponse[1] === 200) {
  const localInfo = JSON.parse(passingResponse[0]);
  console.log(localInfo);
}

// 这意味着 TypeScript 将在索引的位置提供正确的类型。如果您
// 尝试在未声明的索引处访问对象将会引发错误。

passingResponse[2];

// 对于较短的数据组合，元组看起来是一个不错的模式。

type StaffAccount = [number, string, string, string?];

const staff: StaffAccount[] = [
  [0, "Adankwo", "adankwo.e@"],
  [1, "Kanokwan", "kanokwan.s@"],
  [2, "Aneurin", "aneurin.s@", "Supervisor"],
];

// 如果元组的开头有一组已知的类型，然后跟着未知长度，可以使用 spread 运算符
// 来表示它可以具有任何长度，并且额外的索引将会具有指定的类型。

type PayStubs = [StaffAccount, ...number[]];

const payStubs: PayStubs[] = [
  [staff[0], 250],
  [staff[1], 250, 260],
  [staff[0], 300, 300, 300],
];

const monthOnePayments = payStubs[0][1] + payStubs[1][1] + payStubs[2][1];
const monthTwoPayments = payStubs[1][2] + payStubs[2][2];
const monthThreePayments = payStubs[2][2];

// 您可以使用元组来描述带有未知长度参数的函数：

declare function calculatePayForEmployee(id: number, ...args: [...number[]]): number;

calculatePayForEmployee(staff[0][0], payStubs[0][1]);
calculatePayForEmployee(staff[1][0], payStubs[1][1], payStubs[1][2]);

//
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#tuples-in-rest-parameters-and-spread-expressions
// https://auth0.com/blog/typescript-3-exploring-tuples-the-unknown-type/
