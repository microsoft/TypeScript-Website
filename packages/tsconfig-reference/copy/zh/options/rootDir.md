---
display: "根目录"
oneline: "设置你源码的根目录。"
---

**默认**: 所有输入的非声明文件中的最长公共路径。若 `composite` 被指定，则是包含 `tsconfig.json` 文件的目录。

当 TypeScript 编译文件时，它在输出目录中保持与输入目录中相同的目录结构。

例如，假设你有一些输入文件：

```
MyProj
├── tsconfig.json
├── core
│   ├── a.ts
│   ├── b.ts
│   ├── sub
│   │   ├── c.ts
├── types.d.ts
```

`rootDir` 推断的结构是所有非声明输入文件的最长公共路径，在例子中为 `core/`。

如果你的 `outDir` 是 `dist`，TypeScript 将会生成这样的文件树：

```
MyProj
├── dist
│   ├── a.ts
│   ├── b.ts
│   ├── sub
│   │   ├── c.ts
```

但你可能希望让 `core` 成为输出目录结构的一部分。
通过在 `tsconfig.json` 中指定 `rootDir: "."`，TypeScript 将会生成这样的文件树：

```
MyProj
├── dist
│   ├── core
│   │   ├── a.js
│   │   ├── b.js
│   │   ├── sub
│   │   │   ├── c.js
```

重要的是，`rootDir` **不会影响哪些文件被包含在编译中**。
它与 `tsconfig.json` 中 `include`，`exclude`，or `files` 的选项没有关系。

请注意，TypeScript 永远不会将输出文件写入 `outDir` 之外的目录，也不会忽略生成某些文件。
处于这个原因，`rootDir` 页强制要求所有需要被生成的文件都在 `rootDir` 路径下。

例如，假设你有这样的文件树：

```
MyProj
├── tsconfig.json
├── core
│   ├── a.ts
│   ├── b.ts
├── helpers.ts
```

将 `rootDir` 指定为 `core`，_并且_ 将 `include` 指定为 `*` 是错误的，因为它会创建一个文件（`helpers.ts`），这个文件会被生成在 `outDir` _之外_ （即 `../helpers.js`）。
