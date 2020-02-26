---
display: "Strict Property Initialization"
oneline: "Ensure that all class properties match their types after the constructor has finished"
---

trueに設定した場合、Classプロパティが宣言されているがコンストラクターで値がセットされていないときに、TypeScriptはエラーを発生させます。

```ts twoslash
// @errors: 2564
class UserAccount {
  name: string;
  accountType = "user";

  email: string;
  address: string | undefined;

  constructor(name: string) {
    this.name = name;
    // 注 this.emailがセットされていません
  }
}
```

上記の場合:

- `this.name`は具体的に設定されています。
- `this.accountType`はデフォルト値が設定されています。
- `this.email`は値が設定されていないため、エラーとなります。
- `this.address`は`undefined`になりうる値として宣言されており、これは値の設定が必須でないことを意味しています。
