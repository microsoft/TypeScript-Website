---
display: "Preserve Const Enums"
oneline: "Do not erase `const enum` declarations in generated code"
---

コード生成時に`const enum`の定義を取り除かないようにします。
`const enum`は、参照ではなくEnum値を出力することによって、アプリケーション実行時の全体的なメモリの使用量を軽減します。

例えば次のTypeScriptでは:

```ts twoslash
const enum Album {
  JimmyEatWorldFutures = 1,
  TubRingZooHypothesis = 2,
  DogFashionDiscoAdultery = 3
}

const selectedAlbum = Album.JimmyEatWorldFutures;
if (selectedAlbum === Album.JimmyEatWorldFutures) {
  console.log("That is a great choice.");
}
```

デフォルトの`const enum`の挙動は、すべての`Album.Something`を対応する数値リテラル値に変換し、
JavaScriptコードから完全に元のEnumへの参照を除去します。

```ts twoslash
// @showEmit
const enum Album {
  JimmyEatWorldFutures = 1,
  TubRingZooHypothesis = 2,
  DogFashionDiscoAdultery = 3
}

const selectedAlbum = Album.JimmyEatWorldFutures;
if (selectedAlbum === Album.JimmyEatWorldFutures) {
  console.log("That is a great choice.");
}
```

`preserveConstEnums`を`true`に設定すると、`enum`は実行時に残り、数値も出力されるようになります。

```ts twoslash
// @preserveConstEnums: true
// @showEmit
const enum Album {
  JimmyEatWorldFutures = 1,
  TubRingZooHypothesis = 2,
  DogFashionDiscoAdultery = 3
}

const selectedAlbum = Album.JimmyEatWorldFutures;
if (selectedAlbum === Album.JimmyEatWorldFutures) {
  console.log("That is a great choice.");
}
```

このオプションによって、このような`const enums`は実行時に追跡されないソースコードのみの機能になります。
