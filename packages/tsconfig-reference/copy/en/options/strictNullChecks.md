---
display: "Strict Null Checks"
---

When `strictNullChecks` is `false`; `null` and `undefined` are effectively removed from the language.
This can lead to unexpected errors at runtime.

When `strictNullChecks` is `true`; `null` and `undefined` have their own distinct types and you'll get a type error if you try to use them where a concrete value is expected.

For example, with this TypeScript `users.find` has no guarantee that it will correctly find a user, but you can
write code as though it will:

```ts twoslash
// @strictNullChecks: false
declare const loggedInUsername: string

const users = [{ name: "Oby", age: 12 }, { name: "Heera", age: 32 }]
const loggedInUser = users.find(u => u.name === loggedInUsername)

console.log(loggedInUser.age)
```

Turning on `strictNullChecks` will raise an error that you have not made a guarantee that the `loggedInUser` exists before trying to use it.

```ts twoslash
// @errors: 2339 2532
// @strictNullChecks
declare const loggedInUsername: string

const users = [{ name: "Oby", age: 12 }, { name: "Heera", age: 32 }]
const loggedInUser = users.find(u => u.name === loggedInUsername)

console.log(loggedInUser.age)
```

