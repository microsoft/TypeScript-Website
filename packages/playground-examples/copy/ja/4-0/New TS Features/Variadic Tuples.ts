//// { compiler: { ts: "4.0.2" } }
// 可変長タプルによって、タプルはジェネリクスのように
// 型を型チェッカーに渡すことができるrest演算子(...)を扱えるようになりました。

// かなり高度なトピックなので、理解できなくでもあまり心配しないでください。
// これはexample:generic-functionsとexample:tuplesの発展です。

// 手始めに、別のタプルの前に常に数字を付けている可変長タプルを
// 見てみましょう:

type AddMax<T extends unknown[]> = [max: number,  ...rest: T];
//          ^ ジェネリクスでTをタプルに制限しています
//                                                ^ ... でどこにマージするかを示しています

// これは次のように型を合成することができます:
type MaxMin = AddMax<[min: number]>
type MaxMinDiameter = AddMax<[min: number, diameter: number]>

// タプルの後ろに型があっても同様です:
type SuffixDIContext<T extends unknown[]> = [...first: T, context: any];
type DIContainer = SuffixDIContext<[param: string]>

// この仕組みは、複数の入力パラメータと組み合わせることができます。
// 例えば、次の関数は、配列の開始と終了を表す印として
// '\0'を使用して2つの配列をマージします。
function joinWithNullTerminators<T extends unknown[], U extends unknown[]>(t: [...T], u: [...U]) {
    return ['\0', ...t, '\0', ...u, '\0'] as const;
}

// TypeScriptは次のように関数の戻り値の型を推測することができます:
const result = joinWithNullTerminators(['variadic', 'types'], ["terminators", 3]);

// これらを使うことで、関数型プログラミングでよく使われる概念であるカリー化関数などの関数に
// 正しく型をつけることができるようになります。

function curry<T extends unknown[], U extends unknown[], R>(f: (...args: [...T, ...U]) => R, ...a: T) {
    return (...b: U) => f(...a, ...b);
}

// ここでは、3つのジェネリクス引数が使われています:
// - T: カリー化関数への入力の配列であるパラメータ
// - U: カリー化関数に _渡されておらず_ 戻り値の関数に適用される必要があるパラメータ
// - R: カリー化関数に渡された関数の戻り値の型

const sum = (left: number, right: number,) => left + right

const a = curry(sum, 1, 2)
const b = curry(sum, 1)(2)
const c = curry(sum)(1, 2)

// そのほか詳細な説明とコードサンプルはこちら:
// https://github.com/microsoft/TypeScript/pull/39094
 
