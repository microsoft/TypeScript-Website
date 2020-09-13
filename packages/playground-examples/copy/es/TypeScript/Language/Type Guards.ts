// Las guardias de tipo es el término en el que influyes en el análisis del
// flujo de código a través del código. TypeScript utiliza el comportamiento
// existente de JavaScript que valida sus objetos en tiempo de ejecución para
// influir en el flujo de código. Este ejemplo asume que has leído
// example:code-flow

// Para repasar estos ejemplos, crearemos algunas clases, aquí hay un sistema
// para manejar los pedidos por Internet o por teléfono.

interface Order {
  address: string;
}
interface TelephoneOrder extends Order {
  callerNumber: string;
}
interface InternetOrder extends Order {
  email: string;
}

// Entonces un tipo puede ser cualquiera de los dos subtipos de Order o undefined
type PossibleOrders = TelephoneOrder | InternetOrder | undefined;

// Y una función que retorna una posible orden `PossibleOrder`
declare function getOrder(): PossibleOrders;
const possibleOrder = getOrder();

// Podemos usar el operador "in" para verificar si una llave en particular está
// en el objeto a deducir de la unión. ("in" es un operador de JavaScript para
// probar las claves de los objetos.)

if ("email" in possibleOrder) {
  const mustBeInternetOrder = possibleOrder;
}

// Puedes usar el operador "instanceof" de JavaScript si tienes una clase que se
// ajusta a la interfaz:

class TelephoneOrderClass {
  address: string;
  callerNumber: string;
}

if (possibleOrder instanceof TelephoneOrderClass) {
  const mustBeTelephoneOrder = possibleOrder;
}

// Puedes usar el operador "typeof" para reducir la unión. Esto solo funciona
// con las primitivas de JavaScript (como cadenas, objetos, números).

if (typeof possibleOrder === "undefined") {
  const definitelyNotAnOder = possibleOrder;
}

// Puede ver una lista completa de los posibles valores de typeof aquí:
// https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/typeof

// Usando los operadores de JavaScript sólo pueden llegar hasta aquí. Cuando
// quieras comprobar tus propios tipos de objetos puedes usar las funciones de
// predicado de tipos.

// Una función de predicado de tipos es una función donde el tipo retornado
// ofrece información al análisis del flujo de código cuando la función evaluada
// es verdadera.

// Usando el tipo PossibleOrders, podemos usar dos guardias de tipo para
// declarar de que tipo es la orden:

function isAnInternetOrder(order: PossibleOrders): order is InternetOrder {
  return order && "email" in order;
}

function isATelephoneOrder(order: PossibleOrders): order is TelephoneOrder {
  return order && "calledNumber" in order;
}

// Ahora podemos usar estas funciones en las declaraciones if para deducir el
// tipo de la variable possibleOrder dentro del condicional if:

if (isAnInternetOrder(possibleOrder)) {
  console.log("Order received via email:", possibleOrder.email);
}

if (isATelephoneOrder(possibleOrder)) {
  console.log("Order received via phone:", possibleOrder.callerNumber);
}

// Puedes leer más sobre el análisis del flujo de código aquí:
//
//  - example:code-flow
//  - example:type-guards
//  - example:discriminate-types
