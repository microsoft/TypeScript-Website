---
display: "Allow Unused Labels"
oneline: "Error when accidentally creating a label"
---

falseにセットすると、利用していないLabelについての警告を無効化します。

JavaScriptにおいてLabelを利用することは稀ですが、オブジェクトリテラルを記述しようとしたときにLabel構文になってしまうことがあります。

```ts twoslash
// @errors: 7028
// @allowUnusedLabels: false
function verifyAge(age: number) {
  // 'return'の記述が抜けている 
  if (age > 18) {
    verified: true;
  }
}
```
