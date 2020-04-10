//// { compiler: {  noImplicitAny: false }, order: 2 }

// 3.7 で TypeScript 既存の「使用状況からの推論」によるコード修正はよりスマートになりました。
// 既知の重要な型 (string, number, array, Promise) のリストを用いて、
// 型の使用方法がこれらのオブジェクトのAPIと一致するかどうかを推論する様になりました。

// 次のいくつかの例では、関数のパラメータを選択し、電球をクリックして "Infer Parameter types..." を選択してください。

// 数値配列の推論:

function pushNumber(arr) {
  arr.push(12)
}

// promiseの推論:

function awaitPromise(promise) {
  promise.then(value => console.log(value))
}

// 関数とその戻り値の型の推論:

function inferAny(app) {
  const result = app.use('hi')
  return result
}

// 文字列配列に文字列が追加された為、文字列配列を推論します:

function insertString(names) {
  names[1] = 'hello'
}
