//// { order: 3, compiler: { strictNullChecks: true } }

// Quando um tipo específico parece útil na maioria 
// das bases de código, eles são adicionados ao TypeScript e
// se tornam disponíveis para todos, o que significa que 
// você pode contar com a disponibilidade deles.

// Partial<Type>

// Pega um tipo e converte todas as suas propriedades 
// para tipos opcionais.

interface Sticker {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
  submitter: undefined | string;
}

type StickerUpdateParam = Partial<Sticker>;

// Readonly<Type>

// Pega um objeto e transforma suas propriedades para apenas 
// leitura.

type StickerFromAPI = Readonly<Sticker>;

// Record<KeysFrom, Type>

// Cria um tipo que usa a lista de propriedades do
// KeysFrom e dá a eles o valor do tipo.

// Lista de chaves:

type NavigationPages = "home" | "stickers" | "about" | "contact";

// O formato do dado para o qual cada ^ é necessário:

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

// Cria um tipo pegando o conjunto de propriedades Keys
// do Type. Essencialmente uma lista de permissões para extrair 
// informações de tipo de um tipo.

type StickerSortPreview = Pick<Sticker, "name" | "updatedAt">;

// Omit<Type, Keys>

// Cria um tipo removendo o conjunto de propriedades Keys 
// de um tipo. Essencialmente uma lista de bloqueio para extrair
// informação de tipo de um tipo.

type StickerTimeMetadata = Omit<Sticker, "name">;

// Exclude<Type, RemoveUnion>

// Cria um tipo com as propriedades de Type que não sobrepõe 
// RemoveUnion.

type HomeNavigationPages = Exclude<NavigationPages, "home">;

// Extract<Type, MatchUnion>

// Cria um tipo com as propriedades de Type que sobrepõe MatchUnion.

type DynamicPages = Extract<NavigationPages, "home" | "stickers">;

// NonNullable<Type>

// Cria um tipo removendo null e undefined do conjunto de propriedades.
// Útil quando você tem uma checagem de validação.

type StickerLookupResult = Sticker | undefined | null;
type ValidatedResult = NonNullable<StickerLookupResult>;

// ReturnType<Type>

// Extrai o valor de retorno de um Type.

declare function getStickerByID(id: number): Promise<StickerLookupResult>;
type StickerResponse = ReturnType<typeof getStickerByID>;

// InstanceType<Type>

// Cria um tipo que é uma instância de uma classe ou objeto com uma função construtora.

class StickerCollection {
  stickers: Sticker[];
}

type CollectionItem = InstanceType<typeof StickerCollection>;

// Required<Type>

// Cria um tipo que converte todas as propriedades opcionais
// para obrigatórias.

type AccessiblePageInfo = Required<PageInfo>;

// ThisType<Type>

// Diferente dos outros tipos, ThisType não retorna um novo tipo,
// ao invés, ele manipula a definição de this dentro da função. 
// Você pode apenas utilizar ThisType quando você tem noImplicitThis
// ativado no seu TSConfig.

// https://www.typescriptlang.org/docs/handbook/utility-types.html
