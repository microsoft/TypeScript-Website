// Conditional TypesはTypeScriptの型システムに
// 簡単なロジックを組み込む方法を提供します。
// これは非常に高度な機能のため、
// 日々の開発において使わないことも十分に可能です。

// Conditional Typesは以下のような形です:
//
//   A extends B ? C : D
//
// 条件部はある型がある式を拡張しているかを定義し、
// 条件を満たす場合にどの型を返すかを定義します。

// いくつかの例を見てみましょう。
// ここでは簡潔さのためにジェネリクスに単一の文字を使用していきます。
// これは任意ですが、
// 60文字に制限すると画面に収まり難くなります。

type Cat = { meows: true };
type Dog = { barks: true };
type Cheetah = { meows: true; fast: true };
type Wolf = { barks: true; howls: true };

// 以下のように吠える(barks)動物の型だけを
// 抜き出すConditional Typesを作れます。

type ExtractDogish<A> = A extends { barks: true } ? A : never;

// 次に、ExtractDogishで包んだ型を作成します:

// 猫は吠えないので、neverが返ります。
type NeverCat = ExtractDogish<Cat>;
// 狼は吠えるので、狼の型 (Wolf) が返ります。
type Wolfish = ExtractDogish<Wolf>;

// これは多くの型を含む共用型を扱って、
// その共用型に含まれる型の数を
// 絞りたい際に有用です:

type Animals = Cat | Dog | Cheetah | Wolf;

// 共用型にExtractDogish型を適用するのは、
// その共用型に含まれるそれぞれの型に
// ExtraDogishの条件を当てはめるのと同じです:

type Dogish = ExtractDogish<Animals>;

// = ExtractDogish<Cat> | ExtractDogish<Dog> |
//   ExtractDogish<Cheetah> | ExtractDogish<Wolf>
//
// = never | Dog | never | Wolf
//
// = Dog | Wolf (example:unknown-and-never を参照)

// これは共用型のそれぞれの型にConditional Typesが割り当てられるため、
// Distributive Conditional Typesと呼ばれます。

// Deferred Conditional Types

// Conditional Typesは、入力によって異なる型を返すようなAPIの
// 型を絞ることにも使えます。

// 例えば、この関数は引数に渡される真偽値に応じて
// 文字列型か数値型のどちらかを返します。

declare function getID<T extends boolean>(fancy: T): T extends true ? string : number;

// 型システムが真偽値についてどの程度知っているかによって、
// 異なる返り値の型を得られます。

let stringReturnValue = getID(true);
let numberReturnValue = getID(false);
let stringOrNumber = getID(Math.random() < 0.5);

// 上記の例では、TypeScriptは返り値についてすぐに知ることができました。
// しかし、型が未知のときでも
// 関数の中でConditional Typesを使えます。
// これはDeferred Conditonal Typesと呼ばれます。

// 上記のDogish型と同じですが、今回は関数です。
declare function isCatish<T>(x: T): T extends { meows: true } ? T : undefined;

// 他にもConditional Typesで有用なツールがあります。これは遅延評価時に
// 型について推論をすべしとTypeScriptに明確に指示できるものです。
// それは'infer'キーワードです。

// inferは一般的にはコードの中の既存の型を検査して、
// 型の中で新しい変数として扱う
// メタ型を作るのに使われます。

type GetReturnValue<T> = T extends (...args: any[]) => infer R ? R : T;

// 大まかには:
//
//  - 上記は型引数を取るGetReturnValueという
//    条件付きジェネリクスです
//
//  - この条件部は型引数が関数であるかを確認し、
//    もし関数であれば関数の返り値を元に
//    Rという新しい型を作成します
//
//  - 条件を通過した場合は型の値は推論された返り値に、
//    そうでなければ元の型になります
//

type getIDReturn = GetReturnValue<typeof getID>;

// 以下は関数であるというチェックを満たさないので、
// 与えられた型をそのまま返します。
type getCat = GetReturnValue<Cat>;
