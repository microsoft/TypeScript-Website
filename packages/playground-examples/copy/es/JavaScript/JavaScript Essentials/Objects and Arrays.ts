//// { title: 'Objetos y arreglos', order: 1, compiler: { strict: false } }

// Los objetos de JavaScript son colecciones de valores
// asociados a un nombre (o clave).

const userAccount = {
  name: "Kieron",
  id: 0,
};

// Puedes combinarlos para crear modelos de datos más
// grandes y complejos.

const pie = {
  type: "Apple",
};

const purchaseOrder = {
  owner: userAccount,
  item: pie,
};

// Si utilizas tu mouse para pasarle por encima a estas
// palabras (prueba con purchaseOrder arriba) puedes ver
// como TypeScript está interprentando tu JavaScript como
// tipos etiquetados.

// Los valores pueden accederse con un ".", por lo que
// para obtener un nombre de usuario de una orden de compra:
console.log(purchaseOrder.item.type);

// Si pasas tu mouse por encima de cada parte del código entre
// los ()s, puedes ver que TypeScript ofrece más información
// sobre cada parte. Intenta reescribir esto debajo:

// Copia esto en la próxima línea, carácter por carácter:
//
//   purchaseOrder.item.type

// TypeScript proporciona retroalimentación al playground
// sobre qué objetos de JavaScript están disponibles en este
// archivo y permite evitar errores tipográficos y ver
// información adicional sin tener que buscarla en otro sitio.

// TypeScript también ofrece estas mismas funcionalidades para
// los arreglos. Aquí hay una arreglo con solo nuestra orden
// de compra de arriba en él.

const allOrders = [purchaseOrder];

// Si pasas por encima de allOrders, puedes saber que es
// un arreglo porque la información termina con []. Puedes
// acceder a la primera orden usando los corchetes con un
// índice (comenzando en cero).

const firstOrder = allOrders[0];
console.log(firstOrder.item.type);

// Una forma alternativa de obtener un objeto es sacando
// (con pop) los elementos del arreglo. Al hacerlo se
// elimina el objeto del arreglo y se devuelve el objeto.
// A esto se le llama mutar el arreglo, porque cambia los
// datos subyacentes dentro de él.

const poppedFirstOrder = allOrders.pop();

// Ahora allOrders está vacío. Mutar los datos puede ser
// útil para muchas cosas, pero una forma de reducir la
// complejidad en tus bases de código es evitar la mutación.
// TypeScript ofrece por otra parte una forma de declarar
// un arreglo de solo lectura (readonly):

// Crea un tipo basado en la forma de una orden de compra:
type PurchaseOrder = typeof purchaseOrder;

// Crea un arreglo de solo lectura de órdenes de compra
const readonlyOrders: readonly PurchaseOrder[] = [purchaseOrder];

// ¡Sí! Es un poco más de código sin dudas. Hay cuatro
// nuevas cosas aquí:
//
//  type PurchaseOrder - Declara un nuevo tipo de TypeScript.
//
//  typeof - Usa el sistema de inferencia de tipos para establecer
//           el tipo con base en la constante que se pasa a continuación.
//
//  purchaseOrder - Obtiene la variable purchaseOrder y le dice
//                  a TypeScript que esta es la forma de todos los
//                  objetos en el arreglo orders.
//
//  readonly - Este objeto no permite mutación, una vez que
//             se crea el contenido del arreglo será siempre
//             el mismo.
//
// Ahora si intentas hacer pop de readonlyOrders, TypeScript
// levantará un error.

readonlyOrders.pop();

// Puedes usar readonly en todo tipo de lugares, es un
// poco más de sintaxis extra, pero proporciona mucha
// seguridad adicional.

// Puedes saber más sobre readonly:
//  - https://www.typescriptlang.org/docs/handbook/interfaces.html#readonly-properties
//  - https://basarat.gitbooks.io/typescript/content/docs/types/readonly.html

// y puedes continuar aprendiendo sobre JavaScript y
// TypeScript en el ejemplo sobre funciones:
// example:functions
//
// O si quieres saber más sobre inmutabilidad:
// example:immutability
