---
display: "Strict Property Initialization"
oneline: "Check for class properties that are declared but not set in the constructor."
---

When set to true, TypeScript will raise an error when a class property was declared but not set in the constructor.

```ts twoslash
// @errors: 2564
class UserAccount {
  name: string;
  accountType = "user";

  email: string;
  address: string | undefined;

  constructor(name: string) {
    this.name = name;
    // Note that this.email is not set
  }
}
```

In the above case:

- `this.name` is set specifically.
- `this.accountType` is set by default.
- `this.email` is not set and raises an error.
- `this.address` is declared as potentially `undefined` which means it does not have to be set.
