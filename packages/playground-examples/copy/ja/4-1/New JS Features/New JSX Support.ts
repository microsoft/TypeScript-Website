//// { compiler: { ts: "4.1.0-dev.20201028", jsx: 4 } }

// Reactのバージョン17には、JSXを変換する際に
// 出力されるJavaScriptに新しい形式が導入されました。
// 出力されたJavaScriptはプレイグラウンド右側の
// ".JS"タブで確認できます。

import { useState } from "react";

export function ExampleApp() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>You clicked {count} times</p>
      <button onClick={() => setCount(count + 1)}>Click me</button>
    </div>
  );
}

// 以下は、主な変更点の抜粋です:
//
// - React識別子の代わりとなる関数が、`import`を介して提供される
// - 単一要素(jsx)と複数の子要素(jsxs)にそれぞれ異なる関数が使用される
// - keyがpropsから切り離される
//
// 上記の変更が実装されているRFCは以下で読むことができます:
// https://github.com/reactjs/rfcs/blob/createlement-rfc/text/0000-create-element-changes.md

// こうした変更のほとんどは内部的なものであり、
// エンドユーザーがJSXのコードを記述することに
// 影響はありません。
