//// { order: 1, compiler: { strict: false } }

// JavaScript 对象是用具名键包装的值的集合。

const userAccount = {
  name: "Kieron",
  id: 0,
};

// 您可以将他们合并已获得一个更大更复杂的数据模型。

const pie = {
  type: "Apple",
};

const purchaseOrder = {
  owner: userAccount,
  item: pie,
};

// 如果您将鼠标悬停在这些单词上（尝试上面的 purchaseOrder），您可以
// 看到 TypeScript 是如何将您的 JavaScript 解释为被标记的类型。

// 值可以通过“.”（点）访问，可以获取一个采购订单的用户名：
console.log(purchaseOrder.item.type);

// 如果您用鼠标悬停在括号之间的代码的每个部分上，您可以看到 TypeScript
// 为每个部分都提供了更多的信息。尝试重写下面的内容：

// 把这个完整复制到下一行：
//
//   purchaseOrder.item.type

// TypeScript 向游乐场提供关于此文件中可用的 JavaScript 对象
// 的反馈，让您可以减少输入错误并且可以查看额外的信息，而不必在
// 其他地方查找。

// TypeScript 对于数组同样提供了相同的功能。这里有一个数组，其中
// 只有一个我们的采购订单。

const allOrders = [purchaseOrder];

// 如果您将鼠标悬停在 allOrders 上，你可以判断它是一个数组，因为悬停
// 信息以 [] 结尾。您可以使用方括号和索引（从 0 开始）来进行一阶访问。

const firstOrder = allOrders[0];
console.log(firstOrder.item.type);

// 获取对象的另一种方式是 pop 数组以删除对象。这样做会从数组中删除对象，
// 并返回被删除的对象。这被称为修改数组，因为它会更改其中的基础数据。

const poppedFirstOrder = allOrders.pop();

// 现在 allOrders 是空的。修改数据对很多东西都很有用，但是减少修改数据是
// 降低代码复杂度的一种方式。TypeScript 提供了一种声明只读数组的方式：

// 创建一个基于采购订单的形状创建另一个类型：
type PurchaseOrder = typeof purchaseOrder;

// 创建一个采购订单的只读数组：
const readonlyOrders: readonly PurchaseOrder[] = [purchaseOrder];

// 是的！当然还有更多代码，这里有 4 个新事物：
//
//  类型 PurchaseOrder - 为 TypeScript 声明一个新类型。
//
//  typeof - 让类型推断系统基于后面传入的常量推断类型。
//
//  purchaseOrder - 获取 purchaseOrder 变量，并且告诉 TypeScript
//                  这是 orders 数组中所有对象的形状。
//
//  readonly - 这个对象不支持被修改，当创建后，数组的内容将始终如一。
//
// 现在如果您尝试 pop readonlyOrders，TypeScript 将会抛出一个错误。

readonlyOrders.pop();

// 您可以在各种地方使用 readonly，虽然这有一些额外的语法，但是
// 同样会提供很多额外的安全性。

// 您可以找到更多关于 readonly 的信息：
//  - https://www.typescriptlang.org/docs/handbook/interfaces.html#readonly-properties
//  - https://basarat.gitbooks.io/typescript/content/docs/types/readonly.html

// 并且您可以在函数的示例中继续了解 JavaScript 和 TypeScript：
// example:functions
//
// 或者您可以了解更多关于不可变性的信息：
// example:immutability
