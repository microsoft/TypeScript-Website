// Type Guarding é o termo dado para quando você influencia a análise
// de fluxo do código através dele mesmo. O TypeScript usa o comportamento existente do javascript
// o qual valida seus objetos em tempo de execução para influenciar
// o fluxo do código. Este exemplo assume que você já leu example:code-flow

// Para rodar esses exemplos, vamos criar algumas classes,
// aqui está um sistema para lidar com pedidos pela internet ou telefone.

interface Order {
  address: string;
}
interface TelephoneOrder extends Order {
  callerNumber: string;
}
interface InternetOrder extends Order {
  email: string;
}

// Aqui um tipo que poderia ser um dos dois subtipos de Order ou undefined
type PossibleOrders = TelephoneOrder | InternetOrder | undefined;

// E uma função que retorna um PossibleOrder
declare function getOrder(): PossibleOrders;
const possibleOrder = getOrder();

// Nós podemos usar o operador "in" para verificar se uma chave específica
// está no objeto, para limitar a união. ("in" é um operador
// Javascript para testar chaves de objetos.)

if ("email" in possibleOrder) {
  const mustBeInternetOrder = possibleOrder;
}

// Você pode usar o operador JavaScript "instanceof" se você
// tiver uma classe que está em conformidade com a interface:

class TelephoneOrderClass {
  address: string;
  callerNumber: string;
}

if (possibleOrder instanceof TelephoneOrderClass) {
  const mustBeTelephoneOrder = possibleOrder;
}

// Você pode usar o operador Javascript "typeof" para
// limitar a união. Isso apenas funciona com primitivos
// dentro do JavaScript (como strings, objects, numbers).

if (typeof possibleOrder === "undefined") {
  const definitelyNotAnOder = possibleOrder;
}

// Você pode ver uma lista completa de possíveis valores para o typeof
// aqui: https://developer.mozilla.org/docs/Web/JavaScript/Reference/Operators/typeof

// Usar operadores JavaScript pode levar você muito longe. Quando
// você quiser verificar seu próprio tipos de objeto você pode usar
// funções com predicado de tipos.

// Um função com predicado de tipos é uma função onde o tipo de
// retorno oferece informação a análise do fluxo de código quando
// a função retorna verdadeira.

// Usando o PossibleOrder, nós podemos usar dois type guards
// para declarar qual tipo o possibleOrder é:

function isAnInternetOrder(order: PossibleOrders): order is InternetOrder {
  return order && "email" in order;
}

function isATelephoneOrder(order: PossibleOrders): order is TelephoneOrder {
  return order && "calledNumber" in order;
}

// Agora nós podemos usar essas funções em condicionais if para estreitar
// o tipo no qual possibleOrder está dentro do if:

if (isAnInternetOrder(possibleOrder)) {
  console.log("Pedido recebido por email:", possibleOrder.email);
}

if (isATelephoneOrder(possibleOrder)) {
  console.log("Pedido recebido por telefone:", possibleOrder.callerNumber);
}

// Você pode ler mais sobre análise de fluxo de código aqui:
//
//  - example:code-flow
//  - example:type-guards
//  - example:discriminate-types
