// Any es la via de escape de TypeScript. Puedes usar any
// para declarar que una sección de tu código es dinámica y
// parecida a JavaScript, o como solución alternativa para
// las limitaciones del sistema de tipado.

// Un buen caso de uso de any es el análisis del formato JSON:

const myObject = JSON.parse("{}");

// Any le hace saber a TypeScript que confíe en su código
// como seguro porque conoce más sobre este, incluso si
// eso no es estrictamente cierto. Por ejemplo, este código
// no funcionará:

myObject.x.y.z;

// Haciendo uso de any le permite tener la habilidad de escribir
// código similar al JavaScript original sacrificando el sistema
// de tipado.

// Se puede decir que any es un `tipo comodín`, el cual permite
// ser reemplazado con cualquier otro tipo (exceptuando never)
// con el fin de asignar tipos diferentes entre si.

declare function debug(value: any): void;

debug("a string");
debug(23);
debug({ color: "blue" });

// Cada llamado de depuración esta permitido ya que puedes
// reemplazar any con el tipo del argumento a coincidir.

// TypeScript tendrá en cuenta la posición de los anys en
// diferentes formas, por ejemplo con estas tuplas para el
// argumento de la función.

declare function swap(x: [number, string]): [string, number];

declare const pair: [any, any];
swap(pair);

// El llamado a la función swap es permitido porque el
// argumento puede ser emparejado reemplazando el primer `any`
// en el par con el tipo number, y el segundo `any` con el
// tipo string.

// Si las tuplas son algo nuevo para ti, veasé: example:tuples

// Unknown es un tipo hermano de `any`, siendo `any` para
// decir "Sé lo que es mejor", mientras que `unknown` es una forma
// de decir "No estoy seguro de lo que es mejor, así que tienes
// que decirle a TS el tipo" example:unknown-and-never
