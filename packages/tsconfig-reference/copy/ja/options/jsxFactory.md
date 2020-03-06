---
display: "JSX Factory"
oneline: "Control the function emitted by JSX"
---

JSX要素がコンパイルされるときの`.js`ファイルで呼び出される関数を変更します。
`preact`を使う場合に、デフォルトの`"React.createElement"`の代わりに`"h"`や`"preact.h"`に変更するのが一般的な変更です。

このオプションは[Babelにおける`/** @jsx h */`ディレクティブ](https://babeljs.io/docs/en/babel-plugin-transform-react-jsx#custom)と同じものです。
