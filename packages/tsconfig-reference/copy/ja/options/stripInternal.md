---
display: "Strip Internal"
oneline: "Remove declarations which have '@internal' in their JSDoc comments"
---

JSDocコメントとして`@internal`が付与されたコードについて、定義情報を出力しないようにします。
このオプションはコンパイラが内部で利用するためのものです; コンパイラは結果の妥当性検証をしないため、自己責任で使ってください。
`d.ts`ファイル内での可視性を細かく制御できるツールを探しているのであれば、[api-extractor](https://api-extractor.com)を参照してください。

```ts twoslash
/**
 * Days available in a week
 * @internal
 */
export const daysInAWeek = 7;

/** Calculate how much someone earns in a week */
export function weeklySalary(dayRate: number) {
  return daysInAWeek * dayRate;
}
```

このフラグが`false`であるとき（デフォルト）:

```ts twoslash
// @showEmittedFile: index.d.ts
// @showEmit
// @declaration
/**
 * 一週間の日数
 * @internal
 */
export const daysInAWeek = 7;

/** 一週間あたりの稼ぎを計算する */
export function weeklySalary(dayRate: number) {
  return daysInAWeek * dayRate;
}
```

`stripInternal`を`true`に設定すると、`d.ts`は次のように編集されて出力されます。

```ts twoslash
// @stripinternal
// @showEmittedFile: index.d.ts
// @showEmit
// @declaration
/**
 * 一週間の日数
 * @internal
 */
export const daysInAWeek = 7;

/** 一週間あたりの稼ぎを計算する */
export function weeklySalary(dayRate: number) {
  return daysInAWeek * dayRate;
}
```

JavaScriptとしての出力は一緒です。
