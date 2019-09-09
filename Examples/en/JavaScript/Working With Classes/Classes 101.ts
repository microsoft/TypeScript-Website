//// { order: 0 }

// A class is a special type of JavaScript object which
// is always created via a constructor. These classes
// act a lot like objects, and have an inheritance structure
// similar to language like Java/C#/Swift.

// Here's an example class:

class Vendor {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  greet() {
    return "Hello, welcome to " + this.name;
  }
}

// An instance can be created via the new keyword, and
// you can call functions and access properties from the
// object.

const shop = new Vendor("Ye Olde Shop");
console.log(shop.greet());

// You can subclass an object, here's a food cart which
// has a variety as well as a name:

class FoodTruck extends Vendor {
  cuisine: string;

  constructor(name: string, cuisine: string) {
    super(name);
    this.cuisine = cuisine;
  }

  greet() {
    return "Hi, welcome to food truck " + this.name + " we serve " + this.cuisine + " food.";
  }
}

// Because we indicated that there needs to be two arguments
// to create a new truck, TypeScript will provide errors
// when you only use one

const nameOnlyTruck = new FoodTruck("Salome's Adobo");

// Correctly passing in two arguments will let you create a
// new instance of the FoodTruck:

const truck = new FoodTruck("Dave's Doritos", "junk");
console.log(truck.greet());
