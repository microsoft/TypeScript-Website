//// { title: 'Unknown y Never' }

// Unknown

// Unknown es uno de esos tipos que una vez que lo usas, puedes encontrar
// bastantes usos para él. Actúa como un hermano para el tipo `any`.
// Donde `any` permite la ambigüedad, `unknown` requiere de detalles.

// Un buen ejemplo sería envolver un analizador JSON.
// Los datos JSON pueden venir en muchas formas diferentes
// y el creador de la función de análisis JSON no sabrá la
// forma de los datos - la persona que llama a esa función debería.

const jsonParser = (jsonString: string) => JSON.parse(jsonString);

const myAccount = jsonParser(`{ "name": "Dorothea" }`);

myAccount.name;
myAccount.email;

// Si inspecciona jsonParser, puedes ver que retorna el tipo `any`,
// por lo que myAccount también. Es posible arreglar esto con los
// genéricos, pero también es posible arreglar esto con los desconocidos.

const jsonParserUnknown = (jsonString: string): unknown => JSON.parse(jsonString);

const myOtherAccount = jsonParserUnknown(`{ "name": "Samuel" }`);

myOtherAccount.name;

// El objeto myOtherAccount no puede ser usado hasta que el tipo
// haya sido declarado en TypeScript. Esto puede ser utilizado
// para asegurarse que los consumidores de la API piensen en
// su tipo por adelantado:

type User = { name: string };
const myUserAccount = jsonParserUnknown(`{ "name": "Samuel" }`) as User;
myUserAccount.name;

// Unknown es una gran herramienta, para entender más sobre ello:
// https://mariusschulz.com/blog/the-unknown-type-in-typescript
// https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-0.html#new-unknown-top-type

// Never

// Debido a que TypeScript soporta el análisis del flujo de código,
// el lenguaje debe ser capaz de representar cuando el código
// lógicamente no puede suceder. Por ejemplo, esta función no puede
// retornar:

const neverReturns = () => {
  // Arroja en la primera linea
  throw new Error("Always throws, never returns");
};

// Si inspecciona el tipo, puedes ver que es () => never
// el cual significa que esto no puede suceder. Estos todavía
// pueden ser utilizados como otros valores:

const myValue = neverReturns();

// El hecho de que una función retorne `never` puede ser útil
// cuando se trata de la imprevisibilidad del entorno de ejecución
// de JavaScript y de los consumidores de APIs que podrían no
// estar utilizando tipos:

const validateUser = (user: User) => {
  if (user) {
    return user.name !== "NaN";
  }

  // De acuerdo al sistema de tipado, este código nunca puede
  // ocurrir, el cual encaja con el tipo retornado de neverReturns

  return neverReturns();
};

// La definición de tipos declara que un usuario tiene que ser
// suministrado pero existen suficientes mecanismos de escape
// en JavaScript donde no puedes garantizar eso.

// Utilizar una función que retorna `never` permite agregar
// código adicional en lugares donde no debería ser posible.
// Esto es muy útil para presentar mejores mensajes de error
// o para cerrar recursos como archivos o ciclos.

// Un uso popular para `never` es asegurarse de que una
// cláusula `switch` sea exhaustiva. Por ejemplo, que todas
// las rutas han sido cubiertas.

// Aquí hay una enumeración y una cláusula `switch` exhaustiva,
// intenta añadir una nueva opción a la enumeración
// (¿tal vez Tulip?)

enum Flower {
  Rose,
  Rhododendron,
  Violet,
  Daisy,
}

const flowerLatinName = (flower: Flower) => {
  switch (flower) {
    case Flower.Rose:
      return "Rosa rubiginosa";
    case Flower.Rhododendron:
      return "Rhododendron ferrugineum";
    case Flower.Violet:
      return "Viola reichenbachiana";
    case Flower.Daisy:
      return "Bellis perennis";

    default:
      const _exhaustiveCheck: never = flower;
      return _exhaustiveCheck;
  }
};

// Recibirás un error de compilación diciendo que tu
// nuevo tipo de flor no puede convertirse en `never`.

// Never en Uniones

// Un tipo `never` es algo que es automáticamente removido
// de una unión de tipos.

type NeverIsRemoved = string | never | number;

// Si analizas el tipo de NeverIsRemoved, podrás observar que
// es un string | number. Esto se debe a nunca puede pasar en
// tiempo de ejecución debido a que no puedes asignar a un tipo
// `never`.

// Esta característica es bastante utilizada en example:conditional-types
