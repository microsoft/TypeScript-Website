// Enums are a feature added to JavaScript in TypeScript
// which makes it easier to handle named sets of constants.

// By default an enum is number based, starting at zero,
// and each option is assigned an increment by one. This is
// useful when the value is not important.

enum CompassDirection {
  North,
  East,
  South,
  West
}

// By annotating an enum option, you set the value;
// increments continue from that value:

enum StatusCodes {
  OK = 200,
  BadRequest = 400,
  Unauthorized,
  PaymentRequired,
  Forbidden,
  NotFound
}

// You reference an enum by using EnumName.Value

const startingDirection = CompassDirection.East;
const currentStatus = StatusCodes.OK;

// Enums support accessing data in both directions from key
// to value, and value to key.

const okNumber = StatusCodes.OK;
const okNumberIndex = StatusCodes["OK"];
const stringBadRequest = StatusCodes[400];

// Enums can be different types, a string type is common.
// Using a string can make it easier to debug, because the
// value at runtime does not require you to look up the number.

enum GamePadInput {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT"
}

// If you want to reduce the number of objects in your
// JavaScript runtime, you can create a const enum.

// A const enum's value is replaced by TypeScript during
// transpilation of your code, instead of being looked up
// via an object at runtime.

const enum MouseAction {
  MouseDown,
  MouseUpOutside,
  MouseUpInside
}

const handleMouseAction = (action: MouseAction) => {
  switch (action) {
    case MouseAction.MouseDown:
      console.log("Mouse Down");
      break;
  }
};

// If you look at the transpiled JavaScript, you can see
// how the other enums exist as objects and functions,
// however MouseAction is not there.

// This is also true for the check against MouseAction.MouseDown
// inside the switch statement inside handleMouseAction.

// Enums can do more than this, you can read more in the
// TypeScript handbook

// https://www.typescriptlang.org/docs/handbook/enums.html
