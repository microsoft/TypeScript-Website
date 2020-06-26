//// { order: 3, compiler: { strictNullChecks: true } }

// 当某种类型对于大多数代码来说都非常有用时，他们就会被添加到 TypeScript
// 中并且被大家使用。这意味着您可以在代码中直接使用他们，而无需担心它们的可用性。

// Partial<Type>

// 将一个类型的所有属性转换为可选的

interface Sticker {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  submitter: undefined | string;
}

type StickerUpdateParam = Partial<Sticker>;

// Readonly<Type>

// 将一个类型的所有属性转换为只读的

type StickerFromAPI = Readonly<Sticker>;

// Record<KeysFrom, Type>

// 创建一个具有 KeysFrom 列表中所有指定属性的类型，并且将他们值的类型设置为 Type

// 列出需要哪些 key。
type NavigationPages = "home" | "stickers" | "about" | "contact";

// 每个数据（上面的key ^）都需要的数据的形状。
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

// 由 Type 类型选取 Keys 中指定的属性并创建一个新的类型。
// 本质上是由某种类型中提取一部分类型信息。

type StickerSortPreview = Pick<Sticker, "name" | "updatedAt">;

// Omit<Type, Keys>

// 由 Type 类型排除 Keys 中指定的属性并创建一个新的类型。
// 本质上是由某种类型中排除一部分类型信息。

type StickerTimeMetadata = Omit<Sticker, "name">;

// Exclude<Type, RemoveUnion>

// 创建一个类型，其中 Type 的任何属性都与 RemoveUnion 不重合。

type HomeNavigationPages = Exclude<NavigationPages, "home">;

// Extract<Type, MatchUnion>

// 创建一个类型，其中 Type 的任何属性都与 MatchUnion 重合。

type DynamicPages = Extract<NavigationPages, "home" | "stickers">;

// NonNullable<Type>

// 从一组类型中将 null 和 undefined 排除后创建一个类型，对有效性检查非常有用。

type StickerLookupResult = Sticker | undefined | null;
type ValidatedResult = NonNullable<StickerLookupResult>;

// ReturnType<Type>

// 导出一个类型的返回值类型。

declare function getStickerByID(id: number): Promise<StickerLookupResult>;
type StickerResponse = ReturnType<typeof getStickerByID>;

// InstanceType<Type>

// 创建一个是某个具有构造函数的类或对象的实例的类型。

class StickerCollection {
  stickers: Sticker[];
}

type CollectionItem = InstanceType<typeof StickerCollection>;

// Required<Type>

// 创建一个类型，将所有 Type 的可选属性转换为必要的。

type AccessiblePageInfo = Required<PageInfo>;

// ThisType<Type>

// 与其他类型不同，ThisType 不返回新的类型，而是操作函数定义内 this
// 的类型。您只可以在 TSConfig 中 noImplicitThis 开启的情况下使用 ThisType。

// https://www.typescriptlang.org/docs/handbook/utility-types.html
