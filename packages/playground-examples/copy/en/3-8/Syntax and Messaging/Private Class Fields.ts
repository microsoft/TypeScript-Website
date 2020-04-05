//// { compiler: { ts: "3.8.3" } }
// 3.8 adds private fields, which are a way of declaring a class field to
// be unavailable outside of the containing class, including to subclasses.

// For example, the Person class below does not allow for anyone using an
// instance of the class to read  the firstName, lastName or prefix

class Person {
  #firstName: string;
  #lastName: string;
  #prefix: string;

  constructor(firstName: string, lastName: string, prefix: string) {
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#prefix = prefix;
  }

  greet() {
    // In iceland it is preferable to use a full name instead of [prefix] [lastname]
    // https://www.w3.org/International/questions/qa-personal-names#patronymic
    if (navigator.languages[0] === "is") {
      console.log(`Góðan dag, ${this.#firstName} ${this.#lastName}`);
    } else {
      console.log(`Hello, ${this.#prefix} ${this.#lastName}`);
    }
  }
}

let jeremy = new Person("Jeremy", "Bearimy", "Mr");

// You can't get to any of the private fields from outside that class:

// For example, this won't work:
console.log(jeremy.#lastName);

// Nor this:
console.log("Person's last name:", jeremy["#lastName"]);

// A common question we get is "Why would you use this over the 'private'
// keyword in a classfield?" - let's look by making a comparison to
// how it worked in TypeScript before 3.8:

class Dog {
  private _name: string;
  constructor(name: string) {
    this._name = name;
  }
}

let oby = new Dog("Oby");
// Won't let you access via dot notation
oby._name = "Spot";
// But TypeScript allows bracket notation as an escape clause
oby["_name"] = "Cherny";

// The TypeScript reference of private only exists at type-level
// which means that you can only trust it so far. With private fields
// soon to be a part of the JavaScript language, then you can make better
// guarantees about the visibility of your code.

// We don't plan on deprecating the `private` field keyword
// in TypeScript, so your existing code will continue to work, but now
// you can write code which is closer to the JavaScript language instead.

// You can learn more about class fields in the tc39 proposal
// https://github.com/tc39/proposal-class-fields/
// and the beta release notes:
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#ecmascript-private-fields
