---
display: "Strict Function Types"
oneline: "Ensure that function parameters are consistent"
---

有効化すると、このフラグは関数のパラメータをより正しくチェックするようになります。

次は`strictFunctionTypes`が無効な場合の基本的な例です:

```ts twoslash
// @strictFunctionTypes: false
function fn(x: string) {
  console.log("Hello, " + x.toLowerCase());
}

type StringOrNumberFunc = (ns: string | number) => void;

// 安全でない代入
let func: StringOrNumberFunc = fn;
// 安全でない呼び出し - エラーとなります
func(10);
```

`strictFunctionTypes`を_有効化_すると、エラーが正しく検知されます:

```ts twoslash
// @errors: 2322
function fn(x: string) {
  console.log("Hello, " + x.toLowerCase());
}

type StringOrNumberFunc = (ns: string | number) => void;

// 安全でない代入は抑止されます
let func: StringOrNumberFunc = fn;
```

私達はこの機能を開発する際、本質的に安全でないClass階層を数多く見つけました。中にはDOMのものも含まれていました。
このため、この設定は_function_構文で記述された関数にのみ適用され、_メソッド_として記述された関数には適用されません:

```ts twoslash
type Methodish = {
  func(x: string | number): void;
};

function fn(x: string) {
  console.log("Hello, " + x.toLowerCase());
}

// 最終的に安全でない代入となりますが、エラー検知はされません
const m: Methodish = {
  func: fn
};
m.func(10);
```
