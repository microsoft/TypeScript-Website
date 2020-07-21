---
display: "Allow Unreachable Code"
oneline: "Error when code will never be called"
---

Set to false to disable warnings about unreachable code.
These warnings are only about code which is probably unreachable due to the use of JavaScript syntax, for example:

```ts
function fn(n: number) {
  if (n > 5) {
    return true;
  } else {
    return false;
  }
  return true;
}
```

With `"allowUnreachableCode": false`:

```ts twoslash
// @errors: 7027
// @allowUnreachableCode: false
function fn(n: number) {
  if (n > 5) {
    return true;
  } else {
    return false;
  }
  return true;
}
```

This does not affect errors on the basis of code which _appears_ to be unreachable due to type analysis.
