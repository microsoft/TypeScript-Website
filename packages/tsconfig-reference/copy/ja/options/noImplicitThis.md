---
display: "No Implicit This"
oneline: "Raise errors when 'this' would be any"
---

暗黙的に`any`型となるthis式でエラーを発生させます。

例えば、以下のClassは`this.width`と`this.height`にアクセスする関数を返しています。
しかし、`getAreaFunction`の内側の関数内でのコンテキストにおける`this`はRectangleのインスタンスではありません。

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
    return function() {
      return this.width * this.height;
    };
  }
}
```
