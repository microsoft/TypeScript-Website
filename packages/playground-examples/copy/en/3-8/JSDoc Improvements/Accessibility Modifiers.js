//// { "compiler": { "ts": "3.8.3" }, "isJavaScript": true }
// @ts-check

// The JSDoc support for TypeScript was extended to support
// the accessibility modifiers on class properties. There is:
//
// @public - the default, and what happens if you don't set one
// @private - the field can only be accessed in the same class
//            where the field is defined
// @protected - the field is accessible to the class where it is
//              defined and subclasses of that class
//

// This is a base class of Animal, it has both a private and
// protected field. Subclasses can access "this.isFast" but
// not "this.type".

// Outside of these the class, both of these fields are not
// visible and return a compiler error when // @ts-check is
// turned on:

class Animal {
  constructor(type) {
    /** @private */
    this.type = type;
    /** @protected */
    this.isFast = type === "cheetah";
  }

  makeNoise() {
    // Supposedly these are pretty much silent
    if (this.type === "bengal") {
      console.log("");
    } else {
      throw new Error("makeNoise was called on a base class");
    }
  }
}

class Cat extends Animal {
  constructor(type) {
    super(type || "housecat");
  }

  makeNoise() {
    console.log("meow");
  }

  runAway() {
    if (this.isFast) {
      console.log("Got away");
    } else {
      console.log("Did not make it");
    }
  }
}

class Cheetah extends Cat {
  constructor() {
    super("cheetah");
  }
}

class Bengal extends Cat {
  constructor() {
    super("bengal");
  }
}

const housecat = new Cat();
housecat.makeNoise();

// These are not available
housecat.type;
housecat.isFast;

// You can read more in the post
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#jsdoc-modifiers
