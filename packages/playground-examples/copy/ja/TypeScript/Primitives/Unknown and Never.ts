// unknown型

// unknown型は、一度詳しくなると、非常に多くの用途があることに気が付く型の一つです。
// unknown型は、any型とよく似た振る舞いをします。
// anyは曖昧なままでも使用できますが、 unknownは
// 型を特定する必要がある点が異なります。

// JSONパーサーのWrapperは良い例です。
// JSONのデータは、多種多様であるため、JSONパーサーの利用者が
// データの形を知っているにもかかわらず、JSONパーサーの作者は、
// データがどのような形になっているのかを知ることはできません。

const jsonParser = (jsonString: string) => JSON.parse(jsonString);

const myAccount = jsonParser(`{ "name": "Dorothea" }`);

myAccount.name;
myAccount.email;

// 変数jsonParserにカーソルを合わせると、戻り値の型がany型であることがわかります。
// そして、変数myAccountも同様にany型になります。
// これについて、ジェネリクスを使って型付けすることもできますが、
// unknown型を使うことによっても型付けできます。

const jsonParserUnknown = (jsonString: string): unknown => JSON.parse(jsonString);

const myOtherAccount = jsonParserUnknown(`{ "name": "Samuel" }`);

myOtherAccount.name;

// myOtherAccountの型をTypeScriptに示すまでは、myOtherAccountのオブジェクトを使用する
// ことができません。こうすることによって、APIの使用者に、型について前もって
// 考えさせることができます。

type User = { name: string };
const myUserAccount = jsonParserUnknown(`{ "name": "Samuel" }`) as User;
myUserAccount.name;

// unknown型はとても優れたツールです。より深く理解したい場合はこれらを参照してください。
// https://mariusschulz.com/blog/the-unknown-type-in-typescript
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type

// never型

// TypeScriptは、データフローの解析をサポートしているため、
// 論理的に絶対に発生しないコードを表現できる必要があります。
// 例えば、こちらの関数は絶対にreturnされません。

const neverReturns = () => {
  // 1行目で例外を投げる場合
  throw new Error("必ず例外が投げられるので、戻り値は返りません");
};

// この関数にカーソルを合わせると、型が () => neverとなっていることがわかります。
// つまり、この関数は絶対にreturnされません。
// これらは、他の値と同様に、代入することは可能です。

const myValue = neverReturns();

// never型を返す関数は、
// JavaScriptランタイムの予想できない挙動に対応する場合や、
// APIの利用者が型を使わない可能性がある場合に有用です。

const validateUser = (user: User) => {
  if (user) {
    return user.name !== "NaN";
  }
  // 型システム的には、このコードは絶対に実行されません。
  // つまり、関数neverReturnsの戻り値の型に合致します。

  return neverReturns();
};

// この関数の型定義では、引数userが必ず渡されることになっていますが、
// JavaScriptには様々な抜け道があるので、
// それを保証することはできません。

// 上記の例のようにnever型を返す関数を使うことで、実行される可能性がない箇所に
// コードを追加することができます。
// これは、より良いエラーメッセージを表示したい場合や、ファイルや
// ループなどのリソースをクローズしたい場合などで有用です。

// とてもよくあるnever型の使われ方として、
// switch文でのすべてのパスが網羅されていることの担保があります。

// 以下は、enumと、neverによってすべてのパスが網羅されているswith文の例です。
// 試しにFlowerに新しいオプションを追加してみてください(例: Tulipなど)

enum Flower {
  Rose,
  Rhododendron,
  Violet,
  Daisy,
}

const flowerLatinName = (flower: Flower) => {
  switch (flower) {
    case Flower.Rose:
      return "Rosa rubiginosa";
    case Flower.Rhododendron:
      return "Rhododendron ferrugineum";
    case Flower.Violet:
      return "Viola reichenbachiana";
    case Flower.Daisy:
      return "Bellis perennis";

    default:
      const _exhaustiveCheck: never = flower;
      return _exhaustiveCheck;
  }
};

// 新しく追加したオプションの型は、never型に変換できない
// というエラーが表示されるはずです。

// 共用体でのnever型

// 共用体では、never型は
// 自動的に取り除かれます。

type NeverIsRemoved = string | never | number;

// NeverIsRemovedの型を見てみると、
// string | number になっています。
// これは、never型の代入は実行時には絶対に起こらないためです。

// この特徴は、Conditinal Typesで良く使われています。 example:conditional-types

