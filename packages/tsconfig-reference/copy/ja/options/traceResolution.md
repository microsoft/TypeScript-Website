---
display: "Trace Resolution"
oneline: "Log out paths when resolving all modules"
---

あるモジュールがコンパイル対象に含まれていない理由をデバッグするために用います。
`traceResolutions`を`true`にするとTypeScriptが処理された各々のファイルについてモジュール解決過程の情報を出力するようになります。

この設定についてより詳細に知りたい場合、[ハンドブック](/docs/handbook/module-resolution.html#tracing-module-resolution)をご覧ください。
