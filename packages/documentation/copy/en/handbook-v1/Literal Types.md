---
title: Literal Types
layout: docs
permalink: /docs/handbook/literal-types.html
oneline: Using literal types with TypeScript
handbook: "true"
deprecated_by: /docs/handbook/2/everyday-types.html#literal-types
---

A literal is a more concrete sub-type of a collective type.
What this means is that `"Hello World"` is a `string`, but a `string` is not `"Hello World"` inside the type system.

There are three sets of literal types available in TypeScript today: strings, numbers, and booleans; by using literal types you can allow an exact value which a string, number, or boolean must have.

## Literal Narrowing

When you declare a variable via `var` or `let`, you are telling the compiler that there is the chance that this variable will change its contents.
In contrast, using `const` to declare a variable will inform TypeScript that this object will never change.

```ts twoslash
// We're making a guarantee that this variable
// helloWorld will never change, by using const.

// So, TypeScript sets the type to be "Hello World", not string
const helloWorld = "Hello World";

// On the other hand, a let can change, and so the compiler declares it a string
let hiWorld = "Hi World";
```

The process of going from an infinite number of potential cases (there is an infinite number of possible string values) to a smaller, finite number of potential case (in `helloWorld`'s case: 1) is called narrowing.

## String Literal Types

In practice string literal types combine nicely with union types, type guards, and type aliases.
You can use these features together to get enum-like behavior with strings.

```ts twoslash
// @errors: 2345
type Easing = "ease-in" | "ease-out" | "ease-in-out";

class UIElement {
  animate(dx: number, dy: number, easing: Easing) {
    if (easing === "ease-in") {
      // ...
    } else if (easing === "ease-out") {
    } else if (easing === "ease-in-out") {
    } else {
      // It's possible that someone could reach this
      // by ignoring your types though.
    }
  }
}

let button = new UIElement();
button.animate(0, 0, "ease-in");
button.animate(0, 0, "uneasy");
```

You can pass any of the three allowed strings, but any other string will give the error

```
Argument of type '"uneasy"' is not assignable to parameter of type '"ease-in" | "ease-out" | "ease-in-out"'
```

String literal types can be used in the same way to distinguish overloads:

```ts
function createElement(tagName: "img"): HTMLImageElement;
function createElement(tagName: "input"): HTMLInputElement;
// ... more overloads ...
function createElement(tagName: string): Element {
  // ... code goes here ...
}
```

## Numeric Literal Types

TypeScript also has numeric literal types, which act the same as the string literals above.

```ts twoslash
function rollDice(): 1 | 2 | 3 | 4 | 5 | 6 {
  return (Math.floor(Math.random() * 6) + 1) as 1 | 2 | 3 | 4 | 5 | 6;
}

const result = rollDice();
```

A common case for their use is for describing config values:

```ts twoslash
/** Creates a map centered at loc/lat */
declare function setupMap(config: MapConfig): void;
// ---cut---
interface MapConfig {
  lng: number;
  lat: number;
  tileSize: 8 | 16 | 32;
}

setupMap({ lng: -73.935242, lat: 40.73061, tileSize: 16 });
```

## Boolean Literal Types

TypeScript also has boolean literal types. You might use these to constrain object values whose properties are interrelated.

```ts twoslash
interface ValidationSuccess {
  isValid: true;
  reason: null;
}

interface ValidationFailure {
  isValid: false;
  reason: string;
}

type ValidationResult = ValidationSuccess | ValidationFailure;
```
