---
display: "Suppress Excess Property Errors"
oneline: "Allow additional properties being set during creation of types"
---

このオプションにより、次の例に示すような、プロパティが過剰に定義されているときのエラーを抑止します:

```ts twoslash
// @errors: 2322
type Point = { x: number; y: number };
const p: Point = { x: 1, y: 3, m: 10 };
```

このフラグは、[TypeScript 1.6](/docs/handbook/release-notes/typescript-1-6.html#stricter-object-literal-assignment-checks)のオブジェクトリテラルの厳密チェックへの移行を助けるために追加されました。

モダンなコードベースでの、このフラグの利用は推奨されません。エラー抑止が必要な箇所で、都度`// @ts-ignore`を利用できます。
