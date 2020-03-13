---
display: "Keyof Strings Only"
oneline: "Make keyof only return strings instead of string or numbers"
---

このフラグは、 文字列インデックス記法の型として適用される際に`keyof`型パラメータが`string | number`ではなく`string`を返すようにします。

このフラグは、[TypeScript 2.9のリリースよりも前](/docs/handbook/release-notes/typescript-2-9.html#support-number-and-symbol-named-properties-with-keyof-and-mapped-types)の挙動に保ちたいときに利用されます。
