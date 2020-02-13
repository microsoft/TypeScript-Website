// TypeScriptには、ソースコードにリテラルを用いた
// 特別な面白いケースがあります。

// これは、型の拡張・型の絞り込みにおいて、多くのサポートをもたらします。
// （例：type-widening-narrowing）
// そして、はじめにそれを網羅する価値があります。

// リテラルは集合型よりも具体的なサブタイプです。
// どういうことかと言うと、型システム内部では
// 「Hello World」は文字列ですが、文字列は「Hello World」ではありません。

const helloWorld = "Hello World";
let hiWorld = "Hi World"; // これはletなのでstring型です

// この関数は、すべての文字列を受け入れます
declare function allowsAnyString(arg: string);
allowsAnyString(helloWorld);
allowsAnyString(hiWorld);

// この関数は、文字列リテラル「Hello World」のみを受け入れます
declare function allowsOnlyHello(arg: "Hello World");
allowsOnlyHello(helloWorld);
allowsOnlyHello(hiWorld);

// これにより、共用体型を使用して特定のリテラルのみを受け入れる
// APIを宣言することができます

declare function allowsFirstFiveNumbers(arg: 1 | 2 | 3 | 4 | 5);
allowsFirstFiveNumbers(1);
allowsFirstFiveNumbers(10);

let potentiallyAnyNumber = 3;
allowsFirstFiveNumbers(potentiallyAnyNumber);

// しかし、このルールは混み入ったオブジェクトには適用されません。

const myUser = {
  name: "Sabrina"
};

// 定数として定義された `name："Sabrina"` であっても
// `name：string` に変換されてしまう様子を見てください。
// この理由は、名前はいつでも変更できるからです。

myUser.name = "Cynthia";

// なぜならmyUserのnameプロパティは変更できるため、
// TypeScriptは型システムにおいてリテラルバージョンを使用できません。
// しかしながら、次の機能でこれを許容することができます。

const myUnchangingUser = {
  name: "Fatma"
} as const;

// 「as const」がオブジェクトに適用されると、
// 変更できるオブジェクトの代わりに、
// 変更できないオブジェクトになります。

myUnchangingUser.name = "Raîssa";

// 「as const」は固定データのための素晴らしいツールであり、
// コード中であっても、インラインリテラルとして処理されます。
// 「as const」は配列でも動作します。

const exampleUsers = [{ name: "Brian" }, { name: "Fahrooq" }] as const;
