---
display: "Import Helpers"
oneline: "Allow importing helper functions once per project, instead of including them per-file"
---

Class の継承、配列やオブジェクトのスプレッド構文、async の処理など、特定のダウンレベル処理に対して、TypeScript はヘルパーコードを利用します。
デフォルトでは、ヘルパーは利用されているファイルに挿入されます。
同じヘルパーが異なる多くのモジュールで利用されている場合、コードの重複となる可能性があります。

`importHelpers`フラグが有効な場合、ヘルパー関数は[tslib](https://www.npmjs.com/package/tslib)モジュールからインポートされます。
`tslib`を実行時にインポート可能であることを確認する必要があります。
この設定はモジュールに作用します。グローバルなスクリプトファイルはモジュールをインポートしません。

例えば、次の TypeScript について:

```ts
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

[`downlevelIteration`](#downlevelIteration)と`importHelpers`が false のときは次の出力となります:

```ts twoslash
// @showEmit
// @target: ES5
// @downleveliteration
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

[`downlevelIteration`](#downlevelIteration)と`importHelpers`の両方を有効化すると、次の出力になります:

```ts twoslash
// @showEmit
// @target: ES5
// @downleveliteration
// @importhelpers
// @noErrors
export function fn(arr: number[]) {
  const arr2 = [1, ...arr];
}
```

これらのヘルパー関数の独自実装を与える場合、[`noEmitHelpers`](#noEmitHelpers)が利用できます。
