//// { order: 4 }

// Mixins are a faux-multiple inheritance pattern for classed
// in JavaScript which TypeScript has support for. The pattern
// allows you to create a class which creates class which are
// a merge of many classes.

// To get started, we need a type which is the which we'll use
// to extend other classes from (it's main responsibility is
// to declare that the type being passed in is a class) (Maybe?!)
//
type Constructor<T = {}> = new (...args: any[]) => T;

// Then we can create a series of classes which exist to extend
// the final class by wrapping it. This pattern works well
// when similar objects have different capabilities.

// This mixin adds a scale property, with getters and setters
// for changing it with an encapsulated private property

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

// This mixin adds extra methods around alpha composition
// something which modern computers use to create depth

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

// Creating an instance with these classes
// shows that the objects have different sets of
// functions due to their mixins:

const flappySprite = new ModernDisplaySprite("Bird");
flappySprite.setVisible();
flappySprite.setScale(0.8);
flappySprite.x = 10;
flappySprite.y = 20;


const gameBoySprite = new EightBitSprite("L block");
gameBoySprite.setScale(0.3);
// Fails because an EightBitSprite does not have
// the mixin for changing alphas
gameBoySprite.setAlpha(0.5);
