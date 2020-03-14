---
display: "Disable Source Project Reference Redirect"
oneline: "Use d.ts files as the source of truth for tooling between composite project boundries"
---

[複合TypeScriptプロジェクト](/docs/handbook/project-references.html)で作業する場合、このオプションはモジュール間の境界としてd.tsファイルが使用されていた[3.7以前](/docs/handbook/release-notes/typescript-3-7.html#build-free-editing-with-project-references)の挙動に戻す方法を提供します。
3.7にて、信頼できる情報源はTypeScriptのファイルになりました。
