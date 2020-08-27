//// { compiler: { ts: "4.0.2" } }

// # Nullish Coalescing
//
// This is a new operator `??` which is meant to augment
// the common usage of `||` in the same way `===` augments `==`
// as a more strict form of equality.
//
// To understand it, let's look a how || works:

const response = {
  nullValue: null,
  headerText: "",
  animationDuration: 0,
  height: 400,
  showSplashScreen: false,
} as const;

const undefinedValue = response.undefinedValue || "some other default";
// This would be: 'some other default'

const nullValue = response.nullValue || "some other default";

// These two examples work similar in most languages. As a tool || is
// pretty good at defaulting things, but JavaScript's falsy checks
// can surprise you for some common values:

// Potentially unintended. '' is falsy, result: 'Hello, world!'
const headerText = response.headerText || "Hello, world!";

// Potentially unintended. 0 is falsy, result: 300
const animationDuration = response.animationDuration || 300;

// Potentially unintended. false is falsy, result: true
const showSplashScreen = response.showSplashScreen || true;

// When switching to use ?? instead, then === equality is used
// to compare the two sides:

const emptyHeaderText = response.headerText ?? "Hello, world!";
const zeroAnimationDuration = response.animationDuration ?? 300;
const skipSplashScreen = response.showSplashScreen ?? true;
