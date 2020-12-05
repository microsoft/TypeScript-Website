//// { compiler: { ts: "4.0.2" } }

// JavaScriptはどんな値もthrowできるため、
// TypeScriptはエラーの型宣言をサポートしていません。

try {
  // ..
} catch (e) {}

// 歴史的には、上記は、catch句の`e`はデフォルトが
// anyであることを意味していました。
// したがって、`e`の任意のプロパティに自由にアクセスできます。
// 4.0では、catch句における型の割り当ての制限を緩め、
// `any`と`unknown`の両方を許可するようにしました。

// any型を付けた場合と同じふるまい:
try {
  // ..
} catch (e) {
  e.stack;
}

// unknown型を明示した場合のふるまい:

try {
  // ..
} catch (e: unknown) {
  // 型システムが、`e`がどんな型なのかを知るまで
  // `e`を利用することはできません。詳細は以下を確認してください:
  // example:unknown-and-never
  e.stack;

  if (e instanceof SyntaxError) {
    e.stack;
  }
}
