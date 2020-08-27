//// { compiler: { ts: "4.0.2" } }
//
// In 4.0, we use control flow analysis to
// infer the potential type of a class property based on
// what values are set during the constructor.

class UserAccount {
  id; // Type is inferred as string | number
  constructor(isAdmin: boolean) {
    if (isAdmin) {
      this.id = "admin";
    } else {
      this.id = 0;
    }
  }
}

// In previous versions of TypeScript, `id` would
// have been classed as an `any`.
