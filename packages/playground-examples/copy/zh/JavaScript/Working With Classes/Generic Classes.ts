//// { order: 3 }

// 此示例主要在 TypeScript 中使用，因为这样会更容易理解这种方式。
// 最后，我们将介绍如何使用 JSDoc 来创建相同的类。

// 泛型类是一种表示特定类型依赖另一种类型的方法。例如，这是
// 一个可以容纳任何对象的抽屉（Drawer），但是只可以有一种类型：

class Drawer<ClothingType> {
  contents: ClothingType[] = [];

  add(object: ClothingType) {
    this.contents.push(object);
  }

  remove() {
    return this.contents.pop();
  }
}

// 要使用 Drawer，您需要另一种类型：

interface Sock {
  color: string;
}

interface TShirt {
  size: "s" | "m" | "l";
}

// 我们可以在创建 Drawer 时传入 Sock 类型，从而为
// Socks 创建一个 drawer：
const sockDrawer = new Drawer<Sock>();

// 现在我们可以添加或删除 drawer 中的 sock 了：
sockDrawer.add({ color: "white" });
const mySock = sockDrawer.remove();

// 以及为 TShirt 创建 Drawer：
const tshirtDrawer = new Drawer<TShirt>();
tshirtDrawer.add({ size: "m" });

// 如果您有点古怪，您甚至可以通过并集类型将 Sock 和 TShirt 混
// 合用来创建一个 Drawer：

const mixedDrawer = new Drawer<Sock | TShirt>();

// 要不通过额外的 TypeScript 语法创建一个类似 Drawer 的类，则需要
// 使用 JSDoc 中的模板（template）标记。在此示例中，我们定义了模板
// 变量，然后定义类的属性：

// 要在游乐场上实验这项功能，您需要将设置更改为 JavaScript 文件，
// 然后删除上面的的 TypeScript 代码。

/**
 * @template {{}} ClothingType
 */
class Dresser {
  constructor() {
    /** @type {ClothingType[]} */
    this.contents = [];
  }

  /** @param {ClothingType} object */
  add(object) {
    this.contents.push(object);
  }

  /** @return {ClothingType} */
  remove() {
    return this.contents.pop();
  }
}

// 然后我们通过 JSDoc 创建一个新的类型：

/**
 * @typedef {Object} Coat 一个 Coat
 * @property {string} color Coat 的颜色
 */

// 然后当我们创建该类型的新实例时，我们使用 @type 将变量
// 标记为处理 Coat 的 Dresser。

/** @type {Dresser<Coat>} */
const coatDresser = new Dresser();

coatDresser.add({ color: "green" });
const coat = coatDresser.remove();
