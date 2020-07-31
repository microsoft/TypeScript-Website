// Hay veces que te encuentras duplicando tipos. Un ejemplo
// común es el de los recursos anidados en una respuesta API
// autogenerada.

interface ArtworkSearchResponse {
  artists: {
    name: string;
    artworks: {
      name: string;
      deathdate: string | null;
      bio: string;
    }[];
  }[];
}

// Si esta interfaz fuera hecha a mano, es bastante fácil
// imaginar que se saca el tipo de artworks en una interfaz
// como:

interface Artwork {
  name: string;
  deathdate: string | null;
  bio: string;
}

// Sin embargo, en este caso no controlamos la API, y si
// creamos la interfaz a mano, es posible que la parte de
// ArtworkSearchResponse y Artwork se desincronicen cuando
// la respuesta cambie.

// La solución para esto son los tipos indexados, que
// replican la manera en que JavaScript permite el acceso a
// las propiedades a través de cadenas.

type InferredArtwork = ArtworkSearchResponse["artists"][0]["artworks"][0];

// El InferredArtwork se genera mirando las propiedades del
// tipo y dando un nuevo nombre al subconjunto que has
// indexado.
