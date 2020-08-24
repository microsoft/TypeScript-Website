// 条件付き型はTypeScriptの型システムに
// 簡単なロジックを組み込む方法を提供します。
// これは非常に高度な機能のため、
// 日々の開発において使わないことも十分に可能です。

// 条件付き型は以下のような形です:
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
// 抜き出す条件付き型を作れます。

type ExtractDogish<A> = A extends { barks: true } ? A : never;

// 次に、ExtractDogishで包んだ型を作成します:

// Cat型は吠えないので、neverが返ります。
type NeverCat = ExtractDogish<Cat>;
// Wolf型は吠えるので、Wolf型が返ります。
type Wolfish = ExtractDogish<Wolf>;

// これは多くの型を含む交差型を扱って、
// その交差型に含まれる型の数を
// 絞りたい際に有用です:

type Animals = Cat | Dog | Cheetah | Wolf;

// 交差型にExtractDogish型を適用するのは、
// その交差型に含まれるそれぞれの型に
// 条件を当てはめるのと同じです:

type Dogish = ExtractDogish<Animals>;

// = ExtractDogish<Cat> | ExtractDogish<Dog> |
//   ExtractDogish<Cheetah> | ExtractDogish<Wolf>
//
// = never | Dog | never | Wolf
//
// = Dog | Wolf (example:unknown-and-never を参照)

// これは交差型のそれぞれの型に型が割り当てられるため、
// 分配的条件付き型と呼ばれます。

// 遅延評価条件付き型

// 条件付き型は入力によって
// 異なる型を返すAPIの型を絞ることにも使えます。

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
// 関数の中で条件付き型を使えます。
// これは遅延評価条件付き方と呼ばれます。

// 上記のDogish型と同じですが、今回は関数です。
declare function isCatish<T>(x: T): T extends { meows: true } ? T : undefined;

// 他にも条件付き型で有用なツールがあります。これは遅延評価時に
// 型について推論をすべしとTypeScriptに具体的に指示できるものです。
// このツールは'infer'キーワードです。

// inferは一般的にはコードの中の既存の型を検査して、
// 型の中で新しい変数として扱う
// メタ型を作るのに使われます。

type GetReturnValue<T> = T extends (...args: any[]) => infer R ? R : T;

// 大まかには:
//
//  - 上記は型引数を取るGetReturnValueという
//    条件付き総称型です
//
//  - この条件部は、
//    もし関数であれば関数の返り値を元に
//    Rという新しい型を作成します
//
//  - もし条件を通過した場合、
//    型の値は推論された返り値に、そうでなければ元の型になります
//

type getIDReturn = GetReturnValue<typeof getID>;

// 以下は関数であるというチェックを満たさないので、
// 与えられた型をそのまま返します。
type getCat = GetReturnValue<Cat>;
