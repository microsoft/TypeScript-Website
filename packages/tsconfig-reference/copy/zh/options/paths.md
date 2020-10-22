---
display: "路径设置"
oneline: "一组用于寻找模块导入的路径"
---

一些将模块导入重新映射到相对于 `baseUrl` 路径的配置。[手册](/docs/handbook/module-resolution.html#path-mapping)中有更多关于 `paths` 的内容。

`paths` 可以允许你声明 TypeScript 应该如何解析你的 `require`/`import`。

```json tsconfig
{
  "compilerOptions": {
    "baseUrl": ".", // this must be specified if "paths" is specified.
    "paths": {
      "jquery": ["node_modules/jquery/dist/jquery"] // this mapping is relative to "baseUrl"
    }
  }
}
```

这将使你可以写 `import "jquery"`，并且在本地获得所有正确的类型。

```json tsconfig
{
  "compilerOptions": {
    "baseUrl": "src",
    "paths": {
        "app/*": ["app/*"],
        "config/*": ["app/_config/*"],
        "environment/*": ["environments/*"],
        "shared/*": ["app/_shared/*"],
        "helpers/*": ["helpers/*"],
        "tests/*": ["tests/*"]
    },
}
```

这种情况下，你可以告诉 TypeScript 文件解析器支持一些自定义的前缀来寻找代码。
这种模式可以避免在你的代码中出现过长的相对路径。
