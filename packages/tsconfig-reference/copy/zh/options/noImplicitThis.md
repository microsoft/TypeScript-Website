---
display: "禁止隐式 This"
oneline: "将具有 ‘any’ 类型的 ‘this’ 视为错误。"
---

当 ‘this’ 表达式具有隐式的 ‘any’ 类型时抛出错误。

例如，这个类将会返回一个函数，这个函数将会尝试访问 `this.width` 和 `this.height` —— 但在 `getAreaFunction` 函数内返回的函数的上下文中，`this` 并不是 `Rectangle` 的实例。


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
