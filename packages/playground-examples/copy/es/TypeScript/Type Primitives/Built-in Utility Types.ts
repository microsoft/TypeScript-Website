//// { order: 3, compiler: { strictNullChecks: true } }

// Cuando un tipo en particular es utilizado en múltiples
// bases de código, se agrega a TypeScript y pasa a estar
// disponible para cualquier usuario, lo que significa que
// puede confiar constantemente en su disponibilidad.

// Partial<Type>

// Toma como entrada un tipo y convierte todas sus
// propiedades en opcionales.

interface Sticker {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  submitter: undefined | string;
}

type StickerUpdateParam = Partial<Sticker>;

// Readonly<Type>

// Toma un objeto y hace que sus propiedades sean de solo lectura.

type StickerFromAPI = Readonly<Sticker>;

// Record<KeysFrom, Type>

// Crea un tipo que usa la lista de propiedades del
// parametro KeysFrom y les asigna el valor del tipo.

// Lista con llaves para KeysFrom:
type NavigationPages = "home" | "stickers" | "about" | "contact";

// La forma de los datos requerida para cada una de las
// llaves anteriores:
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

// Crea un tipo seleccionando el conjunto de propiedades de
// Keys definidas en Type. Esencialmente, una lista de
// permisos para extraer información de tipo de un tipo.

type StickerSortPreview = Pick<Sticker, "name" | "updatedAt">;

// Omit<Type, Keys>

// Crea un tipo eliminando el conjunto de propiedades
// definidas en Keys del objeto Type. Esencialmente, una
// lista de prohibición para extraer información de tipo de
// un tipo.

type StickerTimeMetadata = Omit<Sticker, "name">;

// Exclude<Type, RemoveUnion>

// Crea un tipo conformado por las propiedades definidas en
// Type que no se superponen con las definidas en
// RemoveUnion.

type HomeNavigationPages = Exclude<NavigationPages, "home">;

// Extract<Type, MatchUnion>

// Crea un tipo conformado por las propiedades definidas en
// Type que se superponen con las definidas en MatchUnion.

type DynamicPages = Extract<NavigationPages, "home" | "stickers">;

// NonNullable<Type>

// Crea un tipo conformado por la exclusión del valor null y
// undefined de un conjunto de propiedades. Muy útil cuando
// tienes una condición de validación.

type StickerLookupResult = Sticker | undefined | null;
type ValidatedResult = NonNullable<StickerLookupResult>;

// ReturnType<Type>

// Extrae el valor de retorno de Type.

declare function getStickerByID(id: number): Promise<StickerLookupResult>;
type StickerResponse = ReturnType<typeof getStickerByID>;

// InstanceType<Type>

// Crea un tipo que es una instancia de una clase, o un
// objeto con un constructor.

class StickerCollection {
  stickers: Sticker[];
}

type CollectionItem = InstanceType<typeof StickerCollection>;

// Required<Type>

// Crea un tipo que convierte todas las propiedades
// opcionales a requeridas.

type AccessiblePageInfo = Required<PageInfo>;

// ThisType<Type>

// A diferencia de otros tipos, ThisType no retorna un nuevo
// tipo, en vez de ello, manipula la definición del tipo en
// una función. Solo se puede usar ThisType cuando se tiene
// activada la opción noImplicitThis en tu configuración
// TSConfig.

// https://www.typescriptlang.org/docs/handbook/utility-types.html
