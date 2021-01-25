---
title: DOMの操作
layout: docs
permalink: /ja/docs/handbook/dom-manipulation.html
oneline: TypeScriptでDOMを扱う
translatable: true
---

## DOMの操作

### _`HTMLElement`型の探索_

標準化されてから20年以上の間に、JavaScriptは非常に長い道のりを歩んできました。2020年には、JavaScriptはサーバー上、データサイエンス、さらにはIoTデバイスでさえも使用できるようになりましたが、最も一般的なユースケースであるWebブラウザについて覚えておくことが重要です。

Webサイトは、HTMLおよびXMLドキュメントで構成されています。これらのドキュメントは静的で、変化しません。_Document Object Model (DOM)_ は、静的なWebサイトを機能的にするためにブラウザによって実装されたプログラミングインターフェースです。DOM APIは、ドキュメントの構造、スタイル、そして内容を変更するために使うことができます。このAPIはとても強力なので、動的なWebサイトを簡単に作成するために数え切れないほど多くのフロントエンドフレームワーク(jQuery、React、Angularなど)が開発されてきました。

TypeScriptはJavaScriptの型付きスーパーセットであり、DOM APIの型定義を提供しています。こうした定義はあらゆるデフォルトのTypeScriptプロジェクトでもすぐに利用できるようになっています。20,000行を超える _lib.dom.d.ts_ の定義の中で、ひときわ目立つものがあります。それが`HTMLElement`です。この型はTypeScriptでのDOM操作の根幹となるものです。

> [DOMの型定義](https://github.com/microsoft/TypeScript/blob/master/lib/lib.dom.d.ts)のソースコードを細かく調べることができます

## 基本的な例

次のような単純化された _index.html_ ファイルがあるとします:

    <!DOCTYPE html>
    <html lang="en">
      <head><title>TypeScript Dom Manipulation</title></head>
      <body>
        <div id="app"></div>
        <!-- Assume index.js is the compiled output of index.ts -->
        <script src="index.js"></script>
      </body>
    </html>

`#app`要素に`<p>Hello, World</p>`要素を追加するTypeScriptのスクリプトを見てみましょう。

```ts
// 1. idプロパティを使ってdiv要素を選択します
const app = document.getElementById("app");

// 2. プログラムによって新しい<p></p>要素を作成します
const p = document.createElement("p");

// 3. テキストの内容を追加します
p.textContent = "Hello, World!";

// 4. p要素をdiv要素に追加します
app?.appendChild(p);
```

コンパイルして、 _index.html_ ページを開くと、HTMLは結果的に次のようになります:

```html
<div id="app">
  <p>Hello, World!</p>
</div>
```

## `Document`インターフェース

TypeScriptの最初の行では、グローバル変数`document`を使用しています。この変数を調べてみると、_lib.dom.d.ts_ ファイルの`Document`インターフェースで定義されていることが分かります。コードスニペットには、`getElementById`と`createElement`の2つのメソッドの呼び出しが含まれています。

### `Document.getElementById`

このメソッドの定義は次のとおりです:

```ts
getElementById(elementId: string): HTMLElement | null;
```

要素のid文字列を渡し、`HTMLElement`あるいは`null`を返します。このメソッドによって、最も重要な型のひとつである`HTMLElement`が導かれます。この型は他のすべての要素のインターフェースのベースとなるインターフェースとして機能します。例えば、前述のコード例の変数`p`は、`HTMLParagraphElement`型です。また、このメソッドは`null`を返す可能性があることにも注意してください。これは、指定された要素を実際に見つけることができるかどうか、このメソッドの実行前には保証できないためです。コードスニペットの最後の行では、`appendChild`を呼び出すために、新機能の _オプショナルチェイニング_ 演算子を用いています。

### `Document.createElement`

このメソッドの定義は次のとおりです (_非推奨の_ 定義は省略しています):

```ts
createElement<K extends keyof HTMLElementTagNameMap>(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K];
createElement(tagName: string, options?: ElementCreationOptions): HTMLElement;
```

この関数の定義はオーバーロードされています。2番目のオーバーロードは最も単純で、`getElementById`と非常に似た動作を行います。任意の`string`を渡すと、標準のHTMLElementを返します。この定義により、開発者はユニークなHTML要素のタグを作成することができます。

例えば、`document.createElement('xyz')`は`<xyz></xyz>`要素を返しますが、これは明らかにHTMLの仕様で指定された要素ではありません。

> 興味ある方は、`document.getElementsByTagName`を使用してカスタムタグ要素に触れてみてください

`createElement`の最初の定義では、複数の高度なジェネリクスパターンを使用しています。これはチャンクに分けて理解するのが最良です。まずは、ジェネリクス式`<K extends keyof HTMLElementTagNameMap>`から見ていきます。この式は`HTMLElementTagNameMap`のキーに **制限された** ジェネリクスパラメータ`K`を定義しています。マップインターフェースは、指定されたすべてのHTMLタグ名とそれに対応するすべての型インターフェースを含みます。例えば、マップされた値の最初の5つは次のとおりです:

```ts
interface HTMLElementTagNameMap {
    "a": HTMLAnchorElement;
    "abbr": HTMLElement;
    "address": HTMLElement;
    "applet": HTMLAppletElement;
    "area": HTMLAreaElement;
        ...
}
```

固有のプロパティを持たない要素は`HTMLElement`を返すだけですが、そうでない型は、(`HTMLElement`を拡張あるいは実装した)特定のインターフェースを返します。

さて、`createElement`定義の残りの部分、`(tagName: K, options?: ElementCreationOptions): HTMLElementTagNameMap[K]`についてですが、第一引数 `tagName`はジェネリクスパラメータ`K`として定義されています。TypeScriptのインタープリタは、十分に精度が高いのでこの引数からジェネリクスパラメータを _推測_ することができます。開発者がこのメソッドを使うときには、実際にはジェネリクスパラメータを指定する必要がない、ということです。`tagName`引数に渡された値がなんであれ、`K`として推測され、定義の残りの部分を通してずっと使用することができます。その結果次のようなことが起こります。戻り値`HTMLElementTagNameMap[K]`は`tagName`引数を取り、それを使って対応する型を返します。この定義によって、前述のコードスニペットの`p`変数は`HTMLParagraphElement`型を取得します。また、もしコードが`document.createElement('a')`であったならば、`HTMLAnchorElement`型の要素となっていました。

## `Node`インターフェース

`document.getElementById`関数は`HTMLElement`を返します。`HTMLElement`は、`Node`インターフェースを拡張した`Element`インターフェースを拡張したものです。このプロトタイプの拡張により、すべての`HTMLElements`が標準メソッドのサブセットを活用できます。前述のコードスニペットでは、`Node`インターフェースで定義されたプロパティを使って新しい`p`要素をWebサイトに追加しています。

### `Node.appendChild`

コードスニペットの最後の行は`app?.appendChild(p)`です。前述の`document.getElementById`のセクションでは、実行時に`app`がnullになる可能性があるため、ここでは _オプショナルチェイニング_ 演算子を用いることを説明しました。`appendChild`は次のように定義されています:

```ts
appendChild<T extends Node>(newChild: T): T;
```

このメソッドは`createElement`メソッドと同様に動作し、ジェネリクスパラメータ`T`は `newChild`引数から推測されます。`T`は別の基底インターフェースである`Node`に _制限_ されています。

## `children`と`childNodes`の違い

前のセクションでは、`HTMLElement`インターフェースは、`Node`を拡張した`Element`を拡張したものであることについて説明しました。DOM APIには、_子_ 要素というものがあり、例えば、次のHTMLでは、`p`タグは`div`要素の子です。

```tsx
<div>
  <p>Hello, World</p>
  <p>TypeScript!</p>
</div>;

const div = document.getElementsByTagName("div")[0];

div.children;
// HTMLCollection(2) [p, p]

div.childNodes;
// NodeList(2) [p, p]
```

`div`要素を取得した後、`children`プロパティは、`HTMLParagraphElements`を含むリストである`HTMLCollection`を返します。`childNodes`プロパティは、同様のノードのリストである`NodeList`を返します。それぞれの`p`タグは`HTMLParagraphElements`型のままですが、`NodeList`は`HTMLCollection`リストにはない _HTMLノード_ を含めることができます。

テキストは保ったまま、一方の`p`タグを削除してHTMLを変更してみましょう。

```tsx
<div>
  <p>Hello, World</p>
  TypeScript!
</div>;

const div = document.getElementsByTagName("div")[0];

div.children;
// HTMLCollection(1) [p]

div.childNodes;
// NodeList(2) [p, text]
```

両方のリストがどのように変化するか見てみましょう。`children`には、`<p>Hello, World</p>`要素だけが含まれるようになり、`childNodes`には、2つの`p`ノードの代わりに、`text`ノードが含まれるようになりました。`NodeList`の`text`の部分は、テキストである `TypeScript!`を含むリテラル`Node`です。この`Node`は`HTMLElement`とはみなされないため、`children`リストには含まれていません。

## `querySelector`と`querySelectorAll`メソッド

これらのメソッドは、どちらもよりユニークな制約に適合するDOM要素のリストを取得するための優れたツールです。_lib.dom.d.ts_ において、次のように定義されています:

```ts
/**
 * セレクタにマッチするノードの子孫である最初の要素を返します。
 */
querySelector<K extends keyof HTMLElementTagNameMap>(selectors: K): HTMLElementTagNameMap[K] | null;
querySelector<K extends keyof SVGElementTagNameMap>(selectors: K): SVGElementTagNameMap[K] | null;
querySelector<E extends Element = Element>(selectors: string): E | null;

/**
 * セレクタにマッチするノードの子孫であるすべての要素を返します。
 */
querySelectorAll<K extends keyof HTMLElementTagNameMap>(selectors: K): NodeListOf<HTMLElementTagNameMap[K]>;
querySelectorAll<K extends keyof SVGElementTagNameMap>(selectors: K): NodeListOf<SVGElementTagNameMap[K]>;
querySelectorAll<E extends Element = Element>(selectors: string): NodeListOf<E>;
```

`querySelectorAll`の定義は、新しい型`NodeListOf`を返すという点以外は `getElementsByTagName`と似ています。この戻り値の型は、基本的には標準的なJavaScriptのリスト要素のカスタム実装です。まず間違いなく、`NodeListOf<E>`を`E[]`と置き換えても、非常によく似たユーザー体験が得られるでしょう。`NodeListOf`は、`length` 、`item(index)`、`forEach((value, key, parent) => void)`、数値インデックスといったプロパティとメソッドのみを実装しています。加えて、このメソッドは`NodeList`が`.childNodes`メソッドから返していた _ノード_ ではなく、_要素_ のリストを返します。これは矛盾しているようにみえるかもしれませんが、`Element`インターフェースが`Node`を拡張したものであることを思い出してください。

上記のメソッドの実際の動作を確認するために、既存のコードを次のように変更しましょう:

```tsx
<ul>
  <li>First :)</li>
  <li>Second!</li>
  <li>Third times a charm.</li>
</ul>;

const first = document.querySelector("li"); // 最初のli要素を返す
const all = document.querySelectorAll("li"); // すべてのli要素のリストを返す
```

## もっと知りたいですか？

_lib.dom.d.ts_ の型定義の最も良いところは、Mozilla Developer Network (MDN)のドキュメントサイトで注釈されている型を反映しているところです。例えば、`HTMLElement`は[HTMLElementページ](https://developer.mozilla.org/docs/Web/API/HTMLElement)に記載されています。こうしたページには、利用可能なすべてのプロパティ、メソッド、時には例さえもリストしています。こうしたページの、もう1つ素晴らしいところは、対応する標準ドキュメントのリンクを掲載している点です。上記のページには[HTMLElementのW3C勧告](https://www.w3.org/TR/html52/dom.html#htmlelement)のリンクがあります。

資料:

- [ECMA-262 Standard](http://www.ecma-international.org/ecma-262/10.0/index.html)
- [DOMの紹介](https://developer.mozilla.org/docs/Web/API/Document_Object_Model/Introduction)
