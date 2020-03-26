//// { order: 3, compiler: { strictNullChecks: true } }

// ある型がほとんどのコードベースで有効性があると感じられた場合、
// その型はTypeScriptに追加され、他の誰もが使えるようになります。
// TypeScriptに追加されたら、いつでもその型が使えることが
// 保証されます。

// Partial<Type>

// オブジェクト型を型引数として受け取り、そのプロパティを
// すべて任意プロパティへと変換します。

interface Sticker {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  submitter: undefined | string;
}

type StickerUpdateParam = Partial<Sticker>;

// Readonly<Type>

// オブジェクト型を型引数として受け取り、そのプロパティを読み取り専用にします。

type StickerFromAPI = Readonly<Sticker>;

// Record<KeysFrom, Type>

// KeysFromからプロパティの一覧を受け取り、
// 各プロパティの値をType型にした型を作成します。

// 型キーの一覧:
type NavigationPages = "home" | "stickers" | "about" | "contact";

// 上記キーに対応するデータの型:
interface PageInfo {
  title: string;
  url: string;
  axTitle?: string;
}

const navigationInfo: Record<NavigationPages, PageInfo> = {
  home: { title: "Home", url: "/" },
  about: { title: "About", url: "/about" },
  contact: { title: "Contact", url: "/contact" },
  stickers: { title: "Stickers", url: "/stickers/all" },
};

// Pick<Type, Keys>

// 型の第一引数に受け取ったオブジェクトから、第二引数に任意のプロパティ名を定義して
// そのプロパティと対応する値の型を持つ型を作成します。
// 型のホワイトリストのようなものです。

type StickerSortPreview = Pick<Sticker, "name" | "updatedAt">;

// Omit<Type, Keys>

// 型の第一引数に受け取ったオブジェクトから、第二引数に任意のプロパティ名を定義して
// そのプロパティを除外した型を作成します。
// 型のブラックリストのようなものです。

type StickerTimeMetadata = Omit<Sticker, "name">;

// Exclude<Type, RemoveUnion>

// 型の第一引数に受け取った共用体型から、第二引数に受け取った共用体型を
// 除外した型を作成します。

type HomeNavigationPages = Exclude<NavigationPages, "home">;

// Extract<Type, MatchUnion>

// 型の第一引数に受け取った共用体型から、第二引数に受け取った共用体型に
// 当てはまる型を作成します。

type DynamicPages = Extract<NavigationPages, "home" | "stickers">;

// NonNullable<Type>

// 型引数に受け取った共用体型から、nullとundefinedを除外した型を返します。
// 値のバリデーションに使えるでしょう。

type StickerLookupResult = Sticker | undefined | null;
type ValidatedResult = NonNullable<StickerLookupResult>;

// ReturnType<Type>

// 型引数に受け取った関数型から、その返り値の型を作成します。

declare function getStickerByID(id: number): Promise<StickerLookupResult>;
type StickerResponse = ReturnType<typeof getStickerByID>;

// InstanceType<Type>

// クラスインスタンス、またはコンストラクタ関数を持つオブジェクトから、
// そのインスタンスの型を作成します。

class StickerCollection {
  stickers: Sticker[];
}

type CollectionItem = InstanceType<typeof StickerCollection>;

// Required<Type>

// 型引数に受け取ったオブジェクト型からオプショナルのプロパティをすべて
// 必須に変換した型を作成します。

type AccessiblePageInfo = Required<PageInfo>;

// ThisType<Type>

// 他の型とは違い、ThisTypeは新しい型を返しません。
// 関数で使われるthisの型を型引数に受け取った型に変換します。
// ThisTypeはTSConfigのnoImplicitThisがtrue
// の場合にしか使えません。

// https://www.typescriptlang.org/docs/handbook/utility-types.html
