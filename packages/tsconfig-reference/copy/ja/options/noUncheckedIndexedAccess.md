---
display: "noUncheckedIndexedAccess"
oneline: "Add undefined to a type when accessed using an index"
---

TypeScriptには、オブジェクトにおいて未知のキーを持ちながらも値が既知であるプロパティをインデックスシグネチャで記述する方法があります。

```ts twoslash
interface EnvironmentVars {
  NAME: string;
  OS: string;

  // 未知のプロパティは、次のようなインデックスシグネチャで扱うことができます。
  [propName: string]: string;
}

declare const env: EnvironmentVars;

// 既存のプロパティとして宣言されています
const sysName = env.NAME;
const os = env.OS;
//    ^?

// 宣言されていませんが、インデックス
// シグネチャのおかげで、stringとして扱われます
const nodeEnv = env.NODE_ENV;
//    ^?
```

`noUncheckedIndexedAccess`をオンにすると、型の未定義のフィールドに`undefined`が追加されます。

```ts twoslash
interface EnvironmentVars {
  NAME: string;
  OS: string;

  // 未知のプロパティは、次のようなインデックスシグネチャで扱うことができます。
  [propName: string]: string;
}
// @noUncheckedIndexedAccess
// ---cut---
declare const env: EnvironmentVars;

// 既存のプロパティとして宣言されています
const sysName = env.NAME;
const os = env.OS;
//    ^?

// 宣言されていませんが、インデックス
// シグネチャのおかげで、stringとして扱われます
const nodeEnd = env.NODE_ENV;
//    ^?
```
