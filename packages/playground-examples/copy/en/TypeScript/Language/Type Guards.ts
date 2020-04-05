// Type Guarding is the term where you influence the code
// flow analysis via code. TypeScript uses existing JavaScript
// behavior which validates your objects at runtime to influence
// the code flow. This example assumes you've read example:code-flow

// To run through these examples, we'll create some classes,
// here's a system for handling internet or telephone orders.

interface Order {
  address: string;
}
interface TelephoneOrder extends Order {
  callerNumber: string;
}
interface InternetOrder extends Order {
  email: string;
}

// Then a type which could be one of the two Order subtypes or undefined
type PossibleOrders = TelephoneOrder | InternetOrder | undefined;

// And a function which returns a PossibleOrder
declare function getOrder(): PossibleOrders;
const possibleOrder = getOrder();

// We can use the "in" operator to check whether a particular
// key is on the object to narrow the union. ("in" is a JavaScript
// operator for testing object keys.)

if ("email" in possibleOrder) {
  const mustBeInternetOrder = possibleOrder;
}

// You can use the JavaScript "instanceof" operator if you
// have a class which conforms to the interface:

class TelephoneOrderClass {
  address: string;
  callerNumber: string;
}

if (possibleOrder instanceof TelephoneOrderClass) {
  const mustBeTelephoneOrder = possibleOrder;
}

// You can use the JavaScript "typeof" operator to
// narrow your union. This only works with primitives
// inside JavaScript (like strings, objects, numbers).

if (typeof possibleOrder === "undefined") {
  const definitelyNotAnOder = possibleOrder;
}

// You can see a full list of possible typeof values
// here: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/typeof

// Using JavaScript operators can only get you so far. When
// you want to check your own object types you can use
// type predicate functions.

// A type predicate function is a function where the return
// type offers information to the code flow analysis when
// the function returns true.

// Using the possible order, we can use two type guards
// to declare which type the possibleOrder is:

function isAnInternetOrder(order: PossibleOrders): order is InternetOrder {
  return order && "email" in order;
}

function isATelephoneOrder(order: PossibleOrders): order is TelephoneOrder {
  return order && "calledNumber" in order;
}

// Now we can use these functions in if statements to narrow
// down the type which possibleOrder is inside the if:

if (isAnInternetOrder(possibleOrder)) {
  console.log("Order received via email:", possibleOrder.email);
}

if (isATelephoneOrder(possibleOrder)) {
  console.log("Order received via phone:", possibleOrder.callerNumber);
}

// You can read more on code flow analysis here:
//
//  - example:code-flow
//  - example:type-guards
//  - example:discriminate-types
