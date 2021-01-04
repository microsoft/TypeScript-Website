// 4.0では、JSDocのタグである@deprecatedが型システムに
// 追加されました。今現在JSDocを使用しているところであれば
// どこでも@deprecatedを使用できます。

interface AccountInfo {
  name: string;
  gender: string;

  /** @deprecated 代わりにgenderフィールドを使用してください */
  sex: "male" | "female";
}

declare const userInfo: AccountInfo;
userInfo.sex;

// TypeScriptは、非推奨のプロパティにアクセスしたとき、
// 処理を止めることはありませんが、警告を出します。
// vscodeなどのエディタであればintellisenseやアウトライン、
// コード内で、deprecatedタグの情報を表示します。
