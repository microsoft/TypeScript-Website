// Type Guards allow you to customize the code flow analysis.
// This language feature lets you create functions which 
// tell TypeScript the type of an argument passed to it.

// You create a function where the return type offers 
// information to the code flow analysis when the function
// returns true

// We'll create a system for handling internet or mail orders.

interface Order { address: string }
interface TelephoneOrder extends Order { callerNumber: string }
interface InternetOrder extends Order { email: string }

// Then a type which could be one of the two Order subtypes or undefined
type PossibleOrders = TelephoneOrder | InternetOrder | undefined

declare function getOrder(): PossibleOrders

const possibleOrder = getOrder()

// Now we have a possible order, we can use two type guards
// to declare which type the possibleOrder is:

function isAnInternetOrder(order: PossibleOrders): order is InternetOrder {
  return order && "email" in order
}

function isATelephoneOrder(order: PossibleOrders): order is TelephoneOrder {
  return order && "calledNumber" in order
}

// Now we can use these functions in if statements to narrow down the 
// type which possibleOrder is inside the if:

if (isAnInternetOrder(possibleOrder)) {
    console.log("Order received via email:", possibleOrder.email)
}

if (isATelephoneOrder(possibleOrder)) {
  console.log("Order received via phone:", possibleOrder.callerNumber)
}

// You can read more on how code flow analysis here:
// example:code-flow
