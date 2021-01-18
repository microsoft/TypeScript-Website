//// { compiler: { ts: "4.1.0-dev.20201028" } }

// 文字列リテラル型を抽出し操作するためにテンプレートリテラルを使用することができます。
// そのようにして抽出した文字列リテラル型は、今度はプロパティとして使用することができ、
// それにより、API内で文字列からのオブジェクトへと変換するための記述が可能になります。

// ## オブジェクトへの文字列の分割

// テンプレートリテラルは、あるパターンを"分割点"として使用して、
// その間の部分文字列を推測することができます。例えば...

// 次の型はセマンティクスバージョニングに準拠した文字列リテラルです。
type TSVersion = "4.1.2"

// この文字列を構成する要素を抽出する型を作ることができます。
// 2つの'.'を中間点として、文字列を分割してみましょう。
type ExtractSemver<SemverString extends string> =
   SemverString extends `${infer Major}.${infer Minor}.${infer Patch}` ?
        { major: Major, minor: Minor, patch: Patch } : { error: "Cannot parse semver string" }

// 1行目は次のexampleを見たことがあるならば、なじみがあるでしょう:
// example:intro-to-template-literals / example:mapped-types-with-template-literals

// 2行目はConditional Typeで、TypeScriptはSemverStringパラメータに対して
// inferをつかったこのパターンが一致するかどうかを検証します。

// 3行目はConditional Typeの結果です。条件が真ならば、それぞれのポジションに渡された
// 部分文字列をもつオブジェクトを返します。
// 文字列がパターンに一致しないならば、エラーメッセージをもつオブジェクトの型を返します。

type TS = ExtractSemver<TSVersion>

// この型はセマンティクスバージョニングを100%サポートしているわけではありません。例えば、次の例を見てみましょう:
type BadSemverButOKString = ExtractSemver<"4.0.Four.4444">

// 一方で、ExtractSemverではそのフォーマットに一致しない文字列はエラーになります。
// このケースでは文字列が"X.Y.Z"というフォーマットである場合のみマッチします。次の行はそうなっていないため、マッチしません:
type SemverError = ExtractSemver<"Four point Zero point Five">

// ## 再帰的な文字列分割

// 前述の例は厳密にマッチする文字列の場合には動作します。しかし、
// もっとあいまいなケースではTypeScript 4.0の機能example:variadic-tuplesを利用したい場合があるでしょう。

// 文字列を再利用可能な要素に分割するとき、タプルを使えばうまく結果を追跡できます。
// Split型の例を次に示します:

type Split<S extends string, D extends string> =
    string extends S ? string[] :
        S extends '' ? [] :
            S extends `${infer T}${D}${infer U}` ?  [T, ...Split<U, D>] :  [S];

// 1行目は2つのパラメータを宣言しています。ここでは簡潔にするため、1文字を使います。
// Sは分割したい文字列を、Dは区切り文字を表します。
// この行で、これら2つのパラメータが確実に文字列であることを保証します。

// 2行目は入力文字列から一般的な文字列に拡張できるか検証して、文字列がリテラルかどうかをチェックします。
// もしそうならば、文字列の配列を返します。
// リテラルではない文字列を扱うことができないためです。

// 例: 次のようなケース:
type S1 = Split<string, ".">

// 3行目は文字列が空かどうかをチェックし、もしそうならば空のタプルを返します。
type S2 = Split<"", ".">

// 4行目には、ExtractSemverと同様のチェックがあります。
// 入力文字列が`[接頭辞(T)][区切り文字][接尾辞(U)]`にマッチする場合は、
// 接頭辞(T)をタプルの最初のパラメータとして抽出します。次に、接尾辞(U)に対してSplitを再実行して、
// 複数回のマッチに対応できるようにします。
//
// 入力文字列に区切り文字が含まれていない場合は、
// 引数(S)として渡された文字列を含む、長さ1のタプルを返します。

// シンプルなケース
type S3 = Split<"1.2", ".">

// すべての.で分割するために一度再帰呼び出しを行うケース
type S4 = Split<"1.2.3", ".">

// この知識があれば、かなりの数のテンプレートリテラルのコミュニティの例を読んで
// 理解できるようになるはずです。例えば:
//
// - Dan Vanderkamによる、express route extractor
// https://twitter.com/danvdk/status/1301707026507198464
//
// - Mike Ryanによる、document.querySelectorの定義
// https://twitter.com/mikeryandev/status/1308472279010025477
//
// テンプレート文字列リテラルを使った非常に複雑な
// 文字列パーサの実験も行われています。面白い試みですが、
// 本番のコードベースで使用することは推奨されていません。
//
// https://github.com/ghoullier/awesome-template-literal-types
//
// また、告知ブログ記事もご覧ください:
// https://devblogs.microsoft.com/typescript/announcing-typescript-4-1-beta/#template-literal-types
