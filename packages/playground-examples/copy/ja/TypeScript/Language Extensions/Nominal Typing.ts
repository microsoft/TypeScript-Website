// 公称型システムではそれぞれの型がユニークであり、
// ある2つの型が同じデータ構造をしていても
// 型をまたいで代入することはできません

// TypeScriptの型システムは構造的です。
// 構造的型システムでは、ある型がアヒル型と同じ構造をしていたら、それをアヒル型として扱います。
// また、ガチョウ型がアヒル型とまったく同じ属性を持っていたら、ガチョウ型はアヒル型としても扱われます。
// より詳しいことはこちらをご覧ください: example:structural-typing

// これにはいくつかの欠点があります。
// 文字列や数値が特別なコンテキストを持っており、
// 他の値に変換可能にしたくない場合などが該当します。
// 例:
//
// - ユーザーの入力した安全でない文字列
// - 翻訳された文字列
// - ユーザー識別番号
// - アクセストークン

// 少しの余分なコードを足すだけで、
// 公称型システムと同じような恩恵に預かることができます。

// 交差型を用いて、__brand （この名前は慣習的なもの）という
// プロパティを持つ型を作成し、
// 通常の文字列が代入不可能な
// ValidatedInputStringという型を作ってみましょう。

type ValidatedInputString = string & { __brand: "User Input Post Validation" };

// 文字列をValidatedInputString型に変換するために関数を使います。
// 注目に値するのは、validateUserInputを通過した文字列はValidatedInputStringだと
// TypeScriptに_伝えて_いる点です。

const validateUserInput = (input: string) => {
  const simpleValidatedInput = input.replace(/\</g, "≤");
  return simpleValidatedInput as ValidatedInputString;
};

// 次に、普通の文字列型は受け取らず、
// 作成した公称型であるValidatedInputStringだけを受け取る関数を作ってみます。

const printName = (name: ValidatedInputString) => {
  console.log(name);
};

// 例えば、ユーザーからの安全でない入力を受け取り、
// バリデーターに通してから出力してみます。

const input = "\n<script>alert('bobby tables')</script>";
const validatedInput = validateUserInput(input);
printName(validatedInput);

// 一方でバリデートしていない文字列をprintNameに渡すと、
// コンパイルエラーが発生します。

printName(input);

// 以下の400コメントがついたGitHubのissueに、
// 公称型を作成する色々な方法のまとめと
// それらのトレードオフがまとまっています:
//
// https://github.com/Microsoft/TypeScript/issues/202
//
// 他にも以下の記事が分かりやすいまとめになっています:
//
// https://michalzalecki.com/nominal-typing-in-typescript/
