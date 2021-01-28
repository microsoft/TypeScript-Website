---
display: "严格属性初始化"
oneline: "检查被声明但是没有被在构造函数中指定初始值的类成员。"
---

当设置为 true 时，TypeScript 会将被声明但是没有在构造函数中指定初始值的类属性视为错误。

```ts twoslash
// @errors: 2564
class UserAccount {
  name: string;
  accountType = "user";

  email: string;
  address: string | undefined;

  constructor(name: string) {
    this.name = name;
    // 注意，this.email 没有被赋值
  }
}
```

在上述情况下：

- `this.name` 被指定初始值。
- `this.accountType` 被指定默认值。
- `this.email` 没有被指定，并且抛出一个错误。
- `this.address` 被声明为具有 `undefined` 类型，这意味着它不必被指定。
