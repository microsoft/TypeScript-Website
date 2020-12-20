---
display: "移除注释"
oneline: "不生成注释。"
---

当转换为 JavaScript 时，忽略所有 TypeScript 文件中的注释。默认为 `false`。

例如，这是一个有 JSDoc 注释的 TypeScript 文件：

```ts
/** 'Hello world' 的葡萄牙语翻译 */
export const helloWorldPTBR = "Olá Mundo";
```

当然 `removeComments` 被设置为 `true`：

```ts twoslash
// @showEmit
// @removeComments: true
/** 'Hello world' 的葡萄牙语翻译 */
export const helloWorldPTBR = "Olá Mundo";
```

未设置 `removeComments` 或被设置为 `false`：

```ts twoslash
// @showEmit
// @removeComments: false
/** 'Hello world' 的葡萄牙语翻译 */
export const helloWorldPTBR = "Olá Mundo";
```

这意味着你的注释将呈现在 JavaScript 中。
