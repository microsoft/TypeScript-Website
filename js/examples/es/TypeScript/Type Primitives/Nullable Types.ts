//// { title: "Tipos Anulables", order: 3, compiler: { strictNullChecks: false } }

// JavaScript tiene dos formas de declarar valores que no
// existen, y TypeScript agrega sintaxis adicional lo que
// permite aun más formas de declarar algo como opcional o
// anulable.

// Primero, la diferencia entre ambas primitivas de
// JavaScript: undefined y null.

// La primitiva indefinida `undefined` es cuando algo no
// puede ser encontrado o modificado.

const emptyObj = {};
const anUndefinedProperty: undefined = emptyObj["anything"];

// La primitiva nula `null` está destinada a ser usada
// cuando hay una falta consciente de un valor.

const searchResults = {
  video: { name: "LEGO Movie" },
  text: null,
  audio: { name: "LEGO Movie Soundtrack" },
};

// ¿Por qué no usar undefined? Principalmente, porque ahora
// puedes verificar que la propiedad text se haya incluido
// correctamente. Si la propiedad text se devuelve como
// undefined, el resultado es el mismo que si no estuviera
// allí.

// Esto puede parecer un poco superficial, pero cuando se
// hace la conversión a una cadena JSON, si la propiedad
// text era undefined, esta no podria ser incluida en la
// cadena de texto equivalente.

// Tipos Anulables Estrictos

// Antes de TypeScript 2.0, las primitivas undefined y null
// eran ignoradas en el sistema de tipado. Esto permitió que
// TypeScript proporcionará un entorno de codificación más
// cercano a JavaScript sin tipado.

// La versión 2.0 agregó una opción de compilador llamada
// "strictNullChecks" y esta opción requería que los
// usuarios tratasen undefined y null como tipos que deben
// ser manejados por medio de análisis de flujo de código
// ( Ver más en example:code-flow )

// Para ver un ejemplo de la diferencia en activar la opción
// de verificación estricta de tipos nulos en TypeScript,
// desplaza el cursor sobre "PotentialString" a
// continuación:

type PotentialString = string | undefined | null;

// La variable PotentialString descarta el valor undefined y
// null. Si vas al panel de configuración, y activas el modo
// estricto, al regresar al código, verás que al pasar por
// PotentialString ahora se muestra la unión completa de
// tipos.

declare function getID(): PotentialString;

const userID = getID();
console.log("User Logged in: ", userID.toUpperCase());

// Lo anterior fallará solamente en modo estricto ^

// Existen maneras de decirle a TypeScript que sabes lo que
// haces, como por ejemplo una aserción de tipo o mediante
// un operador de aserción no nulo (!)

const definitelyString1 = getID() as string;
const definitelyString2 = getID()!;

// O puedes verificar de manera segura por la existencia del
// valor utilizando un condicional if:

if (userID) {
  console.log(userID);
}

// Propiedades Opcionales

// Void

// Void es el tipo que retorna una función que no devuelve
// un valor.

const voidFunction = () => {};
const resultOfVoidFunction = voidFunction();

// Esto es usualmente un accidente, y TypeScript mantiene el
// tipo vacío para permitirle obtener errores del compilador,
// aunque en tiempo de ejecución sería undefined.
