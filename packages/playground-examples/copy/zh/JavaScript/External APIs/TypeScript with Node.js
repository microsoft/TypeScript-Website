//// { order: 3, isJavaScript: true }

// Node.js 是一个非常受欢迎的基于 v8（Chrome 的 JavaScript 引擎）
// 的 JavaScript 运行时。你可以用它来构建服务器，前端客户端以及他们
// 之间的任何内容。

// https://nodejs.org/

// Node.js 带有一组扩展 JavaScript 运行时的核心库，他们包括路径处理：

import { join } from "path";
const myPath = join("~", "downloads", "todo_list.json");

// 操作文件：

import { readFileSync } from "fs";
const todoListText = readFileSync(myPath, "utf8");

// 您可以使用 JSDoc 风格的类型来将类型逐步添加到您的 JavaScript 项目中。
// 我们将基于 JSON 的结构作为列表项构建一个 TODO 列表：

/**
 * @typedef {Object} TODO 一个 TODO 元素
 * @property {string} title TODO 元素所展示的名字
 * @property {string} body TODO 元素的描述
 * @property {boolean} done TODO 元素是否已完成
 */

// 将 JSON.parse 的返回结果赋值给它。
// 要了解更多关于此的信息，可以查看：example:jsdoc-support

/** @type {TODO[]} TODO 的列表 */
const todoList = JSON.parse(todoListText);

// 以及其它实用库：
import { spawnSync } from "child_process";
todoList
  .filter(todo => !todo.done)
  .forEach(todo => {
    // 使用 ghi 客户端对每个未完成的 todo 列表项创建 issue。

    // 注意，当您高亮下面的 “todo.title” 时，您会在 JS 中获得
    // 正确的自动完成功能和文档。
    spawnSync(`ghi open --message "${todo.title}\n${todo.body}"`);
  });

// TypeScript 通过 DefinitelyTyped 为所有内置模块提供了最新的
// 类型定义——这意味着您可以编写具有很高类型覆盖率的 node 程序。

