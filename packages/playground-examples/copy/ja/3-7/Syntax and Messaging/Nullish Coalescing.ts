//// { compiler: {  }, order: 2 }

// Null合体演算子は左辺が
// nullまたはundefinedのときに
// 右辺の式を返す||演算子の代わりです。

// Null合体演算子とは対照的に、||演算子は空文字列や数字の0がfalseと判断される
// falsyチェックを用います。

// この機能の良い例は、
// キーが渡されなかったときに部分オブジェクトがデフォルト値を持つように処理する操作です。

interface AppConfiguration {
  // デフォルト: "(no name)"; 空文字列は有効
  name: string;

  // デフォルト: -1; 0は有効
  items: number;

  // デフォルト: true
  active: boolean;
}

function updateApp(config: Partial<AppConfiguration>) {
  // Null合体演算子を使ったとき
  config.name = config.name ?? "(no name)";
  config.items = config.items ?? -1;
  config.active = config.active ?? true;

  // Null合体演算子を使わない現在の解決法
  config.name = typeof config.name === "string" ? config.name : "(no name)";
  config.items = typeof config.items === "number" ? config.items : -1;
  config.active = typeof config.active === "boolean" ? config.active : true;

  // ||演算子を用いると有効でないデータになる可能性がある
  config.name = config.name || "(no name)"; // "" の入力が許容できない
  config.items = config.items || -1; // 0の入力が許容できない
  config.active = config.active || true; // とても悪いことに、常にtrueになる
}

// 3.7のリリース記事にて、Null合体演算子についてより詳細に知ることができます:
//
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-7/
