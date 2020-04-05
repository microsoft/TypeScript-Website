// 枚举是 TypeScript 为了更简单的处理一组具名固定值
// 而添加到 JavaScript 中的功能。

// 枚举默认是基于数字的，它的值从 0 开始，其余的每个值都会自增 1，
// 它对于具体的值不重要的场景非常有用。

enum CompassDirection {
  North,
  East,
  South,
  West,
}

// 可以通过添加注解来为枚举指定值，并且其他值将继续自增。

enum StatusCodes {
  OK = 200,
  BadRequest = 400,
  Unauthorized,
  PaymentRequired,
  Forbidden,
  NotFound,
}

// 枚举可以通过 枚举名.值名 来引用。

const startingDirection = CompassDirection.East;
const currentStatus = StatusCodes.OK;

// 枚举支持用访问值和用值访问键两种访问方式。

const okNumber = StatusCodes.OK;
const okNumberIndex = StatusCodes["OK"];
const stringBadRequest = StatusCodes[400];

// 枚举可以是不同的类型，其中字符串是一种常见的类型。
// 使用字符串值的枚举可以帮助简化调试，因为你不需要根据运行时的数字去寻找对应的名字。

enum GamePadInput {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

// 如果你想减少在运行时的数字对象的数量，你可以使用常量枚举。

// 常量枚举会在编译时被 TypeScript 替换为对应的值，而不是在运行时查找对象。

const enum MouseAction {
  MouseDown,
  MouseUpOutside,
  MouseUpInside,
}

const handleMouseAction = (action: MouseAction) => {
  switch (action) {
    case MouseAction.MouseDown:
      console.log("Mouse Down");
      break;
  }
};

// 如果查看编译出的 JavaScript，你可以看到其他的枚举怎样以对象和函数的形式存在，
// 但 MouseAction 并不存在。

// 在 handleMouseAction 的 switch 语句中，对于 MouseAction.MouseDown 的检查也是如此。

// 枚举可以做更多的事情，你你可以在 TypeScript 手册中查看更多:
//
// https://www.typescriptlang.org/docs/handbook/enums.html
