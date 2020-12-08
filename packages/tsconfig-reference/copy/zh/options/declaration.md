---
display: "声明"
oneline: "为你工程中的 TypeScript 以及 JavaScript 文件生成 .d.ts 文件。"
---

为你工程中的每个 TypeScript 或 JavaScript 文件生成 `.d.ts` 文件。
这些 `.d.ts` 文件是描述模块外部 API 的类型定义文件。
像 TypeScript 这样的哦你根据可以通过 `.d.ts` 文件为非类型化的代码提供 intellisense 和精确的类型。

当 `declaration` 设置为 `true` 时，用编译器执行下面的 TypeScript 代码：

```ts twoslash
export let helloWorld = "hi";
```

将会生成如下这样的 `index.js` 文件：

```ts twoslash
// @showEmit
export let helloWorld = "hi";
```

以及一个相应的 `helloWorld.d.ts`：

```ts twoslash
// @showEmittedFile: index.d.ts
// @showEmit
// @declaration
export let helloWorld = "hi";
```

当使用 `.d.ts` 文件处理 JavaScript 文件时，你可能需要使用 [`emitDeclarationOnly`](#emitDeclarationOnly) 或 [`outDir`](#outDir) 来确保 JavaScript 文件不会被覆盖。
