//// { title: 'Tipos Unión e Intersección' }

// Las uniones de tipo son una forma de declarar que un
// objeto podría ser de más de un tipo.

type StringOrNumber = string | number;
type ProcessStates = "open" | "closed";
type OddNumbersUnderTen = 1 | 3 | 5 | 7 | 9;
type AMessyUnion = "hello" | 156 | { error: true };

// Si el uso de "open" y "closed" frente a una cadena es
// nuevo para ti, miresé: example:literals

// Podemos mezclar diferentes tipos en una unión, y con ello
// decir que el valor es uno de esos tipos.

// TypeScript te dejará entonces averiguar cómo determinar
// qué valor podría ser en tiempo de ejecución.

// Las uniones pueden a veces ser socavadas por el
// ensanchamiento del tipo, por ejemplo:

type WindowStates = "open" | "closed" | "minimized" | string;

// Si inspecciona arriba, podrá ver que WindowStates
// se convierte en una cadena - no en la unión. Esto es
// explicado en example:type-widening-and-narrowing

// Si una unión es una operación OR, entonces una intersección
// es una operación AND. Las intersecciones de tipo son cuando
// dos tipos se cruzan para crear un nuevo tipo. Esto permite
// la composición del tipo.

interface ErrorHandling {
  success: boolean;
  error?: { message: string };
}

interface ArtworksData {
  artworks: { title: string }[];
}

interface ArtistsData {
  artists: { name: string }[];
}

// Estas interfaces pueden estar compuestas por respuestas
// que tienen tanto un manejo consistente de errores como
// sus propios datos.

type ArtworksResponse = ArtworksData & ErrorHandling;
type ArtistsResponse = ArtistsData & ErrorHandling;

// Por ejemplo:

const handleArtistsResponse = (response: ArtistsResponse) => {
  if (response.error) {
    console.error(response.error.message);
    return;
  }

  console.log(response.artists);
};

// Una mezcla de tipos de Intersección y Unión se vuelve
// realmente útil cuando tienes casos en los que un objeto
// tiene que incluir uno de dos valores:

interface CreateArtistBioBase {
  artistID: string;
  thirdParty?: boolean;
}

type CreateArtistBioRequest = (CreateArtistBioBase & { html: string }) | { markdown: string };

// Ahora sólo puedes crear una petición cuando incluyes
// artistID y los campos html o markdown

const workingRequest: CreateArtistBioRequest = {
  artistID: "banksy",
  markdown: "Banksy is an anonymous England-based graffiti artist...",
};

const badRequest: CreateArtistBioRequest = {
  artistID: "banksy",
};
