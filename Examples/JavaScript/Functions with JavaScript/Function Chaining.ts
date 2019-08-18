// Function chaining APIs are a common pattern in 
// JavaScript, which can make your code focused
// with less intermediary values and easier to read
// because of the spacing.

// A really common API which works via chaining is 
// jQuery. 

import $ from "jquery"

// Here's an example use of the jQuery API

$('#navigation').css('background', 'red')
                .height(300)
                .fadeIn(200)

// If you add a dot on the line above, you'll see 
// a long list of functions. This pattern is easy to 
// reproduce in TypeScript. The key is to make sure
// you always return the same object.

// Here is an example API which creates a chaining
// API. The key is to have an outer function which
// keeps track of internal state, and an object which 
// exposes the API that is always returned.

const addTwoNumbers = (start = 1) => {
    let n = start

    const api = {
        // Implement each function in your API
        add(inc: number = 1) {
            n += inc
            return api
        },
        print() {
            console.log(n)
            return api
        }
    }
    return api
}

// Which allows the same style of API as we
// saw in jQuery:

addTwoNumbers(1).add(3)
                .add()
                .print()
                .add(1)

// Here's a similar example which uses a class:

class AddNumbers {
    private n: number;

    constructor(start: number) {
        this.n = start;
    }

    public add(inc = 1): this {
        this.n = this.n + inc;
        return this;
    }

    public print(): this {
      console.log(this.n)
      return this;
  }

}

// Here it is in action:

const numberGenerator =
  new AddNumbers(2).add(3)
                   .add(3)

// funcs with inference
