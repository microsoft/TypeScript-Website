---
display: "Emit Declaration Only"
oneline: "Only output d.ts files and not .js files"
---

`.d.ts`ファイル_のみ_を出力します; `.js`ファイルは出力しません。

この設定は2つのケースで有用です:

- JavaScriptを生成するために、TypeScript以外のトランスパイラを使っているとき
- 利用者向けに`d.ts`ファイルを出力するためだけにTypeScriptを使っているとき
