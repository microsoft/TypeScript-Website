//// { order: 3, compiler: { strictNullChecks: false } }

// JavaScriptでは、存在しない値を宣言する方法が2つあります。
// TypeScriptでは、optionalやnullableな値を宣言する
// 方法をさらにいくつか提供します。

// 最初に、JavaScriptの基本型である
// undefinedとnullの違いを見てみましょう。

// Undefinedは値が見つからないときあるいは設定できない場合です。

const emptyObj = {};
const anUndefinedProperty: undefined = emptyObj["anything"];

// Nullは値が意図的に欠如していることを
// 意味します。

const searchResults = {
  video: { name: "LEGO Movie" },
  text: null,
  audio: { name: "LEGO Movie Soundtrack" },
};

// なぜundefinedを使わないのでしょう?
// 主な理由としては、textが正しく含まれていることを確認できるからです。
// もしtextがundefinedの場合、
// 結果はtextが存在しないときと同じものになります。

// これは、少し表面的に感じるかもしれません。
// しかし、JSON文字列に変換したときに、
// textがundefinedの場合、textは変換された文字列に含まれません。

// Strict Null Types

// TypeScript 2.0より前では、undefinedとnullは事実上、型システムから無視されていました。
// これによって、TypeScriptのコーディング環境は
// 型のないJavaScriptに近づいてしまっていました。

// バージョン2.0にて、"strictNullChecks"というコンパイラフラグが追加されました。
// このフラグをオンにすると、undefinedとnullが
// コードフロー分析を通して対応すべき型として扱われるようになります。
// (より詳細には example:code-flow を参照ください)

// TypeScriptでstrict null checksを有効にしたときの違いの例として
// 以下の"Potential String"型をホバーしてみてください:

type PotentialString = string | undefined | null;

// PotentialString型ではundefinedとnullが切り捨てられています。
// もし、設定に行きstrictモードを有効にして戻ってくると、
// PotentialString型がすべての型の交差型になっていることが
// 確認できます。

declare function getID(): PotentialString;

const userID = getID();
console.log("User Logged in: ", userID.toUpperCase());

// strictモードでは、上記はエラーになります。

// 型アサーションや非nullアサーション演算子(!)を使うなど
// TypeScriptに詳細を教える方法はいくつかあります。

const definitelyString1 = getID() as string;
const definitelyString2 = getID()!;

// あるいはifを用いて存在を安全に確認することもできます:

if (userID) {
  console.log(userID);
}

// Optional Properties

// Void

// voidは値を返さない関数の
// 戻り値型です。

const voidFunction = () => {};
const resultOfVoidFunction = voidFunction();

// 実行時にはundefinedであっても、
// TypeScriptはコンパイルエラーを発生させるために
// void型を保持します。
