---
display: "禁止隐式 Any"
oneline: "将具有隐式 ‘Any’ 类型的表达式或声明视为错误。"
---

在一些没有类型标记的情况下，当 TypeScript 不能推断出变量的类型时，它将回退为 ‘any’ 类型。

这可能会导致一些错误被遗漏，例如：

```ts twoslash
// @noImplicitAny: false
function fn(s) {
  // 不会提示错误？
  console.log(s.subtr(3));
}
fn(42);
```

开启 ‘noImplicitAny’ 后，当 TypeScript 推断出 ‘any’ 时就会提示一个错误：

```ts twoslash
// @errors: 7006
function fn(s) {
  console.log(s.subtr(3));
}
```
