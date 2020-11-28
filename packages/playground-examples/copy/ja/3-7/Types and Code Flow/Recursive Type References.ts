//// { compiler: {  }, order: 2 }

// タイプを使うかインターフェースを使うかはそれぞれの機能の制約に依るところがあります。
// 3.7では、type aliasに関する制約のうち、interfaceにはない制約が削除
// されました。

// これについての詳細はexample:types-vs-interfacesを参照してください。

// 以前は、定義している型自体の内部で
// 定義している型を参照することはできませんでした。
// これはインターフェースには存在しない制約であり、
// 回避するには少しの手間が必要でした。

// 例えば、以下は3.6では実行できません:
type ValueOrArray<T> = T | Array<ValueOrArray<T>>;

// type aliasとinterfaceを組み合わせた回避策は
// 次のようなものでした。
type ValueOrArray2<T> = T | ArrayOfValueOrArray<T>;
interface ArrayOfValueOrArray<T> extends Array<ValueOrArray2<T>> {}

// この制約の削除により、自身を参照することでJSONを包括的に
// 定義できます。

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

// 3.7ベータ版のリリースノートとPRでより多くのことが学べます:
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
// https://github.com/microsoft/TypeScript/pull/33050
