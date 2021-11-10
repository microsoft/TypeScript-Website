//// { "compiler": {  "noImplicitAny": false }, "order": 2 }

// With 3.7 TypeScript's existing 'infer from usage'
// code fix became smarter. It will now use a list of
// known important types (string, number, array, Promise)
// and infer whether the usage of a type matches the API
// of these objects.

// For the next few examples, select the parameters of
// the functions, click the light bulb and choose
// "Infer Parameter types..."

// Infer a number array:

function pushNumber(arr) {
  arr.push(12);
}

// Infer a promise:

function awaitPromise(promise) {
  promise.then((value) => console.log(value));
}

// Infer the function, and its return type:

function inferAny(app) {
  const result = app.use("hi");
  return result;
}

// Infer a string array because a string
// was added to it:

function insertString(names) {
  names[1] = "hello";
}
