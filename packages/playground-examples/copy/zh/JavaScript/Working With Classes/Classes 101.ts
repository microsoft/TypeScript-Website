//// { order: 0 }

// 类（class）是一种始终用构造函数来创建的 JavaScript 对象。这些类的行为
// 很像对象，并且具有与 Java、C#、Swift 类似的继承结构。

// 下面是一个类的示例：

class Vendor {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  greet() {
    return "Hello, welcome to " + this.name;
  }
}

// 您可以通过 new 关键字创建一个实例，您可以通过该对象调用方法
// 和访问属性。

const shop = new Vendor("Ye Olde Shop");
console.log(shop.greet());

// 您可以继承一个对象。这是一个可以有多种名字的食品推车：

class FoodTruck extends Vendor {
  cuisine: string;

  constructor(name: string, cuisine: string) {
    super(name);
    this.cuisine = cuisine;
  }

  greet() {
    return "Hi, welcome to food truck " + this.name + ". We serve " + this.cuisine + " food.";
  }
}

// 由于我们标记创建新的 FoodTruck 需要两个参数，TypeScript 将
// 在您只传递一个参数时报错：

const nameOnlyTruck = new FoodTruck("Salome's Adobo");

// 如果您正确地传递两个参数，将可以创建一个 FoodTruck 的新实例：

const truck = new FoodTruck("Dave's Doritos", "junk");
console.log(truck.greet());
