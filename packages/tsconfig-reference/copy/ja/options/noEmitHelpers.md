---
display: "No Emit Helpers"
oneline: "Assume helpers are available in the global runtime"
---

[`importHelpers`](#importHelpers)を使って、ヘルパ関数をインポートする代わりに、グローバルスコープに使用するヘルパ関数のための実装を提供し、ヘルパ関数が出力されるのを完全に無効にできます。

例えば、この`async`関数をES5で実行するためには、`await`のような関数と`generator`のような関数が必要です:

```ts twoslash
const getAPI = async (url: string) => {
  // Get API
  return {};
};
```

これは、とても多くのJavaScriptを生成します:

```ts twoslash
// @showEmit
// @target: ES5
const getAPI = async (url: string) => {
  // Get API
  return {};
};
```

このフラグを通じて、独自のグローバル実装に切り替えられます:

```ts twoslash
// @showEmit
// @target: ES5
// @noEmitHelpers
const getAPI = async (url: string) => {
  // Get API
  return {};
};
```
