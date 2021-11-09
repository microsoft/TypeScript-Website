//// { "compiler": { "ts": "4.3.4" } }
// When working with class hierarchies, it can be possible
// to get the functions which you override out of sync because
// prior to 4.3, there is no type-safe way to ensure a function
// is always overriding an existing function.

// For example, this Account class expects its one function to be
// overridden when a user is an admin:

class Account {
  doSomething() {
    console.log("Make me a sandwich");
  }
}

class Admin extends Account {
  doSomething() {
    console.log("Sudo make me a sandwich");
  }
}

// You can change the names of these functions, for example
// maybe 'doSomething' is a bit vague. If you change the name
// to 'performAction' in Account, but _not_ in Admin you have
// decoupled the functions un-expectedly.

// To enforce the consistency, there is a new flag: noImplicitOverride
// and additional syntax. To see it in action, delete the space after the @
// in the following comment:

// @ noImplicitOverride

// Then you need to add `override` where the red error markers are.
