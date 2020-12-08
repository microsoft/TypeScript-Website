---
display: "导入辅助"
oneline: "允许每个项目从 tslib 中导入一次辅助函数，而不是在每个文件中都包含他们。"
---

对于某些降级行为，TypeScript 使用一些辅助代码来进行操作。例如继承类，展开数组或对象，以及异步操作。
默认情况下，这些辅助代码被插入到使用它们的文件中。
如果在许多不同的模块中使用相同的辅助代码，则可能会导致代码重复。

如果启用了 `importHelpers` 选项，这些辅助函数将从 [tslib](https://www.npmjs.com/package/tslib) 中被导入。
你需要确保 `tslib` 模块在运行时可以被导入。
这只影响模块，全局脚本文件不会尝试导入模块。

例如，对于如下 TypeScript 代码：

```ts
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

开启 [`downlevelIteration`](#downlevelIteration) 并且 `importHelpers` 仍为 `false`：

```ts twoslash
// @showEmit
// @target: ES5
// @downleveliteration
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

同时开始 [`downlevelIteration`](#downlevelIteration) 和 `importHelpers`：

```ts twoslash
// @showEmit
// @target: ES5
// @downleveliteration
// @importhelpers
// @noErrors
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

当你提供了自行实现的这些函数时，你可以使用 [`noEmitHelpers`](#noEmitHelpers)。

