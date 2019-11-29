---
display: "Strip Internal"
---

Do not emit declarations for code that has an '@internal' annotation. This is an internal compiler option, which is 
used at your own risk because the compiler does not check that the result is valid. If you are searching for a tool to
handle additional levels of visibility within your d.ts files, look at [api-extractor](https://api-extractor.com).

```ts twoslash
/**
 * Days available in a week 
 * @internal 
 */
export const daysInAWeek = 7;

/** Gets the  */
export function weeklySalary(dayRate: number) {
  return daysInAWeek * dayRate
}
```

With the flag disabled as default:

```ts twoslash
// @showEmittedFile: index.d.ts
// @showEmit
// @declaration
/**
 * Days available in a week 
 * @internal 
 */
export const daysInAWeek = 7;

/** Gets the  */
export function weeklySalary(dayRate: number) {
  return daysInAWeek * dayRate
}
```

Turning on `stripInternal` will emit a redacted `d.ts`. 

```ts twoslash
// @stripinternal
// @showEmittedFile: index.d.ts
// @showEmit
// @declaration
/**
 * Days available in a week 
 * @internal 
 */
export const daysInAWeek = 7;

/** Gets the  */
export function weeklySalary(dayRate: number) {
  return daysInAWeek * dayRate
}
```

The JavaScript is still the same.
