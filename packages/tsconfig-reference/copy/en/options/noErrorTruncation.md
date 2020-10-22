---
display: "No Error Truncation"
oneline: "Do not truncate types in error messages"
---

Do not truncate error messages.

With `false`, the default.

```ts twoslash
// @errors: 2322 2454
// @noErrorTruncation: false
var x: {
  propertyWithAnExceedinglyLongName1: string;
  propertyWithAnExceedinglyLongName2: string;
  propertyWithAnExceedinglyLongName3: string;
  propertyWithAnExceedinglyLongName4: string;
  propertyWithAnExceedinglyLongName5: string;
};

// String representation of type of 'x' should be truncated in error message
var s: string = x;
```

With `true`

```ts twoslash
// @errors: 2322 2454
// @noErrorTruncation: true
var x: {
  propertyWithAnExceedinglyLongName1: string;
  propertyWithAnExceedinglyLongName2: string;
  propertyWithAnExceedinglyLongName3: string;
  propertyWithAnExceedinglyLongName4: string;
  propertyWithAnExceedinglyLongName5: string;
};

// String representation of type of 'x' should be truncated in error message
var s: string = x;
```
