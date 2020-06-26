//// { order: 4 }

// 混合（Mixins）是 TypeScript 支持的 JavaScript 类的伪多重继承
// 模式。该模式允许您创建一个由许多类合并而成的类。

// 首先我们需要一种类型，用于扩展其他类。主要职责是声明传入的类型是一个类。

type Constructor = new (...args: any[]) => {};

// 然后我们可以创建一系列的类，这些类通过包装最终的类来进行扩展。
// 此模式当相似的对象具有不同的功能时效果很好。

// 这个混合添加了 scale 属性，并带有用于使用封装的 private 属性
// 以及对其进行更改的 getter 和 setter：

function Scale<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private _scale = 1;

    setScale(scale: number) {
      this._scale = scale;
    }

    get scale(): number {
      return this._scale;
    }
  };
}

// 该混合围绕 alpha 合成添加了额外的方法，现代计算机使用这些方法来创建深度：

function Alpha<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    private alpha = 1;

    setHidden() {
      this.alpha = 0;
    }

    setVisible() {
      this.alpha = 1;
    }

    setAlpha(alpha: number) {
      this.alpha = alpha;
    }
  };
}

// 一个用于扩展的简单的 sprite 基类：

class Sprite {
  name = "";
  x = 0;
  y = 0;

  constructor(name: string) {
    this.name = name;
  }
}

// 我们将创建两种具有不同功能的 sprite：

const ModernDisplaySprite = Alpha(Scale(Sprite));
const EightBitSprite = Scale(Sprite);

// 创建这些类的实例表明，由于对象的混合，这些对象具有不同的属性和方法：

const flappySprite = new ModernDisplaySprite("Bird");
flappySprite.x = 10;
flappySprite.y = 20;
flappySprite.setVisible();
flappySprite.setScale(0.8);
console.log(flappySprite.scale);

const gameBoySprite = new EightBitSprite("L block");
gameBoySprite.setScale(0.3);

// 由于 EightBitSprite 没有用于更改 alpha 的混合而报错：
gameBoySprite.setAlpha(0.5);

// 如果要对包装的类提供更多的保证，则可以将构造函数与泛型一起使用。

type GConstructor<T = {}> = new (...args: any[]) => T;

// 您可以声明只能在基类为特殊形状时应用此混合。

type Moveable = GConstructor<{ setXYAcceleration: (x: number, y: number) => void }>;

// 然后我们可以创建一个混合，它依赖于上述 GConstructor 参数
// 中存在的函数。

function Jumpable<TBase extends Moveable>(Base: TBase) {
  return class extends Base {
    jump() {
      // 这个混合现在可以知道 setXYAcceleration
      this.setXYAcceleration(0, 20);
    }
  };
}

// 只有在混合的结构中有一个添加 setXYAcceleration 的类之后
// 我们才能创建此 sprite：
const UserSprite = new Jumpable(ModernDisplaySprite);
