---
display: "Strict Function Types"
---

> ✅ We strongly recommend enabling this in all codebases

**Default**: `false`, unless `strict` is set

When enabled, this flag causes functions parameters to be checked more correctly.

Here's a basic example with `strictFunctionTypes` *off*:

```ts
// @strictFunctionTypes: false
function fn(x: string) {
   console.log("Hello, " + x.toLowerCase());
}

type StringOrNumberFunc = (ns: string | number) => void;

// Unsafe assignment
let func: StringOrNumberFunc = fn;
// Unsafe call - will crash
func(10);
```

With `strictFunctionTypes` *on*, the error is correctly detected:
```ts
function fn(x: string) {
   console.log("Hello, " + x.toLowerCase());
}

type StringOrNumberFunc = (ns: string | number) => void;

// Unsafe assignment is prevented
let func: StringOrNumberFunc = fn;
```

During development of this feature, we discovered a large number of inherently unsafe class hierarchies, including some in the DOM.
Because of this, the setting only applies to functions written in *function* syntax, not to those in *method* syntax:
```ts
type Methodish = {
   func(x: string | number): void;
};
function fn(x: string)  {
   console.log("Hello, " + x.toLowerCase());
}

// Ultimately an unsafe assignment, but not detected
const m: Methodish = {
   func: fn
};
m.func(10);
```

