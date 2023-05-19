---
title: Decorators
layout: docs
permalink: /docs/handbook/decorators.html
oneline: TypeScript Decorators overview
translatable: true
---

## Introduction

<blockquote class='bg-reading'>
  <p>Further Reading:<br /><a href='https://saul-mirone.github.io/a-complete-guide-to-typescript-decorator/'>A Complete Guide to TypeScript Decorators</a></p>
</blockquote>

With the introduction of Classes in TypeScript and ES6, there now exist certain scenarios that require additional features to support annotating or modifying classes and class members.
Decorators provide a way to add both annotations and a meta-programming syntax for class declarations and members.
Decorators are a [stage 2 proposal](https://github.com/tc39/proposal-decorators) for JavaScript and are available as an experimental feature of TypeScript.

> NOTE&emsp; Decorators are an experimental feature that may change in future releases.

To enable experimental support for decorators, you must enable the [`experimentalDecorators`](/tsconfig#experimentalDecorators) compiler option either on the command line or in your `tsconfig.json`:

**Command Line**:

```shell
tsc --target ES5 --experimentalDecorators
```

**tsconfig.json**:

```json tsconfig
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true
  }
}
```

## Decorators

A _Decorator_ is a special kind of declaration that can be attached to a [class declaration](#class-decorators), [method](#method-decorators), [accessor](#accessor-decorators), [property](#property-decorators), or [parameter](#parameter-decorators).
Decorators use the form `@expression`, where `expression` must evaluate to a function that will be called at runtime with information about the decorated declaration.

For example, given the decorator `@sealed` we might write the `sealed` function as follows:

```ts
function sealed(target) {
  // do something with 'target' ...
}
```

## Decorator Factories

If we want to customize how a decorator is applied to a declaration, we can write a decorator factory.
A _Decorator Factory_ is simply a function that returns the expression that will be called by the decorator at runtime.

We can write a decorator factory in the following fashion:

```ts
function color(value: string) {
  // this is the decorator factory, it sets up
  // the returned decorator function
  return function (target) {
    // this is the decorator
    // do something with 'target' and 'value'...
  };
}
```

## Decorator Composition

Multiple decorators can be applied to a declaration, for example on a single line:

```ts twoslash
// @experimentalDecorators
// @noErrors
function f() {}
function g() {}
// ---cut---
@f @g x
```

On multiple lines:

```ts twoslash
// @experimentalDecorators
// @noErrors
function f() {}
function g() {}
// ---cut---
@f
@g
x
```

When multiple decorators apply to a single declaration, their evaluation is similar to [function composition in mathematics](https://wikipedia.org/wiki/Function_composition). In this model, when composing functions _f_ and _g_, the resulting composite (_f_ ∘ _g_)(_x_) is equivalent to _f_(_g_(_x_)).

As such, the following steps are performed when evaluating multiple decorators on a single declaration in TypeScript:

1. The expressions for each decorator are evaluated top-to-bottom.
2. The results are then called as functions from bottom-to-top.

If we were to use [decorator factories](#decorator-factories), we can observe this evaluation order with the following example:

<!-- prettier-ignore -->
```ts twoslash
// @experimentalDecorators
function first() {
  console.log("first(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("first(): called");
  };
}

function second() {
  console.log("second(): factory evaluated");
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    console.log("second(): called");
  };
}

class ExampleClass {
  @first()
  @second()
  method() {}
}
```

Which would print this output to the console:

```shell
first(): factory evaluated
second(): factory evaluated
second(): called
first(): called
```

## Decorator Evaluation

There is a well defined order to how decorators applied to various declarations inside of a class are applied:

1. _Parameter Decorators_, followed by _Method_, _Accessor_, or _Property Decorators_ are applied for each instance member.
2. _Parameter Decorators_, followed by _Method_, _Accessor_, or _Property Decorators_ are applied for each static member.
3. _Parameter Decorators_ are applied for the constructor.
4. _Class Decorators_ are applied for the class.

## Class Decorators

A _Class Decorator_ is declared just before a class declaration.
The class decorator is applied to the constructor of the class and can be used to observe, modify, or replace a class definition.
A class decorator cannot be used in a declaration file, or in any other ambient context (such as on a `declare` class).

The expression for the class decorator will be called as a function at runtime, with the constructor of the decorated class as its only argument.

If the class decorator returns a value, it will replace the class declaration with the provided constructor function.

> NOTE&nbsp; Should you choose to return a new constructor function, you must take care to maintain the original prototype.
> The logic that applies decorators at runtime will **not** do this for you.

The following is an example of a class decorator (`@sealed`) applied to a `BugReport` class:

```ts twoslash
// @experimentalDecorators
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}
// ---cut---
@sealed
class BugReport {
  type = "report";
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}
```

We can define the `@sealed` decorator using the following function declaration:

```ts
function sealed(constructor: Function) {
  Object.seal(constructor);
  Object.seal(constructor.prototype);
}
```

When `@sealed` is executed, it will seal both the constructor and its prototype, and will therefore prevent any further functionality from being added to or removed from this class during runtime by accessing `BugReport.prototype` or by defining properties on `BugReport` itself (note that ES2015 classes are really just syntactic sugar to prototype-based constructor functions). This decorator does **not** prevent classes from sub-classing `BugReport`.

Next we have an example of how to override the constructor to set new defaults.

<!-- prettier-ignore -->
```ts twoslash
// @errors: 2339
// @experimentalDecorators
function reportableClassDecorator<T extends { new (...args: any[]): {} }>(constructor: T) {
  return class extends constructor {
    reportingURL = "http://www...";
  };
}

@reportableClassDecorator
class BugReport {
  type = "report";
  title: string;

  constructor(t: string) {
    this.title = t;
  }
}

const bug = new BugReport("Needs dark mode");
console.log(bug.title); // Prints "Needs dark mode"
console.log(bug.type); // Prints "report"

// Note that the decorator _does not_ change the TypeScript type
// and so the new property `reportingURL` is not known
// to the type system:
bug.reportingURL;
```

## Method Decorators

A _Method Decorator_ is declared just before a method declaration.
The decorator is applied to the _Property Descriptor_ for the method, and can be used to observe, modify, or replace a method definition.
A method decorator cannot be used in a declaration file, on an overload, or in any other ambient context (such as in a `declare` class).

The expression for the method decorator will be called as a function at runtime, with the following three arguments:

1. Either the constructor function of the class for a static member, or the prototype of the class for an instance member.
2. The name of the member.
3. The _Property Descriptor_ for the member.

> NOTE&emsp; The _Property Descriptor_ will be `undefined` if your script target is less than `ES5`.

If the method decorator returns a value, it will be used as the _Property Descriptor_ for the method.

> NOTE&emsp; The return value is ignored if your script target is less than `ES5`.

The following is an example of a method decorator (`@enumerable`) applied to a method on the `Greeter` class:

<!-- prettier-ignore -->
```ts twoslash
// @experimentalDecorators
function enumerable(value: boolean) {
  return function (target: any,propertyKey: string,descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}
// ---cut---
class Greeter {
  greeting: string;
  constructor(message: string) {
    this.greeting = message;
  }

  @enumerable(false)
  greet() {
    return "Hello, " + this.greeting;
  }
}
```

We can define the `@enumerable` decorator using the following function declaration:

<!-- prettier-ignore -->
```ts twoslash
function enumerable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.enumerable = value;
  };
}
```

The `@enumerable(false)` decorator here is a [decorator factory](#decorator-factories).
When the `@enumerable(false)` decorator is called, it modifies the `enumerable` property of the property descriptor.

## Accessor Decorators

An _Accessor Decorator_ is declared just before an accessor declaration.
The accessor decorator is applied to the _Property Descriptor_ for the accessor and can be used to observe, modify, or replace an accessor's definitions.
An accessor decorator cannot be used in a declaration file, or in any other ambient context (such as in a `declare` class).

> NOTE&emsp; TypeScript disallows decorating both the `get` and `set` accessor for a single member.
> Instead, all decorators for the member must be applied to the first accessor specified in document order.
> This is because decorators apply to a _Property Descriptor_, which combines both the `get` and `set` accessor, not each declaration separately.

The expression for the accessor decorator will be called as a function at runtime, with the following three arguments:

1. Either the constructor function of the class for a static member, or the prototype of the class for an instance member.
2. The name of the member.
3. The _Property Descriptor_ for the member.

> NOTE&emsp; The _Property Descriptor_ will be `undefined` if your script target is less than `ES5`.

If the accessor decorator returns a value, it will be used as the _Property Descriptor_ for the member.

> NOTE&emsp; The return value is ignored if your script target is less than `ES5`.

The following is an example of an accessor decorator (`@configurable`) applied to a member of the `Point` class:

```ts twoslash
// @experimentalDecorators
function configurable(value: boolean) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    descriptor.configurable = value;
  };
}
// ---cut---
class Point {
  private _x: number;
  private _y: number;
  constructor(x: number, y: number) {
    this._x = x;
    this._y = y;
  }

  @configurable(false)
  get x() {
    return this._x;
  }

  @configurable(false)
  get y() {
    return this._y;
  }
}
```

We can define the `@configurable` decorator using the following function declaration:

<!-- prettier-ignore -->
```ts
function configurable(value: boolean) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    descriptor.configurable = value;
  };
}
```

## Property Decorators

A _Property Decorator_ is declared just before a property declaration.
A property decorator cannot be used in a declaration file, or in any other ambient context (such as in a `declare` class).

The expression for the property decorator will be called as a function at runtime, with the following two arguments:

1. Either the constructor function of the class for a static member, or the prototype of the class for an instance member.
2. The name of the member.

> NOTE&emsp; A _Property Descriptor_ is not provided as an argument to a property decorator due to how property decorators are initialized in TypeScript.
> This is because there is currently no mechanism to describe an instance property when defining members of a prototype, and no way to observe or modify the initializer for a property. The return value is ignored too.
> As such, a property decorator can only be used to observe that a property of a specific name has been declared for a class.

We can use this information to record metadata about the property, as in the following example:

```ts
class Greeter {
  @format("Hello, %s")
  greeting: string;

  constructor(message: string) {
    this.greeting = message;
  }

  greet() {
    let formatString = getFormat(this, "greeting");
    return formatString.replace("%s", this.greeting);
  }
}
```

We can then define the `@format` decorator and `getFormat` functions using the following function declarations:

```ts
import "reflect-metadata";

const formatMetadataKey = Symbol("format");

function format(formatString: string) {
  return Reflect.metadata(formatMetadataKey, formatString);
}

function getFormat(target: any, propertyKey: string) {
  return Reflect.getMetadata(formatMetadataKey, target, propertyKey);
}
```

The `@format("Hello, %s")` decorator here is a [decorator factory](#decorator-factories).
When `@format("Hello, %s")` is called, it adds a metadata entry for the property using the `Reflect.metadata` function from the `reflect-metadata` library.
When `getFormat` is called, it reads the metadata value for the format.

> NOTE&emsp; This example requires the `reflect-metadata` library.
> See [Metadata](#metadata) for more information about the `reflect-metadata` library.

## Parameter Decorators

A _Parameter Decorator_ is declared just before a parameter declaration.
The parameter decorator is applied to the function for a class constructor or method declaration.
A parameter decorator cannot be used in a declaration file, an overload, or in any other ambient context (such as in a `declare` class).

The expression for the parameter decorator will be called as a function at runtime, with the following three arguments:

1. Either the constructor function of the class for a static member, or the prototype of the class for an instance member.
2. The name of the member.
3. The ordinal index of the parameter in the function's parameter list.

> NOTE&emsp; A parameter decorator can only be used to observe that a parameter has been declared on a method.

The return value of the parameter decorator is ignored.

The following is an example of a parameter decorator (`@required`) applied to parameter of a member of the `BugReport` class:

<!-- prettier-ignore -->
```ts twoslash
// @experimentalDecorators
function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<any>) {}
function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {}
// ---cut---
class BugReport {
  type = "report";
  title: string;

  constructor(t: string) {
    this.title = t;
  }

  @validate
  print(@required verbose: boolean) {
    if (verbose) {
      return `type: ${this.type}\ntitle: ${this.title}`;
    } else {
     return this.title; 
    }
  }
}
```

We can then define the `@required` and `@validate` decorators using the following function declarations:

<!-- prettier-ignore -->
```ts twoslash
// @experimentalDecorators
// @emitDecoratorMetadata
import "reflect-metadata";
const requiredMetadataKey = Symbol("required");

function required(target: Object, propertyKey: string | symbol, parameterIndex: number) {
  let existingRequiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyKey) || [];
  existingRequiredParameters.push(parameterIndex);
  Reflect.defineMetadata( requiredMetadataKey, existingRequiredParameters, target, propertyKey);
}

function validate(target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
  let method = descriptor.value!;

  descriptor.value = function () {
    let requiredParameters: number[] = Reflect.getOwnMetadata(requiredMetadataKey, target, propertyName);
    if (requiredParameters) {
      for (let parameterIndex of requiredParameters) {
        if (parameterIndex >= arguments.length || arguments[parameterIndex] === undefined) {
          throw new Error("Missing required argument.");
        }
      }
    }
    return method.apply(this, arguments);
  };
}
```

The `@required` decorator adds a metadata entry that marks the parameter as required.
The `@validate` decorator then wraps the existing `print` method in a function that validates the arguments before invoking the original method.

> NOTE&emsp; This example requires the `reflect-metadata` library.
> See [Metadata](#metadata) for more information about the `reflect-metadata` library.

## Metadata

Some examples use the `reflect-metadata` library which adds a polyfill for an [experimental metadata API](https://github.com/rbuckton/ReflectDecorators).
This library is not yet part of the ECMAScript (JavaScript) standard.
However, once decorators are officially adopted as part of the ECMAScript standard these extensions will be proposed for adoption.

You can install this library via npm:

```shell
npm i reflect-metadata --save
```

TypeScript includes experimental support for emitting certain types of metadata for declarations that have decorators.
To enable this experimental support, you must set the [`emitDecoratorMetadata`](/tsconfig#emitDecoratorMetadata) compiler option either on the command line or in your `tsconfig.json`:

**Command Line**:

```shell
tsc --target ES5 --experimentalDecorators --emitDecoratorMetadata
```

**tsconfig.json**:

```json tsconfig
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

When enabled, as long as the `reflect-metadata` library has been imported, additional design-time type information will be exposed at runtime.

We can see this in action in the following example:

<!-- prettier-ignore -->
```ts twoslash
// @emitDecoratorMetadata
// @experimentalDecorators
// @strictPropertyInitialization: false
import "reflect-metadata";

class Point {
  constructor(public x: number, public y: number) {}
}

class Line {
  private _start: Point;
  private _end: Point;

  @validate
  set start(value: Point) {
    this._start = value;
  }

  get start() {
    return this._start;
  }

  @validate
  set end(value: Point) {
    this._end = value;
  }

  get end() {
    return this._end;
  }
}

function validate<T>(target: any, propertyKey: string, descriptor: TypedPropertyDescriptor<T>) {
  let set = descriptor.set!;
  
  descriptor.set = function (value: T) {
    let type = Reflect.getMetadata("design:type", target, propertyKey);

    if (!(value instanceof type)) {
      throw new TypeError(`Invalid type, got ${typeof value} not ${type.name}.`);
    }

    set.call(this, value);
  };
}

const line = new Line()
line.start = new Point(0, 0)

// @ts-ignore
// line.end = {}

// Fails at runtime with:
// > Invalid type, got object not Point

```

The TypeScript compiler will inject design-time type information using the `@Reflect.metadata` decorator.
You could consider it the equivalent of the following TypeScript:

```ts
class Line {
  private _start: Point;
  private _end: Point;

  @validate
  @Reflect.metadata("design:type", Point)
  set start(value: Point) {
    this._start = value;
  }
  get start() {
    return this._start;
  }

  @validate
  @Reflect.metadata("design:type", Point)
  set end(value: Point) {
    this._end = value;
  }
  get end() {
    return this._end;
  }
}
```

> NOTE&emsp; Decorator metadata is an experimental feature and may introduce breaking changes in future releases.
