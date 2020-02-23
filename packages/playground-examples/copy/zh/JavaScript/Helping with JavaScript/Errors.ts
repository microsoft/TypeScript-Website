//// { order: 3, isJavaScript: true }

// 默认情况下，TypeScript 在 JavaScript 内不提供错误消息。
// 该工具专注于为编辑器提供丰富的支持。

// 但是打开错误提示非常容易。在一个典型的 JS 文件中，只需要添加
// 以下注释即可打开 TypeScript 错误提示。

// @ts-check

let myString = "123";
myString = {};

// 虽然在一开始可能会在您的 JS 文件中添加很多红色曲线。但是这仍然可以在
// JavaScript 中正常工作，并且有一些工具可以修复这些错误。

// 对于某些您不想修改代码的棘手的错误，您可以使用 JSDoc 注释来
// 告诉 TypeScript 类型应该是什么：

/** @type {string | {}} */
let myStringOrObject = "123";
myStringOrObject = {};

// 您可以在这里了解更多：example:jsdoc-support

// 您可以声明下一个错误是不重要的，以让 TypeScript 忽略下一行的错误：

let myIgnoredError = "123";
// @ts-ignore
myStringOrObject = {};

// 您可以使用代码流进行类型推断来修改您的 JavaScript：example:code-flow
