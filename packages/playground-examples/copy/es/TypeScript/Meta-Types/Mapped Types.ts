// Los tipos mapeados son una forma de crear nuevos tipos
// basados en otro tipo. Efectivamente un tipo
// transformacional.

// Los casos más comunes para usar un tipo mapeado es tratar
// con subconjuntos parciales de un tipo existente. Por
// ejemplo, una API puede devolver un objeto Artist:

interface Artist {
  id: number;
  name: string;
  bio: string;
}

// Sin embargo, si enviara una actualización a la API que
// sólo cambiara un subconjunto del objeto Artist, normalmente
// tendría que crear un tipo adicional:

interface ArtistForEdit {
  id: number;
  name?: string;
  bio?: string;
}

// Es muy probable que esto se desincronice con la interface
// Artist de arriba. Los tipos mapeados permiten crear un
// cambio en un tipo existente.

type MyPartialType<Type> = {
  // Para cada propiedad existente dentro del tipo Type
  // conviértalo en su versión opcional ?:
  [Property in keyof Type]?: Type[Property];
};

// Ahora podemos usar el tipo mapeado en su lugar para crear
// nuestra interfaz de edición:
type MappedArtistForEdit = MyPartialType<Artist>;

// Esto es casi perfecto, pero permite que la propiedad id
// sea nula, lo que nunca debería suceder. Así que, hagamos
// una rápida mejora usando un tipo de intersección (veasé:
// example:union-and-intersection-types )

type MyPartialTypeForEdit<Type> = {
  [Property in keyof Type]?: Type[Property];
} & { id: number };

// Esta toma el resultado parcial del tipo mapeado, y lo
// fusiona con un objeto que tiene la propiedad id: number.
// Con esto se fuerza a id a estar en el tipo.

type CorrectMappedArtistForEdit = MyPartialTypeForEdit<Artist>;

// Este es un ejemplo bastante simple de cómo funcionan los
// tipos mapeados, pero cubre la mayoría de los aspectos
// básicos. Si desea profundizar más, consulte el manual:
//
// https://www.typescriptlang.org/docs/handbook/advanced-types.html#mapped-types
