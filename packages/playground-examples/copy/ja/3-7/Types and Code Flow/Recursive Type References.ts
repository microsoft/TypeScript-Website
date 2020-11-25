//// { compiler: {  }, order: 2 }

// タイプを使うかインターフェースを使うかはそれぞれの機能の制約に依るところがあります。
// 3.7では、タイプに関する制約のうち、インターフェースにはない制約が削除
// されました。

// これについての詳細はexample:types-vs-interfacesを参照してください。

// 以前は、定義している型自体の内部では、定義している型を参照することは
// できませんでした。これはインターフェースには存在しない制約であり、
// 回避するには少しの作業が必要でした。

// 例えば、これは3.6では実行不可能です:
type ValueOrArray<T> = T | Array<ValueOrArray<T>>;

// ワークアラウンドの実装は、タイプとインターフェースを組み合わせることで
// 次のようになっていたでしょう。
type ValueOrArray2<T> = T | ArrayOfValueOrArray<T>;
interface ArrayOfValueOrArray<T> extends Array<ValueOrArray2<T>> {}

// この制約の削除により、自身を参照することで機能するJSONを包括的に
// 定義することができます。

type Json = string | number | boolean | null | Json[] | { [key: string]: Json };

const exampleStatusJSON: Json = {
  available: true,
  username: "Jean-loup",
  room: {
    name: "Highcrest",
    // Json型に関数を追加できない
    // update: () => {}
  },
};

// 3.7ベータ版のリリースノートとそのPRでより多くのことが学べます:
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
// https://github.com/microsoft/TypeScript/pull/33050
