// # Nullish Coalescing
//
// 新しい演算子である`??`は、
// `===`がより厳密な等価の形として`==`を補うのと同じく、
// `||`の一般的な使い方を補強します。
//
// 理解をすすめるために、まずは || がどのような動作をするのか見てみましょう:

const response = {
  nullValue: null,
  headerText: "",
  animationDuration: 0,
  height: 400,
  showSplashScreen: false,
} as const;

const undefinedValue = response.undefinedValue || "some other default";
// これは'some other default'となります

const nullValue = response.nullValue || "some other default";

// 上記2つの例はたいていの言語でも同じようにふるまいます。
// || はなにかのデフォルト値を設定するツールとしてはとても優秀です。
// しかし、JavaScriptのfalsyチェックはよく使われる値に対して驚くような動作をすることがあります。

// 意図しない結果かもしれませんが、''は偽であり、次の値は'Hello, world!'となります
const headerText = response.headerText || "Hello, world!";

// 意図しない結果かもしれませんが、0は偽であり、次の値は300となります
const animationDuration = response.animationDuration || 300;

// 意図しない結果かもしれませんが、falseは偽であり、次の値はtrueとなります
const showSplashScreen = response.showSplashScreen || true;

// || の代わりに ?? を使うと、
// === 演算子が両サイドの比較に使用されます:

const emptyHeaderText = response.headerText ?? "Hello, world!";
const zeroAnimationDuration = response.animationDuration ?? 300;
const skipSplashScreen = response.showSplashScreen ?? true;
