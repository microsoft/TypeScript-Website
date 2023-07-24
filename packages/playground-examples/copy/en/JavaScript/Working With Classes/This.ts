//// { "order": 2 }

// When calling a method of a class, you generally expect it
// to refer to the current instance of the class.

class Safe {
  contents: string;

  constructor(contents: string) {
    this.contents = contents;
  }

  printContents() {
    console.log(this.contents);
  }
}

const safe = new Safe("Crown Jewels");
safe.printContents();

// If you come from an objected oriented language where the
// this/self variable is easily predictable, then you may
// find you need to read up on how confusing 'this' can be:
//
// https://yehudakatz.com/2011/08/11/understanding-javascript-function-invocation-and-this/
// https://aka.ms/AA5ugm2

// TLDR: this can change. The reference to which this refers
// to can be different depending on how you call the function.

// For example, if you use a reference to the func in another
// object, and then call it through that - the this variable
// has moved to refer to the hosting object:

const customObjectCapturingThis = { contents: "http://gph.is/VxeHsW", print: safe.printContents };
customObjectCapturingThis.print(); // Prints "http://gph.is/VxeHsW" - not "Crown Jewels"

// This is tricky, because when dealing with callback APIs -
// it can be very tempting to pass the function reference
// directly. This can be worked around by creating a new
// function at the call site.

const objectNotCapturingThis = { contents: "N/A", print: () => safe.printContents() };
objectNotCapturingThis.print();

// There are a few ways to work around this problem. One
// route is to force the binding of this to be the object
// you originally intended via bind.

const customObjectCapturingThisAgain = { contents: "N/A", print: safe.printContents.bind(safe) };
customObjectCapturingThisAgain.print();

// To work around an unexpected this context, you can also
// change how you create functions in your class. By
// creating a property which uses an arrow function, the
// binding of this is done at a different time. Which makes
// it more predictable for those less experienced with the
// JavaScript runtime.

class SafelyBoundSafe {
  contents: string;

  constructor(contents: string) {
    this.contents = contents;
  }

  printContents = () => {
    console.log(this.contents);
  };
}

// Now passing the function to another object
// to run does not accidentally change this.

const saferSafe = new SafelyBoundSafe("Golden Skull");
saferSafe.printContents();

const customObjectTryingToChangeThis = {
  contents: "http://gph.is/XLof62",
  print: saferSafe.printContents,
};

customObjectTryingToChangeThis.print();

// If you have a TypeScript project, you can use the compiler
// flag noImplicitThis to highlight cases where TypeScript
// cannot determine what type "this" is for a function.

// You can learn more about that in the handbook:
//
// https://www.typescriptlang.org/docs/handbook/utility-types.html#thistypet
