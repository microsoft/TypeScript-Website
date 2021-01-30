//// { compiler: { ts: "4.1.0-dev.20201028" } }

// TypeScript 4.1では、テンプレートリテラルがサポートされました。
// テンプレートリテラルの基本はexample:intro-to-template-literalsで学ぶことができます。

// また、Mapped Type宣言に新しい構文が4.1で追加されました。
// これにより、"as `templated string`"の形で
// Union型の文字列変換ができるようになります。

// 例えば、次の型は既存の型のすべてのプロパティを
// 従来のRESTの呼び出しに対応する4つの関数に変換します。

// 各APIのエンドポイントを記述するための文字列のテンプレートリテラル:
type GET<T extends string> = `get${Capitalize<T>}`
type POST<T extends string> = `post${Capitalize<T>}`
type PUT<T extends string> = `put${Capitalize<T>}`
type DELETE<T extends string> = `delete${Capitalize<T>}`

// 上記のリテラル型のUnion
type REST<T extends string> = GET<T> | POST<T> | PUT<T> | DELETE<T>

// 型を引数に取り、その型にあるそれぞれの文字列プロパティに対して、
// 上記のREST型をマッピングし、4つの関数を作成します。

type RESTify<Type> = {
  [Key in keyof Type as REST<Key extends string ? Key : never>]: () => Type[Key]
};

// オブジェクトのキーは文字列、数値、シンボルをとりうるため、
// `Key extends string ? Key : never`が必要になります。
// これにより、この型はキーが文字列のケースのみを扱うことができます。

// 次に、APIから利用可能なオブジェクトのリストを作ります:

interface APIs {
  artwork: { id: string, title: string};
  artist: { id: string, name: string};
  location: { id: string, address: string, country: string }
}

// そして、上記の型を使用するオブジェクトを宣言します:
declare const api: RESTify<APIs>

// そうすると、下記の関数がすべて自動的に作成されます
api.getArtist()
api.postArtist()
api.putLocation()

// テンプレートリテラルについて続けて詳しく学びたい場合は以下を参照してください:
// example:string-manipulation-with-template-literals

// もしくは告知ブログ記事をご覧ください:
// https://devblogs.microsoft.com/typescript/announcing-typescript-4-1-beta/#template-literal-types

