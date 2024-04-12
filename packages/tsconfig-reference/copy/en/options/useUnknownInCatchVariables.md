---
display: "Use Unknown In Catch Variables"
oneline: "Default catch clause variables as `unknown` instead of `any`."
---

In TypeScript 4.0, support was added to allow changing the type of the variable in a catch clause from `any` to `unknown`. Allowing for code like:

```ts twoslash
// @useUnknownInCatchVariables
try {
  // ...
} catch (err: unknown) {
  // We have to verify err is an
  // error before using it as one.
  if (err instanceof Error) {
    console.log(err.message);
  }
}
```

This pattern ensures that error handling code becomes more comprehensive because you cannot guarantee that the object being thrown _is_ a Error subclass ahead of time. With the flag `useUnknownInCatchVariables` enabled, then you do not need the additional syntax (`: unknown`) nor a linter rule to try enforce this behavior.
