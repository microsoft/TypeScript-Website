//// { "compiler": { "ts": "4.2.0-beta" } }
// TypeScript has supported abstract classes since 2015, which
// provides compiler errors if you try to instantiate that class.

// TypeScript 4.2 adds support for declaring that the constructor
// function is abstract. This is mostly used by people who use
// the mixin pattern ( example:mixins )

// The mixin pattern involves having classes dynamically wrapping
// each other to "mixing in" certain features to the end result.

// This pattern is represented in TypeScript via a chain of constructor
// functions of the classes, and by declaring one as abstract you can use
// abstract classes inside your mixins.

// All mixins start with a generic constructor to pass the T through, now
// these can be abstract.
type AbstractConstructor<T> = abstract new (...args: any[]) => T

// We'll create an abstract class "Animal" where
// the subclasses must override 'walk' 
abstract class Animal {
  abstract walk(): void;
  breath() { }
}

// A mixin which adds a new function (in this case, animate)
function animatableAnimal<T extends AbstractConstructor<object>>(Ctor: T) {
  abstract class StopWalking extends Ctor {
    animate() { }
  }
  return StopWalking;
}

// A subclass of the Animal, through the mixins, must still
// handle the abstract contract for Animal. Which means it
// needs to implement 'walk' below. Try deleting the function
// to see what happens.

class Dog extends animatableAnimal(Animal) {
  walk() { }
}


const dog = new Dog()
dog.breath()
dog.walk()
dog.animate()
