---
display: "Strict Bind Call Apply"
oneline: "Ensure that 'call', 'bind' and 'apply' have the right arguments"
---

設定されている場合、関数の組み込みメソッドの`call`と`bind`と`apply`について、元となっている関数に対して正しい引数で呼び出されているかをTypeScriptがチェックします:

```ts twoslash
// @strictBindCallApply: true
// @errors: 2345

// strictBindCallApplyが有効な場合
function fn(x: string) {
   return parseInt(x);
}

const n1 = fn.call(undefined, "10");

const n2 = fn.call(undefined, false);
```

設定されていない場合、これらの関数は任意の引数を受け取って`any`を返します:

```ts twoslash
// @strictBindCallApply: false

// strictBindCallApplyが無効な場合
function fn(x: string) {
   return parseInt(x);
}

// Note: エラーになりません。戻り値の型は'any'です。
const n = fn.call(undefined, false);
```
