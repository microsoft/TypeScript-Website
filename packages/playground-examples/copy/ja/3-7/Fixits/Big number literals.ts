//// { compiler: {  target: 99 }, order: 1 }

// JavaScript を書く際に、JavaScript で表現できる数字の大きさに
// 制限があることをあることをご存知でしたか？

const maxHighValue = 9007199254740991
const maxLowValue = -9007199254740991

// これらの数字を上回る/下回ることは、大変危険です。

const oneOverMax = 9007199254740992
const oneBelowMin = -9007199254740992

// このサイズの数値を扱うための解決策は、
// これらの数値を、number の代わりに BigInts に変換することです:
//
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/BigInt

// TypeScriptは、2の52乗以上の数値リテラル(正/負)の修正機能を提供するようになり、
// 接尾辞 "n"を追加してJavaScriptにBigInt型であることを知らせるようになりました。

// 数値リテラル
9007199254740993;
-9007199254740993
9007199254740994;
-9007199254740994

// 六進数
0x19999999999999;
-0x19999999999999
0x20000000000000;
-0x20000000000000
0x20000000000001;
-0x20000000000001
