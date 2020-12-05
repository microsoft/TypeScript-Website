//// { compiler: { ts: "4.0.2" } }

// 4.0では、コントロールフロー解析を利用し、
// コンストラクタで設定された値に基づいて
// クラスプロパティの潜在的な型を推測します。

class UserAccount {
  id; // 型は次のように推測されます: string | number
  constructor(isAdmin: boolean) {
    if (isAdmin) {
      this.id = "admin";
    } else {
      this.id = 0;
    }
  }
}

// 以前のバージョンのTypeScriptでは、`id`は
// `any`と推測されていました。
