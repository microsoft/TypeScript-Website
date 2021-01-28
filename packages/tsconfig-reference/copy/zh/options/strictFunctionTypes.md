---
display: "严格函数类型"
oneline: "在赋值函数时，进行用于确保参数和返回值是子类型兼容的检查。"
---

启用后，该选项将会使函数参数更正确的被检查。

这里有一个当 `strictFunctionTypes` 关闭时的简单例子：

```ts twoslash
// @strictFunctionTypes: false
function fn(x: string) {
  console.log("Hello, " + x.toLowerCase());
}

type StringOrNumberFunc = (ns: string | number) => void;

// 不安全的赋值
let func: StringOrNumberFunc = fn;
// 不安全的调用 —— 将会异常
func(10);
```

当 `strictFunctionTypes` 选项 _开启_，这个错误将被正确的检测到：

```ts twoslash
// @errors: 2322
function fn(x: string) {
  console.log("Hello, " + x.toLowerCase());
}

type StringOrNumberFunc = (ns: string | number) => void;

// 防止不安全的赋值
let func: StringOrNumberFunc = fn;
```

在开发此功能期间，我们发现了大量不安全的类继承结构，包括 DOM 中的一些类。
因此，这个选项仅适用于 _function_ 语法编写的函数，而不适用于 _method_ 语法的函数：

```ts twoslash
type Methodish = {
  func(x: string | number): void;
};

function fn(x: string) {
  console.log("Hello, " + x.toLowerCase());
}

// 这终究是一个不安全的赋值，但是没有检测到
const m: Methodish = {
  func: fn,
};
m.func(10);
```
