//// { order: 1, target: "ES5" }

// JavaScript 于 2016 将 import、export 添加到该语言，TypeScript 完全
// 支持这种在文件和外部模块之间进行连接的风格。TypeScript 还通过允许将
// 类型与代码一起传递来扩展该语法。

// 让我们看一下从模块导入代码。

import { danger, message, warn, DangerDSLType } from "danger";

// 这个例子需要从一个名为 “danger” 的 node 模块获取一组具名导入（named import）。
// 虽然有 4 个以上的导入，但是这是我们唯一选择导入的东西。

// 指定您要导入的东西的名字可以帮助工具删除您的应用中未使用到的代码。
// 并且可以帮助您了解特定文件中正在使用的内容。

// 在这个例子中，danger， message，和 warn 是 JavaScript 的
// 导入——DangerDSLType 是一个接口类型。

// TypeScript 允许工程师使用 JSDoc 为他们的代码提供文档，并且
// 文档将被一起导入。例如您将鼠标悬停在下面不同的部分上，则
// 可以看到他们相关的解释。

danger.git.modified_files;

// 如果您想了解怎么提供这些文档注解，可以查看 example:jsdoc-support

// 另一个导入代码的方式是让模块使用默认导出（default export）。debug 模块
// 是一个相关的例子，它导出了一个创建日志记录的函数。

import debug from "debug";
const log = debug("playground");
log("Started running code");

// 由于默认导出不具有真实的名称，因此将他们与静态分析工具（如 TypeScript
// 中的重构支持）一起使用时，他们可能会很棘手。但是他们有适合的用途。

// 由于导入导出在 JavaScript 中历史悠久，所以会有一些关于默认导出的困惑：
// 一些导出文件中的文档暗示您可以写这样形式的导入：

import req from "request";

// 但是这会报错，在 StackOverflow 上可以找到将其改为 import as 的建议：

import * as req from "request";

// 这样就可以正常工作了。为什么呢？我们将在导出部分的结尾回顾这一点。

// 为了可以导入，您必须先导出。现代的导出方式是使用 export 关键字。

/** 当前卷轴上的剩余的贴纸 */
export const numberOfStickers = 11;

// 它可以通过以如下形式被导入至另一个文件：
//
// import { numberOfStickers } from "./path/to/file"

// 您可以在一个文件中按需包含任意多个导出，默认导出几乎相与之同。

/** 为您生成一个贴纸 */
const stickerGenerator = () => {};
export default stickerGenerator;

// 它可以以如下形式被导入至另一个文件：
//
// import getStickers from "./path/to/file"
//
// 命名取决于模块的使用者。

// 导入的类型有很多，这里只介绍了现代代码中最常见的集中。手册中涵盖了
// 跨越模块便捷的所有方式，这是一个非常大的主题：
//
// https://www.typescriptlang.org/docs/handbook/modules.html

// 但是，为了解决上一个问题，如果查看此示例的 JavaScript 代码，您将看到：

// var stickerGenerator = function () { };
// exports.default = stickerGenerator;

// 这会将 exports 对象的 default 属性设置为 stickerGenerator，
// 这里的代码将 exports 设置为一个函数，而不是一个对象。
//
// TypeScript 选择了 ECMAScript 规范中如何处理这些情况的部分，他们会
// 抛出一个错误。但是有一个编译器选项可以自动为您处理这些情况，即 esModuleInterop。
//
// 如果您在示例中将此选项打开，您会看到错误消失了。
