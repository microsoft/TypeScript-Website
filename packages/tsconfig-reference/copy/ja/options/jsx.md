---
display: "JSX"
oneline: "Control how JSX is emitted"
---

JSX構文がどのようにJavaScriptファイルに出力されるかを設定します。
`.tsx`で終わるファイルのJS出力にのみ影響します。

- `preserve`: JSXを変更せずに`.jsx`ファイルを出力します
- `react`: JSXを等価な`react.createElement`に変換して`.js`ファイルを出力します
- `react-native`: JSXを変更せずに、`.js`ファイルを出力します
