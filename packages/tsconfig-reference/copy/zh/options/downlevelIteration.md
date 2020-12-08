---
display: "迭代器降级"
oneline: "为迭代器对象生成更符合要求但更复杂的 JavaScript。"
---

‘降级’ 是 TypeScript 的术语，指用于转换到旧版本的 JavaScript。
这个选项是为了在旧版 Javascript 运行时上更准确的实现现代 JavaScript 迭代器的概念。

ECMAScript 6 增加了几个新的迭代器原语：`for / of` 循环（`for (el of arr)`），数组展开（`[a, ...b]`），参数展开（`fn(...args)`）和 `Symbol.iterator`。

如果 `Symbol.iterator` 存在的话，`--downlevelIteration` 将允许在 ES5 环境更准确的使用这些迭代原语。

#### 例：`for / of` 的效果

对于 TypeScript 代码：

```ts twoslash
const str = "Hello!";
for (const s of str) {
  console.log(s);
}
```

如果没有启用 `downlevelIteration`，`for / of` 循环将被降级为传统的 `for` 循环：

```ts twoslash
// @target: ES5
// @showEmit
const str = "Hello!";
for (const s of str) {
  console.log(s);
}
```

这通常是人们所期望的，但是它并不是 100% 符合 ECMAScript 迭代器协议。
某些字符串，例如 emoji （😜），其 `.length` 为 2（甚至更多），但在 `for-of` 循环中应只有一次迭代。
可以在 [Jonathan New 的这篇文章中](https://blog.jonnew.com/posts/poo-dot-length-equals-two) 找到更详细的解释。

当 `downlevelIteration` 启用时，TypeScript 将会使用辅助函数来检查 `Symbol.iterator` 的实现（无论是原生实现还是polyfill）。
如果没有实现，则将会回退到基于索引的迭代。

```ts twoslash
// @target: ES5
// @downlevelIteration
// @showEmit
const str = "Hello!";
for (const s of str) {
  console.log(s);
}
```

你也可以通过 [`importHelpers`](#importHelpers) 来使用 [tslib](https://www.npmjs.com/package/tslib) 以减少被内联的 JavaScript 的数量：

```ts twoslash
// @target: ES5
// @downlevelIteration
// @importHelpers
// @showEmit
const str = "Hello!";
for (const s of str) {
  console.log(s);
}
```

**注：** 如果在运行时不存在 `Symbol.iterator`，启用 `downlevelIteration` 将不会提高合规性。

#### 例：数组展开的效果

这是一个数组展开：

```js
// 构建一个新的数组，其元素首先为 1，然后是 arr2 的元素。 
const arr = [1, ...arr2];
```
根据描述，听起来很容易降级到 ES5：

```js
// The same, right?
const arr = [1].concat(arr2);
```

但是在某些罕见的情况下会明显不同。例如如果数组中有一个“洞”，缺失的索引在展开时将创建一个 _自己的_ 属性，但若使用 `concat` 则不会： 

```js
// 构建一个元素 `1` 不存在的数组
let missing = [0, , 1];
let spreaded = [...missing];
let concated = [].concat(missing);

// true
"1" in spreaded;
// false
"1" in concated;
```

就像 `for / of` 一样，`downlevelIteration` 将使用 `Symbol.iterator`（如果存在的话）来更准确的模拟 ES6 的行为。
