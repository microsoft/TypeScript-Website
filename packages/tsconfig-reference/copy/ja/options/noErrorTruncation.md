---
display: "No Error Truncation"
oneline: "Do not truncate error messages"
---

エラーメッセージを切り捨てないようにします。

デフォルト値の`false`の場合、次のようになります。

```ts twoslash
// @errors: 2322 2454
// @noErrorTruncation: false
var x: {
  propertyWithAnExceedinglyLongName1: string;
  propertyWithAnExceedinglyLongName2: string;
  propertyWithAnExceedinglyLongName3: string;
  propertyWithAnExceedinglyLongName4: string;
  propertyWithAnExceedinglyLongName5: string;
};

// 型'x'の文字列表現はエラメッセージ中で省略されます
var s: string = x;
```

`true`にすると、次のようになります。

```ts twoslash
// @errors: 2322 2454
// @noErrorTruncation: true
var x: {
  propertyWithAnExceedinglyLongName1: string;
  propertyWithAnExceedinglyLongName2: string;
  propertyWithAnExceedinglyLongName3: string;
  propertyWithAnExceedinglyLongName4: string;
  propertyWithAnExceedinglyLongName5: string;
};

// 型'x'の文字列表現はエラメッセージ中で省略されます
var s: string = x;
```
