---
display: "Allow Unreachable Code"
oneline: "Error when code will never be called"
---

false に設定すると、到達不可能なコードに対する警告を無効化します。
この警告は、JavaScript 構文の利用によって到達不可能になり得るコードにのみ関係します。例えば:

```ts
function fn(n: number) {
  if (n > 5) {
    return true;
  } else {
    return false;
  }
  return true;
}
```

`"allowUnreachableCode": false`にすると、次のようになります:

```ts twoslash
// @errors: 7027
// @allowUnreachableCode: false
function fn(n: number) {
  if (n > 5) {
    return true;
  } else {
    return false;
  }
  return true;
}
```

このオプションは、型の分析によって到達不可能と判断されたコードについてのエラーには影響しません。
