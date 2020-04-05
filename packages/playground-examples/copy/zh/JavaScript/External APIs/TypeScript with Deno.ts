//// { order: 3 }

// Deno 是一个尚未完成的基于 v8 专注于安全性的
// JavaScript 和 TypeScript 运行时。

// https://deno.land

// Deno 有一个基于沙盒的权限系统，该系统减少了 JavaScript 对文件系统和
// 网络的访问，并且使用了基于 http 的导入，这些导入在本地下载和缓存。

// 这是使用 Deno 编写脚本的示例：

import compose from "https://deno.land/x/denofun/lib/compose.ts";

function greet(name: string) {
  return `Hello, ${name}!`;
}

function makeLoud(x: string) {
  return x.toUpperCase();
}

const greetLoudly = compose(makeLoud, greet);

// 输出 “HELLO, WORLD!.”
greetLoudly("world");

import concat from "https://deno.land/x/denofun/lib/concat.ts";

// 返回 “helloworld”
concat("hello", "world");
