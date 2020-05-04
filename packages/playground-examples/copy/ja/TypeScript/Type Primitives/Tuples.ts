// 一般的に、配列は0から任意の数の
// 単一の型のオブジェクトを含みます。
// TypeScriptは複数の型を含み、
// 格納順が重要な配列について特別な解析を行います。

// これらはタプルと呼ばれます。これらはキーを持つオブジェクトよりも短い文法で、
// いくつかのデータをつなげるための方法と考えられます。

// タプルはJavaScriptの配列の文法で作成できます:

const failingResponse = ["Not Found", 404];

// ただし、タプルとして型を宣言する必要があります。

const passingResponse: [string, number] = ["{}", 200];

// もし、ホバーすれば2つの変数が配列( (string | number)[] )と
// タプル( [string, number] )として解釈されているという
// 違いを確認できるでしょう。

// 配列の場合、どのインデックスの要素も文字列または数値の
// どちらかになるので順番は重要ではありません。
// タプルでは、順番と長さは保証されています。

if (passingResponse[1] === 200) {
  const localInfo = JSON.parse(passingResponse[0]);
  console.log(localInfo);
}

// これは、TypeScriptが正しいインデックスに対して正しい型を提供するだけでなく、
// もしオブジェクトの宣言していないインデックスに
// アクセスしようとすればエラーを発生させることを意味します。

passingResponse[2];

// タプルは接続されたデータの短いまとまりやフィクスチャにとって、
// 良いパターンとして感じられるでしょう。

type StaffAccount = [number, string, string, string?];

const staff: StaffAccount[] = [
  [0, "Adankwo", "adankwo.e@"],
  [1, "Kanokwan", "kanokwan.s@"],
  [2, "Aneurin", "aneurin.s@", "Supervisor"],
];

// 最初がタプルで、その後の長さが分からない型を扱う場合、
// スプレッド構文を使うと任意の長さを持ち、
// 追加のインデックスの要素が
// 特定の型であると示すことができます。

type PayStubs = [StaffAccount, ...number[]];

const payStubs: PayStubs[] = [
  [staff[0], 250],
  [staff[1], 250, 260],
  [staff[0], 300, 300, 300],
];

const monthOnePayments = payStubs[0][1] + payStubs[1][1] + payStubs[2][1];
const monthTwoPayments = payStubs[1][2] + payStubs[2][2];
const monthThreePayments = payStubs[2][2];

// 以下のようにタプルを用いて任意の数の数値型を
// 引数として受け取る関数を宣言できます:

declare function calculatePayForEmployee(id: number, ...args: [...number[]]): number;

calculatePayForEmployee(staff[0][0], payStubs[0][1]);
calculatePayForEmployee(staff[1][0], payStubs[1][1], payStubs[1][2]);

//
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#tuples-in-rest-parameters-and-spread-expressions
// https://auth0.com/blog/typescript-3-exploring-tuples-the-unknown-type/
