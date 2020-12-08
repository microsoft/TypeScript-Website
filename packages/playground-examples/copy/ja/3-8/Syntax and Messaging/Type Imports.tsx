//// { compiler: { ts: "3.8.3" } }
// 3.8では、型をインポートするための新しい構文を追加しました。
// これはflowユーザーにはおなじみのものです。

// 'import type'は、型のみのインポートを宣言する方法を提供します。
// これは、とても予測可能な方法でJavaScriptに変換される際に
// そのコードが削除されると確信できることを意味します。
// なぜなら、型は必ず削除されるからです！

// 例えば、次の行は決してimportやrequireを追加しません
import type { CSSProperties } from 'react';

// 型としてここで使用されています
const style: CSSProperties = {
  textAlign: 'center'
};

// これは次のimportとは対照的で、
import * as React from 'react';

// JavaScriptに含まれることになります
export class Welcome extends React.Component {
  render() {
    return (
      <div style={style}>
        <h1>Hello, world</h1>
      </div>
    )
  }
}

// しかし、typeなしの'import'が型だけをインポートする場合 - それもまた
// 削除されます。コンパイルされたJSの出力を見ると、
// このimportは含まれません。

import { FunctionComponent } from 'react';

export const BetaNotice: FunctionComponent = () => {
  return <p>This page is still in beta</p>
}

// これはインポート省略と呼ばれ、混乱のもとになります。
// 'import type'構文を使うと、JavaScriptで何をしたいのかを
// 具体的に指定することができます。

// 以上は'import types'の
// 主なユースケースの一つについての簡単な概要ですが、
// 3.8のリリースノートにてさらなる詳細を読むことができます。

// https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#type-only-imports-exports
