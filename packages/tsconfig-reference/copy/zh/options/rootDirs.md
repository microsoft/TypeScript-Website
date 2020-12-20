---
display: "根目录"
oneline: "设置多个根目录"
---

通过 `rootDirs`，你可以告诉编译器有许多“虚拟”的目录作为一个根目录。这将会允许编译器在这些“虚拟”目录中解析相对应的模块导入，就像它们被合并到同一目录中一样。

例如：

```
 src
 └── views
     └── view1.ts (can import "./template1", "./view2`)
     └── view2.ts (can import "./template1", "./view1`)

 generated
 └── templates
         └── views
             └── template1.ts (can import "./view1", "./view2")
```

```json tsconfig
{
  "compilerOptions": {
    "rootDirs": ["src/views", "generated/templates/views"]
  }
}
```

这不会影响到 TypeScript 如何生成 JavaScript，而仅是模拟了假设它们在运行时能通过这些相对路径工作。
