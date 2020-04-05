// EnumはTypeScriptを用いてJavaScriptで
// 固定値の集合を簡単に扱うための機能です。

// デフォルトでは、Enumは0から始まり
// オプション1つにつき1ずつ増加していく数値です。
// これは値が重要でないときに便利です。

enum CompassDirection {
  North,
  East,
  South,
  West,
}

// Enumオプションに注釈を付けると、値を設定できます。
// 注釈をつけなければ、値のインクリメントは設定された値を引き継いで行われます。

enum StatusCodes {
  OK = 200,
  BadRequest = 400,
  Unauthorized,
  PaymentRequired,
  Forbidden,
  NotFound,
}

// EnumはEnum名.値名で参照できます。

const startingDirection = CompassDirection.East;
const currentStatus = StatusCodes.OK;

// Enumはキーから値と値からキーの双方による
// アクセスをサポートしています。

const okNumber = StatusCodes.OK;
const okNumberIndex = StatusCodes["OK"];
const stringBadRequest = StatusCodes[400];

// Enumに異なる型を設定することもできます。文字列型が一般的です。
// 文字列型を用いると、実行時に数字を探す必要がなくなるので、
// デバッグが簡単になります。

enum GamePadInput {
  Up = "UP",
  Down = "DOWN",
  Left = "LEFT",
  Right = "RIGHT",
}

// もし、JavaScriptの実行時にobjectの数を減らしたいなら、
// const enumが使えます。

// const enumの値は
// 実行時にobjectを介して対応する値を見つけるのではなく、
// TypeScriptによるコードのトランスパイル時に置換されます。

const enum MouseAction {
  MouseDown,
  MouseUpOutside,
  MouseUpInside,
}

const handleMouseAction = (action: MouseAction) => {
  switch (action) {
    case MouseAction.MouseDown:
      console.log("Mouse Down");
      break;
  }
};

// トランスパイルされたJavaScriptのコードを見ると、
// 他のEnumはobjectや関数として残っているのに、
// MouseActionだけが残っていないことに気がつくでしょう。

// これは、handleMouseActionのswitch文にある
// MouseAction.MouseDownについても同様です。

// Enumには他にも多くの機能があります。
// 詳しくはTypeScriptハンドブックをご覧ください。
//
// https://www.typescriptlang.org/docs/handbook/enums.html
