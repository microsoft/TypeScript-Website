---
display: "Types vs Runtime"
tags: typescript javascript type-system
---

TypeScript adds a "type layer" on top of JavaScript code. TypeScript does this by adding additional syntax to JavaScript which needs to be removed in order to run inside a JavaScript [runtime](#runtime).

For example, this is JavaScript code which would run in a JavaScript runtime:

```ts
const hello = "Hello world";
```

This is not:

```ts
const hello: string = "Hello world";
```

The `: string` could be thought of as code which only exists in the "type layer" of TypeScript and not in the "runtime" / "expression" layer of JavaScript code which runs.

The type layer is
