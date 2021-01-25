---
display: "孤立模块"
oneline: "确保每个文件都可以不依赖于其他导入而被安全转译。"
---

虽然你可以使用 TypeScript 来从 TypeScript 中生成 JavaScript 代码，但是使用其他转译器例如 [Babel](https://babeljs.io) 也很常见。
但其他转译器一次只能在一个文件上操作，这意味着它们不能进行基于完全理解类型系统后的代码转译。
这个限制也同样适用于被一些构建工具使用的 TypeScript 的 `ts.transpileModule` 接口。

这些限制可能会导致一些 TypeScript 特性的运行时问题，例如 `const enum` 和 `namespace`。
设置 `isolatedModules` 选项后，TypeScript 将会在当你写的某些代码不能被单文件转译的过程正确处理时警告你。

它不会改变你代码的行为，也不会影响 TypeScript 的检查和代码生成过程。

一些当 `isolatedModules` 被启用时不工作的例子：

#### 导出非值标识符

在 TypeScript 中，你可以引入一个 _类型_，然后再将其导出：

```ts twoslash
// @noErrors
import { someType, someFunction } from "someModule";

someFunction();

export { someType, someFunction };
```

由于 `someType` 并没有值，所以生成的 `export` 将不会导出它（否则将导致 JavaScript 运行时的错误）：

```js
export { someFunction };
```

单文件转译器并不知道 `someType` 是否会产生一个值，所以导出一个只指向类型的名称会是一个错误。

#### 非模块文件

如果设置了 `isolatedModules`，则所有的实现文件必须是 _模块_ （也就是它有某种形式的 `import`/`export`）。如果任意文件不是模块就会发生错误：

```ts twoslash
// @errors: 1208
// @isolatedModules
function fn() {}
```

此限制不适用于 `.d.ts` 文件

#### 指向 `const enum` 成员

在 TypeScript 中，当你引用一个 `const enum` 的成员时，该引用在生成的 JavaScript 中将会被其实际值所代替。这会将这样的 TypeScript 代码： 

```ts twoslash
declare const enum Numbers {
  Zero = 0,
  One = 1,
}
console.log(Numbers.Zero + Numbers.One);
```

转换为这样的 JavaScript：

```ts twoslash
// @showEmit
// @removeComments
declare const enum Numbers {
  Zero = 0,
  One = 1,
}
console.log(Numbers.Zero + Numbers.One);
```

在不知道这些成员值的情况下，其他转译器不能替换对 `Numbers` 的引用。如果无视的话则会导致运行时错误（运行时没有 `Numbers`） 对象。
正因如此，当启用 `isolatedModules` 时，引用环境中的 `const enum` 成员将会是一个错误。
