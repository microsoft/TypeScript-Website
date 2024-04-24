//// { "order": 4 }

// Mixins are a faux-multiple inheritance pattern for classes
// in JavaScript which TypeScript has support for. The pattern
// allows you to create a class which is a merge of many
// classes.

// To get started, we need a type which we'll use to extend
// other classes from. The main responsibility is to declare
// that the type being passed in is a class.

type Constructor = new (...args: any[]) => {};

// Then we can create a series of classes which extend
// the final class by wrapping it. This pattern works well
// when similar objects have different capabilities.

// This mixin adds a scale property, with getters and setters
// for changing it with an encapsulated private property:

function Scale<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    // Mixins may not declare private/protected properties
    // however, you can use ES2020 private fields
    _scale = 1;

    setScale(scale: number) {
      this._scale = scale;
    }

    get scale(): number {
      return this._scale;
    }
  };
}

// This mixin adds extra methods around alpha composition
// something which modern computers use to create depth:

function Alpha<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    alpha = 1;

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

// A simple sprite base class which will then be extended:

class Sprite {
  name = "";
  x = 0;
  y = 0;

  constructor(name: string) {
    this.name = name;
  }
}

// Here we create two different types of sprites
// which have different capabilities:

const ModernDisplaySprite = Alpha(Scale(Sprite));
const EightBitSprite = Scale(Sprite);

// Creating instances of these classes shows that
// the objects have different sets of properties
// and methods due to their mixins:

const flappySprite = new ModernDisplaySprite("Bird");
flappySprite.x = 10;
flappySprite.y = 20;
flappySprite.setVisible();
flappySprite.setScale(0.8);
console.log(flappySprite.scale);

const gameBoySprite = new EightBitSprite("L block");
gameBoySprite.setScale(0.3);

// Fails because an EightBitSprite does not have
// the mixin for changing alphas:
gameBoySprite.setAlpha(0.5);

// If you want to make more guarantees over the classes
// which you wrap, you can use a constructor with generics.

type GConstructor<T = {}> = new (...args: any[]) => T;

// Now you can declare that this mixin can only be
// applied when the base class is a certain shape.

type Moveable = GConstructor<{ setXYAcceleration: (x: number, y: number) => void }>;

// We can then create a mixin which relies on the function
// present in the parameter to the GConstructor above.

function Jumpable<TBase extends Moveable>(Base: TBase) {
  return class extends Base {
    jump() {
      // This mixin knows about setXYAcceleration now
      this.setXYAcceleration(0, 20);
    }
  };
}

// We cannot create this sprite until there is a class
// in the mixin hierarchy which adds setXYAcceleration:
const UserSprite = new Jumpable(ModernDisplaySprite);
