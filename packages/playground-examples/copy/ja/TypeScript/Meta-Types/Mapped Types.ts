// mapped typeは他の型を元に新しい型を作る方法であり、
// 効率的に変換できる型です。

// mapped typeのよくある使い方は
// 既存の型の部分集合を扱うことです。
// 例えば、APIが以下のArtistを返すとします:

interface Artist {
  id: number;
  name: string;
  bio: string;
}

// もし、Artistの一部の変更するAPIを通して
// 更新を送信したいとき、
// 一般的には新たに以下の型を作成する必要があるでしょう:

interface ArtistForEdit {
  id: number;
  name?: string;
  bio?: string;
}

// この型が上記のArtist型と同期されなくなってしまう
// 可能性は非常に高いでしょう。
// mapped typeは既存の型を変換した型を作成できます。

type MyPartialType<Type> = {
  // Typeに含まれるすべてのプロパティを
  // ?:な値に変換します
  [Property in keyof Type]?: Type[Property];
};

// すると、新しくinterfaceを編集した型を作成する代わりに、
// mapped typeを使用できます。
type MappedArtistForEdit = MyPartialType<Artist>;

// これでほとんど完璧ですが、
// これは、本来発生しない、idがnullになるパターンを許容してしまいます。
// 交差型を使って、ちょっと改善してみましょう。
// (詳しくは example:union-and-intersection-types を参照)

type MyPartialTypeForEdit<Type> = {
  [Property in keyof Type]?: Type[Property];
} & { id: number };

// 上記はmapped typeの結果を使って、
// これとidが数値の集合を持つオブジェクトとマージします。
// すると、型の中にidが存在していることを強制する型が効率的にできます。

type CorrectMappedArtistForEdit = MyPartialTypeForEdit<Artist>;

// 以上はmapped typeがどのように動作するかのとても簡単な例でしたが、
// 基礎的な動作のほとんどをカバーしています。
// もし、さらに深く知りたい場合は、handbookを参照ください:
//
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types
