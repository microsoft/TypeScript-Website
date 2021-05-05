---
display: "Strip Internal"
oneline: "Disable emitting declarations that have `@internal` in their JSDoc comments."
---

Do not emit declarations for code that has an `@internal` annotation in its JSDoc comment.
This is an internal compiler option; use at your own risk, because the compiler does not check that the result is valid.
If you are searching for a tool to handle additional levels of visibility within your `d.ts` files, look at [api-extractor](https://api-extractor.com).

```ts twoslash
/**
 * Days available in a week
 * @internal
 */
export const daysInAWeek = 7;

/** Calculate how much someone earns in a week */
export function weeklySalary(dayRate: number) {
  return daysInAWeek * dayRate;
}
```

With the flag set to `false` (default):

```ts twoslash
// @showEmittedFile: index.d.ts
// @showEmit
// @declaration
/**
 * Days available in a week
 * @internal
 */
export const daysInAWeek = 7;

/** Calculate how much someone earns in a week */
export function weeklySalary(dayRate: number) {
  return daysInAWeek * dayRate;
}
```

With `stripInternal` set to `true` the `d.ts` emitted will be redacted.

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

/** Calculate how much someone earns in a week */
export function weeklySalary(dayRate: number) {
  return daysInAWeek * dayRate;
}
```

The JavaScript output is still the same.
