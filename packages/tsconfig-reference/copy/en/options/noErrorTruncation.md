---
display: "No Error Truncation"
---

TODO: Declare deprecated?!

Do not truncate error messages.

With `false`

```ts twoslash
// @noErrorTruncation: false
// @errors: 2322 2454
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

<br/>
<br/>
<br/>

With  `true`

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
