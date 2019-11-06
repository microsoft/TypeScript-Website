//// { order: 3, compiler: { strictNullChecks: true } }

// When a particular type feels like it's useful in most
// codebases, they are added into TypeScript and become
// available for anyone which means you can consistently
// rely on their availability

// Partial<Type>

// Takes a type and converts all of its properties
// to optional ones.

interface Sticker {
  id: number
  name: string
  createdAt: string
  updatedAt: string
  submitter: undefined | string
}

type StickerUpdateParam = Partial<Sticker>


// Readonly<Type>

// Takes an object and makes its properties read-only.

type StickerFromAPI = Readonly<Sticker>


// Record<KeysFrom, Type>

// Creates a type which uses the list of properties from
// KeysFrom and gives them the value of Type.

// List which keys come from:
type NavigationPages = 'home' | 'stickers' | 'about' | 'contact'

// The shape of the data for which each of ^ is needed:
interface PageInfo {
  title: string
  url: string
  axTitle?: string
}

const navigationInfo: Record<NavigationPages, PageInfo> = {
  home: { title: "Home", url: "/" },
  about: { title: "About" , url: "/about"},
  contact: { title: "Contact", url: "/contact" },
  stickers: { title: "Stickers", url: "/stickers/all" }
}

// Pick<Type, Keys>

// Creates a type by picking the set of properties Keys
// from Type. Essentially an allow-list for extracting type
// information from a type.

type StickerSortPreview = Pick<Sticker, "name" | "updatedAt">


// Omit<Type, Keys>

// Creates a type by removing the set of properties Keys
// from Type. Essentially a block-list for extracting type
// information from a type.

type StickerTimeMetadata = Omit<Sticker, "name">


// Exclude<Type, RemoveUnion>

// Creates a type where any property in Type's properties
// which don't overlap with RemoveUnion.

type HomeNavigationPages = Exclude<NavigationPages, "home">


// Extract<Type, MatchUnion>

// Creates a type where any property in Type's properties
// are included if they overlap with MatchUnion.

type DynamicPages = Extract<NavigationPages, "home" | "stickers">


// NonNullable<Type>

// Creates a type by excluding null and undefined from a set
// of properties. Useful when you have a validation check.

type StickerLookupResult = Sticker | undefined | null
type ValidatedResult = NonNullable<StickerLookupResult>


// ReturnType<Type>

// Extracts the return value from a Type.

declare function getStickerByID(id: number): Promise<StickerLookupResult>
type StickerResponse = ReturnType<typeof getStickerByID>


// InstanceType<Type>

// Creates a type which is an instance of a class, or object
// with a constructor function.

class StickerCollection {
  stickers: Sticker[]
}

type CollectionItem = InstanceType<typeof StickerCollection>


// Required<Type>

// Creates a type which converts all optional properties
// to required ones.

type AccessiblePageInfo = Required<PageInfo>


// ThisType<Type>

// Unlike other types, ThisType does not return a new
// type but instead manipulates the definition of this
// inside a function. You can only use ThisType when you
// have noImplicitThis turned on in your TSConfig.

// https://www.typescriptlang.org/docs/handbook/utility-types.html
