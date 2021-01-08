// 論理代入演算子は、
// 2020年のJavaScriptの新しい機能であり、
// JavaScriptのオブジェクトを編集できる新しい演算子のグループです。

// これら新しい演算子の目的は、数学的演算子(例えば+= -= *=)の概念を再利用しつつ
// 論理を用いることです。

interface User {
  id?: number
  name: string
  location: {
      postalCode?: string
  }
}

function updateUser(user: User) {
  // 次のコードや
  if (!user.id) user.id = 1

  // あるいは次のコードも
  user.id = user.id || 1

  // 以下のコードに置き換えることができます:
  user.id ||= 1
}

// これらの演算子は、プロパティの深いネストを扱うことができるため、
// それによってかなり多くの定型的なコードも節約することができます。

declare const user: User
user.location.postalCode ||= "90210"

// 新しい演算子は3つあります:
//
//   ||= 上述のとおり
//   &&= 論理積('or')の代わりに、論理和('and')を使用します
//   ??= example:nullish-coalescingを発展させたもので、
//       === を代わりに使う || のより厳密なバージョンです

// 提案の詳細についてはこちらを確認してください:
// https://github.com/tc39/proposal-logical-assignment
