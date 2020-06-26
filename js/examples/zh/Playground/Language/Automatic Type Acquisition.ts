// 自动类型获取是指 TypeScript 自动在后台从 npm 的 @types 下获取类型定义
// 从而为 JavaScript 用户提供更好的用户体验。

// 现在游乐场有与 TypeScript 中内置的类型获取类似（但是有更多限制）的版本。

// 您可以在代码中添加 import 来使用它，它通过 DefinitelyTyped 中的
// @types 或依赖项本身内部的 d.ts 文件来工作。

import { danger } from "danger";

// 在下面高亮显示这些标识符，以查看内置类型中所关联的 JSDoc。

danger.github;

// 它也会处理依赖关系，因此在下面的例子中，danger 也依赖于 @octokit/rest。

danger.github.api.pulls.createComment();

// 类型获取还将考虑 Node 的内置模块，并在使用时提取出 Node 的类型声明。
// 需要注意的是，由于需要下载的类型很多，它往往比其他类型花费更长的时间。

import { readFileSync } from "fs";

const inputPath = "my/path/file.ts";
readFileSync(inputPath, "utf8");
