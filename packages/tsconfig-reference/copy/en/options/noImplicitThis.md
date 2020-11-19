---
display: "No Implicit This"
oneline: "Enable error reporting when `this` is given the type `any`."
---

Raise error on 'this' expressions with an implied 'any' type.

For example, the class below returns a function which tries to access `this.width` and `this.height` – but the context
for `this` inside the function inside `getAreaFunction` is not the instance of the Rectangle.

```ts twoslash
// @errors: 2683
class Rectangle {
  width: number;
  height: number;

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
  }

  getAreaFunction() {
    return function () {
      return this.width * this.height;
    };
  }
}
```
