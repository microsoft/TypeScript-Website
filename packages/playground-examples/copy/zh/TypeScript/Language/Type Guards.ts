// 类型守卫是您通过代码影响代码流分析的功能。
// TypeScript 使用现存的 JavaScript 在运行时验证对象的行为来进行代码流分析。
// 本文假定您已阅读 example:code-flow

// 为了展示这些例子，我们会创建一些类。
// 这是用来处理互联网或电话订单的系统。

interface Order {
  address: string;
}
interface TelephoneOrder extends Order {
  callerNumber: string;
}
interface InternetOrder extends Order {
  email: string;
}

// 然后定义一个可能是两种订单子类型之一或 undefined 的类型。
type PossibleOrders = TelephoneOrder | InternetOrder | undefined;

// 创建一个函数，返回 PossibleOrders 类型。
declare function getOrder(): PossibleOrders;
const possibleOrder = getOrder();

// 我们可以使用 'in' 操作符来检查某个特定的键存在在对象上，
// 以缩小并集类型的范围 （'in' 是 JavaScript中用来检查对象上键是否存在的操作符）。

if ("email" in possibleOrder) {
  const mustBeInternetOrder = possibleOrder;
}

// 如果您有符合接口的类，可以使用 JavaScript 中 'instanceof' 操作符来检查。

class TelephoneOrderClass {
  address: string;
  callerNumber: string;
}

if (possibleOrder instanceof TelephoneOrderClass) {
  const mustBeTelephoneOrder = possibleOrder;
}

// 你可以使用 JavaScript 中 'typeof' 操作符来缩小您的并集类型。
// 它只对于 JavaScript 中的基本类型起作用（例如字符串，对象，数组等）。

if (typeof possibleOrder === "undefined") {
  const definitelyNotAnOder = possibleOrder;
}

// 你可以在这里看到全部 typeof 的可能的值:
// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/typeof

// 使用 JavaScript 操作符仅仅可以帮助您实现一部分功能，
// 当您希望检查自己定义的类型时，您可以使用类型谓词函数。

// 类型谓词函数是一个当返回 true 时，会给代码流分析提供一些额外信息的函数。

// 要使用 PossibleOrders 类型，我们可以用两个类型守卫
// 来声明 possibleOrder 究竟是哪个类型：

function isAnInternetOrder(order: PossibleOrders): order is InternetOrder {
  return order && "email" in order;
}

function isATelephoneOrder(order: PossibleOrders): order is TelephoneOrder {
  return order && "calledNumber" in order;
}

// 现在我们可以使用这些函数在 if 语句中缩小 possibleOrder 的可能的类型：

if (isAnInternetOrder(possibleOrder)) {
  console.log("Order received via email:", possibleOrder.email);
}

if (isATelephoneOrder(possibleOrder)) {
  console.log("Order received via phone:", possibleOrder.callerNumber);
}

// 你可以在这里获得更多关于代码流分析的信息：
//
//  - example:code-flow
//  - example:type-guards
//  - example:discriminate-types
