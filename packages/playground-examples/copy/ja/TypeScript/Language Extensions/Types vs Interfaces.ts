// オブジェクトの形を宣言するのに使う
// 2つの主なツールがinterfaceとtype aliasです。
//
// これらはとても似ており、ほとんどの場合、
// 同じ振る舞いをします。

type BirdType = {
  wings: 2;
};

interface BirdInterface {
  wings: 2;
}

const bird1: BirdType = { wings: 2 };
const bird2: BirdInterface = { wings: 2 };

// TypeScriptは構造的型システムを採用しているので、
// どちらの使い方も混在させることができます。

const bird3: BirdInterface = bird1;

// どちらも他のinterfaceやtypeからの拡張をサポートしています。
// type aliasは交差型を、
// interfaceはextendsキーワードを使用します。

type Owl = { nocturnal: true } & BirdType;
type Robin = { nocturnal: false } & BirdInterface;

interface Peacock extends BirdType {
  colourful: true;
  flies: false;
}
interface Chicken extends BirdInterface {
  colourful: false;
  flies: false;
}

let owl: Owl = { wings: 2, nocturnal: true };
let chicken: Chicken = { wings: 2, colourful: false, flies: false };

// そうは言っても、type aliasよりもinterfaceを使うことをおすすめします。
// 具体的には、より良いエラーメッセージが得られるからです。
// 以下のエラーにマウスオーバーしてみると、
// Chickenのようなinterfaceを使ったときの方が簡潔でより分かりやすいメッセージが
// TypeScriptより示されているのが分かるでしょう。

owl = chicken;
chicken = owl;

// type aliasとinterfaceの最も大きな違いの1つは、
// interfaceが開かれた型であるのに対して、type aliasは閉じた型であることです。
// これは、interfaceは2回目の宣言で拡張が可能であることを
// 意味します。

interface Kitten {
  purrs: boolean;
}

interface Kitten {
  colour: string;
}

// 一方で、type aliasは一度宣言した後に、
// 外からその型の内容を変更することはできません。

type Puppy = {
  color: string;
};

type Puppy = {
  toys: number;
};

// 達成したい目標に依って、この違いは利点にも欠点にもなり得ます。
// しかし、公開される型については
// interfaceを用いる方が良いでしょう。

// type aliasとinterfaceにおけるすべてのエッジケースを確認するのに
// 最適な資料の1つである以下のstack overflowスレッドは
// 初めの一歩にちょうど良いでしょう:

// https://stackoverflow.com/questions/37233735/typescript-interfaces-vs-types/52682220#52682220
