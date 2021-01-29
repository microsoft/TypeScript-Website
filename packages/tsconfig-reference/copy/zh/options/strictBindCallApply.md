---
display: "严格的 Bind Call Apply"
oneline: "检查 `bind`，`call` 和 `apply` 的参数是否与原函数匹配。"
---

当开启后，TypeScript 将检查内置函数 `bind`，`call` 和 `apply` 是否接受了被调用函数的正确参数：


```ts twoslash
// @strictBindCallApply: true
// @errors: 2345

// 启用 strictBindCallApply 选项
function fn(x: string) {
  return parseInt(x);
}

const n1 = fn.call(undefined, "10");

const n2 = fn.call(undefined, false);
```

否则，这些函数将接受任意参数，并且返回 `any`：

```ts twoslash
// @strictBindCallApply: false

// With strictBindCallApply off
function fn(x: string) {
  return parseInt(x);
}

// Note: No error; return type is 'any'
const n = fn.call(undefined, false);
```
