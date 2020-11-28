//// { compiler: { ts: "3.8.3" } }
// 3.8ではprivateフィールドが追加されました。これはサブクラスを含め、フィールドを定義しているクラスの外側からは
// アクセスできないようにするクラスフィールドの宣言方法です。

// 例えば、以下のPersonクラスでは、どのクラスのインスタンスからも
// firstName、lastName、あるいはprefixを読み取ることはできません。

class Person {
  #firstName: string;
  #lastName: string;
  #prefix: string;

  constructor(firstName: string, lastName: string, prefix: string) {
    this.#firstName = firstName;
    this.#lastName = lastName;
    this.#prefix = prefix;
  }

  greet() {
    // アイスランドでは[prefix] [lastname]の代わりにフルネームを用いることが好ましいです
    // https://www.w3.org/International/questions/qa-personal-names#patronymic
    if (navigator.languages[0] === "is") {
      console.log(`Góðan dag, ${this.#firstName} ${this.#lastName}`);
    } else {
      console.log(`Hello, ${this.#prefix} ${this.#lastName}`);
    }
  }
}

let jeremy = new Person("Jeremy", "Bearimy", "Mr");

// このクラスの外からは、privateフィールドにアクセスできません:

// 例えば、これは動作しません:
console.log(jeremy.#lastName);

// これも動作しません:
console.log("Person's last name:", jeremy["#lastName"]);

// よくある質問は、"なぜクラスフィールドの'private'キーワードよりもこちらを使うのか？"
// というものです。
// では、3.8以前のTypeScriptでのふるまいと比較してみましょう。

class Dog {
  private _name: string;
  constructor(name: string) {
    this._name = name;
  }
}

let oby = new Dog("Oby");
// ドット記法でのアクセスはできません
oby._name = "Spot";
// しかし、TypeScriptでは抜け道としてブラケット記法を使えてしまいます
oby["_name"] = "Cherny";

// privateキーワードのTypeScriptの参照は型レベルでしか存在しないので
// 型レベルまでしか信用できません。
// 一方で、privateフィールドは近いうちにJavaScript言語の一部となるので
// そうなればコードの可視性をより強く保証できるようになります。

// TypeScriptの`private`フィールドキーワードを廃止する予定はないので、
// 既存のコードは引き続き動作します。今では、`private`キーワードの代わりに
// よりJavaScriptに近いコードを書くこともできるようになりました。

// クラスフィールドについての詳細はtc39の提案
// https://github.com/tc39/proposal-class-fields/
// とベータ版リリースノートを参照してください:
// https://devblogs.microsoft.com/typescript/announcing-typescript-3-8-beta/#ecmascript-private-fields
