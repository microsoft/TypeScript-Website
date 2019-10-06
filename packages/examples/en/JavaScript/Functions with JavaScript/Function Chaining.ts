//// { order: 2, compiler: { esModuleInterop: true } }


// Function chaining APIs are a common pattern in
// JavaScript, which can make your code focused
// with less intermediary values and easier to read
// because of their nesting qualities.

// A really common API which works via chaining
// is jQuery. Here is an example of jQuery
// being used with the types from DefinitelyTyped

import $ from "jquery";

// Here's an example use of the jQuery API:

$("#navigation")
  .css("background", "red")
  .height(300)
  .fadeIn(200);

// If you add a dot on the line above, you'll see
// a long list of functions. This pattern is easy to
// reproduce in JavaScript. The key is to make sure
// you always return the same object.

// Here is an example API which creates a chaining
// API. The key is to have an outer function which
// keeps track of internal state, and an object which
// exposes the API that is always returned.

const addTwoNumbers = (start = 1) => {
  let n = start;

  const api = {
    // Implement each function in your API
    add(inc: number = 1) {
      n += inc;
      return api;
    },

    print() {
      console.log(n);
      return api;
    }
  };
  return api;
};

// Which allows the same style of API as we
// saw in jQuery:

addTwoNumbers(1)
  .add(3)
  .add()
  .print()
  .add(1);

// Here's a similar example which uses a class:

class AddNumbers {
  private n = 0;

  constructor(start = 0) {
    this.n = start;
  }

  public add(inc = 1) {
    this.n = this.n + inc;
    return this;
  }

  public print() {
    console.log(this.n);
    return this;
  }
}

// Here it is in action:

new AddNumbers(2).add(3).add(3);

// This example as used the TypeScript
// type inference to provide a way to
// provide tooling to JavaScript patterns.

// For more examples on this:
//
//  - example:code-flow
