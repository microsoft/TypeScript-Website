---
title: Type Inference
layout: docs
permalink: /docs/handbook/type-inference.html
oneline: How code flow analysis works in TypeScript
translatable: true
---

In TypeScript, there are several places where type inference is used to provide type information when there is no explicit type annotation. For example, in this code

```ts twoslash
let x = 3;
//  ^?
```

The type of the `x` variable is inferred to be `number`.
This kind of inference takes place when initializing variables and members, setting parameter default values, and determining function return types.

In most cases, type inference is straightforward.
In the following sections, we'll explore some of the nuances in how types are inferred.

## Best common type

When a type inference is made from several expressions, the types of those expressions are used to calculate a "best common type". For example,

```ts twoslash
let x = [0, 1, null];
//  ^?
```

To infer the type of `x` in the example above, we must consider the type of each array element.
Here we are given two choices for the type of the array: `number` and `null`.
The best common type algorithm considers each candidate type, and picks the type that is compatible with all the other candidates.

Because the best common type has to be chosen from the provided candidate types, there are some cases where types share a common structure, but no one type is the super type of all candidate types. For example:

```ts twoslash
// @strict: false
class Animal {}
class Rhino extends Animal {
  hasHorn: true;
}
class Elephant extends Animal {
  hasTrunk: true;
}
class Snake extends Animal {
  hasLegs: false;
}
// ---cut---
let zoo = [new Rhino(), new Elephant(), new Snake()];
//    ^?
```

Ideally, we may want `zoo` to be inferred as an `Animal[]`, but because there is no object that is strictly of type `Animal` in the array, we make no inference about the array element type.
To correct this, explicitly provide the type when no one type is a super type of all other candidates:

```ts twoslash
// @strict: false
class Animal {}
class Rhino extends Animal {
  hasHorn: true;
}
class Elephant extends Animal {
  hasTrunk: true;
}
class Snake extends Animal {
  hasLegs: false;
}
// ---cut---
let zoo: Animal[] = [new Rhino(), new Elephant(), new Snake()];
//    ^?
```

When no best common type is found, the resulting inference is the union array type, `(Rhino | Elephant | Snake)[]`.

## Contextual Typing

Type inference also works in "the other direction" in some cases in TypeScript.
This is known as "contextual typing". Contextual typing occurs when the type of an expression is implied by its location. For example:

```ts twoslash
// @errors: 2339
window.onmousedown = function (mouseEvent) {
  console.log(mouseEvent.button);
  console.log(mouseEvent.kangaroo);
};
```

Here, the TypeScript type checker used the type of the `Window.onmousedown` function to infer the type of the function expression on the right hand side of the assignment.
When it did so, it was able to infer the [type](https://developer.mozilla.org/docs/Web/API/MouseEvent) of the `mouseEvent` parameter, which does contain a `button` property, but not a `kangaroo` property.

This works because window already has `onmousedown` declared in its type:

```ts
// Declares there is a global variable called 'window'
declare var window: Window & typeof globalThis;

// Which is declared as (simplified):
interface Window extends GlobalEventHandlers {
  // ...
}

// Which defines a lot of known handler events
interface GlobalEventHandlers {
  onmousedown: ((this: GlobalEventHandlers, ev: MouseEvent) => any) | null;
  // ...
}
```

TypeScript is smart enough to infer types in other contexts as well:

```ts twoslash
// @errors: 2339
window.onscroll = function (uiEvent) {
  console.log(uiEvent.button);
};
```

Based on the fact that the above function is being assigned to `Window.onscroll`, TypeScript knows that `uiEvent` is a [UIEvent](https://developer.mozilla.org/docs/Web/API/UIEvent), and not a [MouseEvent](https://developer.mozilla.org/docs/Web/API/MouseEvent) like the previous example. `UIEvent` objects contain no `button` property, and so TypeScript will throw an error.

If this function were not in a contextually typed position, the function's argument would implicitly have type `any`, and no error would be issued (unless you are using the [`noImplicitAny`](/tsconfig#noImplicitAny) option):

```ts twoslash
// @noImplicitAny: false
const handler = function (uiEvent) {
  console.log(uiEvent.button); // <- OK
};
```

We can also explicitly give type information to the function's argument to override any contextual type:

```ts 
window.onscroll = function (uiEvent: any) {
  console.log(uiEvent.button); // <- Now, no error is given
};
```

However, this code will log `undefined`, since `uiEvent` has no property called `button`.

Contextual typing applies in many cases.
Common cases include arguments to function calls, right hand sides of assignments, type assertions, members of object and array literals, and return statements.
The contextual type also acts as a candidate type in best common type. For example:

```ts twoslash
// @strict: false
class Animal {}
class Rhino extends Animal {
  hasHorn: true;
}
class Elephant extends Animal {
  hasTrunk: true;
}
class Snake extends Animal {
  hasLegs: false;
}
// ---cut---
function createZoo(): Animal[] {
  return [new Rhino(), new Elephant(), new Snake()];
}
```

In this example, best common type has a set of four candidates: `Animal`, `Rhino`, `Elephant`, and `Snake`.
Of these, `Animal` can be chosen by the best common type algorithm.
