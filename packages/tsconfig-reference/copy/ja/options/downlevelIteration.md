---
display: "Downlevel Iteration"
oneline: "Emit more compliant, but verbose JavaScript for iterating objects"
---

ダウンレベル化は、古いバージョンのJavaScriptにトランスパイルするという意味のTypeScriptの用語です。
このフラグは、モダンなJavaScriptにおける新しいコンセプトの反復処理が古いJavaScriptでの実行時にどのように実装されるかについて、より正確なサポートを有効化します。

ECMAScript 6では、いくつかの新しい反復処理のための基本構文が加えられました: `for / of`ループ（`for (el of arr)`）、配列のスプレッド（`[a, ...b]`）、引数のスプレッド（`fn(...args)`）、`Symbol.iterator`です。
`--downlevelIteration`は、`Symbol.iterator`の実装が存在している場合、ES5環境におけるこれらの基本的な反復処理をより正確に利用可能になります。

#### 例: `for / of`での効果

`downlevelIteration`が無効であるとき、任意のオブジェクトに対する`for / of`ループは旧来の`for`ループへダウンレベルトランスパイルされます:

```ts twoslash
// @target: ES5
// @showEmit
const str = "Hello!";
for (const s of str) {
  console.log(s);
}
```

これは大概の場合で期待通りの結果となりますが、ECMAScript 6の挙動と100%合致しているわけではありません。
特定の文字列、たとえば絵文字（😜）は、`.length`は2（もしくはそれ以上！）ですが、`for-of`ループでは1文字分として反復されねばなりません。
より詳細な解説は[Jonathan Newによるblog](https://blog.jonnew.com/posts/poo-dot-length-equals-two)を参照してください。

`downlevelIteration`が有効であるとき、TypeScriptは`Symbol.iterator`の実装（ネイティブまたはポリフィル）をチェックするヘルパー関数を利用します。
もし実装が存在しなければ、indexを利用する反復処理へフォールバックします。

```ts twoslash
// @target: ES5
// @downlevelIteration
// @showEmit
const str = "Hello!";
for (const s of str) {
  console.log(s);
}
```

> > **Note:** `Symbol.iterator`が実行時に存在しない場合、`downlevelIteration`はECMAScriptへの準拠を保証しません。

#### 例: 配列のスプレッドに対する効果

次のスプレッドされた配列について:

```js
// 要素が1で、その後にarr2の要素が続く新しい配列を作成します
const arr = [1, ...arr2];
```

説明に沿って、次のようにES5へダウンレベル化できます:

```js
// 同じですよね？
const arr = [1].concat(arr2);
```

しかし、これは特定の稀なケースにおいてはっきりとした違いがあります。
例えば、配列に「穴」がある場合、スプレッドでは欠落したインデックスが_独自の_プロパティとして作成されますが、`concat`を利用した場合は作成されません:

```js
// 「1」の要素が欠落している配列を作成します
let missing = [0, , 1];
let spreaded = [...missing];
let concated = [].concat(missing);

// true
"1" in spreaded;
// false
"1" in concated;
```

`for / of`と同様、`downlevelIteration`は（利用可能であれば）`Symbol.iterator`を使い、より正確にES6の挙動を模倣します。
