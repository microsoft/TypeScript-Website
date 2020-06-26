//// { order: 3, isJavaScript: true }

// TypeScript 有着非常丰富的 JSDoc 支持，很多情况下您甚至可以不写 .ts 文件
// 而仅仅使用 JSDoc 注解去创建丰富的开发环境。
//
// JSDoc 注释是由两个星号（*）开头的多行注释。
/* 这是一个普通注释 */
/** 这是一个 JSDoc 注释 */

// JSDoc 注释会附加到下方最近的 JavaScript 代码中。

const myVariable = "Hi";

// 如果您将鼠标悬停到 myVariable，你可以看到它已经
// 被附加了这段在 JSDoc 注释中的文字。

// JSDoc 注释是一种为 TypeScript 和 您的编辑器提供类型信息的方式。
// 让我们简单的从将变量的类型设置为内置类型开始。

// 对于所有这些示例，您可以将鼠标悬停在名称上，然后再下一行尝试
// 输入【example】以查看自动完成选项。

/** @type {number} */
var myNumber;

// 你可以在手册中查看所有已支持的标签：
//
// https://www.typescriptlang.org/docs/handbook/type-checking-javascript-files.html#supported-jsdoc

// 但是，我们将在这里尝试一些更常见的示例，您也可以将手册中的任何示例粘贴到此处。

// 从 JavaScript 配置文件中导入类型：

/** @type { import("webpack").Config } */
const config = {};

// 创建一个复杂的类型以在其他多处地方复用：

/**
 * @typedef {Object} User - 用户账户
 * @property {string} displayName - 用户用来展示的名字
 * @property {number} id - 唯一 ID
 */

// 然后通过引用类型的名字来使用它：

/** @type { User } */
const user = {};

// type 和 typedef 有兼容 TypeScript 的内联类型快捷用法：

/** @type {{ owner: User, name: string }} */
const resource;

/** @typedef {{owner: User, name: string} Resource */

/** @type {Resource} */
const otherResource;

// 声明一个有类型的函数：

/**
 * 将两个数字相加
 * @param {number} a 第一个数字
 * @param {number} b 第二个数字
 * @returns {number}
 */
function addTwoNumbers(a, b) {
  return a + b;
}

// 你可以使用大多数 TypeScript 的类型工具，例如并集类型：

/** @type {(string | boolean)} */
let stringOrBoolean = "";
stringOrBoolean = false;

// 在 JSDoc 中扩展全局变量是一个涉及更多内容的过程，您可以
// 在 VS Code 文档中找到：
//
// https://code.visualstudio.com/docs/nodejs/working-with-javascript#_global-variables-and-type-checking

// 在您的函数中添加 JSDoc 注释是一个双赢的情况，您将获得更好的工具，
// 所有 API 的使用者也一样。
