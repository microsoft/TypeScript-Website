---
title: Mixins
layout: docs
permalink: /docs/handbook/mixins.html
oneline: Using the mixin pattern with TypeScript
---

# Introduction

Along with traditional OO hierarchies, another popular way of building up classes from reusable components is to build them by combining simpler partial classes.
You may be familiar with the idea of mixins or traits for languages like Scala, and the pattern has also reached some popularity in the JavaScript community.

# How Does A Mixin Work?

The pattern relies on using Generics with class inheritance to extend a base class.
To get started, we'll need a class which will have the mixin's applied:

```ts twoslash
class Sprite {
  name = "";
  x = 0;
  y = 0;

  constructor(name: string) {
    this.name = name;
  }
}
```

Then

```ts twoslash
// To get started, we need a type which we'll use to extend
// other classes from. The main responsibility is to declare
// that the type being passed in is a class.

type Constructor = new (...args: any[]) => {};

// This mixin adds a scale property, with getters and setters
// for changing it with an encapsulated private property:

function Scale<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    // Mixins may not declare private/protected properties
    _scale = 1;

    setScale(scale: number) {
      this._scale = scale;
    }

    get scale(): number {
      return this._scale;
    }
  };
}
```

# Understanding the sample

The code sample starts with the two classes that will act as our mixins.
You can see each one is focused on a particular activity or capability.
We'll later mix these together to form a new class from both capabilities.

```ts
// Disposable Mixin
class Disposable {
  isDisposed: boolean;
  dispose() {
    this.isDisposed = true;
  }
}

// Activatable Mixin
class Activatable {
  isActive: boolean;
  activate() {
    this.isActive = true;
  }
  deactivate() {
    this.isActive = false;
  }
}
```

Next, we'll create the class that will handle the combination of the two mixins.
Let's look at this in more detail to see how it does this:

```ts
class SmartObject {
    ...
}

interface SmartObject extends Disposable, Activatable {}
```

The first thing you may notice in the above is that instead of trying to extend `Disposable` and `Activatable` in `SmartObject` class, we extend them in `SmartObject` interface. `SmartObject` interface will be mixed into the `SmartObject` class due to the [declaration merging](/docs/handbook/declaration-merging.html#merging-interfaces).

This treats the classes as interfaces, and only mixes the types behind Disposable and Activatable into the SmartObject type rather than the implementation. This means that we'll have to provide the implementation in class.
Except, that's exactly what we want to avoid by using mixins.

Finally, we mix our mixins into the class implementation.

```ts
applyMixins(SmartObject, [Disposable, Activatable]);
```

Lastly, we create a helper function that will do the mixing for us.
This will run through the properties of each of the mixins and copy them over to the target of the mixins, filling out the stand-in properties with their implementations.

```ts
function applyMixins(derivedCtor: any, baseCtors: any[]) {
  baseCtors.forEach((baseCtor) => {
    Object.getOwnPropertyNames(baseCtor.prototype).forEach((name) => {
      Object.defineProperty(
        derivedCtor.prototype,
        name,
        Object.getOwnPropertyDescriptor(baseCtor.prototype, name)
      );
    });
  });
}
```
